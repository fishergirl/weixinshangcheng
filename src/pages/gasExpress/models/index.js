import {wechatUserInfo, goodsWithPrice, isSignUp, couponList, branchList} from '../../../services/api'
import router from 'umi/router'
import { Modal, Toast } from 'antd-mobile'
import {getAppid} from "../../../utils/config";

function changeData(arr) {
  return arr.map(item=>{
    item.counter = 0;
    return item
  })
}
export default {
	namespace: 'gasExpress',

	state: {
	  goodsData:{
      pageSize:10,
      pageIndex:0,
      rows:[],
      noMore: false
    },
    couponList:[],
    wechatInfo:null,
  },

	effects: {
	  * init(_,{ call, put }){
      const wechatInfo = yield call(wechatUserInfo,{appid:getAppid()});
      yield put({type:'changeState',payload:{wechatInfo:wechatInfo.data}});
      const selectCity = localStorage.getItem( getAppid() + 'select_city');
      let appInfo = {};
      const addressInfo = wechatInfo.data.addressInfo;
      if(wechatInfo.data.hasSaleArea){   //如果存在销售区域
        if(addressInfo && addressInfo.saleOrgId && addressInfo.saleOrgSNNo && addressInfo.saleDesc ){  //如果存在默认地址
         appInfo = {
           hasSaleArea: true,
           saleInfo:{   //销售区域信息
             orgId: addressInfo.saleOrgId,
             orgSNNo: addressInfo.saleOrgSNNo,
             saleDesc: addressInfo.saleDesc
           },
           storeInfo: addressInfo.orgId ? {  //门店信息
             orgId: addressInfo.orgId,
             orgSNNo: addressInfo.orgSNNo,
             orgName: addressInfo.orgName
           }: null,
           addressInfo: addressInfo //默认地址信息
         }
        }else if(selectCity){  //没有默认地址但存在本地操作记录
          appInfo.hasSaleArea = true;
          appInfo.saleInfo = JSON.parse(selectCity);
          const cityList = yield call(branchList);
          //查询销售区域列表 检测服务端是否删除了本销售区域
          if(!cityList.data.some(item=>item.orgId === appInfo.saleInfo.orgId)){
            router.replace({pathname:'/city',query:{type:'push'}});
            return
          }
        }else{ //首次进入
          router.replace({pathname:'/city',query:{type:'push'}});
          return
        }
      }else{ //如果不存在销售区域
        if(addressInfo){ //存在默认地址
          appInfo = {
            saleInfo: null,
            storeInfo: addressInfo.orgId ? { //门店信息
              orgId: addressInfo.orgId,
              orgSNNo: addressInfo.orgSNNo,
              orgName: addressInfo.orgName
            }: null,
            addressInfo:addressInfo //默认地址信息
          }
        }
        appInfo.hasSaleArea = false
      }
      // console.log(appInfo)
      yield put({
        type:'global/changeState',
        payload: {
          appInfo
        }
      });
      yield put({
        type:'getGoods',
        payload:{
          pageIndex: 1
        }
      });
    },
    * getCouponList(_, {call, put}) {
      const res = yield call(couponList, {appid:getAppid(),status:1});
      yield put({
        type: 'changeState',
        payload: {
          couponList: res.data
        }
      })
    },
		* getGoods( { payload } , { call, put, select } ) {
		  const { pageSize, pageIndex, rows } = yield select(state=>state.gasExpress.goodsData);
		  let { wechatInfo } = yield select(state=>state.gasExpress);
		  const { appInfo } = yield select(state=>state.global);
		  if(!wechatInfo){
        const info = yield call(wechatUserInfo,{appid:getAppid()});
        yield put({type:'changeState',payload:{wechatInfo:info.data}});
        wechatInfo = info.data;
      }
		  let orgSNNo = '';
		  console.log(appInfo,11);
		  if(appInfo.storeInfo){
        orgSNNo = appInfo.storeInfo.orgSNNo;
      }else if(appInfo.saleInfo){
        orgSNNo = appInfo.saleInfo.orgSNNo;
      }
		  const data = {
        gtCategory:1,
        customerId: wechatInfo.csmId,
        orgSNNo,
        pageSize,
        pageIndex,
        ...payload
      };
      const res = yield call(goodsWithPrice, data);
      let newRows = [];
      const resRows = changeData(res.data.rows);
      let noMore = false;
      if(resRows.length === 0)noMore = true;
      if(!payload || payload.pageIndex === 1){
        newRows = resRows
      }else{
        newRows = rows.concat(resRows);
      }
      yield put({
        type:'changeGoodsData',
        payload:{
          rows: newRows,
          noMore,
          ...payload
        }
      })
		},
    * changeList( { payload:{ index, counter } }, { put, select } ) {
      const rows = yield select(state=>state.gasExpress.goodsData.rows);
      rows[index].counter = counter;
      yield put({
        type:'changeGoodsData',
        payload:{
          rows
        }
      })
    },
    * submit(_,{ call, put, select }){
      const rows = yield select(state=>state.gasExpress.goodsData.rows);
      const selectGoods = rows.filter(item=>item.counter>0);
      if(selectGoods.length === 0){
        Toast.info('请选择商品',2,null,false);
        return
      }
      yield put({
        type: 'global/changeState',
        payload: {
          selectGoods,
          orderFlag : 1
        }
      });
		  try{
        window.noMessage = true;
        yield call(isSignUp);
        router.push('/submitOrder')
      }catch (e) {
		    if(e.data){
          Modal.alert('提示', '您还未注册，请先注册',[
            {text:'取消'},
            {
              text:'确定',
              onPress(){
                router.push({pathname:'/register',query:{replace:'submitOrder'}})
              }
            }
          ])
        }
      }
    }
	},

	reducers: {
    changeGoodsData(state, { payload }) {
      return {
        ...state,
        goodsData:{
          ...state.goodsData,
          ...payload
        }
      };
    },
    changeState(state, { payload }){
      return {
        ...state,
        ...payload
      }
    }
  },
};

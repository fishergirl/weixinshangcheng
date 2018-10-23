import {setDefaultAddress, addressDel, addressSave, branchList} from '../../../services/api'
import router from 'umi/router'
import {
  Toast,
  Modal
} from 'antd-mobile';

export default {
	namespace: 'address',

	state: {
    editOne: null,
    list: []
  },

	effects: {
    * setDefaultAddress({ payload }, { call, put }){
      yield call(setDefaultAddress,payload);
      yield put({
        type:'global/getUserInfo'
      });
    },
    * del({payload}, { call, put, select}){
      const { appInfo } = yield select(state=>state.global);
      yield call(addressDel,payload);
      if(appInfo.addressInfo && appInfo.addressInfo.csmAddressId === payload.csmAddressId){ //删除选择订单的地址时，只保留机构信息
        yield put({
          type:'global/changeState',
          payload:{
            appInfo: {
              ...appInfo,
              addressInfo: null
            }
          }
        })
      }
      yield put({
        type:'global/getUserInfo'
      });
    },
    * save({ payload }, { call, put, select }) {
      const { editOne } = yield select(state=>state.address);
      const { appInfo } = yield select(state=>state.global);
      const data = {
        csmAddress : editOne.csmAddress,
        isMain: editOne.isMain || 0,
        csmFloor: editOne.csmFloor,
        csmAddressId: editOne.csmAddressId || 0,
        ...payload
      };
      try{
        window.noMessage = true;
        yield call(addressSave, data);
        yield put.resolve({
          type:'global/getUserInfo'
        });
        if(appInfo && appInfo.addressInfo && appInfo.addressInfo.csmAddressId === editOne.csmAddressId){ //编辑选择订单的地址时
          const { userInfo } = yield select(state=>state.global);
          const address = userInfo.addressItems.filter(item=>item.csmAddressId === appInfo.addressInfo.csmAddressId)[0];
          yield put({
            type:'global/changeState',
            payload:{
              appInfo:{
                ...appInfo,
                saleInfo:{   //销售区域信息
                  orgId: address.saleOrgId,
                  orgSNNo: address.saleOrgSNNo,
                  saleDesc: address.saleDesc
                },
                storeInfo: address.orgId ? {  //门店信息
                  orgId: address.orgId,
                  orgSNNo: address.orgSNNo,
                  orgName: address.orgName
                }: null,
                addressInfo: address //默认地址信息
              }
            }
          });
          if(address.orgId !== appInfo.addressInfo.orgId){
            Toast.info('所选配送地址发生变动，请重新选择商品下单',2,null,false);
            router.go(-3);
            return
          }
        }
        router.goBack()
      }catch (e) {
        if(e.data){
          if(e.data.status === 311){
            Modal.alert('提示', <span>所选地址不在服务区范围,<br/>是否查看服务区？</span>,[
              {text:'取消'},
              {
                text:'查看服务区',
                onPress(){
                  router.push('/address/valid')
                }
              }
            ])
          }else{
            Toast.fail(e.data.message || '未知错误',2,null,false)
          }
        }
      }
    },
    * branchList(_, {call, put}) {
      const res = yield call(branchList);
      yield put({
        type: 'changeState',
        payload:{
          list: res.data
        }
      })
    },
	},

	reducers: {
    changeState(state,{ payload }){
      return {
        ...state,
        ...payload
      }
    }
  },
};

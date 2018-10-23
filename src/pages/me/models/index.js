import { wechatUserInfo, csmCouponList, invalidCouponList, getInviteQrcode, getMyRedPack } from '../../../services/api'
import router from 'umi/router'
import {getAppid} from "../../../utils/config";

const _wxShare = (userInfo)=>{
  let link = 'http://tswx.haoyunqi.com.cn/shop/share/qrcode?csmCode=' + userInfo.csmCode + '&appid=' + getAppid();
  let imgUrl = 'http://image.haoyunqi.com.cn/wx_ic_invite.png';
  const wx = window.wx;
  wx.onMenuShareTimeline({
    title: '邀请好友，赢红包', // 分享标题
    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: imgUrl, // 分享图标
    success: function () {
      // 用户确认分享后执行的回调函数
    },
    cancel: function () {
      // 用户取消分享后执行的回调函数
    }
  });

  wx.onMenuShareAppMessage({
    title: '邀请好友，赢红包', // 分享标题
    desc: '邀请好友注册成功送红包，好友注册后完成首笔订单再送红包，可100%赢取红包哟~', // 分享描述
    link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    imgUrl: imgUrl, // 分享图标
    type: 'link', // 分享类型,music、video或link，不填默认为link
    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success: function () {
      // 用户确认分享后执行的回调函数
    },
    cancel: function () {
      // 用户取消分享后执行的回调函数
    }
  });
};


export default {
	namespace: 'me',

	state: {
    wechatUserInfo: null,
	  cmsCouponData: { //优惠卷
      rows:[],
      pageIndex: 1,
      pageSize: 10,
      noMore: false,
    },
    invalidCouponList:[],//失效优惠卷
    qrcodeData:{}, //二维码
    redPackData:{}
  },

	effects: {
	  * getWeChatUserInfo(_,{ call, put }){
	    const res = yield call(wechatUserInfo);
	    yield put({
        type:'changeState',
        payload:{
          wechatUserInfo: res.data
        }
      })
    },
    * getCmsCouponList( { payload }, { call, put, select }){
      const userInfo = yield select(state=>state.global.userInfo);
      let { rows, pageIndex, pageSize } = yield select(state=>state.me.cmsCouponData);
      if(!userInfo)router.goBack();
      const data = {
        appid : getAppid(),
        csmCode: userInfo.csmCode,
        pageIndex,
        pageSize,
        ...payload
      };
      const res = yield call(csmCouponList,data);
      if(payload && payload.pageIndex > 1){
        rows = rows.concat(res.data)
      }else {
        rows = res.data
      }
      let noMore = false;
      if(res.data.length < pageSize){
        noMore = true
      }
      yield put({
        type:'changeCmsCouponData',
        payload:{
          rows,
          noMore,
          ...payload
        }
      })
    },
    * getInvalidCouponList(_,{ call, put, select }){
      const userInfo = yield select(state=>state.global.userInfo);
      if(!userInfo)router.go(-2);
      const data = {
        appid : getAppid(),
        csmCode: userInfo.csmCode,
      };
      const res = yield call(invalidCouponList,data);
      yield put({
        type:'changeState',
        payload:{
          invalidCouponList:res.data.rows
        }
      })
    },
    * getQrcode(_,{ call, put, select }){
      const userInfo = yield select(state=>state.global.userInfo);
      if(!userInfo)router.goBack();
      const data = {
        appid : getAppid(),
        csmCode: userInfo.csmCode,
        csmName: userInfo.csmName,
        openId: userInfo.openId
      };
      const res = yield call(getInviteQrcode,data);
      yield put({
        type:'changeState',
        payload:{
          qrcodeData: res.data
        }
      });
      _wxShare(userInfo)
    },
    * myRedPackInit(_,{ call, put }){
      const redPack = yield call(getMyRedPack);
      yield put({
        type: 'changeState',
        payload: {
          redPackData: redPack.data
        }
      });
    }
	},

	reducers: {
	  changeCmsCouponData(state,{ payload }){
	    return {
        ...state,
        cmsCouponData:{
          ...state.cmsCouponData,
          ...payload
        }
      }
    },
    changeState(state,{ payload }){
	    return {
        ...state,
        ...payload
      }
    }
  },
};

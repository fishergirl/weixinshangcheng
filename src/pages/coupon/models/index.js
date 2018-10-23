import { couponList, getCoupon } from '../../../services/api'
import { getAppid } from '../../../utils/config'
import { Toast } from 'antd-mobile'

export default {
	namespace: 'coupon',

	state: {
    rows:[]
  },

	effects: {
		* getCouponList(_, {call, put}) {
      const res = yield call(couponList, {appid:getAppid(),status:1});
      yield put({
        type: 'changeState',
        payload: {
          rows: res.data
        }
      })
		},
    * getCoupon({ payload }, { call, put, select }){
      yield put.resolve({
        type:'global/getUserInfo'
      });
		  const userInfo = yield select(state=>state.global.userInfo);
		  if(!userInfo) return;
		  const data = {
        address: userInfo.csmRgAddress,
        appid: getAppid(),
        cid: payload.cid,
        csmCode: userInfo.csmCode,
        csmName: userInfo.csmName,
        phone: userInfo.csmRgPhone
      };
      yield call(getCoupon,data);
      Toast.success('领取成功',1,null,false)
    }
	},

	reducers: {
	  changeState(state, { payload }){
	    return {
        ...state,
        ...payload
      }
    }
  },
};

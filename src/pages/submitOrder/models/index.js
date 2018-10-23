import { csmCouponList, shopOrderSubmit } from '../../../services/api'
import router from 'umi/router'
import { getAppid } from '../../../utils/config'
import { wxPay } from '../../../utils/wx'
export default {
	namespace: 'submitOrder',

	state: {
    cmsCouponList: null
  },

	effects: {
	  * getCmsCouponList( { payload }, { call, put, select }){
	      const userInfo = yield select(state=>state.global.userInfo);
        const data = {
          appid : getAppid(),
          csmCode: userInfo.csmCode,
          // type:2
        };
        const res = yield call(csmCouponList,data);
        yield put({
          type:'changeState',
          payload:{
            cmsCouponList: res.data
          }
        })
    },
    * orderSubmit({ payload }, { call }){
	    const order = yield call(shopOrderSubmit, payload.data);
	    if(payload.payValue === 2){ //微信支付
        yield call(wxPay,order.data,payload.fee);
      }
      router.replace('/orderList');
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

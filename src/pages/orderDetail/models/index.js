import { getOrderDetail } from '../../../services/api'

export default {
	namespace: 'orderDetail',

	state: {
	  data:{}
  },

	effects: {
		* getOrderDetail({ payload }, { call, put }) {
      const res = yield call(getOrderDetail,payload);
      yield put({
        type:'changeState',
        payload:{
          data: res.data
        }
      })
		},
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

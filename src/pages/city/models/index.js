import { branchList } from '../../../services/api'

export default {
	namespace: 'city',

	state: {
	  list: []
  },

	effects: {
		* branchList(_, {call, put}) {
      const res = yield call(branchList);
      yield put({
        type: 'changeStatus',
        payload:{
          list: res.data
        }
      })
		},
	},

	reducers: {
    changeStatus(state,{ payload }){
      return {
        ...state,
        ...payload
      }
    }
  },
};

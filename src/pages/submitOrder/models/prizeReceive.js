import { winRecordQuery } from '../../../services/api'

export default {
  namespace: 'prizeReceive',

  state: {
    prizeInfo: {}
  },

  effects: {
    * getPrizeInfo( { payload }, { call, put, select }){
      const userInfo = yield select(state=>state.global.userInfo);
      const data = {
        csmCode: userInfo.csmCode,
        ...payload
      };
      const res = yield call(winRecordQuery,data);
      yield put({
        type:'changeState',
        payload:{
          prizeInfo: res.data
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

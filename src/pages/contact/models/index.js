import { phoneSave, setDefaultPhone, phoneDel } from '../../../services/api'
import router from 'umi/router'

export default {
	namespace: 'contact',

	state: {
	  editOne:null
  },

	effects: {
		* save({ payload }, { call, put, select }) {
      const { editOne } = yield select(state=>state.contact);
      const data = {
        contact: editOne.contact,
        isMain: editOne.isMain || 0,
        csmPhone : editOne.csmPhone,
        csmPhoneId: editOne.csmPhoneId || 0,
        ...payload
      };
      yield call(phoneSave, data);
      yield put({
        type:'global/getUserInfo'
      });
      router.goBack()
		},
    * setDefaultPhone({ payload }, { call, put }){
      yield call(setDefaultPhone,payload)
      yield put({
        type:'global/getUserInfo'
      });
    },
    * del({payload}, { call, put }){
      yield call(phoneDel,payload);
      yield put({
        type:'global/getUserInfo'
      });
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

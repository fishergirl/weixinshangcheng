import { shopSignUp, shopGetCode } from '../../../services/api'
import { getAppid } from '../../../utils/config'
import router from 'umi/router'
export default {
	namespace: 'register',

	state: {},

	effects: {
	  * getCode({ payload },{ call }){
	    yield call(shopGetCode,payload)
    },
		* signUp({ payload }, { call, select }) {
	    const routing  = yield select(state=>state.routing);
		  const data = {
		    appid: getAppid(),
        ...payload
      };
      yield call(shopSignUp,data);
      router.replace('/'+ routing.location.query.replace)
		},
	},

	reducers: {},
};

import { userUserInfo, corpSettingQuery } from '../services/api'
import router from 'umi/router'

export default {
  namespace: "global",
  state: {
    routerFrom: {},
    routerTo: {},
    userInfo: null, //用户信息
    appInfo: null,//用户选择的销售区域，门店，地址信息
    corpSetting: null,//企业信息
    orderFlag: 1,//订单类型：1.普通订单 2.积分兑换订单
    selectGoods: null, //所选货物
    selectPhone: null, //所选联系人
    selectAddress: null //所选配送地址
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ query }) => {
        //router listen
        dispatch({
          type: 'setRouter',
          payload: {
            routerTo:history.location
          }
        });
      });
    },
    clear({ dispatch, history }) {
      return history.listen(() => {
        if(history.location.pathname === '/gasExpress' || history.location.pathname === '/exchange/goods' || history.location.pathname === '/shake/prize'){
          dispatch({
            type:'changeState',
            payload: {
              orderFlag: 1,
              selectGoods: null,
              selectPhone: null,
              selectAddress: null
            }
          })
        }
      });
    },
  },
  effects: {
    * getUserInfo(_,{ call, put, select }){
        const routing = yield select(state=>state.routing);
        const res = yield call(userUserInfo);
        if(!res.data || Object.keys(res.data).length === 0){
          router.replace({pathname:'/register',query:{replace:routing.location.pathname.substring(1)}})
        }
        yield put({
          type:'changeState',
          payload:{
            userInfo:res.data
          }
        })
    },
    * getCorpSetting(_,{ call, put }){
      const res = yield call(corpSettingQuery);
      yield put({
        type:'changeState',
        payload:{
          corpSetting:res.data
        }
      })
    }
  },
  reducers: {
    changeState(state, { payload }){
      console.log(payload,11)
      return {
        ...state,
        ...payload
      }
    },
    setRouter(state, { payload }){
      const routerFrom = state.routerTo;
      const routerTo = payload.routerTo;
      if(routerFrom && routerFrom.pathname === routerTo.pathname){
        return state
      }
      return {
        ...state,
        routerFrom,
        routerTo
      }
    }
  }
};

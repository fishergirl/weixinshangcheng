import { bannerQuery, goodsTypeQuery, goodsWithPrice } from '../../../services/api'
import { getAppid } from '../../../utils/config'

export default {
  namespace: 'main',
  state: {
    bannerList: [],
    goodsTypeList: [],
    goodsPriceList: [],
  },
  effects: {
    * getData(_, { call, put }) {
      const res = yield [
        call( bannerQuery, { appid:getAppid() }),
        call( goodsTypeQuery, { gtCategory: 2 }),
        call( goodsWithPrice, { gtCategory: 3 }),
      ];
      yield put({
        type:'changeState',
        payload:{
          bannerList: res[0].data,
          goodsTypeList: res[1].data,
          goodsPriceList: res[2].data.rows
        }
      })
    },
  },
  reducers: {
    changeState(state, { payload }) {
      return {...state, ...payload};
    },
  },
};

import { scoreGoods, exchangeRecords, setDefaultAddress } from '../../../services/api'

export default {
	namespace: 'exchange',

	state: {
    goodsData:{
      rows: [],
      pageNum: 1,
      pageSize: 10,
      noMore: false
    },
    detailData:{},
    recordsData:{
      rows: [],
      pageNum: 1,
      pageSize: 10,
      noMore: false
    },
    hasSelectAddress: false
  },

	effects: {
		* getScoreGoods({ payload }, {call, put, select }) {
		  let { rows, pageNum, pageSize } = yield select(state=>state.exchange.goodsData);
		  const data = {
        pageNum,
        pageSize,
        ...payload
      };
      const res = yield call(scoreGoods,data);
      let noMore = false;
      if(res.data.rows.length < pageSize) noMore = true;
      if(payload && payload.pageNum > 1){
        rows = rows.concat(res.data.rows);
      }else{
        rows = res.data.rows
      }
      yield put ({
        type: 'changeGoodsData',
        payload:{
          rows,
          noMore
        }
      })
		},
    * getGoodsDetail({ payload }, { call, put }){
		  const res = yield call(scoreGoods,{pageNum:1,goodsCode: payload.goodsCode});
      yield put({
        type: 'changeState',
        payload:{
          detailData: res.data.rows[0]
        }
      })
    },
    * getExchangeRecords({ payload }, { call, put, select }){
      let { rows, pageNum, pageSize } = yield select(state=>state.exchange.recordsData);
      const data = {
        pageNum,
        pageSize,
        ...payload
      };
      const res = yield call(exchangeRecords,data);
      let noMore = false;
      if(res.data.rows.length < pageSize) noMore = true;
      if(payload && payload.pageNum > 1){
        rows = rows.concat(res.data.rows);
      }else{
        rows = res.data.rows
      }
      yield put ({
        type: 'changeRecordsData',
        payload:{
          rows,
          noMore
        }
      })
    },
    * setDefaultAddress({ payload }, { call }){
      yield call(setDefaultAddress,payload)
    }
	},

	reducers: {
    changeState(state,{ payload }){
      return {
        ...state,
        ...payload
      }
    },
    changeGoodsData(state,{ payload }){
      return {
        ...state,
        goodsData: {
          ...state.goodsData,
          ...payload
        }
      }
    },
    changeRecordsData(state,{ payload }){
      return {
        ...state,
        recordsData: {
          ...state.recordsData,
          ...payload
        }
      }
    },
  },
};

import { orderQuery, updateOrderCancel, updateOrderDiscard } from '../../../services/api'
export default {
	namespace: 'orderList',

	state: {
    ordersData:{
      pageNum: 1,
      rows:[],
      noMore: false
    }
  },

	effects: {
		* getOrders({ payload }, { call, put, select }) {
      let { pageNum, rows, noMore } = yield select(state=>state.orderList.ordersData);
      const res = yield call(orderQuery,{pageNum,pageSize:10,...payload});
      if(res.data.rows.length === 0)noMore = true;
      if(payload && payload.pageNum > 1){
        rows = rows.concat(res.data.rows)
      }else{
        rows = res.data.rows
      }
      yield put({
        type:'changeOrdersData',
        payload:{
          rows,
          noMore,
          ...payload
        }
      })
		},
    * orderCancel({ payload }, { call, put, select }){
      let { rows } = yield select(state=>state.orderList.ordersData);
      yield call(updateOrderCancel,payload);
      rows.forEach(item=>{
        if(item.orderCode === payload.orderCode)item.orderStatus = 11;
      });
      yield put({
        type:'changeOrdersData',
        payload:{
          rows
        }
      })
    },
    * orderDiscard({ payload }, { call ,put, select }){
      let { rows } = yield select(state=>state.orderList.ordersData);
      yield call(updateOrderDiscard,payload);
      rows.forEach(item=>{
        if(item.orderCode === payload.orderCode)item.orderStatus = 3;
      });
      yield put({
        type:'changeOrdersData',
        payload:{
          rows
        }
      })
    }
	},

	reducers: {
    changeOrdersData(state,{ payload }){
      return {
        ...state,
        ordersData:{
          ...state.ordersData,
          ...payload
        }
      }
    }
  },
};

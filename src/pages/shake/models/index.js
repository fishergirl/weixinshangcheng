import { shakeInfo, shakeStart, winRecordList } from '../../../services/api'
import { getAppid } from '../../../utils/config'
import {
  Modal
} from 'antd-mobile'

const NOGIFT_TIPs = ['好可惜，奖品离你只有一步之遥。摆好姿势，再来一次！', '天灵灵地灵灵~摇个奖品行不行！', '很遗憾，你没有中奖别灰心，再试一次吧！'];
export default {
	namespace: 'shake',

	state: {
	  shakeInfo:{},
    showWin: false,
    winMes: '',
    remainCountMsg:'',
    winRecordInfo:{
      pageIndex: 1,
      pageSize: 10,
      rows:[],
      noMore: false
    }
  },

	effects: {
		* getShakeInfo({ payload }, {call, put}) {
        const res = yield call(shakeInfo,payload);
        yield put({
          type:'changeState',
          payload:{
            shakeInfo: res.data
          }
        })
		},
    * shakeStart({ payload }, { call, put, select }){
		  const userInfo = yield select(state=>state.global);
		  const data = {
        appid: getAppid(),
        csmCode: userInfo.csmCode,
        csmName: userInfo.csmName,
        csmRgPhone: userInfo.csmRgPhone,
        ...payload
      };
      const res = yield call(shakeStart,data);
      const msg = (NOGIFT_TIPs[~~(Math.random() * NOGIFT_TIPs.length)] || NOGIFT_TIPs[0]);
      const remainCountMsg = '您还有' + res.data.remainJoinCount + '次抽奖机会~';
      if(res.data.lose){
        Modal.alert('未中奖',<span>{msg}<br/>{remainCountMsg}</span> ,[{text:'确定'}])
      }else{
        yield put({
          type: 'changeState',
          payload:{
            showWin: true,
            winMes: '获得'+ res.data.name +'！',
            remainCountMsg
          }
        });
      }
    },
    * getWinRecordList({ payload }, { call , put, select }){
		  let { pageIndex, pageSize, rows, noMore } = yield select(state=>state.shake.winRecordInfo);
		  const data = {
		    pageSize,
        pageIndex,
        ...payload
      };
		  const res = yield call(winRecordList, data);
		  if(data.pageIndex > 1){
		    rows = res.data.rows.concat(rows);
      }else{
		    rows = res.data.rows;
      }
      if(res.data.rows.length < pageSize){
        noMore = true
      }
		  yield put({
        type: 'changeWinRecordInfo',
        payload: {
          rows,
          noMore,
          pageIndex: data.pageIndex
        }
      })
    },

	},

	reducers: {
		changeState(state, {payload}) {
			return {
				...state,
				...payload
			}
		},
    changeWinRecordInfo(state, { payload }){
		  return{
        ...state,
        winRecordInfo:{
          ...state.winRecordInfo,
          ...payload
        }
      }
    },
    clearWinRecordInfo(state){
		  return{
        ...state,
        winRecordInfo:{
          pageIndex: 1,
          pageSize: 10,
          rows:[],
          noMore: false
        }
      }
    }
	},
};

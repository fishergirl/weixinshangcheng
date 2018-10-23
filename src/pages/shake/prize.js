import React, {Component} from 'react';
import {connect} from 'dva';
import {
  ActivityIndicator
} from 'antd-mobile';
import router from 'umi/router'
import styles from './style.less'
import {dateFtt} from "../../utils/dateFtt";

@connect(({global, shake, loading}) => {
	return {
    global,
    shake,
		loading: loading.effects['global/getUserInfo'] || loading.effects['shake/getWinRecordList'] || false,
	}
})
class ReactComponent extends Component {
	state = {};

	componentDidMount() {
    this._init();
	}

	componentWillUnmount() {
    this.props.dispatch({type:'shake/clearWinRecordInfo'})
	}

	_init = async ()=>{
    const { location:{ query }, dispatch } = this.props;
    await dispatch({type: 'global/getUserInfo'});
    const { global: { userInfo } } = this.props;
    dispatch({
      type:'shake/getWinRecordList',
      payload:{
        shakeId: query.shakeId,
        csmCode: userInfo.csmCode
      }
    });
    this._scrollWatch()
  };

  _scrollWatch = ()=>{
    const oPage = this.page;
    oPage.addEventListener('scroll',()=>{
      if(oPage.scrollTop + oPage.offsetHeight >= oPage.scrollHeight - 30){
        const { shake:{ winRecordInfo:{ noMore, pageIndex, rows } }, global: { userInfo }, location:{ query }, loading } = this.props;
        if(loading || noMore || rows.length < 10)return;
        this.props.dispatch({
          type: 'shake/getWinRecordList',
          payload:{
            pageIndex: pageIndex + 1,
            shakeId: query.shakeId,
            csmCode: userInfo.csmCode
          }
        })
      }
    })
  };

	render() {
    const { shake:{ winRecordInfo:{ rows, noMore }}, loading } = this.props;
		return (
			<div className={styles.prize} ref={el=>this.page=el}>
        <div className={styles.title}>我的奖品</div>
        <div className={styles.list}>
          {
            rows.map((item,index)=>(
              <div className={styles.item} key={index}>
                <div>
                  <p>奖品名称：{item.prizeName}</p>
                  <p>抽奖时间：{dateFtt(item.createTime,'yyyy-MM-dd hh:mm')}</p>
                </div>
                {
                  item.status === 1 && <span className='red' onClick={()=>router.push({pathname:'/submitOrder/prizeReceive',query:{recordId:item.recordId}})}>领取</span>
                }
                {
                  item.status === 2 && <span>已领取</span>
                }
              </div>
            ))
          }
        </div>
        <ActivityIndicator toast text="加载中..." animating={loading}/>
        {
          rows.length === 0 && !loading &&
          <div className={styles.no_data}>暂无记录</div>
        }
        {
          rows.length > 10 && <div className={styles.foot}>{ noMore ? '没有更多了' : '加载中...' }</div>
        }
			</div>
		);
	}
}

export default ReactComponent

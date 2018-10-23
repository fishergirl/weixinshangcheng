import React, {Component} from 'react';
import {connect} from 'dva';
import {
  ActivityIndicator
} from 'antd-mobile';
import { imgHost } from '../../utils/config'
import { dateFtt } from '../../utils/dateFtt'
import styles from './style.less'

@connect(({shake, loading}) => {
	return {
    shake,
		loading: loading.effects['shake/getWinRecordList'] || false,
	}
})
class ReactComponent extends Component {
	state = {
    refreshing: false
  };

	componentDidMount() {
    const { query } = this.props.location;
    this.props.dispatch({
      type:'shake/getWinRecordList',
      payload:{
        shakeId: query.shakeId
      }
    });
    this._scrollWatch()
	}

	componentWillUnmount() {
    this.props.dispatch({type:'shake/clearWinRecordInfo'})
	}

  _scrollWatch = ()=>{
    const oPage = this.page;
    oPage.addEventListener('scroll',()=>{
      if(oPage.scrollTop + oPage.offsetHeight >= oPage.scrollHeight - 30){
        const { shake:{ winRecordInfo:{ noMore, pageIndex, rows } }, location:{ query }, loading } = this.props;
        if(loading || noMore || rows.length < 10)return;
        this.props.dispatch({
          type: 'shake/getWinRecordList',
          payload:{
            pageIndex: pageIndex + 1,
            shakeId: query.shakeId
          }
        })
      }
    })
  };

	render() {
	  const { shake:{ winRecordInfo:{ rows, noMore }}, loading } = this.props;
	  const desensitization = (str)=>{
      return str.substring(0,1) + '***'
    };
		return (
		  <div className={styles.shakeRecord} ref={el=>this.page = el}>
        <div className={styles.title_bg}>
          <img src={imgHost + 'wx_zjjlbg.png'} alt=""/>
          <h3>摇一摇中奖记录</h3>
        </div>
        <div className={styles.list}>
          {
            rows.map((item,index)=>(
              <div className={styles.item} key={index}>
                <i><img src={imgHost + 'wx_icon.png'} alt=""/></i>
                <div>
                  <p>用户 {desensitization(item.csmName)} 获得 {item.prizeName} x1</p>
                  <p>抽奖时间：{dateFtt(item.createTime,'yyyy-MM-dd hh:mm')}</p>
                </div>
              </div>
            ))
          }
        </div>
        <ActivityIndicator toast text="加载中..." animating={ rows.length === 0 && loading}/>
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

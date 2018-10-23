import React, {Component} from 'react';
import {connect} from 'dva';
import {
  ActivityIndicator
} from 'antd-mobile'
import Scroll from 'react-bescroll';
import { imgHost } from '../../utils/config'
import classnames from 'classnames'
import { dateFtt } from '../../utils/dateFtt'
import styles from './style.less'

@connect(({exchange, global, loading}) => {
  return {
    exchange,
    global,
    loading: loading.effects['exchange/getExchangeRecords'] || false,
  }
})
export default class Analysis extends Component {
	state = {
	  type: 'default'
  };

	componentDidMount() {
    this.props.dispatch({
      type:'exchange/getExchangeRecords'
    })
	}

	componentWillUnmount() {

	}

  loadMoreData = async()=>{
    this.setState({type: 'loadMore'});
    const { exchange:{ recordsData:{ pageNum, rows } } } = this.props;
    if(rows.length < 10)return;
    await this.props.dispatch({
      type: 'exchange/getExchangeRecords',
      payload:{
        pageNum: pageNum+1
      }
    });
  };

	render() {
    const { exchange:{ recordsData: { rows, noMore }}, loading } = this.props;
    const { type } = this.state;
		return (
			<div className={styles.goods_list}>
        <ActivityIndicator toast text="加载中..." animating={type === 'default' && loading}/>
        <Scroll
          ref={(ref)=>this.scroll=ref}
          scrollbar={false}
          click={true}
          pullUpLoad= {{
            txt:{
              more: '加载中...',
              nomore: noMore ? '没有更多了哦' : '',
            }
          }}
          pullUpLoadMoreData={this.loadMoreData}
          isPullUpTipHide={ rows.length < 10 }
        >
          <div className={styles.list_wrapper}>
            {
              rows.map((item,index)=>(
                <div className={styles.records_detail} key={index}>
                  <div className={styles.ex_header}>
                    {
                      (item.dtype === 5 || item.dtype === 6) ?
                        <span>积分冲正</span> :
                        <span>{dateFtt(item.orderBill.createTime,'yyyy-MM-dd hh:mm')}</span>
                    }
                    <span className={classnames({[styles.add]: item.dtype % 2 !== 0})}>{item.dtype % 2 !== 0 ? '+' : '-'}{item.score}</span>
                  </div>
                  {
                    item.orderBill && item.orderBill.detailList.map((good,index)=>(
                      <div className={styles.goods_detail_goods} key={index}>
                        <div className={styles.goods_img}>
                          <img src={good.imageName ? imgHost + good.imageName.split(';')[0] : imgHost + 'wx_goods.png'} alt="goods" />
                        </div>
                        <div className={styles.goods_desc}>
                          <p>{item.dtype === 1?'获得积分':'积分兑换'}</p>
                          <p>{good.aliasName || good.goodsName}</p>
                        </div>
                        <div>
                          X {good.gcount}
                        </div>
                      </div>
                    ))
                  }
                </div>
              ))
            }
            {
              rows.length === 0 && !loading &&
              <div className={styles.nodata}>
                暂无数据
              </div>
            }
          </div>
        </Scroll>
			</div>
		);
	}
}

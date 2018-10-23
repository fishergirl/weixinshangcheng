import React, {Component} from 'react';
import {connect} from 'dva';
import {
  ActivityIndicator
} from 'antd-mobile'
import Scroll from 'react-bescroll';
import router from 'umi/router'
import { imgHost } from '../../utils/config'
import styles from './style.less'

@connect(({exchange, global, loading}) => {
  return {
    exchange,
    global,
    loading: loading.effects['exchange/getScoreGoods'] || false,
  }
})
export default class Goods extends Component {
	state = {
	  type: 'default'
  };

	componentDidMount() {
    this.props.dispatch({
      type:'exchange/getScoreGoods'
    })
	}

	componentWillUnmount() {

	}

  loadMoreData = async()=>{
	  this.setState({type: 'loadMore'});
    const { exchange:{ goodsData:{ pageNum, rows } } } = this.props;
    if(rows.length < 10)return;
    await this.props.dispatch({
      type: 'exchange/getScoreGoods',
      payload:{
        pageNum: pageNum+1
      }
    });
  };


	render() {
    const { exchange:{ goodsData: { rows, noMore }}, loading } = this.props;
    const { type } = this.state;
		return (
			<div className={styles.goods_list}>
        <ActivityIndicator toast text="加载中..." animating={ type === 'default' && loading}/>
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
                <div className={styles.goods_detail} key={index} onClick={()=>router.push({pathname:'/exchange/goodsDetail',query:{goodsCode:item.goodsCode}})}>
                  <div className={styles.goods_img}>
                    <img src={item.imageName ? imgHost + item.imageName.split(';')[0] : imgHost + 'wx_goods.png'} alt="goods" />
                  </div>
                  <div className={styles.goods_desc}>
                    <p>{item.aliasName || item.goodsName}</p>
                    <p>
                      <i className="iconfont icon-jifen"/> {item.requiredScore}
                    </p>
                  </div>
                </div>
              ))
            }
          </div>
        </Scroll>
        {
          rows.length === 0 && !loading &&
          <div className={styles.nodata}>暂无数据</div>
        }
      </div>
		);
	}
}

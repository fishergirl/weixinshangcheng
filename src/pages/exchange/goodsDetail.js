import React, {Component} from 'react';
import {connect} from 'dva';
import {
  Carousel,
  ActivityIndicator
} from 'antd-mobile'
import numeral from 'numeral'
import DocumentTitle from 'react-document-title'
import router from 'umi/router'
import { imgHost } from '../../utils/config'
import classnames from 'classnames'
import styles from './style.less'

@connect(({exchange, global, loading}) => {
  return {
    exchange,
    global,
    loading: loading.effects['exchange/getGoodsDetail'] || false,
  }
})
export default class GoodsDetail extends Component {
	state = {
	  counter : 1,
    tab: 0
  };

	componentDidMount() {
	  const { query } = this.props.location;
    this.props.dispatch({
      type:'exchange/getGoodsDetail',
      payload:{
        goodsCode:query.goodsCode
      }
    })
	}

	componentWillUnmount() {

	}

  onChange = (counter)=>{
	  if(counter<1 || counter>999)return;
	  this.setState({counter})
  };

  submit = ()=>{
    const { exchange:{ detailData } } = this.props;
    const { counter } = this.state;
    detailData.counter = counter;
    this.props.dispatch({
      type:'global/changeState',
      payload:{
        selectGoods: [detailData],
        orderFlag: 2
      }
    });
    router.push('/submitOrder');
  };

	render() {
	  const { exchange:{ detailData }, loading} = this.props;
	  const { counter, tab } = this.state;
	  const images = detailData.imageName ? detailData.imageName.split(';') : [];
		return (
      <DocumentTitle title="商品详情">
        <div className={styles.detail}>
          <ActivityIndicator toast text="加载中..." animating={loading}/>
          {
            images.length > 0 &&
            <Carousel
              className={styles.banner}
              dotActiveStyle={{background:'#48b4c8'}}
              autoplay={true}
              infinite={true}
            >
              {
                images.map((item,index)=>(
                  <div className={styles.img_box} key={index}>
                    <img src={imgHost + item} alt="banner"/>
                  </div>
                ))
              }
            </Carousel>
          }
          {
            images.length === 0 &&
            <div className={styles.img_box}>
              <img src={imgHost + 'wx_goods.png'} alt="banner"/>
            </div>
          }
          <div className={styles.detail_info}>
            <p>{detailData.aliasName || detailData.goodsName}</p>
            <div className={styles.detail_notice}>
              <span><i className="iconfont icon-jifen"/> {detailData.requiredScore}</span>
              <span>市场参考价￥{numeral(detailData.basePrice).format('0.00')}</span>
              <div className={styles.counter}>
                <span onClick={()=>this.onChange(counter - 1)}>-</span>
                <span>{counter}</span>
                <span onClick={()=>this.onChange(counter + 1)}>+</span>
              </div>
            </div>
          </div>
          <div className={styles.tabs_wrap}>
            <div className={styles.tabs}>
              <div className={classnames(styles.tab_item,{[styles.active]:tab === 0})} onClick={()=>this.setState({tab:0})}>图文详情</div>
              <div className={classnames(styles.tab_item,{[styles.active]:tab === 1})} onClick={()=>this.setState({tab:1})}>产品参数</div>
              <div className={classnames(styles.tab_item,{[styles.active]:tab === 2})} onClick={()=>this.setState({tab:2})}>售后保障</div>
            </div>
            <div className={styles.line} style={{left:  tab*33.33 + '%'}}/>
          </div>
          <div className={styles.tab_content}>
            { tab === 0 && <div dangerouslySetInnerHTML={{__html:detailData.extends1}}/> }
            { tab === 1 && <div dangerouslySetInnerHTML={{__html:detailData.extends2}}/> }
            { tab === 2 && <div dangerouslySetInnerHTML={{__html:detailData.extends3}}/> }
            <div />
          </div>
          <div className={styles.foot}>
            <span>合计：<span className="red">{detailData.requiredScore*counter || 0}</span> 积分</span>
            <span onClick={this.submit}>我要兑换</span>
          </div>
        </div>
      </DocumentTitle>
		);
	}
}

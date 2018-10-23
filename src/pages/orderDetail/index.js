import React, {Component,Fragment} from 'react';
import {connect} from 'dva';
import {
  ActivityIndicator
} from 'antd-mobile';
import DocumentTitle from 'react-document-title'
import classnames from 'classnames'
import numeral from 'numeral'
import router from 'umi/router'
import { status,statusInfo } from "../../utils/status";
import styles from './style.less'
import {imgHost} from "../../utils/config";
import {getSetting} from "../../utils/corpSetting";

function changImg(str) {
  return str.split(';')[0]
}
@connect(({orderDetail, global, loading}) => {
	return {
    global,
    orderDetail,
		loading: loading.effects['orderDetail/getOrderDetail'],
	}
})
export default class OrderDetail extends Component {
	state = {};

	componentDidMount() {
    const orderCode = this.props.location.query.orderCode;
    if(!orderCode){
      router.replace('/');
      return
    }
    const { corpSetting } = this.props.global;
    if(!corpSetting){
      this.props.dispatch({
        type:'global/getCorpSetting'
      })
    }
    this.props.dispatch({
      type:'orderDetail/getOrderDetail',
      payload:{
        orderCode:Number(orderCode)
      }
    })
	}

	componentWillUnmount() {
    this.props.dispatch({
      type:'orderDetail/changeState',
      payload:{
        data:{}
      }
    })
	}

	render() {
	  const { orderDetail:{ data },  global:{ corpSetting }, loading } = this.props;
    const showPrice = getSetting(corpSetting).showPrice ;
    const cfloorFun = getSetting(corpSetting).cfloorFun;
		return (
      <DocumentTitle title="订单详情">
        <Fragment>
          <ActivityIndicator toast text="加载中..." animating={loading || false}/>
          {
            !loading &&
            <div className={styles.page}>
              <div className={styles.title}>
                <i className={classnames(styles.status_icon,styles[statusInfo(data).img])}/>
                <p className={styles.status_desc}>{statusInfo(data).mes}</p>
              </div>
              <div className={styles.order}>
                <span>订单编号：{data.orderCode}</span>
                <span className={styles.order_status}>{status(data)}</span>
              </div>
              <div className={classnames(styles.block,styles.user)}>
                <div className={styles.sub_title}>收货地址</div>
                <div className={styles.item}>
                  <span>{data.contact}</span>
                  <span>{data.contactPhone}</span>
                </div>
                <div className={styles.item}>
                  <span>{data.csmAddress}</span>
                </div>
              </div>
              <div className={styles.block}>
                <div className={styles.sub_title}>商品信息</div>
                {
                  data.detailList && data.detailList.map((item,index) =>(
                    <div className={styles.block_border} key={index}>
                      <div className={styles.box}>
                        <div>
                          <div className={styles.img}>
                            <img src={imgHost+(item.imageName ? changImg(item.imageName) : 'wx_goods.png')} alt=""/>
                          </div>
                        </div>
                        <div className={styles.mes}>
                          <p>{item.aliasName || item.goodsName}</p>
                          {
                            showPrice && data.orderFlag === 1 &&
                            <p>￥<span>{item.basePrice || item.gprince}</span></p>
                          }
                          {
                            data.orderFlag === 2 &&
                            <p>{item.priceScore}积分</p>
                          }
                        </div>
                        <div className={styles.counter_t}>X{item.counter || item.gcount}</div>
                      </div>
                      {
                        showPrice &&
                        <div className={styles.item}>
                          <span>配送费</span>
                          <span>{item.fee1 ? '￥' + numeral(item.fee1).format('0.00') : '免费配送'}</span>
                        </div>
                      }
                      {
                        cfloorFun &&
                        <div className={styles.item}>
                          <span>上楼费</span>
                          <span>￥{numeral(item.fee2).format('0.00')}</span>
                        </div>
                      }
                      {
                        item.tip > 0 &&
                        <div className={styles.item}>
                          <span>服务费</span>
                          <span>￥{numeral(item.tip).format('0.00')}</span>
                        </div>
                      }
                    </div>
                  ))
                }
                <div className={styles.foot}>
                  <span>共 <span className="orange">{data.goodsCount}</span> 件商品</span>
                  {
                    data.orderFlag === 1 && showPrice && data.payStatus === 1 &&
                    <span>应付：<span className="red">￥ {numeral(data.treceivables).format('0.00')}</span></span>
                  }
                  {
                    data.orderFlag === 1 && showPrice && data.payStatus > 1 &&
                    <span>实付：<span className="red">￥ {numeral(data.taccReceivable).format('0.00')}</span></span>
                  }
                  {
                    data.orderFlag === 2 &&
                    <span>应付：<span className="orange">{data.tRequiredScore}积分 {showPrice && <span className="red">￥ {numeral(data.treceivables).format('0.00')}</span>}</span></span>
                  }
                </div>
              </div>
            </div>
          }
        </Fragment>
      </DocumentTitle>
		);
	}
}

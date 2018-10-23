import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import DocumentTitle from 'react-document-title';
import classnames from 'classnames'
import {
  Toast,
  ActivityIndicator
} from 'antd-mobile'
import { dateFtt } from '../../utils/dateFtt'
import styles from './style.less'

@connect(({coupon, loading}) => {
	return {
    coupon,
		loading: loading.effects['coupon/getCouponList'] || false,
    subLoading: loading.effects['coupon/getCoupon'] || false,
	}
})
export default class Coupon extends Component {
	state = {};

	componentDidMount() {
    this.props.dispatch({type:'coupon/getCouponList'});
	}

	componentWillUnmount() {

	}

  getCoupon = (item)=>{
    if(item.status === 2) {
      Toast.info('该优惠卷已结束',2,null,false)
      return
    }
    this.props.dispatch({
      type:'coupon/getCoupon',
      payload:{
        cid:item.cid
      }
    })
  };

	render() {
	  const { coupon:{ rows }, loading, subLoading } = this.props;
		return (
      <DocumentTitle title='优惠卷'>
        <Fragment>
          <ActivityIndicator toast text="加载中..." animating={loading}/>
          <ActivityIndicator toast text="处理中..." animating={subLoading}/>
          <div className={styles.title}>
            店铺优惠卷
          </div>
          <ul>
            {
              rows.map((item,index)=>(
                <li className={classnames(styles.coupon_item,{[styles.galy]: item.status === 2 })} key={index}>
                  <div className={styles.coupon_l}>
                    <p>￥<span>{item.value}</span></p>
                    <p>订单金额满{item.limit}可以使用</p>
                    <p>有效期{dateFtt(new Date(item.startTime),'yyyy-MM-dd')} 至 {dateFtt(new Date(item.endTime),'yyyy-MM-dd')}</p>
                  </div>
                  <div className={styles.coupon_r} onClick={()=>this.getCoupon(item)}>
                    立即领取
                  </div>
                </li>
              ))
            }
          </ul>
        </Fragment>
      </DocumentTitle>
		);
	}
}

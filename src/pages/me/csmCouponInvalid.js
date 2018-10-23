import React, {Component} from 'react';
import {connect} from 'dva';
import {
  ActivityIndicator
} from 'antd-mobile';
import DocumentTitle from 'react-document-title';
import classnames from 'classnames'
import { dateFtt } from "../../utils/dateFtt";
import styles from './style.less'


@connect(({me, loading}) => {
  return {
    me,
    loading: loading.effects['me/getInvalidCouponList'],
  }
})
export default class Analysis extends Component {
  state = {};

  componentDidMount() {
    this.props.dispatch({
      type: 'me/getInvalidCouponList'
    });
  }

  componentWillUnmount() {

  }

  render() {
    const { me:{ invalidCouponList }, loading } = this.props;
    return (
      <DocumentTitle title="用户优惠卷">
        <div className={styles.coupon_page} ref={el=>this.page = el}>
          <div className={styles.title}>失效卷</div>
          <ul className={classnames(styles.coupon_list,styles.disable)} >
            {
              invalidCouponList && invalidCouponList.map((item,index)=>(
                <li className={styles.coupon_item} key={index}>
                  <div className={styles.item_left}>
                    <p>￥<span>{item.value}</span></p>
                    <p>满{item.limit}元使用</p>
                  </div>
                  <div className={styles.item_right}>
                    <p>{item.cname}</p>
                    <p>使用时间：{dateFtt(item.startTime,'yyyy.MM.dd')}-{dateFtt(item.endTime,'yyyy.MM.dd')}</p>
                  </div>
                  <div className={styles.yuan_up}/>
                  <div className={styles.yuan_down}/>
                </li>
              ))
            }
          </ul>
          <ActivityIndicator toast text="加载中..." animating={invalidCouponList && invalidCouponList.length === 0 && loading}/>
          {
            invalidCouponList && invalidCouponList.length === 0 && !loading &&
            <div className={styles.no_data}>暂无数据</div>
          }
        </div>
      </DocumentTitle>
    );
  }
}

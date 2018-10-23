import React, {Component,Fragment} from 'react';
import {connect} from 'dva';
import {
  ActivityIndicator
} from 'antd-mobile';
import router from 'umi/router';
import DocumentTitle from 'react-document-title';
import { dateFtt } from "../../utils/dateFtt";
import styles from './style.less'

@connect(({me, loading}) => {
  return {
    me,
    loading: loading.effects['me/getCmsCouponList'],
  }
})
export default class Analysis extends Component {
	state = {};

	componentDidMount() {
    this.props.dispatch({
      type: 'me/getCmsCouponList'
    });
    this._scrollWatch();
	}

	componentWillUnmount() {

	}

	_scrollWatch = ()=>{
	  const oPage = this.page;
    oPage.addEventListener('scroll',()=>{
      if(oPage.scrollTop + oPage.offsetHeight >= oPage.scrollHeight - 30){
        const { me:{ cmsCouponData:{ noMore, pageIndex } }, loading } = this.props;
        if(loading || noMore)return;
        this.props.dispatch({
          type: 'me/getCmsCouponList',
          payload:{
            pageIndex: pageIndex + 1
          }
        })
      }
    })
  };

	render() {
	  const { me:{ cmsCouponData:{ rows, noMore } }, loading } = this.props;
		return (
      <DocumentTitle title="用户优惠卷">
        <div className={styles.coupon_page} ref={el=>this.page = el}>
          <div className={styles.title}>我的优惠卷</div>
          <ul className={styles.coupon_list} >
            {
              rows && rows.map((item,index)=>(
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
          <ActivityIndicator toast text="加载中..." animating={rows && rows.length === 0 && loading}/>
          {
            rows && rows.length === 0 && !loading &&
            <div className={styles.no_data}>暂无数据</div>
          }
          {
            rows && rows.length > 0 &&
            <div className={styles.foot}>
              {
                noMore ?
                  <Fragment>
                    <span>没有更多可用券了 | </span>
                    <span className={styles.a} onClick={()=>router.push('/me/csmCouponInvalid')}>查看失效卷 ></span>
                  </Fragment>
                  :
                  <span>加载中...</span>
              }
            </div>
          }

        </div>
      </DocumentTitle>
		);
	}
}

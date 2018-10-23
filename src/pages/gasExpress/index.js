import React, {Component,Fragment} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {
  Icon,
  ActivityIndicator
} from 'antd-mobile';
import DocumentTitle from 'react-document-title';
import classnames from 'classnames'
import Scroll from 'react-bescroll';
import GoodsItem from '../../components/GoodsItem'
import styles from './style.less'

@connect(({gasExpress, global, loading }) => {
  return {
    gasExpress,
    global,
    loading: loading.models.gasExpress || false,
    subLoading: loading.effects['gasExpress/submit'] || false,
  }
})
export default class GasExpress extends Component {
  state = {
    type: 'default'
  };

  componentDidMount() {
    const { gasExpress:{ goodsData:{ rows } }, global:{ routerFrom, appInfo, corpSetting } } = this.props;
    if (rows.length>0 && routerFrom && (routerFrom.pathname === '/submitOrder' || routerFrom.pathname === '/coupon')) return;
    console.log(appInfo,'appInfo')
    if(appInfo && (appInfo.storeInfo || appInfo.saleInfo || !appInfo.hasSaleArea)){
      this.props.dispatch({
        type: 'gasExpress/getGoods',
        payload: {
          pageIndex: 1
        }
      });
    }else{
      this.props.dispatch({
        type: 'gasExpress/init'
      });
    }
    this.props.dispatch({
      type:'gasExpress/getCouponList'
    });
    if(!corpSetting){
      this.props.dispatch({
        type:'global/getCorpSetting'
      })
    }
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if(newProps.gasExpress.goodsData.rows.length !== this.props.gasExpress.goodsData.rows.length){
      this.scroll.getScrollObj().refresh();
    }
  }

  pullDownFreshAction = async ()=> {
    this.setState({type:'pullDown'});
    await this.props.dispatch({
      type: 'gasExpress/getGoods',
      payload: {
        pageIndex: 1
      }
    });
  };

  loadMoreData = async ()=>{
    this.setState({type:'pullUp'});
    const { gasExpress:{ goodsData:{ pageIndex, rows } } } = this.props;
    if(rows.length < 10)return;
    await this.props.dispatch({
      type: 'gasExpress/getGoods',
      payload:{
        pageIndex: pageIndex + 1
      }
    });
  };

  render() {
    const { gasExpress:{ goodsData:{ rows, noMore }, couponList }, global:{ appInfo, corpSetting }, dispatch, loading, subLoading } = this.props;
    const { type } = this.state;
    let counter = 0;
    rows.forEach(item=>{
      counter += Number(item.counter) || 0
    });
    const validCouponList = couponList.filter(item=>item.status === 1);
    return (
      <DocumentTitle title="一键订气">
        <Fragment>
          <ActivityIndicator toast text="处理中..." animating={subLoading}/>
          <ActivityIndicator toast text="加载中..." animating={loading && type === 'default' }/>
          {
            validCouponList.length > 0 &&
            <div className={styles.coupon} onClick={()=>router.push('/coupon')}>
              <span className={styles.flex}>有可领取的优惠券</span>
              <span className="red">去领取</span>
              <Icon type="right"/>
            </div>
          }
          {
            appInfo && appInfo.hasSaleArea &&
            <div className={styles.goods_tip}>
              <span>所选销售区域：{appInfo && appInfo.saleInfo ? appInfo.saleInfo.saleDesc : '--' }</span>
              <span onClick={()=>router.push('/city')}><i className="iconfont icon-qiehuan"/>切换销售区域</span>
            </div>
          }
          <div className={classnames(styles.goods_list,{[styles.has_coupon]: validCouponList.length > 0,[styles.has_salearea]: appInfo && appInfo.hasSaleArea, [styles.no_tip]:rows.length < 10 })}>
             <Scroll
              ref={(ref)=>this.scroll=ref}
              scrollbar={false}
              click={true}
              pullDownRefresh
              doPullDownFresh={this.pullDownFreshAction}
              pullUpLoad= {{
                txt:{
                  more: '加载中...',
                  nomore: noMore ? '没有更多了哦' : '',
                }
              }}
              pullUpLoadMoreData={this.loadMoreData}
              isPullUpTipHide={ rows.length === 0 }
            >
              <div className={styles.goods_list_box}>
                {
                  rows.length === 0 && !loading ? <div className={styles.no_data}>暂无数据</div> :
                  rows.map((item,index)=><GoodsItem key={index} item={item} corpSetting={corpSetting}  onChange={(counter)=>dispatch({type:'gasExpress/changeList',payload:{index,counter}})} />)
                }
              </div>
            </Scroll>
          </div>
          <div className={styles.foot}>
            <span>已选数量： <span className="red">{counter}</span></span>
            <span onClick={()=>dispatch({type:'gasExpress/submit'})}>立即购买</span>
          </div>

        </Fragment>
      </DocumentTitle>
    );
  }
}

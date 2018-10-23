import React, {Component,Fragment} from 'react';
import {connect} from 'dva';
import {
  ActivityIndicator,
  Tag
} from 'antd-mobile'
import Scroll from 'react-bescroll';
import numeral from 'numeral'
import router from 'umi/router'
import classnames from 'classnames'
import { imgHost } from '../../../utils/config'
import styles from '../style.less'

@connect(({exchange, global, loading}) => {
  return {
    exchange,
    global,
    loading: loading.effects['global/getUserInfo'] || loading.effects['exchange/getScoreGoods'] || false,
  }
})
export default class Goods extends Component {
  state = {
    type: 'default'
  };

  componentDidMount() {
    if(!this.props.exchange.hasSelectAddress){
      router.replace('/exchange/v2/address')
    }
    this.props.dispatch({
      type:'global/getUserInfo'
    });
    this.props.dispatch({
      type:'global/getCorpSetting'
    });
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

  renderTip = (count,corpSetting)=>{
    if(!corpSetting)return '';
    const sp3_7 = (corpSetting.sp3 >> 7) & 0x01;
    if(!sp3_7) return '';
    if (count <= 0) {
      return <span className="orange">无货</span>;
    }
    if (count > 10) {
      return <span className="gray">库存充足</span>;
    }
    if (count > 0 && count <= 10) {
      return <span className="orange">{"仅剩" + count + "件"}</span>;
    }
  };

  renderTag = (userInfo)=> {
    if (!userInfo) return '';
    const csmType = userInfo.csmType;
    return (
      <Fragment>
        { csmType === 1 && <span className={styles.juming}><Tag small>居民用户</Tag></span> }
        { csmType === 2 && <span className={styles.shangye}><Tag small>商业用户</Tag></span> }
        { csmType === 4 && <span className={styles.gongye}><Tag small>工业用户</Tag></span> }
      </Fragment>
    )
  };

  render() {
    const { exchange:{ goodsData: { rows, noMore }}, global:{ userInfo, corpSetting }, loading } = this.props;
    const { type } = this.state;
    return (
      <div className={classnames(styles.goods_list,styles.goods_list_v2)}>
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
            <div className={styles.list_title}>
              {this.renderTag(userInfo)} 可兑换积分：<span className="orange"><i className="iconfont icon-jifen"/> {userInfo && userInfo.score}</span>
            </div>
            {
              rows.map((item,index)=>(
                <div className={styles.goods_detail} key={index} onClick={()=>router.push({pathname:'/exchange/v2/goodsDetail',query:{goodsCode:item.goodsCode}})}>
                  <div className={styles.goods_img}>
                    <img src={item.imageName ? imgHost + item.imageName.split(';')[0] : imgHost + 'wx_goods.png'} alt="goods" />
                  </div>
                  <div className={styles.goods_desc}>
                    <p>{item.aliasName || item.goodsName}</p>
                    <p>市场参考价：￥{numeral(item.basePrice).format('0.00')}</p>
                    <div>
                      <span className={styles.juming}>
                        <i className="iconfont icon-jifen"/> <span>{item.requiredScore1}</span> <Tag small>居民用户</Tag>
                      </span>
                      <span className={styles.shangye}>
                        <i className="iconfont icon-jifen"/> <span>{item.requiredScore2}</span> <Tag small>商业用户</Tag>
                      </span>
                      <span className={styles.gongye}>
                        <i className="iconfont icon-jifen"/> <span>{item.requiredScore4}</span> <Tag small>工业用户</Tag>
                      </span>
                    </div>
                  </div>
                  <div className={styles.goods_right}>
                    {this.renderTip(item.gdCount,corpSetting)}
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

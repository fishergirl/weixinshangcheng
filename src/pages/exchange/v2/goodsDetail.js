import React, {Component} from 'react';
import {connect} from 'dva';
import {
  Carousel,
  ActivityIndicator,
  Tag,
  Toast
} from 'antd-mobile'
import numeral from 'numeral'
import DocumentTitle from 'react-document-title'
import router from 'umi/router'
import { imgHost } from '../../../utils/config'
import classnames from 'classnames'
import styles from '../style.less'

@connect(({exchange, global, loading}) => {
  return {
    exchange,
    global,
    loading: loading.effects['exchange/getGoodsDetail'] || false,
  }
})
export default class GoodsDetail extends Component {
  state = {
    tab: 0
  };

  componentDidMount() {
    const { query } = this.props.location;
    const { userInfo, corpSetting } = this.props.global;

    if(!userInfo){
      this.props.dispatch({
        type: 'global/getUserInfo'
      })
    }

    if(!corpSetting){
      this.props.dispatch({
        type:'global/getCorpSetting'
      });
    }

    this.props.dispatch({
      type:'exchange/getGoodsDetail',
      payload:{
        goodsCode:query.goodsCode
      }
    })
  }

  componentWillUnmount() {

  }

  submit = ()=>{
    const { exchange:{ detailData }, global:{ userInfo } } = this.props;
    console.log(userInfo)
    const csmType = userInfo.csmType || 1;
    const requiredScore = detailData["requiredScore" + csmType];
    if(requiredScore === 0) {
      const csmTypedesc = {
        "1": "居民",
        "2": "商业",
        "4": "工业"
      };
      Toast.info(csmTypedesc[csmType] + "用户类型不可兑换此商品",2,null,false);
      return;
    }
    // if(detailData.gdCount <= 0) {
    //   Toast.info("商品无货，请选择其他兑换商品",2,null,false);
    //   return;
    // }
    // if(requiredScore > userInfo.score) {
    //   Toast.info("积分不足，不可兑换此商品",2,null,false);
    //   return;
    // }
    detailData.counter = 1;
    const addressInfo = userInfo.addressItems.filter(item=>item.isMain === 1)[0];
    this.props.dispatch({
      type:'global/changeState',
      payload:{
        selectGoods: [detailData],
        orderFlag: 2,
        appInfo:{
          addressInfo: addressInfo
        }
      }
    });
    router.push('/submitOrder/exchangeV2');
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

  render() {
    const { exchange:{ detailData }, global:{ corpSetting }, loading} = this.props;
    const { tab } = this.state;
    const images = detailData.imageName ? detailData.imageName.split(';') : [];
    return (
      <DocumentTitle title="商品详情">
        <div className={classnames(styles.detail,styles.detail_v2)}>
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
              <span>市场参考价￥{numeral(detailData.basePrice).format('0.00')}</span>
              <span>{this.renderTip(detailData.gdCount,corpSetting)}</span>
            </div>
            <div className={styles.tag}>
              <span className={styles.juming}>
                <i className="iconfont icon-jifen"/> <span>{detailData.requiredScore1}</span> <Tag small>居民用户</Tag>
              </span>
              <span className={styles.shangye}>
                <i className="iconfont icon-jifen"/> <span>{detailData.requiredScore2}</span> <Tag small>商业用户</Tag>
              </span>
              <span className={styles.gongye}>
                <i className="iconfont icon-jifen"/> <span>{detailData.requiredScore4}</span> <Tag small>工业用户</Tag>
              </span>
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
            <span/>
            <span onClick={this.submit}>我要兑换</span>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

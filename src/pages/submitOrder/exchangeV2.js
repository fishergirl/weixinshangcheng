import React, {Component,Fragment} from 'react';
import {connect} from 'dva';
import {
  List,
  InputItem,
  ActivityIndicator,
  Toast,
  Tag
} from 'antd-mobile'
import DocumentTitle from 'react-document-title'
import router from 'umi/router'
import classnames from 'classnames'
import GoodsItem from '../../components/GoodsItem'
import styles from './style.less'


const Item = List.Item;
//获取联系人
const getSelectPhone = (userInfo,selectPhone)=>{
  if(!userInfo || !userInfo.phoneItems) return {};
  if(selectPhone) return selectPhone;
  return userInfo.phoneItems.filter(item=>item.isMain === 1)[0] || {}
};
//获取配送地址
// const getSelectAddress = (userInfo,selectAddress)=>{
//   if(!userInfo || !userInfo.addressItems) return {};
//   if(selectAddress) return selectAddress;
//   return userInfo.addressItems.filter(item=>item.isMain === 1)[0] || {}
// };


@connect(({submitOrder, global, loading}) => {
  return {
    submitOrder,
    global,
    loading: loading.effects['global/getUserInfo'] || loading.effects['global/getCorpSetting'],
    submitLoading: loading.effects['submitOrder/orderSubmit'],
  }
})
export default class SubmitOrder extends Component {
  state = {
    sendType: true, //配送方式
    counter: 1
  };

  componentDidMount() {
    const { userInfo, selectGoods, corpSetting, appInfo } = this.props.global;
    if (!selectGoods || !appInfo) {
      router.goBack();
      return
    }

    if(!corpSetting){
      this.props.dispatch({
        type:'global/getCorpSetting',
      })
    }

    if(!userInfo){
      this.props.dispatch({
        type:'global/getUserInfo',
      });
    }
  }

  componentWillUnmount() {

  }

  submitExchange = ()=>{
    if(!this._checkInput())return;
    this.saveOrder(1);
  };

  saveOrder = (payValue)=>{
    const { global:{ userInfo, selectGoods, orderFlag, selectPhone, corpSetting, appInfo } } = this.props;
    const { sendType } = this.state;
    const addressInfo = appInfo && appInfo.addressInfo || {};
    let realFloor = addressInfo.csmFloor; //真实楼层
    realFloor = realFloor > 1 ? realFloor - 1 : 0;
    if(payValue === 2){  // 净气不能选择微信支付
      const good = selectGoods.filter(item=>item.pricingMode === 2)[0];
      if(good){
        Toast.info( good.goodsName + '不能使用微信支付，请选择其他支付方式',2,null,false);
        return
      }
    }
    const buyList = selectGoods.map(item=>({
      goodsId: item.goodsId,
      goodsCode: item.goodsCode,
      fee: item.deliveryFun,
      fee2: item.floorFun,
      tip: item.tip || 0,
      gtId: item.gTypeId,
      gtFlag: item.gtFlag,
      gcount: item.counter,
    }));
    const remark = [];
    if(sendType){
      remark.push("随安检送达");
    }else{
      remark.push("门店自提");
    }
    if(this.remarkRef.state.value) {
      remark.push(this.remarkRef.state.value);
    }
    const data = {
      buyList,
      addressId: addressInfo.csmAddressId,
      address: addressInfo.csmAddress,
      realFloor,
      payType: payValue, //支付宝支付
      phone: getSelectPhone(userInfo,selectPhone).csmPhone,
      contact: getSelectPhone(userInfo,selectPhone).contact,
      remark: remark.join(","),
      orderFlag: orderFlag, //1.普通订单 2.积分兑换订单
      corpSettingFee1: corpSetting.fee1 || 0, //基础上楼费
      fromPlat: 2, //订单来源 微信 2
    };
    if(orderFlag === 1){
      data.orgSNNo = addressInfo.orgSNNo
    }

    this.props.dispatch({
      type:'submitOrder/orderSubmit',
      payload:{
        data,
        fee: 0,
        payValue
      }
    })
  };

  //输入验证
  _checkInput = ()=>{
    const { global:{ userInfo, selectPhone, appInfo } } = this.props;
    const addressInfo = appInfo && appInfo.addressInfo || {};
    const errArr = [];
    if(!getSelectPhone(userInfo,selectPhone).contact)errArr.push('请选择联系人');
    if(!addressInfo.csmAddress)errArr.push('请选择配送地址');
    if(errArr.length>0){
      Toast.info(errArr[0],2,null,false);
      return false
    }
    return true
  };

  //计算各种总价
  _getTotal = ()=>{
    const { global:{ selectGoods } } = this.props;
    let totalScore = 0; //总积分（商品积分总和）
    selectGoods && selectGoods.forEach(item => {
      totalScore += item.counter*item.requiredScore;
    });
    return {
      totalScore,
    }
  };

  onChange = (counter)=>{
    const { corpSetting } = this.props.global;
    if(counter<1 || counter>corpSetting.exchangeBuyMax)return;
    this.setState({counter})
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
    const { global:{ userInfo, selectGoods, orderFlag, selectPhone, appInfo, corpSetting  }, loading, submitLoading } = this.props;
    const { sendType,counter } = this.state;
    const addressInfo = appInfo && appInfo.addressInfo || {};
    return (
      <DocumentTitle title="订单详情">
        <Fragment>
          <ActivityIndicator toast text="加载中..." animating={loading || false} />
          <ActivityIndicator toast text="处理中..." animating={submitLoading || false} />
          <div className={styles.userInfo}>
            <i className="iconfont icon-svgaddress"/>
            <List className={styles.userInfo_r}>
              <Item arrow="horizontal" extra={getSelectPhone(userInfo,selectPhone).csmPhone || ''} onClick={()=>router.push({pathname:'/contact',query:{from:'submitOrder'}})}>
                {this.renderTag(userInfo)}
                <span className={classnames({'gray': !getSelectPhone(userInfo,selectPhone).contact})}>{getSelectPhone(userInfo,selectPhone).contact || '请选择联系人'}</span>
              </Item>
              <Item arrow="horizontal" onClick={()=>router.push({pathname:'/address',query:{from:'submitOrder',orderFlag}})}>
                <span className={classnames(styles.address,{'gray': !addressInfo.csmAddress},{[styles.address_font]: addressInfo.csmAddress && addressInfo.csmAddress.length>15})}
                >{addressInfo.csmAddress ? addressInfo.csmAddress+'('+addressInfo.csmFloor+'楼)' : '请选择配送地址'}</span>
              </Item>
            </List>
          </div>
          <div className={styles.fen}>
            <img src={require('../../assets/caitiao.png')} alt=""/>
          </div>
          <div>
            {
              selectGoods && selectGoods.map((item,index)=><GoodsItem className={styles.item} orderFlag={orderFlag} hasRemark={true} hasCounter={false} corpSetting={corpSetting} renderTip={true} item={item} key={index}/>)
            }
          </div>
          <List className={styles.submitOrder}>
            <Item
              extra={
                <div className={styles.counter}>
                  <span onClick={()=>this.onChange(counter - 1)}>-</span>
                  <span>{counter}</span>
                  <span onClick={()=>this.onChange(counter + 1)}>+</span>
                </div>
              }
            >数量：</Item>
            <Item>
              配送方式： <label onClick={()=>this.setState({sendType:false})}><i className={classnames('iconfont',sendType ? 'icon-danxuan1' : 'icon-duigou')}/> 门店自提</label>&nbsp;&nbsp;&nbsp;
              <label onClick={()=>this.setState({sendType:true})}><i className={classnames('iconfont',sendType ? 'icon-duigou' : 'icon-danxuan1' )}/> 随安检单送达</label>
            </Item>
            <InputItem
              clear
              placeholder="请输入留言"
              ref={el => this.remarkRef = el}
            >买家留言：</InputItem>
          </List>
          <div className={styles.foot}>
            <span>
              合计：<label className="orange">{this._getTotal().totalScore}积分</label>
            </span>
            <span onClick={this.submitExchange}>提交订单</span>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

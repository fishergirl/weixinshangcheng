import React, {Component,Fragment} from 'react';
import {connect} from 'dva';
import {
  List,
  ActivityIndicator,
  Toast
} from 'antd-mobile'
import DocumentTitle from 'react-document-title'
import router from 'umi/router'
import classnames from 'classnames'
import styles from './style.less'
import {imgHost} from "../../utils/config";


const Item = List.Item;
//获取联系人
const getSelectPhone = (userInfo,selectPhone)=>{
  if(!userInfo || !userInfo.phoneItems) return {};
  if(selectPhone) return selectPhone;
  return userInfo.phoneItems.filter(item=>item.isMain === 1)[0] || {}
};
//获取配送地址
const getSelectAddress = (userInfo,selectAddress)=>{
  if(!userInfo || !userInfo.addressItems) return {};
  if(selectAddress) return selectAddress;
  return userInfo.addressItems.filter(item=>item.isMain === 1)[0] || {}
};


@connect(({prizeReceive, global, loading}) => {
  return {
    prizeReceive,
    global,
    loading: loading.effects['global/getUserInfo'],
    submitLoading: loading.effects['submitOrder/orderSubmit'],
  }
})
export default class SubmitOrder extends Component {
  state = {};

  componentDidMount() {
    this._init();
  }

  componentWillUnmount() {

  }

  _init = async () => {
    const { userInfo } = this.props.global;
    const { query } = this.props.location;
    this.props.dispatch({
      type:'global/changeState',
      payload:{
        orderFlag: 4
      }
    });
    if(!userInfo){
      await this.props.dispatch({
        type:'global/getUserInfo',
      });
    }
    this.props.dispatch({
      type:'prizeReceive/getPrizeInfo',
      payload:{
        recordId: query.recordId
      }
    })
  };

  submitExchange = ()=>{
    if(!this._checkInput())return;
    this.saveOrder(1);
  };

  saveOrder = (payValue)=>{
    const { global:{ userInfo, orderFlag, selectPhone, selectAddress }, location:{ query } } = this.props;
    const addressInfo = getSelectAddress(userInfo,selectAddress);
    const buyList = {
      recordId: query.recordId
    };
    const data = {
      buyList,
      addressId: addressInfo.csmAddressId,
      address: addressInfo.csmAddress,
      payType: payValue,
      phone: getSelectPhone(userInfo,selectPhone).csmPhone,
      contact: getSelectPhone(userInfo,selectPhone).contact,
      remark: '(抽奖活动订单)',
      orderFlag: orderFlag, //1.普通订单 2.积分兑换订单 4.抽奖订单
      fromPlat: 2, //订单来源 微信 2
      saleType: 'shake'
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
    const { global:{ userInfo, selectPhone, selectAddress } } = this.props;
    const addressInfo = getSelectAddress(userInfo,selectAddress);
    const errArr = [];
    if(!getSelectPhone(userInfo,selectPhone).contact)errArr.push('请选择联系人');
    if(!addressInfo.csmAddress)errArr.push('请选择配送地址');
    if(errArr.length>0){
      Toast.info(errArr[0],2,null,false);
      return false
    }
    return true
  };

  render() {
    const { global:{ userInfo, selectPhone, selectAddress }, prizeReceive:{ prizeInfo }, loading, submitLoading } = this.props;
    const addressInfo = getSelectAddress(userInfo,selectAddress);
    return (
      <DocumentTitle title="领奖">
        <Fragment>
          <ActivityIndicator toast text="加载中..." animating={loading || false} />
          <ActivityIndicator toast text="处理中..." animating={submitLoading || false} />
          <div className={styles.userInfo}>
            <i className="iconfont icon-svgaddress"/>
            <List className={styles.userInfo_r}>
              <Item arrow="horizontal" extra={getSelectPhone(userInfo,selectPhone).csmPhone || ''} onClick={()=>router.push({pathname:'/contact',query:{from:'submitOrder'}})}>
                <span className={classnames({'gray': !getSelectPhone(userInfo,selectPhone).contact})}>{getSelectPhone(userInfo,selectPhone).contact || '请选择联系人'}</span>
              </Item>
              <Item arrow="horizontal" onClick={()=>router.push({pathname:'/address',query:{from:'submitOrder'}})}>
                <span className={classnames(styles.address,{'gray': !addressInfo.csmAddress},{[styles.address_font]: addressInfo.csmAddress && addressInfo.csmAddress.length>15})}
                >{addressInfo.csmAddress ? addressInfo.csmAddress+'('+addressInfo.csmFloor+'楼)' : '请选择配送地址'}</span>
              </Item>
            </List>
          </div>
          <div className={styles.fen}>
            <img src={require('../../assets/caitiao.png')} alt=""/>
          </div>
          <div>
            <div className={styles.box}>
              <div>
                <div className={styles.img}>
                  <img src={imgHost+ 'wx_gift.png'} alt=""/>
                </div>
              </div>
              <div className={styles.mes}>
                <p>{prizeInfo.prizeName}</p>
              </div>
              <div className={styles.counter_t}>X1</div>
            </div>
          </div>
          <div className={styles.foot_prize}>
            <span onClick={this.submitExchange}>领取</span>
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

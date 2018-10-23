import React, {Component,Fragment} from 'react';
import {connect} from 'dva';
import numeral from 'numeral'
import {
  List,
  InputItem,
  ActivityIndicator,
  Picker,
  DatePicker,
  Toast
} from 'antd-mobile'
import DocumentTitle from 'react-document-title'
import router from 'umi/router'
import classnames from 'classnames'
import GoodsItem from '../../components/GoodsItem'
import Coupon from '../../components/Coupon'
import PayWay from '../../components/PayWay'
import { dateFtt } from "../../utils/dateFtt";
import styles from './style.less'
import {getSetting} from "../../utils/corpSetting";

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

//日期选择数据源
const datePicker = [
  {value:0,label:'今天'},
  {value:1,label:'明天'},
];

const getDate = (dateIndex,time)=>{
  return new Date(new Date(time).getTime() + dateIndex*24*60*60*1000 + (8 * 60 * 60 * 1000));
};

@connect(({submitOrder, global, loading}) => {
	return {
    submitOrder,
    global,
		loading: loading.effects['global/getUserInfo'] || loading.effects['global/getCorpSetting'],
    couponLoading: loading.effects['submitOrder/getCmsCouponList'],
    submitLoading: loading.effects['submitOrder/orderSubmit'],
	}
})
export default class SubmitOrder extends Component {
	state = {
    floorShow: false,
    isAppointment: false, //是否预约
    appointmentDt: '',
    dateTimeSpare1: '',
    dateIndex:0,
    showCoupon: false,
    coupon: null,
    showPayWay: false,
  };

	componentDidMount() {
    const { userInfo, selectGoods, corpSetting, appInfo, orderFlag } = this.props.global;
    if (!selectGoods || !appInfo || (orderFlag === 1 && appInfo.hasSaleArea && !appInfo.saleInfo)) {
      router.goBack();
      return
    }
    console.log(appInfo)
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
    this.props.dispatch({
      type:'submitOrder/changeState',
      payload:{
        cmsCouponList: null
      }
    })
	}

  openCoupon = async()=>{
	  const { cmsCouponList } = this.props.submitOrder;
    this.setState({showCoupon:true});
    if(cmsCouponList)return;
    this.props.dispatch({
      type:'submitOrder/getCmsCouponList'
    })
  };

  CouponSuccess = (id)=>{
    const { submitOrder:{ cmsCouponList } } = this.props;
    this.setState({
      coupon: id ? cmsCouponList.filter(item=>item.sid === id)[0] : null
    })
  };

  submit = ()=>{
    if(!this._checkInput())return;
    this.setState({ showPayWay: true });
  };

  submitExchange = ()=>{
    if(!this._checkInput())return;
    this.saveOrder(0);
  };

  saveOrder = (payValue)=>{
    const { global:{ userInfo, selectGoods, orderFlag, selectPhone, corpSetting, appInfo } } = this.props;
    const { isAppointment, dateIndex, appointmentDt, dateTimeSpare1, coupon } = this.state;
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
    const data = {
      buyList,
      addressId: addressInfo.csmAddressId,
      address: addressInfo.csmAddress,
      realFloor,
      payType: payValue, //支付宝支付
      phone: getSelectPhone(userInfo,selectPhone).csmPhone,
      contact: getSelectPhone(userInfo,selectPhone).contact,
      remark: this.remarkRef.state.value,
      orderFlag: orderFlag, //1.普通订单 2.积分兑换订单
      corpSettingFee1: corpSetting.fee1 || 0, //基础上楼费
      fromPlat: 2, //订单来源 微信 2
    };
    if(orderFlag === 1){
      data.orgSNNo = addressInfo.orgSNNo
    }
    if(isAppointment){
      data.appointmentDt = getDate(dateIndex,appointmentDt);
      data.dateTimeSpare1 = getDate(dateIndex,dateTimeSpare1);
    }
    if(coupon){
      data.cid = coupon.cid;
      data.sid = coupon.sid;
    }

    this.props.dispatch({
      type:'submitOrder/orderSubmit',
      payload:{
        data,
        fee: parseInt((this._getTotal().totalMoney - (coupon && coupon.value || 0))*100),
        payValue
      }
    })
  };

  //输入验证
  _checkInput = ()=>{
    const { global:{ userInfo, selectPhone, appInfo } } = this.props;
    const { isAppointment, dateIndex, appointmentDt, dateTimeSpare1, coupon} = this.state;
    const addressInfo = appInfo && appInfo.addressInfo || {};
    const errArr = [];
    if(!getSelectPhone(userInfo,selectPhone).contact)errArr.push('请选择联系人');
    if(!addressInfo.csmAddress)errArr.push('请选择配送地址');
    if(coupon && coupon.value  > 0 && this._getTotal().totalMoney - coupon.value <= 0)errArr.push('优惠金额大于总金额，无法使用此优惠劵');
    if(isAppointment){
      if(!appointmentDt || !dateTimeSpare1) errArr.push('请选择预约时间');
      if(getDate(dateIndex,appointmentDt).getTime() < new Date().getTime()-2*60*1000 + 8*60*60*1000)errArr.push('预约开始时间不能小于当前时间');
      if(getDate(dateIndex,appointmentDt).getTime() >= getDate(dateIndex,dateTimeSpare1).getTime())errArr.push('预约结束时间应大于预约开始时间');
    }
    if(errArr.length>0){
      Toast.info(errArr[0],2,null,false);
      return false
    }
    return true
  };

  //计算各种总价
  _getTotal = ()=>{
    const { global:{ selectGoods, orderFlag, appInfo, corpSetting } } = this.props;
    const addressInfo = appInfo && appInfo.addressInfo || {};
    let totalPrice = 0; //总价格（商品价格总和）
    let totalScore = 0; //总积分（商品积分总和）
    let totalDelivery = 0; //总配送费（商品配送费总和）
    let totalTip = 0; //总服务费（商品服务费总和）
    let totalFloorFun = 0; //总上楼费（商品上楼费总和）
    let realFloor = addressInfo.csmFloor; //真实楼层
    realFloor = realFloor > 1 ? realFloor - 1 : 0;
    selectGoods && corpSetting && selectGoods.forEach(item => {
      totalPrice += item.counter*item.basePrice;
      totalScore += item.counter*item.requiredScore;
      totalDelivery += item.counter*item.deliveryFun;
      totalTip += item.counter*(item.tip||0);
      totalFloorFun += item.counter*((item.floorFun*realFloor) + corpSetting.fee1/100)
    });
    if(realFloor === 0)totalFloorFun = 0; //1楼没有上楼费
    if(orderFlag === 2)totalPrice = 0;// 积分兑换订单，商品的价格是0
    let totalMoney = totalPrice + totalDelivery + totalTip ;
    const cfloorFun = getSetting(corpSetting).cfloorFun;
    if(cfloorFun){
      totalMoney = totalPrice + totalDelivery + totalTip + totalFloorFun;
    }
    return {
      totalPrice,
      totalScore,
      totalDelivery,
      totalTip,
      totalFloorFun,
      totalMoney
    }
  };

  //计算单个上楼费
  _getFloorDetail(item){
    const { global:{ appInfo, corpSetting } } = this.props;
    const addressInfo = appInfo && appInfo.addressInfo || {};
    if(!item || !corpSetting)return'';
    let realFloor = addressInfo.csmFloor; //真实楼层
    realFloor = realFloor > 1 ? realFloor - 1 : 0;
    const floorFun = ((item.floorFun * realFloor) + corpSetting.fee1/100) * item.counter;
    return `上楼费：¥${floorFun.toFixed(2)} (${realFloor}层 x ${item.floorFun}元/层 ${corpSetting.fee1>0 ? '+ '+ corpSetting.fee1/100 +'元' : ''}) x ${item.counter}件`
  }

	render() {
	  const { submitOrder:{ cmsCouponList }, global:{ userInfo, selectGoods, orderFlag, selectPhone, appInfo, corpSetting  }, loading, couponLoading, submitLoading } = this.props;
	  const { floorShow, isAppointment, dateIndex, appointmentDt, dateTimeSpare1, showCoupon, coupon, showPayWay } = this.state;
    const showPrice = getSetting(corpSetting).showPrice;
    const cfloorFun = getSetting(corpSetting).cfloorFun;
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
              selectGoods && selectGoods.map((item,index)=><GoodsItem className={styles.item} orderFlag={orderFlag} corpSetting={corpSetting} hasRemark={true} hasCounter={false} item={item} key={index}/>)
            }
          </div>
          <List className={styles.submitOrder}>
            {
              showPrice &&
              <Item extra={this._getTotal().totalDelivery > 0 ?'￥'+ numeral(this._getTotal().totalDelivery).format('0.00') : '免费配送'}>配送费：</Item>
            }
            {
              this._getTotal().totalFloorFun > 0 && cfloorFun &&
              <Fragment>
                <Item extra={'￥'+ numeral(this._getTotal().totalFloorFun).format('0.00')}
                      onClick={()=>this.setState({floorShow: !floorShow})}
                      className={classnames({[styles.no_border]: floorShow})}
                      arrow={floorShow?'down':'horizontal'}
                >上楼费：</Item>
                {
                  floorShow &&
                  <Item wrap>
                    {
                      selectGoods.map((item,index)=>(
                        <div className={styles.sub} key={index}>
                          <div className={styles.sub_title}>{item.aliasName || item.goodsName}</div>
                          <div className={styles.sub_detail}>{this._getFloorDetail(item)}</div>
                        </div>
                      ))
                    }
                  </Item>
                }
              </Fragment>
            }
            { this._getTotal().totalTip > 0 && <Item extra={'￥'+ numeral(this._getTotal().totalTip).format('0.00')}>服务费：</Item> }
            {
              orderFlag === 1 &&
              <Item extra={coupon ? <span className="red">-{coupon.value}</span> : '点击选择'} onClick={this.openCoupon} arrow="horizontal">请选择优惠券：</Item>
            }
            <Item className={classnames({[styles.no_border]: isAppointment})}>
              是否预约： <label onClick={()=>this.setState({isAppointment:false})}><i className={classnames('iconfont',isAppointment ? 'icon-danxuan1' : 'icon-duigou')}/> 否</label>&nbsp;&nbsp;&nbsp;
              <label onClick={()=>this.setState({isAppointment:true})}><i className={classnames('iconfont',isAppointment ? 'icon-duigou' : 'icon-danxuan1' )}/> 是</label>
            </Item>
            {
              isAppointment &&
              <div className={classnames(styles.picker_box,styles.border_bottom)}>
                <Picker data={datePicker} cols={1}
                        value={dateIndex}
                        onOk={val=>this.setState({dateIndex:val})}
                >
                  <div className={styles.picker_gary }>{datePicker[dateIndex].label}</div>
                </Picker>
                <DatePicker  mode="time"
                             value={appointmentDt}
                             onChange={time => this.setState({ appointmentDt:time })}
                >
                  <div className={classnames(styles.picker_gary,styles.date)}>{appointmentDt ? dateFtt(appointmentDt,'hh:mm',true) : '--:--'} <i className="iconfont icon-rili"/></div>
                </DatePicker>
                <div>至</div>
                <DatePicker  mode="time"
                             value={dateTimeSpare1}
                             onChange={time => this.setState({ dateTimeSpare1:time })}
                >
                  <div className={classnames(styles.picker_gary,styles.date,styles.last)}>{dateTimeSpare1 ? dateFtt(dateTimeSpare1,'hh:mm',true) : '--:--'} <i className="iconfont icon-rili"/></div>
                </DatePicker>
              </div>
            }
            <InputItem
              clear
              placeholder="请输入留言"
              maxLength={35}
              ref={el => this.remarkRef = el}
            >买家留言：</InputItem>
          </List>
          {  //普通订单
            orderFlag === 1 &&
            <div className={styles.foot}>
              {
                showPrice ?
                  <span>合计：
                    {
                      coupon && coupon.value  > 0 && this._getTotal().totalMoney - coupon.value <= 0 ?
                        <label className="red">无法使用此券</label>
                        :
                        <label className="red">￥{numeral(this._getTotal().totalMoney - (coupon ? coupon.value : 0)).format('0.00')}</label>
                    }
                    {
                      coupon && coupon.value > 0 &&
                      <label className={styles.foot_coupon}>已优惠{coupon.value}元</label>
                    }
              </span>
                  : <span/>
              }
              <span onClick={this.submit}>去结算</span>
            </div>
          }
          { //积分订单
            orderFlag === 2 &&
            <div className={styles.foot}>
              <span>
                合计：<label className="orange">{this._getTotal().totalScore}积分</label>
                {
                  showPrice && <label className="orange">￥{numeral(this._getTotal().totalMoney).format('0.00')}</label>
                }
              </span>
              {
                this._getTotal().totalMoney > 0 ?
                <span onClick={this.submit}>去结算</span> :
                  <span onClick={this.submitExchange}>提交订单</span>
              }
            </div>
          }
          <Coupon visible={showCoupon}
                  data={cmsCouponList}
                  totalMoney={this._getTotal().totalMoney}
                  selectId={coupon && coupon.sid}
                  onSuccess={this.CouponSuccess}
                  loading={couponLoading}
                  onVisibleChange={v => this.setState({showCoupon:v})}
          />
          <PayWay visible={showPayWay}
                  corpSetting={corpSetting}
                  onSuccess={this.saveOrder}
                  onVisibleChange={v => this.setState({showPayWay:v})}
          />
        </Fragment>
      </DocumentTitle>
		);
	}
}

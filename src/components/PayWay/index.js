import React, {Component} from 'react';
import {
  List,
  Toast
} from 'antd-mobile';
import classnames from 'classnames'
import Popup from '../Popup'
import {getSetting} from "../../utils/corpSetting";
import styles from './style.less'

export default class PayWay extends Component {
  state = {
    payValue: null
  };

  selectOne=(payValue)=>{
    if(this.state.payValue === payValue){
      this.setState({payValue: null})
    }else{
      this.setState({payValue})
    }
  };
  success=()=>{
    const { onSuccess } = this.props;
    const { payValue } = this.state;
    if(!payValue){
      Toast.info('请选择付款方式',2,null,false);
      return
    }
    onSuccess(payValue);
  };
  cancel=()=>{
    this.setState({
      selectId: this.props.selectId
    })
  };

  render() {
    const { onVisibleChange, corpSetting, ...otherProps } = this.props;
    const showPrice = getSetting(corpSetting).showPrice;
    const { payValue } = this.state;
    let data = [
      { payValue: 2, desc: '微信支付'},
      { payValue: 1, desc: '货到付款'}
    ];
    if(corpSetting && (corpSetting.corpCode === '34019' || corpSetting.corpCode === '37018')){
      data = [  // 国祯优先显示货到付款
        { payValue: 1, desc: '货到付款' },
        { payValue: 2, desc: '微信支付' }
      ];
    }
    if(!showPrice){ // 不显示价格的情况,支付方式只有现金
      data = [
        { payValue: 1, desc: '货到付款' }
      ];
    }else{
      const payMethod_wechat = (corpSetting.sp1 >> 7 & 0x01);
      const payMethod_money = (corpSetting.sp1 >> 8 & 0x01);
      // 微信支付和现金支付都选了  或者 都没选，则支付方式为两种都支持
      if((payMethod_wechat === 0 && payMethod_money === 0) || (payMethod_wechat === 1 && payMethod_money === 1)) {

      } else { // 只选一种的情况
        if(payMethod_wechat === 1) { // 仅微信支付
          data = [
            { payValue: 2, desc: '微信支付' }
          ];
        }
        if(payMethod_money === 1) { // 仅现金支付
          data = [
            { payValue: 1, desc: '货到付款' }
          ];
        }
      }
    }
    return (
      <Popup title='请选择付款方式'
             {...otherProps}
             onSuccess={this.success}
             onVisibleChange={onVisibleChange}
             onCancel={this.cancel}
      >
        <List className={styles.popup}>
          {
           data.map((item,index)=>(
              <List.Item key={index}
                         onClick={()=>this.selectOne(item.payValue)}
                         thumb={<i className={classnames('iconfont',item.payValue === 2 ? 'icon-weixinzhifu' : 'icon-cash_payment')}/>}
                         extra={<i className={classnames('iconfont',payValue === item.payValue ? 'icon-duigou' : 'icon-danxuan1')}/>}
              >
                {item.desc}
              </List.Item>
            ))
          }
        </List>
      </Popup>
    );
  }
}

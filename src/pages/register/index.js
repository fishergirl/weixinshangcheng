import React, {Component} from 'react';
import {connect} from 'dva';
import {
  List,
  InputItem,
  WingBlank,
  Button,
  Toast
} from 'antd-mobile';
import DocumentTitle from 'react-document-title';
import classnames from 'classnames'
import { reg_phone } from '../../utils/config'
import styles from './style.less'

@connect(({ register, loading }) => {
  return {
    register,
    loading: loading.effects['register/signUp'] || false,
  }
})
export default class Analysis extends Component {
	state = {
	  btnTxt: '验证'
  };

	componentDidMount() {

	}

	componentWillUnmount() {

	}

  getCode = ()=> {
    if(!this.phoneNumRef.state.value){
      Toast.info('请输入手机号',2,null,false);
      return
    }
    if(!reg_phone.test(this.phoneNumRef.state.value)){
      Toast.info('手机号格式有误',2,null,false);
      return
    }
    if (this.state.btnTxt !== '验证') return;
    let num = 60;
    this.setState({ btnTxt: num });
    // eslint-disable-next-line
    this.state.btnTxt = num;
    const timer = setInterval(()=>{
      num--;
      if(num <= 0){
        clearInterval(timer);
        this.setState({ btnTxt: '验证' });
      }else{
        this.setState({ btnTxt: num });
      }
    },1000);
    this.props.dispatch({
      type:'register/getCode',
      payload:{
        phoneNum: this.phoneNumRef.state.value
      }
    })
  };

  save = ()=>{
    if(!this.nameRef.state.value){
      Toast.info('请输入姓名/客户名称',2,null,false);
      return
    }
    if(!this.phoneNumRef.state.value){
      Toast.info('请输入手机号',2,null,false);
      return
    }
    if(!reg_phone.test(this.phoneNumRef.state.value)){
      Toast.info('手机号格式有误',2,null,false);
      return
    }
    if(!this.codeRef.state.value){
      Toast.info('请输入验证码',2,null,false);
      return
    }
    this.props.dispatch({
      type:'register/signUp',
      payload:{
        name:this.nameRef.state.value,
        phone:this.phoneNumRef.state.value,
        code:this.codeRef.state.value
      }
    });
  };

	render() {
	  const { loading } = this.props;
	  const { btnTxt } = this.state;
		return (
      <DocumentTitle title="注册">
        <div className={styles.page}>
          <List className={styles.list}>
            <InputItem
              ref={el=>this.nameRef = el}
              placeholder="请输入姓名/客户名称"
            >
              <i className="iconfont icon-wo1"/>
            </InputItem>
            <InputItem
              ref={el=>this.phoneNumRef = el}
              placeholder="请输入手机号"
              extra={
                <span className={classnames(styles.yan,{[styles.disable]:btnTxt !== '验证'})} onClick={this.getCode}>{btnTxt}</span>
              }
              type="number"
            >
              <i className="iconfont icon-phone"/>
            </InputItem>
            <InputItem
              ref={el=>this.codeRef = el}
              placeholder="验证码"
              type="number"
            >
              <i className="iconfont icon-msnui-auth-code"/>
            </InputItem>
          </List>
          <WingBlank>
            <Button type="primary" onClick={this.save} className={styles.add_btn} loading={loading}>注册</Button>
          </WingBlank>
        </div>
      </DocumentTitle>
		);
	}
}

import React, {Component} from 'react';
import {connect} from 'dva';
import DocumentTitle from 'react-document-title'
import router from 'umi/router'
import {
  List,
  InputItem,
  Button,
  WingBlank,
  Toast
} from 'antd-mobile';
import { reg_phone, reg_TelPhone } from '../../utils/config'
import styles from './style.less'


@connect(({contact, loading}) => {
	return {
    contact,
		loading: loading.effects['contact/save'] || false,
	}
})
export default class Analysis extends Component {
	state = {};

  UNSAFE_componentWillMount(){
    const { editOne } = this.props.contact;
    if(!editOne){
      router.goBack()
    }
  }

  save = () => {
    const { loading } = this.props;
    if(loading)return;
	  if(!this.nameRef.state.value){
      Toast.info('请输入联系人姓名',2,null,false)
    }else if(!this.phoneRef.state.value){
      Toast.info('请输入联系人电话',2,null,false)
    }else if(!reg_phone.test(this.phoneRef.state.value) && !reg_TelPhone.test(this.phoneRef.state.value)){
      Toast.info('联系人电话格式不正确',2,null,false)
    }else{
      this.props.dispatch({
        type:'contact/save',
        payload:{
          contact:this.nameRef.state.value,
          csmPhone :this.phoneRef.state.value
        }
      })
    }
  };

	render() {
    const { contact:{editOne}, loading  } = this.props;
		return (
      <DocumentTitle title="联系电话">
        <div className={styles.addPage}>
          <List className={styles.addList}>
            <InputItem
              clear
              placeholder="请输入联系人姓名"
              maxLength={20}
              defaultValue={editOne && editOne.contact}
              ref={el => this.nameRef = el}
            >联系人：</InputItem>
            <InputItem
              clear
              placeholder="请输入联系人电话"
              defaultValue={editOne && editOne.csmPhone}
              ref={el => this.phoneRef = el}
            >联系人电话：</InputItem>
          </List>
          <WingBlank>
            <Button type="primary" onClick={this.save} className={styles.add_btn} loading={loading}>保存</Button>
          </WingBlank>
        </div>
      </DocumentTitle>
		);
	}
}

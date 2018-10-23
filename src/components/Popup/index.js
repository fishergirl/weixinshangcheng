import React, {Component} from 'react';
import {
  List,
  Icon,
  WingBlank,
  Button
} from 'antd-mobile';
import { Spin  } from 'antd'
import classnames from 'classnames'
import styles from './style.less'
const Item = List.Item;
export default class Popup extends Component {

  UNSAFE_componentWillReceiveProps(newProps){
    if(newProps.visible !== this.props.visible){
      document.getElementsByTagName('body')[0].style.overflowY = newProps.visible ? 'hidden' : 'scroll';
      document.getElementById('root').style.overflowY = newProps.visible ? 'hidden' : 'scroll'
    }
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].style.overflowY =  'scroll';
    document.getElementById('root').style.overflowY =  'scroll';
  }

  success =()=>{
    const { onSuccess } = this.props;
    onSuccess();
  };
  cancel = ()=>{
    const { onCancel, onVisibleChange } = this.props;
    onCancel();
    onVisibleChange(false)
  };
	render() {
	  const { visible=true, title='', btnText='确定', loading, children } = this.props;
		return (
			<div>
        <div className={styles.bg} onClick={this.cancel} style={{display:visible?'block':'none'}}/>
        <div className={classnames(styles.body,{[styles.show]:visible})}>
          <Item className={styles.title}>
            {title}
            <Icon className={styles.close} color="#999" onClick={this.cancel} size="md" type='cross'/>
          </Item>
          <Spin spinning={loading || false}>
            <div className={styles.main}>
              {children}
            </div>
          </Spin>
          <div className={styles.foot}>
            <WingBlank>
              <Button type="primary" onClick={this.success} className={styles.add_btn} >{btnText}</Button>
            </WingBlank>
          </div>
        </div>
			</div>
		);
	}
}

import React, {Component} from 'react';
import {connect} from 'dva';
import {
  Button,
  WingBlank
} from 'antd-mobile'
import classnames from 'classnames'
import DocumentTitle from 'react-document-title';
import styles from './style.less'

@connect(({me, loading}) => {
  return {
    me,
    loading: loading.effects['chart/fetch'],
  }
})
export default class MyRedPack extends Component {
	state = {};

	componentDidMount() {

	}

	componentWillUnmount() {

	}

	render() {
		return (
			<DocumentTitle title="我的红包">
        <div className={styles.myRedPack}>
          <p><span>0.00</span>元</p>
          <p>金额满1元可提现</p>
          <p>红包记录</p>
          <img src={require('../../assets/red_pack_bg.png')} alt=""/>
          <WingBlank>
            <Button className={classnames(styles.btn,{[styles.disable]:true})}>提现</Button>
          </WingBlank>
          <p>常见问题</p>
        </div>
			</DocumentTitle>
		);
	}
}

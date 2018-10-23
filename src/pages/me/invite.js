import React, {Component} from 'react';
import {connect} from 'dva';
import {
  ActivityIndicator
} from 'antd-mobile';
import DocumentTitle from 'react-document-title';
import styles from './style.less'

@connect(({me, loading}) => {
	return {
    me,
		loading: loading.effects['me/getQrcode'],
	}
})
export default class Analysis extends Component {
	state = {
    showMask: false
  };

	componentDidMount() {
    this.props.dispatch({
      type:'me/getQrcode'
    })
	}

	componentWillUnmount() {

	}

  showMask = ()=>{
	  this.setState({
      showMask: true
    })
  };
	render() {
	  const { me:{ qrcodeData }, loading } = this.props;
	  const { showMask } = this.state;
		return (
      <DocumentTitle title="邀请好友">
        <div className={styles.invite}>
          <ActivityIndicator toast text="加载中..." animating={ loading || false }/>
          <img className={styles.bg} src={require("../../assets/invite.png")} alt=""/>
          <img className={styles.qr} src={qrcodeData && qrcodeData.qrcodeUrl ? 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=' + qrcodeData.qrcodeUrl : ''} alt=""/>
          <div className={styles.text}>
            <p>我的邀请码</p>
            <p className={styles.blue}>好友用你的邀请二维码注册，会有红包奖励哟~</p>
            <p className={styles.red}>分享到</p>
            <ul>
              <li onClick={this.showMask}>
                <i className="iconfont icon-wxtb"/>
                <span>微信好友</span>
              </li>
              <li onClick={this.showMask}>
                <i className="iconfont icon-pengyouquan"/>
                <span>朋友圈</span>
              </li>
            </ul>
          </div>
          {
            showMask &&
            <div className={styles.mask} onClick={()=>this.setState({showMask: false})}>
              <img className={styles.arrow} src={require("../../assets/b.png")} alt=""/>
              <img className={styles.ctx} src={require("../../assets/z.png")} alt=""/>
            </div>
          }
        </div>
      </DocumentTitle>
		);
	}
}

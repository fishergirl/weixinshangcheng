import React, {Component,Fragment} from 'react';
import {connect} from 'dva';
import router from 'umi/router';
import {
  List,
  ActivityIndicator
} from 'antd-mobile';
import DocumentTitle from 'react-document-title';
import styles from './style.less'

const Item = List.Item;
@connect(({me, global, loading}) => {
	return {
    me,
    global,
		loading: loading.effects['global/getUserInfo'] || loading.effects['me/getWeChatUserInfo'],
	}
})
export default class Me extends Component {
	state = {};

	componentDidMount() {
    const { userInfo } = this.props.global;
    if(!userInfo){
      this.props.dispatch({
        type:'global/getUserInfo'
      })
    }
    this.props.dispatch({
      type:'me/getWeChatUserInfo'
    })
  }

	componentWillUnmount() {

	}

	render() {
	  const { global:{ userInfo }, me:{ wechatUserInfo }, loading } = this.props;
		return (
      <DocumentTitle title="个人中心">
        <Fragment>
          <ActivityIndicator toast text="加载中..." animating={loading || false}/>
          <div className={styles.info}>
            <div className={styles.avatar}>
              <img src={ wechatUserInfo ? wechatUserInfo.headImg : '' } alt=""/>
            </div>
            <div className={styles.name}>{userInfo && userInfo.csmName}</div>
            <div className={styles.score}>
              <i className="iconfont icon-jifen"/>
              <span>积分({userInfo && userInfo.score > 0 ? userInfo.score : 0})</span>
            </div>
          </div>
          <List className={styles.list}>
            <Item extra="查看全部订单" arrow="horizontal" onClick={()=>router.push('/orderList')}>我的订单</Item>
            <Item arrow="horizontal" onClick={()=>router.push('/address')}>我的地址</Item>
            <Item arrow="horizontal" onClick={()=>router.push('/contact')}>我的电话</Item>
            <Item arrow="horizontal" onClick={()=>router.push('/me/cmsCoupon')}>优惠卷</Item>
            {/*<Item arrow="horizontal" onClick={()=>router.push('/me/invite')}>邀请好友</Item>*/}
            {/*<Item arrow="horizontal" onClick={()=>router.push('/me/myRedPack')}>我的红包</Item>*/}
          </List>
        </Fragment>
      </DocumentTitle>
		);
	}
}

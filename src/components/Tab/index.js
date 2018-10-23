import React, {Component} from 'react';
import router from 'umi/router';
import {
  TabBar
} from 'antd-mobile';
import styles from './index.less'
export default class Analysis extends Component {

	render() {
	  const { pathname } = this.props;
		return (
      <div className={styles.tabBar}>
        <TabBar tintColor="#48b4c8">
          <TabBar.Item
            title='首页'
            key="首页"
            icon={<i className="iconfont icon-shouye"/>}
            selectedIcon={<i className="iconfont icon-shouye blue"/>}
            selected={pathname === '/main'}
            onPress={()=>pathname !== '/main' && router.push('/main')}
          />
          <TabBar.Item
            title='购物车'
            key="购物车"
            icon={<i className="iconfont icon-gouwuche"/>}
            selectedIcon={<i className="iconfont icon-gouwuche blue"/>}
            selected={pathname === '/shop'}
            onPress={()=>pathname !== '/shop' && router.push('/shop')}
          />
          <TabBar.Item
            title='我的'
            key="我的"
            icon={<i className="iconfont icon-wo1"/>}
            selectedIcon={<i className="iconfont icon-wo1 blue"/>}
            selected={pathname === '/me'}
            onPress={()=>pathname !== '/me' && router.push('/me')}
          />
        </TabBar>
      </div>
		);
	}
}

import React, {Component,Fragment} from 'react';
import classnames from 'classnames'
import router from 'umi/router'
import DocumentTitle from 'react-document-title';
import styles from './style.less'

export default class Layout extends Component {
  state = {
    tab:0,
  };

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  tabChange = (tab)=>{
    const { pathname } = this.props.location;
    if(pathname.indexOf('v2') === -1){
      router.replace(tab === 0 ? '/exchange/goods' : '/exchange/records')
    }else{
      router.replace(tab === 0 ? '/exchange/v2/goods' : '/exchange/v2/records')
    }
    this.setState({tab});
  };

  render() {
    const { tab } = this.state;
    const { location } = this.props;
    if(location.pathname === '/exchange/goodsDetail' || location.pathname === '/exchange/v2/goodsDetail')return this.props.children;
    return (
      <DocumentTitle title="积分商城">
        <Fragment>
          <div className={styles.tabs_wrap}>
            <div className={styles.tabs}>
              <div className={classnames(styles.tab_item,{[styles.active]:tab === 0})} onClick={()=>this.tabChange(0)}>积分兑换</div>
              <div className={classnames(styles.tab_item,{[styles.active]:tab === 1})} onClick={()=>this.tabChange(1)}>积分记录</div>
            </div>
            <div className={classnames(styles.line)} style={{left:  tab*50 + '%'}}/>
          </div>
          <div>
            {this.props.children}
          </div>
        </Fragment>
      </DocumentTitle>
    );
  }
}

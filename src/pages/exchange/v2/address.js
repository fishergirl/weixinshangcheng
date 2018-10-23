import React, {Component} from 'react';
import {connect} from 'dva';
import {
  List,
  Tag,
  WingBlank,
  Button,
  ActivityIndicator,
  Toast
} from 'antd-mobile'
import classnames from 'classnames'
import router from 'umi/router'
import styles from '../style.less'

const Item = List.Item;

//将默认地址项置顶
function changeUserInfo(userInfo) {
  if(userInfo && userInfo.addressItems.length>0){
    const arr = JSON.parse(JSON.stringify(userInfo.addressItems));
    const index = arr.findIndex(item=>item.isMain === 1);
    return arr.splice(index,1).concat(arr);
  }
  return []
}
@connect(({exchange, global, loading}) => {
  return {
    exchange,
    global,
    loading: loading.effects['global/getUserInfo'] || false,
    submitLoading: loading.effects['exchange/setDefaultAddress'] || false,
  }
})
export default class Address extends Component {
	state = {
    selectIndex : 0
  };

	componentDidMount() {
    this.props.dispatch({
      type:'global/getUserInfo'
    })
	}

	componentWillUnmount() {

	}

  selectOne = (item,index)=>{
    if(!item.orgId) {
      Toast.info('该地址未审核，请联系管理员',2,null,false);
      return;
    }
    this.setState({selectIndex: index})
  };

  selectAddress = async()=>{
    const { global: { userInfo }, dispatch } = this.props;
    const item = changeUserInfo(userInfo)[this.state.selectIndex];
    if(!item.orgId) {
      Toast.info('该地址未审核，请联系管理员',2,null,false);
      return;
    }
    if(item.isMain !== 1){
      await dispatch({
        type:'exchange/setDefaultAddress',
        payload:{
          csmAddressId:item.csmAddressId
        }
      })
    }
    dispatch({
      type:'exchange/changeState',
      payload:{
        hasSelectAddress: true
      }
    });
    router.push('/exchange/v2/goods')
  };

	render() {
    const { global: { userInfo }, loading, submitLoading } = this.props;
    const { selectIndex } = this.state;
		return (
      <div className={styles.address}>
        <ActivityIndicator toast text="加载中..." animating={loading} />
        <ActivityIndicator toast text="处理中..." animating={submitLoading} />
        <List className={styles.list} renderHeader={() => '请选择您的地址'}>
          {
            changeUserInfo(userInfo).map((item,index)=>(
              <Item key={index}
                    onClick={()=>this.selectOne(item,index)}
                    thumb={<i className={classnames('iconfont',index === selectIndex ? 'icon-duigou' : 'icon-danxuan1')}/>}
                    extra={item.isMain === 1 ? <Tag small selected>默认</Tag> : ''}
              >
                <div>
                  <p>{item.csmAddress}</p>
                  {
                    !item.orgId &&
                    <p className={styles.address_tip}>该地址未审核，请联系管理员</p>
                  }
                </div>
              </Item>
            ))
          }
        </List>
        <div className={styles.add_btn}>
          <WingBlank>
            <Button type="primary" onClick={this.selectAddress}>确定</Button>
          </WingBlank>
        </div>
      </div>
		);
	}
}

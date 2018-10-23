import React, {Component} from 'react';
import {connect} from 'dva';
import DocumentTitle from 'react-document-title'
import {
  List,
  ActivityIndicator,
  Modal,
  Toast
} from 'antd-mobile';
import classnames from 'classnames'
import router from 'umi/router'
import styles from './style.less'

//将默认地址项置顶
function changeUserInfo(userInfo) {
  if(userInfo && userInfo.addressItems.length>0){
    const arr = JSON.parse(JSON.stringify(userInfo.addressItems));
    const index = arr.findIndex(item=>item.isMain === 1);
    return arr.splice(index,1).concat(arr);
  }
  return []
}
const Item = List.Item;

@connect(({address, global, loading}) => {
	return {
    address,
    global,
		loading: loading.effects['global/getUserInfo'] || loading.effects['address/setDefaultAddress'] || loading.effects['address/del'],
	}
})
export default class Address extends Component {
	state = {};

	componentDidMount() {
    if(this.props.location.query.from !== 'submitOrder'){
     this.props.dispatch({
       type:'global/changeState',
       payload:{
         appInfo:null
       }
     })
    }
    const { userInfo } = this.props.global;
	  if(!userInfo){
      this.props.dispatch({
        type:'global/getUserInfo',
      });
    }
	}

	componentWillUnmount() {

	}

  edit = (item)=>{
    this.props.dispatch({
      type:'address/changeState',
      payload:{
        editOne: item || {}
      }
    });
    router.push('/address/add')
  };

  del = (item)=>{
    const { dispatch } = this.props;
    Modal.alert('提示', '确定删除此配送地址吗？',[
      {text:'取消'},
      {
        text:'确定',
        onPress(){
          dispatch({
            type:'address/del',
            payload:{
              csmAddressId:item.csmAddressId
            }
          })
        }
      }
    ])
  };

  selectOne = (item)=>{
    if(this.props.location.query.from !== 'submitOrder')return;
    const { appInfo } = this.props.global;
    if((!item.saleOrgId || !item.saleDesc || !item.saleOrgSNNo) && item.saleOrgId !== -1){
      Toast.info('该地址不在服务区，请重新选择',2,null,false);
      return
    }

    const orgId =  appInfo.storeInfo && appInfo.storeInfo.orgId || appInfo.saleInfo.orgId;
    const itemOrgId = item.orgId || item.saleOrgId;
    if(orgId !== itemOrgId){
      const dispatch = this.props.dispatch;
      Modal.alert('提示', '修改地址,需重新选择商品下单',[
        {text:'取消'},
        {
          text:'确定',
          onPress(){
            dispatch({
              type: 'global/changeState',
              payload: {
                appInfo: {
                  ...appInfo,
                  saleInfo:{   //销售区域信息
                    orgId: item.saleOrgId,
                    orgSNNo: item.saleOrgSNNo,
                    saleDesc: item.saleDesc
                  },
                  storeInfo: item.orgId ? {  //门店信息
                    orgId: item.orgId,
                    orgSNNo: item.orgSNNo,
                    orgName: item.orgName
                  }: null,
                  addressInfo: item //默认地址信息
                }
              }
            });

            if(item.isMain !== 1){
              dispatch({
                type:'address/setDefaultAddress',
                payload:{csmAddressId :item.csmAddressId}
              });
            }

            router.go(-2);
          }
        }
      ])
    }else{
      this.props.dispatch({
        type: 'global/changeState',
        payload: {
          appInfo: {
            ...appInfo,
            addressInfo: item //默认地址信息
          }
        }
      });

      if(item.isMain !== 1){
        this.props.dispatch({
          type:'address/setDefaultAddress',
          payload:{csmAddressId :item.csmAddressId}
        });
      }

      router.goBack();
    }


  };

	render() {
    const { global:{ userInfo, orderFlag }, dispatch, loading, location:{ query } } = this.props;
    const addressItems = changeUserInfo(userInfo);
		return (
			<DocumentTitle title='配送地址'>
        <div className={styles.address}>
          <ActivityIndicator toast text="处理中..." animating={loading || false} />
          {
            addressItems.map((item,index)=>(
              <List className={styles.list} key={index}>
                <Item extra={item.csmPhone} onClick={()=>this.selectOne(item)} >
                  {item.csmAddress + '(' + item.csmFloor + '楼)'}
                </Item>
                <Item className={styles.phone_edit}
                      extra={
                        <div className={styles.phone_action}>
                          <span onClick={()=>this.edit(item)}><i className='iconfont icon-edit'/> 编辑</span>
                          <span onClick={()=>this.del(item)}><i className='iconfont icon-del'/> 删除</span>
                        </div>
                      }
                >
                  {
                    (item.saleOrgId === -1 || query.from !== 'submitOrder' || orderFlag === 2) &&
                    (
                      item.isMain === 1
                        ? <span className={styles.phone_active}><i className='iconfont icon-duigou'/> 默认地址</span>
                        : <span className={styles.phone_default} onClick={()=>dispatch({type:'address/setDefaultAddress',payload:{csmAddressId :item.csmAddressId}})}><i className='iconfont icon-yuan'/> 设为默认</span>
                    )
                  }
                  {
                    (!item.saleOrgId || !item.saleDesc || !item.saleOrgSNNo) && item.saleOrgId !== -1 && query.from === 'submitOrder' && orderFlag === 1 &&
                      <span className={classnames("red",styles.tip)}>本地址不在服务范围</span>
                  }
                  {
                    !!item.saleOrgId && !! item.saleDesc && !! item.saleOrgSNNo && item.saleOrgId !== -1 && query.from === 'submitOrder' && orderFlag === 1 &&
                      <span className={classnames("gray",styles.tip)}>所在销售区域：{item.saleDesc}</span>
                  }
                </Item>
              </List>
            ))
          }
          <p className={styles.add} onClick={()=>this.edit()}>
            <i className='iconfont icon-jia'/> 添加新的配送地址
          </p>
        </div>
			</DocumentTitle>
		);
	}
}

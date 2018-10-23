import React, {Component} from 'react';
import {connect} from 'dva';
import DocumentTitle from 'react-document-title'
import {
  List,
  ActivityIndicator,
  Modal
} from 'antd-mobile';
import router from 'umi/router'
import styles from './style.less'

//将默认电话项置顶
function changeUserInfo(userInfo) {
  if(userInfo && userInfo.phoneItems.length>0){
    const arr = JSON.parse(JSON.stringify(userInfo.phoneItems))
    const index = arr.findIndex(item=>item.isMain === 1);
    return arr.splice(index,1).concat(arr);
  }
  return []
}
const Item = List.Item;
@connect(({contact, global, loading}) => {
	return {
    global,
    contact,
		loading: loading.effects['global/getUserInfo'] || loading.effects['contact/setDefaultPhone'] || loading.effects['contact/del'],
	}
})
export default class Contact extends Component {
	state = {};

	componentDidMount() {
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
      type:'contact/changeState',
      payload:{
        editOne: item || {}
      }
    });
    router.push('/contact/add')
  };

  del = (item)=>{
    const { dispatch } = this.props;
    Modal.alert('提示', '确定删除此联系电话吗？',[
      {text:'取消'},
      {
        text:'确定',
        onPress(){
          dispatch({
            type:'contact/del',
            payload:{
              csmPhoneId :item.csmPhoneId
            }
          })
        }
      }
    ])
  };

  selectOne = (item)=>{
    if(this.props.location.query.from !== 'submitOrder')return;
    this.props.dispatch({
      type: 'global/changeState',
      payload: {
        selectPhone: item
      }
    });
    router.goBack()
  };

	render() {
	  const { global:{ userInfo }, dispatch, loading } = this.props;
	  const phoneItems = changeUserInfo(userInfo);
		return (
      <DocumentTitle title="联系电话">
        <div className={styles.contact}>
          <ActivityIndicator toast text="加载中..." animating={loading || false}/>
          {
            phoneItems.map((item,index)=>(
              <List className={styles.list} key={index}>
                <Item extra={item.csmPhone} onClick={()=>this.selectOne(item)}>{item.contact}</Item>
                <Item className={styles.phone_edit}
                      extra={
                        <div className={styles.phone_action}>
                          <span onClick={()=>this.edit(item)}><i className='iconfont icon-edit'/> 编辑</span>
                          <span onClick={()=>this.del(item)}><i className='iconfont icon-del'/> 删除</span>
                        </div>
                      }
                >
                  {
                    item.isMain === 1
                      ? <span className={styles.phone_active}><i className='iconfont icon-duigou'/> 默认电话</span>
                      : <span className={styles.phone_default} onClick={()=>dispatch({type:'contact/setDefaultPhone',payload:{csmPhoneId :item.csmPhoneId}})}><i className='iconfont icon-yuan'/> 设为默认</span>
                  }
                </Item>
              </List>
            ))
          }
          <p className={styles.add} onClick={()=>this.edit()}>
            <i className='iconfont icon-jia'/> 添加新的联系方式
          </p>
        </div>
      </DocumentTitle>
		);
	}
}

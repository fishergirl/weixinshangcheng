import React, {Component} from 'react';
import {
  List
} from 'antd-mobile';
import classnames from 'classnames'
import Popup from '../Popup'
import styles from './style.less'

export default class Analysis extends Component {
	state = {
	  selectId: null
  };

  UNSAFE_componentWillReceiveProps(newProps) {
	  if(this.props.selectId !== newProps.selectId && newProps.selectId !== this.state.selectId){
      this.setState({
        selectId: newProps.selectId
      })
    }
  }

  selectOne=(item)=>{
    const { totalMoney } = this.props;
    if(item.limit > totalMoney) return;
    if(this.state.selectId === item.sid){
      this.setState({selectId: null})
    }else{
      this.setState({selectId: item.sid})
    }
  };
  success=()=>{
    const { selectId } = this.state;
    const { onSuccess, onVisibleChange } = this.props;
    onSuccess(selectId);
    onVisibleChange(false)
  };
  cancel=()=>{
    this.setState({
      selectId: this.props.selectId
    })
  };
	render() {
	  const { data=[], onVisibleChange, totalMoney, ...otherProps } = this.props;
	  const { selectId } = this.state;
		return (
      <Popup title='请选择优惠卷'
             {...otherProps}
             onSuccess={this.success}
             onCancel={this.cancel}
             onVisibleChange={onVisibleChange}
      >
        <List className={styles.popup}>
          {
            data && data.map((item,index)=>(
              <List.Item key={index}
                         className={classnames({[styles.gray]:item.limit > totalMoney})}
                         onClick={()=>this.selectOne(item)}
                         thumb={<i className={classnames('iconfont icon-youhuiquan')}/>}
                         extra={<i className={classnames('iconfont',selectId === item.sid ? 'icon-duigou' : 'icon-danxuan1')}/>}
              >
                满{item.limit}元减{item.value}元
              </List.Item>
            ))
          }
          {/*{data && data.length > 10 && <div className={styles.loadMore}>点击加载更多</div>}*/}
        </List>
        {
          data && data.length === 0 &&
          <div className={styles.tip}>
            没有符合此订单使用的优惠卷
          </div>
        }
      </Popup>
		);
	}
}

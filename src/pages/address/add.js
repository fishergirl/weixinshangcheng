import React, {Component} from 'react';
import {connect} from 'dva';
import DocumentTitle from 'react-document-title'
import classnames from 'classnames'
import router from 'umi/router'
import {
  List,
  TextareaItem,
  InputItem,
  Button,
  WingBlank,
  Toast,
  Picker,
  ActivityIndicator
} from 'antd-mobile';
import cityData from '../../utils/cityData'
import { getSetting } from '../../utils/corpSetting'
import styles from './style.less'

@connect(({address, global, loading}) => {
	return {
    address,
    global,
    subLoading: loading.effects['address/save'] || false,
    loading: loading.effects['global/getCorpSetting'] || false
	}
})
export default class Add extends Component {
	state = {
    pickerValue: null
  };

	componentDidMount() {
    const { editOne } = this.props.address;
    const { corpSetting } = this.props.global;
    if(!editOne){
      router.goBack();
    }
    if(!corpSetting){
      this.props.dispatch({
        type:'global/getCorpSetting'
      })
    }
    this.setState({
      pickerValue: this.changeAddress(editOne).pickerValue
    })
	}

	componentWillUnmount() {
	}

  save = () => {
    const { corpSetting } = this.props.global;
    const { subLoading } = this.props;
    if(subLoading)return;
    const limit = getSetting(corpSetting).maxFloor;
    if(!this.state.pickerValue){
      Toast.info('请选择省市区',2,null,false)
    }else if(!this.detailAddressRef.state.value){
      Toast.info('请输入详细地址',2,null,false)
    }else if(!this.csmFloorRef.state.value){
      Toast.info('请输入楼层',2,null,false)
    }else if(this.csmFloorRef.state.value < 1 || this.csmFloorRef.state.value > limit){
      Toast.info('楼层应在1-' + limit + '之间')
    }else{
      this.props.dispatch({
        type:'address/save',
        payload:{
          csmAddress : this.state.pickerValue.join(' ') +' '+ this.detailAddressRef.state.value,
          csmFloor: this.csmFloorRef.state.value
        }
      })
    }
  };
	changeAddress = (editOne)=>{
    let pickerValue = null;
    let detailAddress = '';
    if(editOne && Object.keys(editOne).length > 0){
      const csmAddress = editOne.csmAddress;
      const arr = csmAddress.split(' ').splice(0,3);
      detailAddress = csmAddress.split(' ')[3];
      if(!detailAddress) detailAddress = csmAddress;
      if(arr.length === 3){
        pickerValue = arr;
      }
    }
    return {
      pickerValue,
      detailAddress
    }
  };

	render() {
	  const { address:{editOne}, loading, subLoading } = this.props;
	  const { pickerValue } = this.state;
		return (
      <DocumentTitle title="配送地址">
        <div className={styles.addPage}>
          <ActivityIndicator toast text="加载中..." animating={loading} />
          <List renderFooter={()=>'提醒：为确保您的商品顺利送达，请填写真实楼层'}>
            <div className={classnames(styles.picker_list,{[styles.active]:this.changeAddress(editOne).pickerValue})}>
              <Picker
                title="请选择省市区"
                extra='请选择省市区'
                data={cityData}
                value={pickerValue}
                onChange={v => this.setState({ pickerValue: v })}
                onOk={v => this.setState({ pickerValue: v })}
              >
                <List.Item arrow="horizontal"  />
              </Picker>
            </div>
            <TextareaItem
              title="详细地址"
              placeholder="请输入详细地址"
              count={35}
              autoHeight
              rows={3}
              defaultValue={this.changeAddress(editOne).detailAddress}
              ref={el => this.detailAddressRef = el}
            />
            <InputItem
              type="number"
              placeholder="请输入楼层"
              clear
              defaultValue={editOne && editOne.csmFloor}
              ref={el => this.csmFloorRef = el}
            >楼层</InputItem>
          </List>
          <WingBlank>
            <Button type="primary" onClick={this.save} className={styles.add_btn} loading={subLoading}>保存</Button>
          </WingBlank>
        </div>
      </DocumentTitle>
		);
	}
}

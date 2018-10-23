import React, {Component,Fragment} from 'react';
import {connect} from 'dva';
import {
  List,
  ActivityIndicator
} from 'antd-mobile';
import router from 'umi/router';
import DocumentTitle from 'react-document-title';
import { getAppid } from '../../utils/config'


const Item = List.Item;
@connect(({city, loading}) => {
	return {
    city,
		loading: loading.effects['city/branchList'] || false,
	}
})
export default class City extends Component {
	state = {};

	componentDidMount() {
    this.props.dispatch({
      type:'city/branchList'
    })
	}

	componentWillUnmount() {

	}

	selectOne = (item)=>{
    localStorage.setItem(getAppid() + 'select_city',JSON.stringify(item));
    this.props.dispatch({
      type:'global/changeState',
      payload: {
        appInfo: {
          hasSaleArea: true,
          saleInfo:{   //销售区域信息
            orgId: item.orgId,
            orgSNNo: item.orgSNNo,
            saleDesc: item.saleDesc
          },
        }
      }
    });
    const query = this.props.location.query;
    if(query.type === 'push'){
      router.push('/gasExpress')
    }else{
      router.goBack();
    }

  };

	render() {
	  const { city: { list }, loading } = this.props;
		return (
      <DocumentTitle title="区域选择">
        <Fragment>
          <ActivityIndicator toast text="加载中..." animating={ loading }/>
          <List renderHeader={() => '请选择销售区域'}>
           {
             list.map((item,index)=>(
               <Item arrow="horizontal" key={index} onClick={()=>this.selectOne(item)}>{item.saleDesc}</Item>
             ))
           }
          </List>
        </Fragment>
      </DocumentTitle>
		);
	}
}

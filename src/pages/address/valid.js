import React, {Component, Fragment} from 'react';
import {connect} from 'dva';
import DocumentTitle from 'react-document-title';
import {
  List,
  ActivityIndicator
} from 'antd-mobile'

const Item = List.Item;

@connect(({address, loading}) => {
	return {
    address,
    loading: loading.effects['address/branchList'] || false,
	}
})
class ReactComponent extends Component {
	state = {};

	componentDidMount() {
    this.props.dispatch({
      type:'address/branchList'
    })
	}

	componentWillUnmount() {

	}

	render() {
	  const { address:{ list }, loading } = this.props;
    const getAddress = (item)=>{
	    const provinceName = item.provinceName || '';
	    const cityName = item.cityName || '';
	    const countryName = item.countryName || '';
	    if(provinceName || cityName || countryName){
        return provinceName + ' ' + cityName + ' ' + countryName
      }
      return false
    };
		return (
      <DocumentTitle title="服务区">
        <Fragment>
          <ActivityIndicator toast text="加载中..." animating={loading || false} />
          <List>
            {
              list.map((item,index)=>(
                <Fragment key={index}>
                  {
                    getAddress(item) &&
                    <Item >{ getAddress(item) }</Item>
                  }
                </Fragment>
              ))
            }
          </List>
        </Fragment>
      </DocumentTitle>
		);
	}
}

export default ReactComponent

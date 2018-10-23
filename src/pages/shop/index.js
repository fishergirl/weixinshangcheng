import React, {Component,Fragment} from 'react';
import {connect} from 'dva';
import DocumentTitle from 'react-document-title';

@connect(({chart, loading}) => {
	return {
		chart,
		loading: loading.effects['chart/fetch'],
	}
})
export default class Shop extends Component {
	state = {};

	componentDidMount() {

	}

	componentWillUnmount() {

	}

	render() {
		return (
			<DocumentTitle title="购物车">
        <Fragment>

        </Fragment>
			</DocumentTitle>
		);
	}
}

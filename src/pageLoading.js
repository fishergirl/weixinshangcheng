import React, {Component} from 'react';
import {
  ActivityIndicator
} from 'antd-mobile';

export default class Loading extends Component {

  render() {
    return (
      <ActivityIndicator toast text="加载中..." animating={true}/>
    );
  }
}

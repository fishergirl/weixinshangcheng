import { Component } from 'react';
import withRouter from 'umi/withRouter';

class Layout extends Component {
  render() {
    return this.props.children;
  }
}

export default withRouter(Layout);

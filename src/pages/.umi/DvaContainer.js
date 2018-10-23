import { Component } from 'react';
import dva from 'dva';
import createLoading from 'dva-loading';

let app = dva({
  history: window.g_history,
  ...((require('E:/项目原码/weixinshangcheng/src/dva.js').config || (() => ({})))()),
});

window.g_app = app;
app.use(createLoading());

app.model({ namespace: 'global', ...(require('E:/项目原码/weixinshangcheng/src/models/global.js').default) });
app.model({ namespace: 'index', ...(require('E:/项目原码/weixinshangcheng/src/pages/submitOrder/models/index.js').default) });
app.model({ namespace: 'prizeReceive', ...(require('E:/项目原码/weixinshangcheng/src/pages/submitOrder/models/prizeReceive.js').default) });
app.model({ namespace: 'index', ...(require('E:/项目原码/weixinshangcheng/src/pages/gasExpress/models/index.js').default) });
app.model({ namespace: 'index', ...(require('E:/项目原码/weixinshangcheng/src/pages/contact/models/index.js').default) });
app.model({ namespace: 'index', ...(require('E:/项目原码/weixinshangcheng/src/pages/main/models/index.js').default) });
app.model({ namespace: 'index', ...(require('E:/项目原码/weixinshangcheng/src/pages/me/models/index.js').default) });
app.model({ namespace: 'index', ...(require('E:/项目原码/weixinshangcheng/src/pages/orderDetail/models/index.js').default) });
app.model({ namespace: 'index', ...(require('E:/项目原码/weixinshangcheng/src/pages/orderList/models/index.js').default) });
app.model({ namespace: 'index', ...(require('E:/项目原码/weixinshangcheng/src/pages/register/models/index.js').default) });
app.model({ namespace: 'index', ...(require('E:/项目原码/weixinshangcheng/src/pages/city/models/index.js').default) });
app.model({ namespace: 'index', ...(require('E:/项目原码/weixinshangcheng/src/pages/shake/models/index.js').default) });
app.model({ namespace: 'index', ...(require('E:/项目原码/weixinshangcheng/src/pages/address/models/index.js').default) });
app.model({ namespace: 'index', ...(require('E:/项目原码/weixinshangcheng/src/pages/shop/models/index.js').default) });
app.model({ namespace: 'index', ...(require('E:/项目原码/weixinshangcheng/src/pages/coupon/models/index.js').default) });
app.model({ namespace: 'index', ...(require('E:/项目原码/weixinshangcheng/src/pages/exchange/models/index.js').default) });

class DvaContainer extends Component {
  render() {
    app.router(() => this.props.children);
    return app.start()();
  }
}

export default DvaContainer;

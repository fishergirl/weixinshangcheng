import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import { routerRedux } from 'dva/router';



let Router = DefaultRouter;
const { ConnectedRouter } = routerRedux;
Router = ConnectedRouter;


let routes = [
  {
    "path": "/",
    "component": require('../../layouts/index.js').default,
    "routes": [
      {
        "path": "/404",
        "exact": true,
        "component": require('../404.js').default
      },
      {
        "path": "/submitOrder/prizeReceive",
        "exact": true,
        "component": require('../submitOrder/prizeReceive.js').default
      },
      {
        "path": "/gasExpress",
        "exact": true,
        "component": require('../gasExpress/index.js').default
      },
      {
        "path": "/contact/add",
        "exact": true,
        "component": require('../contact/add.js').default
      },
      {
        "path": "/contact",
        "exact": true,
        "component": require('../contact/index.js').default
      },
      {
        "path": "/main",
        "exact": true,
        "component": require('../main/index.js').default
      },
      {
        "path": "/me/cmsCoupon",
        "exact": true,
        "component": require('../me/cmsCoupon.js').default
      },
      {
        "path": "/me/csmCouponInvalid",
        "exact": true,
        "component": require('../me/csmCouponInvalid.js').default
      },
      {
        "path": "/me",
        "exact": true,
        "component": require('../me/index.js').default
      },
      {
        "path": "/me/invite",
        "exact": true,
        "component": require('../me/invite.js').default
      },
      {
        "path": "/me/myRedPack",
        "exact": true,
        "component": require('../me/myRedPack.js').default
      },
      {
        "path": "/orderDetail",
        "exact": true,
        "component": require('../orderDetail/index.js').default
      },
      {
        "path": "/orderList",
        "exact": true,
        "component": require('../orderList/index.js').default
      },
      {
        "path": "/register",
        "exact": true,
        "component": require('../register/index.js').default
      },
      {
        "path": "/city",
        "exact": true,
        "component": require('../city/index.js').default
      },
      {
        "path": "/shake/prize",
        "exact": true,
        "component": require('../shake/prize.js').default
      },
      {
        "path": "/shake/shakeRecord",
        "exact": true,
        "component": require('../shake/shakeRecord.js').default
      },
      {
        "path": "/shake/:id",
        "exact": true,
        "component": require('../shake/$id.js').default
      },
      {
        "path": "/address/add",
        "exact": true,
        "component": require('../address/add.js').default
      },
      {
        "path": "/address",
        "exact": true,
        "component": require('../address/index.js').default
      },
      {
        "path": "/address/valid",
        "exact": true,
        "component": require('../address/valid.js').default
      },
      {
        "path": "/shop",
        "exact": true,
        "component": require('../shop/index.js').default
      },
      {
        "path": "/submitOrder/exchangeV2",
        "exact": true,
        "component": require('../submitOrder/exchangeV2.js').default
      },
      {
        "path": "/submitOrder",
        "exact": true,
        "component": require('../submitOrder/index.js').default
      },
      {
        "path": "/coupon",
        "exact": true,
        "component": require('../coupon/index.js').default
      },
      {
        "path": "/",
        "exact": true,
        "component": require('../index.js').default,
        "Route": require('E:/项目原码/weixinshangcheng/routes/PrivateRoute.js').default
      },
      {
        "path": "/exchange",
        "exact": false,
        "component": require('../exchange/_layout.js').default,
        "routes": [
          {
            "path": "/exchange/goods",
            "exact": true,
            "component": require('../exchange/goods.js').default
          },
          {
            "path": "/exchange/goodsDetail",
            "exact": true,
            "component": require('../exchange/goodsDetail.js').default
          },
          {
            "path": "/exchange/records",
            "exact": true,
            "component": require('../exchange/records.js').default
          },
          {
            "path": "/exchange/v2/address",
            "exact": true,
            "component": require('../exchange/v2/address.js').default
          },
          {
            "path": "/exchange/v2/goods",
            "exact": true,
            "component": require('../exchange/v2/goods.js').default
          },
          {
            "path": "/exchange/v2/goodsDetail",
            "exact": true,
            "component": require('../exchange/v2/goodsDetail.js').default
          },
          {
            "path": "/exchange/v2/records",
            "exact": true,
            "component": require('../exchange/v2/records.js').default
          },
          {
            "component": () => React.createElement(require('E:/项目原码/weixinshangcheng/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', routes: '[{"path":"/","component":"./src\\\\layouts\\\\index.js","routes":[{"path":"/404","exact":true,"component":"./src/pages/404.js"},{"path":"/submitOrder/models/prizeReceive","exact":true,"component":"./src/pages/submitOrder/models/prizeReceive.js"},{"path":"/submitOrder/prizeReceive","exact":true,"component":"./src/pages/submitOrder/prizeReceive.js"},{"path":"/gasExpress","exact":true,"component":"./src/pages/gasExpress/index.js"},{"path":"/gasExpress/models","exact":true,"component":"./src/pages/gasExpress/models/index.js"},{"path":"/contact/add","exact":true,"component":"./src/pages/contact/add.js"},{"path":"/contact","exact":true,"component":"./src/pages/contact/index.js"},{"path":"/contact/models","exact":true,"component":"./src/pages/contact/models/index.js"},{"path":"/main","exact":true,"component":"./src/pages/main/index.js"},{"path":"/main/models","exact":true,"component":"./src/pages/main/models/index.js"},{"path":"/me/cmsCoupon","exact":true,"component":"./src/pages/me/cmsCoupon.js"},{"path":"/me/csmCouponInvalid","exact":true,"component":"./src/pages/me/csmCouponInvalid.js"},{"path":"/me","exact":true,"component":"./src/pages/me/index.js"},{"path":"/me/invite","exact":true,"component":"./src/pages/me/invite.js"},{"path":"/me/models","exact":true,"component":"./src/pages/me/models/index.js"},{"path":"/me/myRedPack","exact":true,"component":"./src/pages/me/myRedPack.js"},{"path":"/orderDetail","exact":true,"component":"./src/pages/orderDetail/index.js"},{"path":"/orderDetail/models","exact":true,"component":"./src/pages/orderDetail/models/index.js"},{"path":"/orderList","exact":true,"component":"./src/pages/orderList/index.js"},{"path":"/coupon/models","exact":true,"component":"./src/pages/coupon/models/index.js"},{"path":"/register","exact":true,"component":"./src/pages/register/index.js"},{"path":"/register/models","exact":true,"component":"./src/pages/register/models/index.js"},{"path":"/city","exact":true,"component":"./src/pages/city/index.js"},{"path":"/city/models","exact":true,"component":"./src/pages/city/models/index.js"},{"path":"/shake/models","exact":true,"component":"./src/pages/shake/models/index.js"},{"path":"/shake/prize","exact":true,"component":"./src/pages/shake/prize.js"},{"path":"/shake/shakeRecord","exact":true,"component":"./src/pages/shake/shakeRecord.js"},{"path":"/shake/:id","exact":true,"component":"./src/pages/shake/$id.js"},{"path":"/address/add","exact":true,"component":"./src/pages/address/add.js"},{"path":"/address","exact":true,"component":"./src/pages/address/index.js"},{"path":"/address/models","exact":true,"component":"./src/pages/address/models/index.js"},{"path":"/address/valid","exact":true,"component":"./src/pages/address/valid.js"},{"path":"/shop","exact":true,"component":"./src/pages/shop/index.js"},{"path":"/shop/models","exact":true,"component":"./src/pages/shop/models/index.js"},{"path":"/submitOrder/exchangeV2","exact":true,"component":"./src/pages/submitOrder/exchangeV2.js"},{"path":"/submitOrder","exact":true,"component":"./src/pages/submitOrder/index.js"},{"path":"/submitOrder/models","exact":true,"component":"./src/pages/submitOrder/models/index.js"},{"path":"/coupon","exact":true,"component":"./src/pages/coupon/index.js"},{"path":"/","exact":true,"component":"./src/pages/index.js","Route":"./routes/PrivateRoute.js"},{"path":"/exchange","exact":false,"component":"./src/pages/exchange/_layout.js","routes":[{"path":"/exchange/goods","exact":true,"component":"./src/pages/exchange/goods.js"},{"path":"/exchange/goodsDetail","exact":true,"component":"./src/pages/exchange/goodsDetail.js"},{"path":"/exchange/models","exact":true,"component":"./src/pages/exchange/models/index.js"},{"path":"/exchange/records","exact":true,"component":"./src/pages/exchange/records.js"},{"path":"/exchange/v2/address","exact":true,"component":"./src/pages/exchange/v2/address.js"},{"path":"/exchange/v2/goods","exact":true,"component":"./src/pages/exchange/v2/goods.js"},{"path":"/exchange/v2/goodsDetail","exact":true,"component":"./src/pages/exchange/v2/goodsDetail.js"},{"path":"/exchange/v2/records","exact":true,"component":"./src/pages/exchange/v2/records.js"}]},{"path":"/orderList/models","exact":true,"component":"./src/pages/orderList/models/index.js"}],"Route":"./routes/PrivateRoute.js"}]' })
          }
        ]
      },
      {
        "component": () => React.createElement(require('E:/项目原码/weixinshangcheng/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', routes: '[{"path":"/","component":"./src\\\\layouts\\\\index.js","routes":[{"path":"/404","exact":true,"component":"./src/pages/404.js"},{"path":"/submitOrder/models/prizeReceive","exact":true,"component":"./src/pages/submitOrder/models/prizeReceive.js"},{"path":"/submitOrder/prizeReceive","exact":true,"component":"./src/pages/submitOrder/prizeReceive.js"},{"path":"/gasExpress","exact":true,"component":"./src/pages/gasExpress/index.js"},{"path":"/gasExpress/models","exact":true,"component":"./src/pages/gasExpress/models/index.js"},{"path":"/contact/add","exact":true,"component":"./src/pages/contact/add.js"},{"path":"/contact","exact":true,"component":"./src/pages/contact/index.js"},{"path":"/contact/models","exact":true,"component":"./src/pages/contact/models/index.js"},{"path":"/main","exact":true,"component":"./src/pages/main/index.js"},{"path":"/main/models","exact":true,"component":"./src/pages/main/models/index.js"},{"path":"/me/cmsCoupon","exact":true,"component":"./src/pages/me/cmsCoupon.js"},{"path":"/me/csmCouponInvalid","exact":true,"component":"./src/pages/me/csmCouponInvalid.js"},{"path":"/me","exact":true,"component":"./src/pages/me/index.js"},{"path":"/me/invite","exact":true,"component":"./src/pages/me/invite.js"},{"path":"/me/models","exact":true,"component":"./src/pages/me/models/index.js"},{"path":"/me/myRedPack","exact":true,"component":"./src/pages/me/myRedPack.js"},{"path":"/orderDetail","exact":true,"component":"./src/pages/orderDetail/index.js"},{"path":"/orderDetail/models","exact":true,"component":"./src/pages/orderDetail/models/index.js"},{"path":"/orderList","exact":true,"component":"./src/pages/orderList/index.js"},{"path":"/coupon/models","exact":true,"component":"./src/pages/coupon/models/index.js"},{"path":"/register","exact":true,"component":"./src/pages/register/index.js"},{"path":"/register/models","exact":true,"component":"./src/pages/register/models/index.js"},{"path":"/city","exact":true,"component":"./src/pages/city/index.js"},{"path":"/city/models","exact":true,"component":"./src/pages/city/models/index.js"},{"path":"/shake/models","exact":true,"component":"./src/pages/shake/models/index.js"},{"path":"/shake/prize","exact":true,"component":"./src/pages/shake/prize.js"},{"path":"/shake/shakeRecord","exact":true,"component":"./src/pages/shake/shakeRecord.js"},{"path":"/shake/:id","exact":true,"component":"./src/pages/shake/$id.js"},{"path":"/address/add","exact":true,"component":"./src/pages/address/add.js"},{"path":"/address","exact":true,"component":"./src/pages/address/index.js"},{"path":"/address/models","exact":true,"component":"./src/pages/address/models/index.js"},{"path":"/address/valid","exact":true,"component":"./src/pages/address/valid.js"},{"path":"/shop","exact":true,"component":"./src/pages/shop/index.js"},{"path":"/shop/models","exact":true,"component":"./src/pages/shop/models/index.js"},{"path":"/submitOrder/exchangeV2","exact":true,"component":"./src/pages/submitOrder/exchangeV2.js"},{"path":"/submitOrder","exact":true,"component":"./src/pages/submitOrder/index.js"},{"path":"/submitOrder/models","exact":true,"component":"./src/pages/submitOrder/models/index.js"},{"path":"/coupon","exact":true,"component":"./src/pages/coupon/index.js"},{"path":"/","exact":true,"component":"./src/pages/index.js","Route":"./routes/PrivateRoute.js"},{"path":"/exchange","exact":false,"component":"./src/pages/exchange/_layout.js","routes":[{"path":"/exchange/goods","exact":true,"component":"./src/pages/exchange/goods.js"},{"path":"/exchange/goodsDetail","exact":true,"component":"./src/pages/exchange/goodsDetail.js"},{"path":"/exchange/models","exact":true,"component":"./src/pages/exchange/models/index.js"},{"path":"/exchange/records","exact":true,"component":"./src/pages/exchange/records.js"},{"path":"/exchange/v2/address","exact":true,"component":"./src/pages/exchange/v2/address.js"},{"path":"/exchange/v2/goods","exact":true,"component":"./src/pages/exchange/v2/goods.js"},{"path":"/exchange/v2/goodsDetail","exact":true,"component":"./src/pages/exchange/v2/goodsDetail.js"},{"path":"/exchange/v2/records","exact":true,"component":"./src/pages/exchange/v2/records.js"}]},{"path":"/orderList/models","exact":true,"component":"./src/pages/orderList/models/index.js"}],"Route":"./routes/PrivateRoute.js"}]' })
      }
    ],
    "Route": require('E:/项目原码/weixinshangcheng/routes/PrivateRoute.js').default
  }
];


export default function() {
  return (
<Router history={window.g_history}>
  <Route render={({ location }) =>
    renderRoutes(routes, {}, { location })
  } />
</Router>
  );
}

import request from '../utils/request';

export const branchList = data => request({ url:'/cool-system/org/query/branch/list', method: 'GET', data });
export const queryOnlineAreaOrg = data => request({ url:'/cool-system/org/query/onLine/area/org', method: 'GET', data });
export const getWeixinJapiTicket = data => request({ url:'/cool-weixin-service/shop/get/weixin/japiTicket', method: 'POST', data });

export const wechatUserInfo = data => request({ url:'/api/get/wechat/userInfo', method: 'GET', data });
export const userUserInfo = data => request({ url:'/cool-weixin-service/sale/rest/user/userInfo', method: 'GET', data });
export const isSignUp = data => request({ url:'/cool-weixin-service/sale/rest/user/isSignUp', method: 'POST', data });
export const shopSignUp = data => request({ url:'/cool-weixin-service/shop/signUp', method: 'POST', data });
export const shopGetCode = data => request({ url:'/cool-weixin-service/shop/getCode', method: 'POST', data });

export const goodsWithPrice = data => request({ url:'/cool-system/good/query/goodsprice/online/quick', method: 'POST', data });

export const couponList = data => request({ url:'/cool-sale-service/openapi/idea/query/coupon/list', method: 'POST', data });
export const getCoupon = data => request({ url:'/cool-sale-service/openapi/idea/get/coupon', method: 'POST', data });
export const csmCouponList = data => request({ url:'/cool-sale-service/openapi/idea/query/csm/coupon/list', method: 'POST', data });
export const invalidCouponList = data => request({ url:'/cool-sale-service/openapi/idea/query/invalid/coupon', method: 'POST', data });

export const phoneSave = data => request({ url:'/cool-crm/csm/csmPhone/save', method: 'POST', data });
export const setDefaultPhone = data => request({ url:'/cool-crm/csm/phone/updateIsMain', method: 'POST', data });
export const phoneDel = data => request({ url:'/cool-crm/csm/csmPhone/delete', method: 'POST', data });

export const addressSave = data => request({ url:'/cool-crm/csm/csmAddress/save', method: 'POST', data });
export const setDefaultAddress = data => request({ url:'/cool-crm/csm/address/updateIsMain', method: 'POST', data });
export const addressDel = data => request({ url:'/cool-crm/csm/address/del', method: 'POST', data });

export const corpSettingQuery = data => request({ url:'/cool-system/corpSetting/query', method: 'POST', data });
export const orderQuery = data => request({ url:`/cool-order/order/query/csmorder/${data.pageNum}/${data.pageSize}`, method: 'GET' });
export const getOrderDetail = data => request({ url:'/cool-order/order/query/order/detail', method: 'POST', data });
export const shopOrderSubmit = data => request({ url:'/cool-weixin-service/shop/orderSubmit', method: 'POST', data });
export const shopWxPrePay = data => request({ url:'/cool-weixin-service/shop/wxPrePay', method: 'POST', data });
export const updateOrderPayStatus = data => request({ url:'/cool-order/order/update/order/paystatus', method: 'POST', data });
export const updateOrderCancel = data => request({ url:'/cool-order/order/update/order/cancel', method: 'POST', data });
export const updateOrderDiscard = data => request({ url:'/cool-order/order/update/order/discard', method: 'POST', data });

export const getInviteQrcode = data => request({ url:'/api/get/invite/qrcode', method: 'POST', data });
export const getMyRedPack = data => request({ url:'/api/my/redPack', method: 'POST', data });
export const getInvitation = data => request({ url:'/api/get/invitation', method: 'POST', data });

export const bannerQuery = data => request({ url:'/api/bannerQuery', method: 'POST', data });
export const goodsTypeQuery = data => request({ url:'/api/goodsTypeQuery', method: 'POST', data });

export const scoreGoods = data => request({ url:'/api/score/goods', method: 'POST', data });
export const exchangeRecords = data => request({ url:'/api/exchangeRecords', method: 'POST', data });
export const shakeInfo = data => request({ url:'/api/shake/info', method: 'POST', data });
export const shakeStart = data => request({ url:'/api/shake/start', method: 'POST', data });
export const winRecordList = data => request({ url:'/api/winRecord/list', method: 'POST', data });
export const winRecordQuery = data => request({ url:'/api/winRecord/query', method: 'POST', data });



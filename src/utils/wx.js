import {getWeixinJapiTicket, shopWxPrePay, updateOrderPayStatus} from '../services/api'
import queryString from "query-string";
import { Toast } from 'antd-mobile';

export const wxConfig = async ()=>{
  const wx = window.wx;
  const index = window.location.href.indexOf('#');
  const url = window.location.href.substring(0,index);
  const queryIndex = window.location.href.indexOf('?');
  const query = queryString.parse(window.location.href.substring(queryIndex+1));
  let appid = query.appid;
  if (typeof appid === 'undefined') {
    appid = localStorage.getItem('appid');
  }
  const res = await getWeixinJapiTicket({appId: appid,url});
  const jsapiConfig = res.data;
  console.log(jsapiConfig,"微信配置信息");
  if(Object.keys(jsapiConfig).length === 0){
    Toast.fail('微信权限配置失败',2,null,false);
    return
  }
  wx.config({
    debug: false,
    appId: appid,
    jsApiList: ['chooseWXPay', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideAllNonBaseMenuItem', 'previewImage', 'getNetworkType', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseImage', 'uploadImage'],
    timestamp: jsapiConfig.timestamp,
    nonceStr: jsapiConfig.nonceStr,
    signature: jsapiConfig.signature
  });
  wx.error(function (res) {
    console.error(res);
  });
  wx.ready(function (res) {
    console.log('jssdk ready...', res);
  });
};

const pay = (res)=>{
  return new Promise((resolve)=>{
    window.wx.chooseWXPay({
      timestamp: res.data.timeStamp * 1,
      nonceStr: res.data.nonceStr,
      package: 'prepay_id=' + res.data.prePayId,
      signType: res.data.signType,
      paySign: res.data.paySign,
      complete(res1){
        resolve(res1);
        console.log(res1)
      }
    });
  })
};

export const wxPay = async (orderCode,fee)=>{
  const res = await shopWxPrePay({orderCode,fee});
  const res1 = await pay(res);
  if(res1.errMsg === "chooseWXPay:ok") {
    try{
      window.noToast = true;
      await updateOrderPayStatus({orderCode})
    }catch (e) { console.log('修改预支付状态失败')}
  }
};

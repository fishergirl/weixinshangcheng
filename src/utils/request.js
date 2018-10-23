/*eslint-disable*/
import axios from 'axios';
import { Toast } from 'antd-mobile';
import {getAppid} from "./config";
import queryString from "query-string";

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function $params(obj) {
  const str = [];
  for (const p in obj) {
    str.push(
      encodeURIComponent(p) +
      '=' +
      encodeURIComponent(typeof obj[p] === 'object' ? JSON.stringify(obj[p]) : obj[p])
    );
  }
  return str.join('&');
}

export default function request( options, timeout = 10000) {
  return new Promise((resolve, reject) => {
    let headers = {};
    const index = window.location.href.indexOf('?');
    const query = queryString.parse(window.location.href.substring(index+1));
    const appid = query.appid;
    if (appid) {
      const sessionAppid = localStorage.getItem('appid');
      if(appid !== sessionAppid) {
        localStorage.setItem('appid',appid);
        headers.clearInfo = 'clear';
      }
    }
    let data = {
      method: options.method || "GET",
      url: options.url,
      headers: {
        Accept: 'application/json',
        // 'Content-Type': 'application/json; charset=utf-8',
        'Content-Type': 'application/x-www-form-urlencoded',
        ...options.headers,
        ...headers
      },
      timeout:timeout
    };
    switch (data.method) {
      case "GET":
        data.params = options.data;
        break;
      case "POST":
        data.data = $params(options.data);
        // data.data = options.data;
        break;
    }
    axios(data).then((resp) => {
      if(resp.data.status === 200 || resp.data.status === 'ok'){
        resolve(resp.data);
        window.noToast = false;
        window.noMessage = false;
      }else{
        if(window.onToast){
          window.noToast = false;
        }else if(window.noMessage){
          window.noMessage = false;
        }else{
          Toast.fail(resp.data.message || '未知错误',2,null,false)
        }
        reject(resp);
      }
    }).catch((err) => {
      reject(err);
      if(window.onToast){
        window.noToast = false;
        return
      }
      if(err.response) {
        if(err.response.status === 302 || err.response.status === 401){
          // Toast.info('登录失效请重新登陆');
          // window.g_app._store.dispatch({type:'global/login'});
          const data = {
            appid:getAppid(),
            path: encodeURIComponent(window.location.hash.substring(1))
          };
          Toast.loading('请稍后...');
          window.location.href = `/login/weixin/loginConfirm?appid=${data.appid}&path=${data.path}`;
          return
        }
        const errortext = codeMessage[err.response.status] || '网络异常，请求数据失败,请手动刷新页面';
        Toast.fail(errortext)
      }else{
        Toast.fail('网络异常，请求数据失败,请手动刷新页面')
      }
    })
  });
}

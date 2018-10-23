/*eslint-disable*/
import './font/iconfont.less'
import { showVConsole } from './utils/config'

//刷新前保存状态用于设置初始值
window.onbeforeunload = ()=>{
  const initState = window.g_app._store.getState().global;
  sessionStorage.setItem('dva_initState',JSON.stringify(initState))
};

import {wxConfig} from "./utils/wx";
wxConfig();

if(showVConsole) { //引入vConsole调试器
  let script = document.createElement('script');
  script.src = 'https://cdn.bootcss.com/vConsole/3.2.0/vconsole.min.js';
  document.getElementsByTagName('html')[0].appendChild(script);
  script.onload = function () {
    new VConsole();
  };
}


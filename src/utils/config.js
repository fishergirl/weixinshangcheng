
module.exports = {
  getAppid:()=>localStorage.getItem('appid'),
  imgHost: 'http://image.haoyunqi.com.cn/',
  reg_phone : /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/,//手机号正则
  reg_TelPhone : /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,//座机号正则
  showVConsole : false, //是否显示vConsole
};

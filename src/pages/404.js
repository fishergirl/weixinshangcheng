import React from 'react'
import styles from './404.less'
import { Button } from 'antd-mobile';
import { connect } from 'dva';
import router from 'umi/router';

export default connect()(({ dispatch }) => {
  return (
  <div className={styles.error}>
    <img src={require('../assets/404-05.png')} alt=""   style={{width:'100%',height:'auto'}}/>
    <h1>404 Not Found</h1>
    <Button onClick={()=>router.push('/')}>返回首页</Button>
  </div>
  );
});


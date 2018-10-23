import React, {Component} from 'react';
import {connect} from 'dva';
import {
  Modal
} from 'antd-mobile';
import classnames from 'classnames'
import DocumentTitle from 'react-document-title';
import router from 'umi/router'
import { listenPhoneShake, removePhoneShake } from '../../utils/shake'
import { imgHost } from '../../utils/config'
import timeout from '../../utils/timeout'
import NumberToChinese from '../../utils/NumberToChinese'
import { dateFtt } from '../../utils/dateFtt'
import styles from './style.less'

@connect(({global, shake, loading}) => {
	return {
    global,
    shake,
		loading: loading.effects['chart/fetch'],
	}
})
class ReactComponent extends Component {
	state = {
    isShake: false,
    modal: false
  };

	componentDidMount() {
    listenPhoneShake(this.shakeFn);
    this.init();
	}

	componentWillUnmount() {
    removePhoneShake();
	}

  init = async ()=>{
	  const { global:{ userInfo }, dispatch, location } = this.props;
    const shakeId = location.pathname.split('/')[2];
	  if(!userInfo){
	    dispatch({type:'global/getUserInfo'})
    }
    dispatch({
      type:'shake/getShakeInfo',
      payload:{
        shakeId
      }
    })
  };

  shakeFn = async ()=>{
	  if(this.state.isShake)return;
    const shakeId = this.props.location.pathname.split('/')[2];
    this.audioRef.play();
    if(this.checkShake()){
      this.props.dispatch({
        type:'shake/shakeStart',
        payload:{
          shakeId
        }
      })
    }
    this.setState({isShake:true});
    await timeout(1600);
    this.setState({isShake:false});
  };

  checkShake = ()=>{
    const { shake:{ shakeInfo } } = this.props;
    const errArr = [];
    if(!shakeInfo || Object.keys(shakeInfo).length === 0)errArr.push('活动信息还未加载完成');
    else if(shakeInfo.isvalid === 'invalid')errArr.push('活动已经下线');
    else if(shakeInfo.status === '未开始')errArr.push('活动还未开始');
    else if(shakeInfo.status === '已结束')errArr.push('活动已经结束');
    if(errArr.length>0){
      Modal.alert('提示', errArr[0] ,[{text:'确定'}]);
      return false
    }
    return true
  };

  winClose = () => {
    this.props.dispatch({
      type:'shake/changeState',
      payload:{
        showWin: false,
        winMes:'',
        remainCountMsg:''
      }
    })
  };

	render() {
	  const { isShake,modal } = this.state;
	  const { shake:{ shakeInfo, showWin, winMes, remainCountMsg } } = this.props;
    const shakeId = this.props.location.pathname.split('/')[2];
	  const prizeList = ()=>{
	    if(!shakeInfo.prizeList)return [];
	    return shakeInfo.prizeList.sort((a,b)=>a.level-b.level);
    };
		return (
      <DocumentTitle title="摇一摇活动">
        <div className={styles.page}>
          <div className={styles.audio}>
            <audio ref={el=>this.audioRef=el} src={imgHost + 'wx_shake_audio.mp3'} />
          </div>
          <div className={styles.content}>
            <div className={styles.bg}>
              <img className={styles.indexBg} src={imgHost + 'wx_indexbg.png'} alt=''/>
              <img className={classnames(styles.shakeimg,{[styles.shake]:isShake})} src={imgHost + 'wx_shake.png'}  alt=''/>
              <img className={styles.cp} src={imgHost + 'wx_cp.png'}  alt=''/>
            </div>
          </div>
          <div>
            <ul className={styles.nav}>
              <li onClick={()=>this.setState({modal:true})}><img src={imgHost + 'wx_hdsm.png'} alt=''/><p>活动说明</p></li>
              <li onClick={()=>router.push({pathname:'/shake/shakeRecord',query:{shakeId}})}><img src={imgHost + 'wx_zjjl.png'} alt=''/><p>中奖纪录</p></li>
              <li onClick={()=>router.push({pathname:'/shake/prize',query:{shakeId}})}><img src={imgHost + 'wx_wdjp.png'} alt=''/><p>我的奖品</p></li>
            </ul>
          </div>
          <Modal
            visible={modal}
            transparent
            closable
            onClose={()=>this.setState({modal:false})}
            title="活动说明"
          >
            <div className={styles.modal}>
              <p>{shakeInfo.remark}</p>
              <p>每人可参与{shakeInfo.maxShake}次</p>
              <p>开始时间:{dateFtt(shakeInfo.startTime,'yyyy-MM-dd hh:mm:ss')}</p>
              <p>结束时间:{dateFtt(shakeInfo.endTime,'yyyy-MM-dd hh:mm:ss')}</p>
              <p>奖品：</p>
              {
                prizeList().map((item,index)=>(
                  <p key={index}>{NumberToChinese(item.level)}等奖:{item.name}</p>
                ))
              }
            </div>
          </Modal>
          <div className={classnames(styles.result_panel,{[styles.show]:showWin})}>
            <div className={styles.mask} onClick={this.winClose}/>
            <div className={styles.result_ctn}>
              <div className={styles.btn_close} onClick={this.winClose}/>
              <div className={styles.btn_ok} onClick={this.winClose}>确认</div>
              <div className={styles.result_txt}>
                <p className={styles.result_title}>恭喜您</p>
                <p className={styles.result_mes}>{winMes}</p>
                <p className="tip">已经放入我的奖品，快去我的奖品查看吧~ {remainCountMsg}</p>
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
		);
	}
}

export default ReactComponent

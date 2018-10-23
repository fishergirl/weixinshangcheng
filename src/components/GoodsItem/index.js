import React, {Component} from 'react';
import { InputItem, Toast } from 'antd-mobile'
import styles from './style.less'
import classnames from 'classnames'
import { imgHost } from 'utils/config'
import {getSetting} from "../../utils/corpSetting";

function changImg(str) {
  return str.split(';')[0]
}
export default class CoodsItem extends Component {
  componentDidMount(){
    document.addEventListener('click',(e)=>{
      if(this.input && e.target !== this.input.inputRef.inputRef){
        this.input.inputRef.inputRef.blur()
      }
    })
  }
  onChange = (counter)=>{
    const { corpSetting } = this.props;
    const buyMax= corpSetting && corpSetting.buyMax;
    if(counter < 0)return;
    if(counter > (buyMax || 999)) {
      Toast.info('本商品限购'+ buyMax + '件',2,null,false);
      return
    }
    this.props.onChange(counter)
  };
  onBlur = (counter)=>{
    this.props.onChange(Number(counter) || 0)
  };

  renderTip = (count,corpSetting)=>{
    if(!corpSetting)return '';
    const sp3_7 = (corpSetting.sp3 >> 7) & 0x01;
    if(!sp3_7) return '';
    if (count <= 0) {
      return <span className="orange">无货</span>;
    }
    if (count > 10) {
      return <span className="gray">库存充足</span>;
    }
    if (count > 0 && count <= 10) {
      return <span className="orange">{"仅剩" + count + "件"}</span>;
    }
  };

	render() {
	  let { item={}, hasCounter=true, className, hasRemark, renderTip, orderFlag=1, corpSetting } = this.props;
    const showPrice = getSetting(corpSetting).showPrice;
		return (
			<div className={classnames(styles.box,className)}>
        <div>
          <div className={styles.img}>
            <img src={imgHost+(item.imageName ? changImg(item.imageName) : 'wx_goods.png')} alt=""/>
          </div>
        </div>
        <div className={classnames(styles.mes,{[styles.has_counter]:hasCounter})}>
          <p>{item.aliasName || item.goodsName}</p>
          {
            orderFlag === 1 && showPrice &&
            <p>￥<span>{item.basePrice || item.gprince}</span></p>
          }
          {
            orderFlag === 2 &&
            <p><i className="iconfont icon-jifen"/> {item.requiredScore}</p>
          }
          {
            hasRemark && item.remark &&
            <p>{ item.remark.length > 50 ? item.remark.substring(0, 50) + '...' : item.remark }</p>
          }
        </div>
        {
          hasCounter ?
          <div className={styles.counter}>
            <span onClick={()=>this.onChange(Number(item.counter) - 1)}>-</span>
            <InputItem ref={ref=>this.input = ref} className={styles.input} maxLength={3} type="number" defaultValue={item.counter || 0} value={item.counter} onChange={this.onChange} onBlur={this.onBlur} />
            <span onClick={()=>this.onChange(Number(item.counter) + 1)}>+</span>
          </div> :
          renderTip ? this.renderTip(item.gcount,corpSetting) :
          <div className={styles.counter_t}>X{item.counter || item.gcount}</div>
        }
      </div>
		);
	}
}

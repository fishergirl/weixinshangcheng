import React, {Component,Fragment} from 'react';
import {connect} from 'dva';
import {
  Button,
  ActivityIndicator,
  Modal
} from 'antd-mobile';
import Scroll from 'react-bescroll';
import DocumentTitle from 'react-document-title'
import router from 'umi/router'
import classnames from 'classnames'
import numeral from 'numeral'
import styles from './style.less'
import { status, payStatus } from "../../utils/status"
import { dateFtt } from "../../utils/dateFtt";
import { getSetting } from "../../utils/corpSetting";
import { imgHost } from '../../utils/config'
import { wxPay } from '../../utils/wx'

function changImg(str) {
  return str.split(';')[0]
}

const changeRow = (rows,tab)=>{
  if(rows.length === 0) return [];
  switch (tab){
    case 0:
      return rows;
    case 1:
      return rows.filter(item=>item.orderStatus === 1 && item.payStatus === 1 && item.paymentMethod === 2);
    case 2:
      return rows.filter(item=>(item.orderStatus === 1 && item.payStatus === 3 && item.paymentMethod === 2) || item.orderStatus === 2);
    case 3:
      return rows.filter(item=>item.orderStatus === 5);
    default:
      return []
  }
};

@connect(({orderList, global, loading}) => {
	return {
    orderList,
    global,
		loading: loading.effects['orderList/getOrders'] || loading.effects['global/getCorpSetting'] || false,
    subLoading: loading.effects['orderList/orderCancel'] || loading.effects['orderList/orderDiscard'] || false,
	}
})
export default class OrderList extends Component {
	state = {
	  tab: 0,
    moving: false,
    percent: 0,
    type: 'default',
    payLoading: false
  };

	componentDidMount() {
	  const { corpSetting } = this.props.global;
	  if(!corpSetting){
	    this.props.dispatch({
        type:'global/getCorpSetting'
      })
    }
    this.props.dispatch({
      type:'orderList/getOrders',
      payload: {
        pageNum: 1
      }
    })
	}


  pullDownFreshAction = async ()=>{
    this.setState({type:'pullDown'});
    await this.props.dispatch({
      type: 'orderList/getOrders',
      payload: {
        pageNum: 1
      }
    });
  };

  loadMoreData = async ()=>{
    this.setState({type:'pullUp'});
    const { orderList:{ ordersData:{ pageNum, rows } } } = this.props;
    if(rows.length < 10)return;
    await this.props.dispatch({
      type: 'orderList/getOrders',
      payload:{
        pageNum: pageNum+1
      }
    });
  };

  del = (e,orderCode)=>{
    e.stopPropagation();
    const { dispatch } = this.props;
    Modal.alert('提示', '确定取消该订单吗？',[
      {text:'取消'},
      {
        text:'确定',
        onPress(){
          dispatch({
            type:'orderList/orderCancel',
            payload:{
              orderCode
            }
          })
        }
      }
    ]);
  };

  pay = async (e,order)=>{
    e.stopPropagation();
    this.setState({ payLoading: true });
    try{
      await wxPay(order.orderCode,parseInt(order.treceivables * 100));
      this.setState({type:'default', payLoading: false});
      this.props.dispatch({
        type: 'orderList/getOrders',
        payload: {
          pageNum: 1
        }
      })
    }catch (e) {
      this.setState({ payLoading: false });
    }
  };

  discardOrder = (e,orderCode)=>{
    e.stopPropagation();
    const { dispatch } = this.props;
    Modal.alert('提示', '确定要退单吗？',[
      {text:'取消'},
      {
        text:'确定',
        onPress(){
          dispatch({
            type:'orderList/orderDiscard',
            payload:{
              orderCode
            }
          })
        }
      }
    ]);
  };

	render() {
	  const { orderList:{ ordersData:{ rows, noMore } }, global:{ corpSetting }, loading, subLoading } = this.props;
	  const { tab, moving, percent, type, payLoading } = this.state;
	  const showPrice = getSetting(corpSetting).showPrice;
	  const showPay = (order)=>{
      const date1 = dateFtt(new Date(order.transactDt),'yyyy-MM-dd');
      const date2 = dateFtt(new Date(), 'yyyy-MM-dd');
      return showPrice && order.orderStatus === 1 && order.paymentMethod === 2 && order.payStatus === 1 && date1 === date2;
    };
		return (
      <DocumentTitle title="订单列表">
       <div className={styles.orderList}>
         <ActivityIndicator toast text="加载中..." animating={loading && type === 'default'}/>
         <ActivityIndicator toast text="处理中..." animating={subLoading || payLoading}/>
         <div className={styles.tabs_wrap}>
           <div className={styles.tabs}>
             <div className={classnames(styles.tab_item,{[styles.active]:tab === 0})} onClick={()=>this.setState({tab : 0})}>全部订单</div>
             <div className={classnames(styles.tab_item,{[styles.active]:tab === 1})} onClick={()=>this.setState({tab : 1})}>待付款</div>
             <div className={classnames(styles.tab_item,{[styles.active]:tab === 2})} onClick={()=>this.setState({tab : 2})}>待发货</div>
             <div className={classnames(styles.tab_item,{[styles.active]:tab === 3})} onClick={()=>this.setState({tab : 3})}>待收货</div>
           </div>
           <div className={classnames(styles.line)} style={{left: (moving ? percent : tab*25)+'%'}}/>
         </div>
         <div className={classnames(styles.swiper,{[styles.no_tip]:rows && changeRow(rows,tab).length<10})}>
           <Scroll
             ref={(ref)=>this.scroll=ref}
             scrollbar={false}
             click={true}
             pullDownRefresh
             doPullDownFresh={this.pullDownFreshAction}
             pullUpLoad= {{
               txt:{
                 more: '加载中...',
                 nomore: noMore ? '没有更多了哦' : '',
               }
             }}
             pullUpLoadMoreData={this.loadMoreData}
             isPullUpTipHide={ rows.length === 0 }
           >
             <div className={styles.orders_list}>
               {
                 rows && changeRow(rows,tab).map((order,index)=>(
                   <div className={styles.order} key={index} onClick={()=>router.push({pathname:'/orderDetail',query:{orderCode:order.orderCode}})}>
                     <div className={styles.order_title}>
                       <span>订单号：{order.orderCode}</span>
                       <span className={styles.order_date}>({dateFtt(order.createTime,'yyyy-MM-dd hh:mm')})</span>
                       <span className={styles.order_status}>{status(order)}</span>
                     </div>
                     {
                       order.detailList.map((item,idx)=>(
                         <div className={styles.box} key={idx}>
                           <div>
                             <div className={styles.img}>
                               <img src={imgHost+(item.imageName ? changImg(item.imageName) : 'wx_goods.png')} alt=""/>
                             </div>
                           </div>
                           <div className={styles.mes}>
                             <p>{item.aliasName || item.goodsName}</p>
                             {
                               showPrice && order.orderFlag === 1 &&
                               <p>￥<span>{item.basePrice || item.gprince}</span></p>
                             }
                             {
                               order.orderFlag === 2 &&
                               <p>{item.priceScore}积分</p>
                             }
                           </div>
                           <div className={styles.counter_t}>X{item.counter || item.gcount}</div>
                         </div>
                       ))
                     }
                     <div className={styles.message}>
                       共 <span className="orange">{order.goodsCount}</span> 件商品
                       {
                         showPrice && order.treceivables >= 0 &&
                         <Fragment>
                           {
                             (order.orderFlag === 1 || order.orderFlag === 4) &&
                             <span>应付：<span className="orange">￥<span className={styles.big}>{numeral(order.treceivables).format('0.00')} </span></span></span>
                           }
                           {
                             order.orderFlag === 2 &&
                             <span>应付：<i className="orange">{order.tRequiredScore} 积分</i></span>
                           }
                           {
                             order.decimalSpare1 > 0 &&
                             <span>(含配送费：¥ {numeral(order.decimalSpare1).format('0.00')})</span>
                           }
                           {
                             order.decimalSpare1 === 0 &&
                             <span>(免配送费)</span>
                           }
                         </Fragment>
                       }
                     </div>
                     <div className={styles.foot}>
                       <span className={styles.dai}>
                         {payStatus(order)}
                       </span>
                       {
                         order.orderStatus === 1 && order.payStatus === 1 &&
                         <Button className={styles.btn} inline size="small" onClick={(e)=>this.del(e,order.orderCode)}>取消订单</Button>
                       }
                       {
                         showPay(order) &&
                         <Button className={classnames(styles.btn,styles.active)} inline size="small" onClick={(e)=>this.pay(e,order)}>付款</Button>
                       }
                       {
                         (order.orderStatus === 2 || (order.orderStatus === 1 && order.payStatus > 1)) && (corpSetting && corpSetting.corpCode !== '37018') &&
                         <Button className={styles.btn} inline size="small" onClick={(e)=>this.discardOrder(e,order.orderCode)}>申请退单</Button>
                       }
                     </div>
                   </div>
                 ))
               }
               {
                 !loading && rows && changeRow(rows,tab).length === 0 &&
                 <div className={styles.no_data}>
                   暂无数据
                 </div>
               }
             </div>
           </Scroll>
         </div>
       </div>
      </DocumentTitle>
		);
	}
}

export const status = (item)=>{
	const obj = {
		"-1": "已作废",
		"1": "未审核",
		"2": "已审核",
		"3": "退单申请中",
		"4": "已接收",
		"5": "已接单",
		"6": "已转派",
		"7": "已退单",
		"8": "已出库",
		"10": "已完成",
		"11": "已终止"
	};
	return obj[item.orderStatus] || "";
};

export const statusInfo = (order)=>{
	if(!order)return {};
	if(order.orderStatus === -1 || order.payStatus === 7 || order.orderStatus === 11) { //已关闭
		return {
			mes:'交易关闭',
			img:'danding'
		}
	}
	if(order.orderStatus === 1){ // 未审核
	  if(order.paymentMethod === 2){ //微信支付
      if(order.payStatus === 1) { //未付款
        return {
          mes: '等待买家付款',
          img: 'jingya'
        }
      }
      if(order.payStatus === 2 || order.payStatus === 3) { // 已付款
        return {
          mes: '等待发货',
          img: 'weixiao'
        }
      }
    }
    if(order.paymentMethod === 1){ //现金支付
      return {
        mes: '等待发货',
        img: 'weixiao'
      }
    }
	}
	if(order.orderStatus === 2){ // 已审核
		return {
			mes: '等待发货',
			img: 'weixiao'
		}
	}
	if(order.orderStatus === 3){ // 退单申请中
		return {
			mes: '等待卖家处理',
			img: 'danding'
		}
	}
	if(order.orderStatus === 5){  // 已接单
		return {
			mes: '等待买家收货',
			img: 'daxiao'
		}
	}
	if(order.orderStatus === 10){ // 订单完成
		return {
			mes: '交易完成',
			img: 'kaixin'
		}
	}
	return {
		mes: '订单处理中',
		img: 'danding'
	}
};

export const payStatus = (order)=>{
  if(order.orderStatus === -1 || order.orderStatus === 10 || order.orderStatus === 11) {
    return ''
  } else {
    if(order.paymentMethod === 1) {
      return "货到付款";
    }
    if(order.paymentMethod === 2) {
      if(order.payStatus === 1) {
        return "等待买家付款";
      }
      if(order.payStatus === 2 || order.payStatus === 3) {
        return "买家已付款";
      }
    }
  }
};

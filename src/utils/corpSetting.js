
export const getSetting = (corpSetting) => {
  if(!corpSetting) return {};
  const sp1 = Number(corpSetting.sp1) || 0;
  const buyMax = Number(corpSetting.buyMax) || 999;
  let showPrice = true;
  let cfloorFun = false;
  if(sp1 >> 6 & 0x01) { // 不显示价格
    showPrice = false;
  }
  if(sp1 >> 17 & 0x01){ //计算上楼费
    cfloorFun = true;
  }
  const maxFloor = sp1 >> 18 & 0xF;
  return {
    buyMax,
    showPrice,
    cfloorFun,
    maxFloor
  }
};

import React, {Component,Fragment} from 'react';
import {connect} from 'dva';
import classnames from 'classnames'
import numeral from 'numeral';
import DocumentTitle from 'react-document-title';
import {
  Carousel,
  ActivityIndicator,
  Button
} from 'antd-mobile';
import { imgHost } from 'utils/config'
import Tab from '../../components/Tab'
import styles from './style.less'

@connect(({main, loading}) => {
	return {
    main,
		loading: loading.effects['main/getData'],
	}
})
export default class Main extends Component {
	state = {};

	componentDidMount() {
    this.props.dispatch({
      type: 'main/getData'
    })
	}

	componentWillUnmount() {

	}

	render() {
	  const { main:{ bannerList, goodsTypeList, goodsPriceList }, loading, location:{ pathname } } = this.props;
		return (
			<DocumentTitle title="首页">
        <Fragment>
          <ActivityIndicator toast text="正在加载" animating={loading}/>
          <Carousel
            className={styles.banner}
            dotActiveStyle={{background:'#48b4c8'}}
            autoplay={true}
            infinite={true}
          >
            {
              bannerList.map((item,index)=>(
                <img className={styles.banner} key={index} src={imgHost+item.ImageName} alt=""/>
              ))
            }
          </Carousel>
          <div className={classnames(styles.typeList,'clearfix')}>
            {
              goodsTypeList.map((item,index)=>(
                <div className={styles.type_box} key={index}>
                  <div className={styles.type_left}>
                    <img src={imgHost+(item.imageName || 'wx_goods.png')} alt=""/>
                  </div>
                  <div className={styles.type_right}>
                    <p className={styles.type_subTitile}>{item.gtName}</p>
                    <p className={styles.no_wrap}>{item.remark}</p>
                  </div>
                </div>
              ))
            }
          </div>
          {
            (bannerList.length > 0 || goodsTypeList.length>0 || goodsPriceList.length >0) &&
            <div className={styles.tip}>热销商品</div>
          }
          <div className={styles.hot_goods}>
            {
              goodsPriceList.map((item,index)=>(
                <div className={styles.hot_goods_item} key={index}>
                  <div className={styles.img_box}>
                    <img src={imgHost+(item.imageName || 'wx_sales.png')} alt=""/>
                  </div>
                  <p className={styles.hot_title}>
                    {item.aliasName}
                  </p>
                  <div className={styles.hot_price_box}>
                    <span className={styles.special_price}>￥<span>{numeral(item.basePrice - item.specialPrice).format('0.00')}</span></span>
                    { item.specialPrice && <span className={styles.base_price}>￥{numeral(item.basePrice).format('0.00')}</span>}
                    <span className={styles.express}>邮费:0.00</span>
                    <Button size='small' inline className={styles.hot_btn}>购买</Button>
                  </div>
                </div>
              ))
            }
          </div>
          {
            bannerList.length === 0 && goodsTypeList.length === 0 && !loading &&
            <div className={styles.none_data}>暂无数据</div>
          }
          <Tab pathname={pathname}/>
        </Fragment>
			</DocumentTitle>
		);
	}
}

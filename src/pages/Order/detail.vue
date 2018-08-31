<template>
<div class="wrapper" v-if="data">
  <head-nav></head-nav>
  <div class="noice" v-if="data.orderStatus===1&&data.orderAmountPaid===0&&data.remainingTime">
    <p class='fs16'>{{orderStatusOpt[data.orderStatus]}}</p>
    <p>请在{{data.remainingTime | formatDuring}}内支付，超时将自动取消订单</p>
  </div>
  <div class="noice" v-else-if="data.orderStatus===7&&data.orderAmountPaid>=0&&data.depositAmount===0">
    <p class='fs16'><icon type="success"></icon>{{orderStatusOpt[data.orderStatus]}}</p>
  </div>
  <div class="noice" v-else-if="data.orderStatus===1&&data.depositAmount===0&&data.orderAmountPaid>0">
    <flow >
    <flow-state is-done>
    <span slot="title">提交订单</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">已付款</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">备货中</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">已完成</span>
    </flow-state>
    </flow>
  </div>
  <div class="noice" v-else-if="data.orderStatus===4&&data.depositAmount===0">
    <flow >
    <flow-state is-done>
    <span slot="title">提交订单</span>
    </flow-state>
    <flow-line is-done></flow-line>
    <flow-state is-done>
    <span slot="title">已付款</span>
    </flow-state>
    <flow-line is-done></flow-line>
    <flow-state is-done>
    <span slot="title">备货中</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">已完成</span>
    </flow-state>
    </flow>
  </div>
  <div class="noice" v-else-if="data.orderStatus===5&&data.depositAmount===0">
    <flow >
    <flow-state is-done>
    <span slot="title">提交订单</span>
    </flow-state>
    <flow-line is-done></flow-line>
    <flow-state is-done>
    <span slot="title">已付款</span>
    </flow-state>
    <flow-line is-done></flow-line>
    <flow-state is-done>
    <span slot="title">已出库</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">已完成</span>
    </flow-state>
    </flow>
  </div>
  <div class="noice" v-else-if="data.orderStatus===6">
    <p class='fs16'><icon type="success"></icon>{{orderStatusOpt[data.orderStatus]}}</p>
  </div>
  <div class="noice" v-else-if="data.orderStatus===1&&data.depositAmount>0&&data.depositAmountPaid===0">
    <div class='left fl fs16'><i class="fa fa-clock-o" aria-hidden="true"></i>待付定金</div>
    <div class="fr right">
      <p class="p1 fs14">剩余：{{ data.remainingTime| formatDuring}}</p>
      <p class="p2 fs12">需付定金：¥{{data.depositAmount | money}}</p>
    </div>
    <p class="cb"></p>
  </div>
  <div class="noice" v-else-if="data.orderStatus===7&&data.depositAmount>0&&data.depositAmountPaid===0">
    <p class='fs16'><icon type="success"></icon>{{orderStatusOpt[data.orderStatus]}}</p>
  </div>
  <div class="noice" v-else-if="data.orderStatus===1&&data.depositAmount>0&&data.depositAmountPaid>0">
    <flow >
    <flow-state is-done>
    <span slot="title">已付定金</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">上门量尺</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">尾款支付</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">待发货</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">待收货</span>
    </flow-state>
    </flow>
  </div>
  <div class="noice" v-else-if="data.orderStatus===7&&data.depositAmount>0&&data.depositAmountPaid>0">
    <p class='fs16'><icon type="success"></icon>{{orderStatusOpt[data.orderStatus]}}</p>
  </div>
  <div class="noice" v-else-if="data.orderStatus===2">
    <flow >
    <flow-state is-done>
    <span slot="title">已付定金</span>
    </flow-state>
    <flow-line is-done></flow-line>
    <flow-state is-done>
    <span slot="title">上门量尺</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">尾款支付</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">待发货</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">待收货</span>
    </flow-state>
    </flow>
  </div>
  <div class="noice" v-else-if="data.orderStatus===7&&data.depositAmount>0&&data.depositAmountPaid===data.depositAmount">
    <p class='fs16'><icon type="success"></icon>{{orderStatusOpt[data.orderStatus]}}</p>
  </div>
  <div class="noice" v-else-if="data.orderStatus===3">
    <flow >
    <flow-state is-done>
    <span slot="title">已付定金</span>
    </flow-state>
    <flow-line is-done></flow-line>
    <flow-state is-done>
    <span slot="title">上门量尺</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state is-done>
    <span slot="title">尾款支付</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">待发货</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">待收货</span>
    </flow-state>
    </flow>
  </div>
  <div class="noice" v-else-if="data.orderStatus===7&&data.remainAmount>0&&data.remainAmountPaid===0">
    <p class='fs16'><icon type="success"></icon>{{orderStatusOpt[data.orderStatus]}}</p>
  </div>
  <div class="noice" v-else-if="data.orderStatus===3&&data.remainAmount>0&&data.remainAmountPaid>0">
    <flow >
    <flow-state is-done>
    <span slot="title">已付定金</span>
    </flow-state>
    <flow-line is-done></flow-line>
    <flow-state is-done>
    <span slot="title">上门量尺</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">尾款支付</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">待发货</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">待收货</span>
    </flow-state>
    </flow>
  </div>
  <div class="noice" v-else-if="data.orderStatus===7&&data.remainAmount>0&&data.remainAmountPaid>0">
    <p class='fs16'><icon type="success"></icon>{{orderStatusOpt[data.orderStatus]}}</p>
  </div>
  <div class="noice" v-else-if="data.orderStatus===4">
    <flow >
    <flow-state is-done>
    <span slot="title">已付定金</span>
    </flow-state>
    <flow-line is-done></flow-line>
    <flow-state is-done>
    <span slot="title">上门量尺</span>
    </flow-state>
    <flow-line is-done></flow-line>
    <flow-state is-done>
    <span slot="title">尾款支付</span>
    </flow-state>
    <flow-line is-done></flow-line>
    <flow-state is-done>
    <span slot="title">待发货</span>
    </flow-state>
    <flow-line></flow-line>
    <flow-state>
    <span slot="title">待收货</span>
    </flow-state>
    </flow>
  </div>
  <div class="noice" v-else-if="data.orderStatus===5 && data.orderGoodsType===3">
    <flow >
      <flow-state is-done>
        <span slot="title">已付定金</span>
      </flow-state>
      <flow-line is-done></flow-line>
      <flow-state is-done>
        <span slot="title">上门量尺</span>
      </flow-state>
      <flow-line is-done></flow-line>
      <flow-state is-done>
        <span slot="title">尾款支付</span>
      </flow-state>
      <flow-line is-done></flow-line>
      <flow-state is-done>
        <span slot="title">已出库</span>
      </flow-state>
      <flow-line></flow-line>
      <flow-state>
        <span slot="title">待收货</span>
      </flow-state>
    </flow>
  </div>
  <div class="showPasteArrnoice" v-else-if="data.orderStatus===7&&data.remainAmount>0&&data.remainAmountPaid===data.remainAmount">
    <p class='fs16'><icon type="success"></icon>{{orderStatusOpt[data.orderStatus]}}</p>
  </div>

  <div class="address" @click="showAddress">
    <i class="location_b"></i>
    <p>{{data.receiptVO.consigneeName}} {{data.receiptVO.consigneeMobile}}</p>
    <p class="fs12">{{data.receiptVO.regionName + data.receiptVO.detailedAddress}}</p>
  </div>

  <router-link v-if="data.orderStatus===5&&data.orderGoodsType!==3" :to="`../express/${data.orderId}`">
  <div class="express">
    <i class="dot fr"></i>
    <i class="fa fa-truck fl" aria-hidden="true"></i>
    <p class="info fs16">点击查看物流信息</p>
  </div>
  </router-link>
  <good-item :merchantGoodsList="data.merchantGoodsList" :goodsTypeOpt="goodsTypeOpt" :order="data" :canLink="true"
             :showDiscount="data.orderGoodsType!==3&&data.orderStatus>=4&&data.orderStatus<7"
             :showPasteArr="[3,4]"
             :showPrice="data.orderGoodsType!==3"></good-item>
  <div class="price-count">
    <p v-if="data.orderAmount">商品金额<span>¥{{data.orderGoodsType!==5?data.orderAmount:data.merchantGoodsList[0]['wxOrderGoodsVOList'].reduce((n, v)=>{return n + v.goodsNum * v.salePrice}, 0) | money}}</span></p>
    <p>配送费<span>¥{{data.transportFee | money}}</span></p>
    <p v-if="data.merchantFullDiscount + data.platformFullDiscount>0">满减优惠<span>-¥{{(data.merchantFullDiscount + data.platformFullDiscount)| money}}</span></p>
    <!--<p v-if="data.preDepositAmount">预存款<span>-¥{{data.preDepositAmount | money}}</span></p>-->
    <p v-if="data.merchantCoupon + data.platformCoupon>0">优惠券<span>-¥{{(data.merchantCoupon + data.platformCoupon) | money}}</span></p>
    <p v-if="data.merchantDiscountAmount">商家优惠<span>-¥{{data.merchantDiscountAmount | money}}</span></p>
    <div>
      <p>实付金额:<span>¥{{data.orderAmountReal | money}}</span></p>
      <p v-if="((data.orderStatus!==7&&data.orderStatus>=3)||(data.orderStatus===7&&data.preCancelStatus>=3))&&data.orderGoodsType===3">已付定金:<span>¥{{data.depositAmountPaid | money}}</span></p>
      <p v-if="((data.orderStatus===3)||(data.orderStatus===7&&data.preCancelStatus===3)) && data.remainAmountPaid>0">已付部分尾款:<span>¥{{data.remainAmountPaid | money}}</span></p>
      <p v-if="((data.orderStatus!==7&&data.orderStatus>=4)||(data.orderStatus===7&&data.preCancelStatus>=4))&&data.orderGoodsType===3">已付尾款:<span>¥{{data.remainAmountPaid>data.orderAmountReal - data.depositAmountPaid?data.orderAmountReal - data.depositAmountPaid:data.remainAmountPaid | money}}</span></p>
      <p v-if="((data.orderStatus===1)||(data.orderStatus===7&&data.preCancelStatus===1)) && data.orderAmountPaid>0">已支付:<span>¥{{data.orderAmountPaid | money}}</span></p>
      <p v-if="data.orderStatus===1 && data.orderAmountPaid>0">还需支付:<span>¥{{data.orderAmountReal-data.orderAmountPaid | money}}</span></p>
      <p v-if="((data.orderStatus===3)||(data.orderStatus===7&&data.preCancelStatus===3))&&data.orderGoodsType===3">待付尾款:<span>¥{{data.orderAmountReal-data.orderAmountPaid | money}}</span></p>
    </div>
  </div>
  <div class="goodsRemark" v-if="remarkGoodsList.length>0&&data.orderGoodsType===3 && ((data.orderStatus>=4 && data.orderStatus<7) || (data.orderStatus===7 && data.preCancelStatus>=4))">
    <div class="goodsRemarkTitle">商品备注</div>
    <good-item class="box" :goodsList="remarkGoodsList" :canLink="true" :showDiscount="true" :showPrice="true" :showPasteArr="[4]"></good-item>
  </div>
  <div class="sellerRemark" v-if="data.orderGoodsType===3&&((data.orderStatus!==7&&data.orderStatus>=3)||(data.orderStatus===7&&data.preCancelStatus>=3))&&data.sellerNote">
    商家留言:
    <p>{{data.sellerNote}}</p>
  </div>
  <div class="detail">
    <ul>
      <li>订单编号:{{data.orderSn}}</li>
      <li>下单时间:{{data.createdTime | date('yyyy-MM-dd hh:mm')}}</li>
    </ul>
    <ul>
      <li>配送方式:免费配送</li>
    </ul>
    <ul>
      <li>支付方式:{{paymentMethodName || '在线支付'}}</li>
    </ul>
    <ul>
      <template v-if="data.invoiceVO.type!==1">
      <li>发票类型:{{data.invoiceVO.type | option(invoiceVOTypeOpt)}}</li>
      <li>发票抬头:{{data.invoiceVO.title}}</li>
      <li>发票内容:{{data.invoiceVO.content}}</li>
      </template>
      <template v-else>
      <li>无需发票</li>
      </template>
    </ul>
  </div>
  <!--收货地址修改-->
  <div class="diyDialog" :class="{show:showAddressList}">
    <address-select :address="{addressId:data.receiptVO.addressId}" @selectAddress="selectAddress"></address-select>
  </div>
  <div class="linkToMerchant" v-if="data.orderGoodsType===3&&data.orderStatus!==7">
  <a :href="`tel:${merchantBase.telphoneNo}`">联系卖家</a>
  </div>
  <div v-if="data.orderStatus===1&&data.orderAmountPaid===0&&data.depositAmount===0" class="pay-buttom">
    <a :href="`/Pay/${data.orderSn}`">
    <button class="sure fr">
      去支付
    </button>
    </a>
    <button @click="orderCancel" class="cancel fr">
      取消订单
    </button>
  </div>
  <div v-if="data.orderGoodsType!=3 && data.orderStatus===1 &&data.orderAmountPaid>0&&data.orderAmountPaid<data.orderAmountReal" class="pay-buttom">
    <a :href="`/Pay/${data.orderSn}`">
    <button class="sure fr">
      继续支付
    </button>
    </a>
  </div>
  <div v-if="data.orderGoodsType===3 && data.orderStatus===1&&data.depositAmountPaid>0&&data.orderAmountPaid<data.orderAmountReal" class="pay-buttom">
    <a :href="`/Pay/${data.orderSn}`">
    <button class="sure fr">
      继续支付
    </button>
    </a>
  </div>
  <div v-if="data.orderGoodsType===3 && data.orderStatus===3 &&data.remainAmountPaid>0&&data.orderAmountPaid<data.orderAmountReal" class="pay-buttom">
    <a :href="`/Pay/${data.orderSn}`">
    <button class="sure fr">
      继续支付
    </button>
    </a>
  </div>

  <div v-if="data.orderStatus===1&&data.depositAmount>0 && data.depositAmountPaid===0" class="pay-buttom">
    <a :href="`/Pay/${data.orderSn}`">
    <button class="sure fr">
      支付定金
    </button>
    </a>
  </div>

  <div v-if="data.orderStatus===3&&data.remainAmountPaid===0&&data.remainAmount>0" class="pay-buttom">
    <a :href="`/Pay/${data.orderSn}`">
    <button class="sure fr">
      付尾款
    </button>
    </a>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
import {
  Tab, TabItem, Group, Cell, Flexbox, XHeader, Flow, FlowState, FlowLine, Icon, ConfirmPlugin, LoadingPlugin
} from 'vux'
import http from '@/http'
import {orderStatusOpt, deliveryMethodOpt, deliveryTypeOpt, invoiceVOTypeOpt, goodsTypeOpt, PaymentRecordVOStatus} from './js/attr'
import AddressSelect from '@/components/addressSelect.vue'
import goodsItem from './components/goodsItem'
import {headNav} from '@/components'

Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)

export default {
  components: {
    TabItem,
    Tab,
    Group,
    Cell,
    XHeader,
    Flexbox,
    Flow,
    FlowState,
    FlowLine,
    AddressSelect,
    Icon,
    'good-item': goodsItem,
    'head-nav': headNav
  },
  methods: {
    showAddress () {
      if (this.data.orderStatus === 4 && this.data.depositAmount === 0 && this.data.orderGoodsType === 2 && this.data.merchantGoodsList[0]['wxOrderGoodsVOList'].every(v => { return v.isArrivalAll === 1 })) {
        this.showAddressList = true
      }
    },
    getDetail () {
      http('ht-mj-order-server/order/wx/detail', {orderId: this.$route.params.orderId}).then((res) => {
        res.merchantGoodsList.forEach((v) => {
          v.wxOrderGoodsVOList = v.wxOrderGoodsVOList.map(v => {
            if (v.goodsType === 4) {
              v.salePrice = 0
            }
            return v
          })
        })

        this.data = res
        if (res.orderGoodsType === 3) {
          let goodsList = []
          res.merchantGoodsList[0].wxOrderGoodsVOList.forEach(function (value, index) {
            if (value.isRemark === 1) {
              goodsList.push(value)
            }
          })
          this.remarkGoodsList = goodsList
        }
        let paymentArr = this.data.paymentRecordVOList
        if (paymentArr && paymentArr.length > 0) {
          let paymentMethodName = ''
          let variablePaymentArr = []
          let existPaymentCodeArr = []
          this.data.paymentRecordVOList.forEach(function (value, index) {
            let isExist = existPaymentCodeArr.indexOf(value.paymentMethodCode) >= 0
            if (!isExist) {
              existPaymentCodeArr.push(value.paymentMethodCode)
            }
            if (value.status === 2 && !isExist) {
              variablePaymentArr.push(value)
            }
          })
          let len = variablePaymentArr.length
          variablePaymentArr.forEach(function (v, i) {
            paymentMethodName += v.paymentMethodName + (i < len - 1 ? '，' : '')
          })
          this.paymentMethodName = paymentMethodName
        }
        this.queryDetail(res.merchantGoodsList[0]['merchantId'])
      })
    },
    selectAddress (item) {
      if (item.addressId) {
        this.data.receiptVO.addressId = item.addressId
        this.data.receiptVO.consigneeName = item.consignee
        this.data.receiptVO.consigneeMobile = item.mobile
        this.data.receiptVO.detailedAddress = item.address
        this.data.receiptVO.regionName = item.provinceName + item.cityName + item.areaName
        this.addressModify(item)
      }

      this.showAddressList = false
    },
    addressModify (item) {
      item = {
        'addressId': item.addressId,
        'areaId': item.areaId,
        'cityId': item.cityId,
        'consigneeMobile': item.mobile,
        'consigneeName': item.consignee,
        'deliveryMethod': this.data.receiptVO.deliveryMethod,
        'deliveryType': this.data.receiptVO.deliveryType,
        'detailedAddress': item.address,
        'provinceId': item.provinceId,
        'receiptTime': this.data.receiptVO.receiptTime,
        'regionName': item.provinceName + item.cityName + item.areaName,
        'shippedTime': this.data.receiptVO.shippedTime,
        'userRemark': this.data.receiptVO.userRemark
      }

      http('ht-mj-order-server/order/wx/address/modify', {orderSn: this.data.orderSn, receiptVO: item}).then((res) => {
      })
    },
    queryDetail (merchantId) {
      http('ht-mj-merchant-server/merchantBase/queryDetail', {merchantId}).then((res) => {
        this.merchantBase = res
      })
    },
    orderCancel () {
      let _this = this
      _this.$vux.confirm.show({
        content: '订单取消后不可恢复，确认取消订单吗？',
        cancelText: '再看看',
        onCancel () {
          console.log('onCancel')
        },
        onConfirm () {
          _this.$vux.loading.show({
            text: '取消订单中...'
          })
          http('ht-mj-order-server/order/wx/cancel', {orderSn: _this.data.orderSn}).then((res) => {
            _this.getDetail()
            _this.$vux.loading.hide()
          })
        }
      })
    }
  },
  mounted: function () {
    this.getDetail()
  },
  data () {
    return {
      data: undefined,
      orderStatusOpt,
      deliveryMethodOpt,
      deliveryTypeOpt,
      invoiceVOTypeOpt,
      goodsTypeOpt,
      PaymentRecordVOStatus,
      showAddressList: false,
      merchantBase: {},
      paymentMethodName: '',
      remarkGoodsList: []
    }
  }
}
</script>

<style lang="less" scoped>
@import './css/style.less';
</style>

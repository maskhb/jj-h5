<template>
  <div>
    <x-header :title="title" :left-options="{backText: ''}"></x-header>
    <div v-if="data" class="wapper">
      <icon class="icon" :type="iconType"></icon>
      <div class="h_44">
        <p class="p1" v-if="data.payType!='diy_pay'">
          支付金额为<span class="payMoney">¥{{data.payMoney | money}}</span>
        </p>
      </div>
      <p class="p2 fs16">{{iconType=='success'?(data.needToPayAmount>0?'请及时支付尾款，以便我们尽快为您备货':'支付成功，我们会尽快为您备货'):'请及时支付，以便我们尽快为您备货'}}</p>
      <div class="b1 fs12" v-if="data.payType!='diy_pay'">
        <p>交易单号 <span class="fr">{{data.orderSn}}</span></p>
        <p v-if="data.needToPayAmount>0">剩余待支付 <span class="fr money">¥{{data.needToPayAmount | money}}</span></p>
      </div>
      <router-link :to="`/pay/${data.orderSn}`">
      <div v-if="data.needToPayAmount>0" class="btn contuine">
        继续支付
      </div>
      </router-link>
      <router-link to="/">
      <div class="btn nav fl">
        首页
      </div>
      </router-link>
      <router-link to="/UserCenter">
      <div class="btn nav fr">
        个人中心
      </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import {
  Icon, XHeader
} from 'vux'
import http from '@/http'
import {GetQueryString} from '@/utils/common'

export default {
  components: {
    Icon,
    XHeader
  },
  methods: {
    payOrder (payOrder) {
      let orderNo = this.$route.params.orderNo
      if (payOrder) {
        orderNo = payOrder
      }
      http('ht-mj-order-server/order/wx/payOrder/result', {payOrder: orderNo}).then((res) => {
        if(res.success){
          //        res.needToPayAmount = res.payMoney - parseInt(GetQueryString('total_fee') * 100)
          this.data = res
        }else{
          this.payOrder(payOrder)
        }
      })
    },
    init () {
      if (this.$route.params.type === 'ali_wap') {
        if (GetQueryString('is_success') === 'T' && (GetQueryString('trade_status') === 'TRADE_SUCCESS' || GetQueryString('trade_status') === 'TRADE_FINISHED')) {
          this.title = '支付成功'
          this.iconType = 'success'
        } else {
          this.title = '支付失败'
          this.iconType = 'cancel'
        }
        this.payOrder()
      } else if (this.$route.params.type === 'wx_jsapi') {
        if (GetQueryString('is_success') === 'T') {
          this.title = '支付成功'
          this.iconType = 'success'
        } else {
          this.title = '支付失败'
          this.iconType = 'cancel'
        }
        this.payOrder()
      } else if (this.$route.params.type === 'jjq_h5') {
        http('payment-api/pay/queryOrder', {paramMap: {transactionId: GetQueryString('org_order'), callback: GetQueryString('callback'), payTypeKey: 'jjq_h5'}}, {includeApi: true}).then(
          (res) => {
            if (res.payOrderNo) {
              this.payOrder(res.payOrderNo)
            }

            //            this.payOrder('20180518111949-2701063740054528');
            if (res.return_code === 'PAID') {
              this.title = '支付成功'
              this.iconType = 'success'
            } else {
              this.title = '支付失败'
              this.iconType = 'cancel'
            }
          })
      } else if (this.$route.params.type === 'mock_h5') {
        if (GetQueryString('is_success') === 'T') {
          this.title = '支付成功'
          this.iconType = 'success'
        } else {
          this.title = '支付失败'
          this.iconType = 'cancel'
        }
        this.payOrder()
      } else if (this.$route.params.type === 'diy_pay') {
        if (GetQueryString('is_success') === 'T') {
          this.title = '支付成功'
          this.iconType = 'success'
        } else {
          this.title = '支付失败'
          this.iconType = 'cancel'
        }
        this.data = {
          payType: 'diy_pay'
        }
      }
    }
  },
  mounted: function () {
    this.init()
  },
  data () {
    return {
      payType: '',
      data: undefined,
      title: '',
      iconType: undefined
    }
  }
}
</script>

<style lang="less" scoped>
.wapper{
  text-align:center;
  padding:0 30px;
  background:#fff;
  .icon{
    margin-top:61px;
    transform:scale(3);
    color:#F5A623;
  }
  .h_44{
    height:44px;
  }
  .p1{
    margin-top:80px;
    .payMoney{
      color:#F45B5E;
      margin-left:10px;
    }
  }
  .p2{
    margin-top:12px;
  }
  .b1{
    border:#C8C7CC 1px solid;
    padding:26px;
    text-align:left;
    margin-top:36px;
    color:#6B6A72;
    .money{
      color:#F55F62
    }
  }
  .btn{
    line-height:80px;
    border:1px solid #F5A623;
    border-radius:80px;
    color:#F5A623;
    background:#fff;
  }
  .btn.contuine{
    margin-top:60px;
    color:#fff;
    background:#F5A623;
  }
  .btn.nav{
    width:330px;
    margin-top:30px;
  }
}
</style>

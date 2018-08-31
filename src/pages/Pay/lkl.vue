<template>
<div class="wapper">
  <div class="topHeader">
  <x-header title="我的订单" :left-options="{backText: ''}"></x-header>
  </div>

  <div class="fs12">
    <p>订单号 <span class="fr">{{orderSn}}</span></p>
    <p>应付金额 <span class="price fs16 fr">{{needToPayAmount}}</span></p>
  </div>
<qrcode class="qrcode" :value="orderID" type="img"></qrcode>
  <p class="p1">请出示二维码给收银员使用pos机扫描<br>或在pos机上输入支付单号：</p>
  <p class="p2">{{orderID}}</p>
</div>

</template>

<script>
import {
  Qrcode,
  XHeader
} from 'vux'
export default {
  components: {
    Qrcode,
    XHeader
  },
  mounted () {

  },
  data () {
    return {
      orderSn: this.$route.params.orderSn,
      orderID: this.$route.params.orderID,
      needToPayAmount: this.$route.params.needToPayAmount
    }
  }
}
</script>

<style lang="less" scoped>
.fs12{
  width:640px;
  margin:0 auto;
  margin-top:80px;
  border:1px #C8C7CC dashed;
  padding:25px;
  .price{
    color:#F55F62;
  }
  p{
    line-height:60px;
  }
}
.qrcode{
  margin-top:80px;
  margin-bottom:35px;
  text-align:center;
}
.p1{
  color:#6B6A72;
  text-align:center;
  margin-bottom:5px;
}
.p2{
  text-align:center;
  color:#F45B5E;
}
.topHeader /deep/ .vux-header .vux-header-title{ color:#5f5f5f;}
</style>

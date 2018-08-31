<template>
  <div class="wapper">
    <h1 class="info">内部测试，非真实支付，不构成真实交易！</h1>
    <div class="fs12">
      <p>支付订单号 <span class="fr">{{paramMap.transactionId}}</span></p>
      <p>支付金额<span class="price fs16 fr">{{paramMap.payAmount|money}}</span></p>
    </div>
    <div class="m_20">
      <x-button type="primary" @click.native="toPay">确认支付（测试）</x-button>
    </div>
  </div>

</template>

<script>
import {
  Qrcode, XButton
} from 'vux'
import http from '@/http'

export default {
  components: {
    Qrcode, XButton
  },
  methods:{
    toPay(){
      let paramMap = this.paramMap;
      http('payment-api/pay/mockPay', {paramMap:paramMap}, {includeApi:true})
        .then(function(suc){
          location.href = `/Pay/result/mock_h5/${this.payOrderNo}?is_success=${suc.payResult=='SUCCESS'?'T':'F'}`
        }.bind(this));
    }
  },
  mounted () {
    let {params} = this.$route;
    if(params) {
      this.payOrderNo = params.payOrderNo;
      delete params.payOrderNo;
      this.paramMap = params;
    }

  },
  data () {
    return {
      payOrderNo:'',
      paramMap:{}
    }
  }
}
</script>

<style lang="less" scoped>
  .info{ line-height: 60px; margin-top: 40px; font-size: 18PX; color:red; font-weight: bold;  text-align: center; padding: 0 20px;}
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
</style>

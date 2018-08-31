<template>
<div class="wrapper">
  <p class="noice display1line fs12">{{casherTitle}}</p>
  <div v-if="checkoutCounter" class="block b1">
    <p v-if="checkoutCounter.merchantDiscountAmount>0"><span>商家优惠:</span> &yen;{{checkoutCounter.merchantDiscountAmount | money}}</p>
    <p><span>还需支付:</span> &yen;{{checkoutCounter.needToPayAmount | money}}</p>
    <p class="gray"><span>订单金额:</span> &yen;{{checkoutCounter.orderAmount | money}}</p>
    <p class="gray"><span>已支付:</span> &yen;{{checkoutCounter.orderAmountPaid | money}}</p>
  </div>

  <group class="group" v-if="checkoutCounter">
    <x-input type="number" title="本次支付:" label-width="3" @on-blur="blur" v-model="needToPayAmount" :required="true"></x-input>
  </group>

  <div class="select">选择支付方式</div>

  <div class="block b3">
    <p v-for="(item, index) in list" @click="payType=item.payTypeKey" :key="index"
       v-if="item.payTypeKey != 'jjq_h5' || (item.payTypeKey === 'jjq_h5' && checkoutCounter && checkoutCounter.isAllowJJQ===1)">
      <mj-audio v-model="payType" :value="item.payTypeKey" />
      <img v-if="item.payTypeKey === 'jjq_h5'" src="./images/hd.png">
      <img v-if="item.payTypeKey === 'wx_jsapi'" src="./images/wx.png">
      <img v-if="item.payTypeKey === 'ali_wap'" src="./images/alipay.png">
      <img v-if="item.payTypeKey === 'lakala_pos'" src="./images/lkl.png">
      <img v-if="item.payTypeKey === 'mock_h5'" src="./images/test_pay.png">
      {{item.payTypeTitle}}
    </p>
  </div>

  <div class="payBtn fs16" @click="checkPay">
    立即支付
  </div>
</div>
</template>

<script>
import {CheckIcon, InlineXNumber, Icon, XInput, Group, ToastPlugin, AlertModule} from 'vux'
import http from '@/http'
import {Audio} from '@/components'
import Vue from 'vue'
import wx from '@/lib/wxTools'
Vue.use(ToastPlugin, {position: 'top', width: '12em'})

export default {
  components: {
    InlineXNumber,
    CheckIcon,
    Icon,
    mjAudio: Audio,
    XInput,
    Group
  },
  methods: {
    init () {
      http('ht-mj-order-server/order/wx/checkoutCounter', {orderSn: this.$route.params.orderSn}).then((res) => {
        this.checkoutCounter = res
        this.needToPayAmount = (res.needToPayAmount / 100).toFixed(2)
        this.minPrePayAccount = (res.minPayAmount / 100).toFixed(2)

        if (res.needToPayAmount === 0) {
          //          this.$router.push(`/Order/detail/${res.orderId}`)
          this.$router.push(`/Pay/result/diy_pay/${res.orderId}?is_success=T`)
        } else {
          this.cashierBySystemType()
        }
      })

      this.casherTitleApi()
    },
    cashierBySystemType () {
      http('payment-api/pay/cashierBySystemType', {source: 'mj_h5', systemType: 1}, {includeApi: true}).then(
        (data) => {
          data = data.filter((v) => { return v.payTypeIsValid === 1 })

          data = data.sort((v1, v2) => {
            return v2.rate - v1.rate
          })

          data = data.map((v) => {
            switch (v.payTypeKey) {
              case 'jjq_h5':
                v.payTypeTitle = '恒大品牌家居券'
                v.src = './images/hd.png'
                break
              case 'wx_jsapi':
                v.payTypeTitle = '微信支付'
                v.src = './images/wx.png'
                break
              case 'ali_wap':
                v.payTypeTitle = '支付宝支付'
                v.src = './images/alipay.png'
                break
              case 'lakala_pos':
                v.payTypeTitle = '拉卡拉POS机刷卡支付'
                v.src = './images/lkl.png'
                break
              case 'mock_h5':
                v.payTypeTitle = '测试模拟支付'
                break
            }
            return v
          })

          this.list = data
          if (data.find((v) => { return v.payTypeKey === 'jjq_h5' })) {
            this.payType = 'jjq_h5'
          } else if (data.find((v) => { return v.payTypeKey === 'wx_jsapi' })) {
            this.payType = 'wx_jsapi'
          } else if (data.find((v) => { return v.payTypeKey === 'ali_wap' })) {
            this.payType = 'ali_wap'
          } else if (data.find((v) => { return v.payTypeKey === 'lakala_pos' })) {
            this.payType = 'lakala_pos'
          } else if (data.find((v) => { return v.payTypeKey === 'mock_h5' })) {
            this.payType = 'mock_h5'
          }
        })
    },
    checkPay () {
      this.blur(this.needToPayAmount)
      if (this.warnTips) {
        return false
      }

      http('ht-mj-order-server/order/wx/payOrder', {orderSn: this.$route.params.orderSn, money: parseInt(this.needToPayAmount * 100), paymentMethodCode: this.payType}).then((res) => {
        if (res) {
          this.pay(res)
        }
      }, (e) => {
        e.callback = () => {
          if (e.busCode === 745 || e.busCode === 740) {
            this.$router.push(`/UserCenter`)
          }
        }
      })
    },
    pay (payOrderNo) {
      let paramMap = {payOrderNo: payOrderNo, payTypeKey: this.payType, clientIp: '0.0.0.0', userId: this.checkoutCounter.userId, appMainBody: 3, showUrl: location.protocol + '//' + location.host, returnUrl: location.protocol + '//' + location.host + '/Pay/result/' + this.payType + '/' + payOrderNo, phone: this.checkoutCounter.userMobile}
      if (window.wxInfo && window.wxInfo.openid) {
        paramMap['openId'] = window.wxInfo.openid
      }

      http('payment-api/pay/dopay', {paramMap: paramMap}, {includeApi: true}).then(
        (data) => {
          if (data.fail === true && data.errCode === '2800006') {
            AlertModule.show({
              content: '该支付方式暂不可用，请选择其他支付方式'
            })
            return
          } else if (data.fail === true) {
            AlertModule.show({
              content: data.errCodeDes
            })
            return
          }

          if (this.payType === 'ali_wap') {
            let url = data.signParamMap.payServiceUrl + '?' + data.signParamMap.payInfo
            this.$router.push({path: '/Pay/alipay', query: {url: encodeURIComponent(url)}})
          } else if (this.payType === 'jjq_h5') {
            let {payServiceUrl, org_order, username, order_info} = data.signParamMap

            let turnForm = document.createElement('form')
            turnForm.style.display = 'none'
            document.body.appendChild(turnForm)
            turnForm.method = 'post'
            turnForm.action = payServiceUrl

            var newElement1 = document.createElement('input')
            newElement1.setAttribute('name', 'org_order')
            newElement1.setAttribute('type', 'input')
            newElement1.setAttribute('value', org_order)

            var newElement2 = document.createElement('input')
            newElement2.setAttribute('name', 'username')
            newElement2.setAttribute('type', 'input')
            newElement2.setAttribute('value', username)

            var newElement3 = document.createElement('input')
            newElement3.setAttribute('name', 'order_info')
            newElement3.setAttribute('type', 'input')
            newElement3.setAttribute('value', order_info)

            turnForm.appendChild(newElement1)
            turnForm.appendChild(newElement2)
            turnForm.appendChild(newElement3)

            turnForm.submit()
          } else if (this.payType === 'lakala_pos') {
            if (data.signParamMap) {
              let orderSn = this.$route.params.orderSn
              this.$router.push(`/Pay/lkl/${orderSn}/${data.signParamMap.orderID}/${this.needToPayAmount}`)
            }
          } else if (this.payType === 'wx_jsapi') {
            let opt = {
              timestamp: data.signParamMap.timeStamp,
              nonceStr: data.signParamMap.nonceStr,
              package: data.signParamMap.package,
              signType: data.signParamMap.signType,
              paySign: data.signParamMap.paySign,
              success: function (res) {
                if (res && res.errMsg && res.errMsg === 'chooseWXPay:ok') {
                  location.href = `/Pay/result/wx_jsapi/${payOrderNo}?is_success=T`
                } else {
                  location.href = `/Pay/result/wx_jsapi/${payOrderNo}?is_success=F`
                }
              }
            }
            wx.pay(opt)
          } else if (this.payType === 'mock_h5') {
            let signParamMap = data.signParamMap
            if (signParamMap) {
              this.$router.push('/Pay/mockTest/' + payOrderNo + '/' + encodeURIComponent(signParamMap['notifyUrl']) +
                '/' + signParamMap['payAmount'] + '/' + signParamMap['signMsg'] + '/' + signParamMap['transactionId'])
            }
          }
        }

      )
    },
    blur (value) {
      this.needToPayAmount = Number(value).toFixed(2)

      value = parseInt(value * 100)
      let minPrePayAccount = parseInt(this.minPrePayAccount * 100)
      if (value > this.checkoutCounter.needToPayAmount) {
        this.needToPayAmount = (this.checkoutCounter.needToPayAmount / 100).toFixed(2)
      } else if (this.checkoutCounter.needToPayAmount < minPrePayAccount && value !== this.checkoutCounter.needToPayAmount) {
        this.warnTips = `待支付金额小于${this.minPrePayAccount}元，必须全额支付`
        this.minPrePayAccount = this.checkoutCounter.needToPayAmount
      } else if (this.checkoutCounter.needToPayAmount >= minPrePayAccount && value < minPrePayAccount) {
        this.warnTips = `单次支付金额必须大于等于${this.minPrePayAccount}元`
        this.needToPayAmount = this.minPrePayAccount
      } else if (value > 10000000) {
        this.warnTips = `单笔支付最大金额10万元`
        this.needToPayAmount = (10000000 / 100).toFixed(2)
      } else {
        this.warnTips = undefined
      }

      if (this.warnTips) {
        this.$vux.toast.text(this.warnTips)
      }
    },
    casherTitleApi () {
      http('ht-mj-cms-server/setting/getValueByKey/casherTitle').then((res) => {
        this.casherTitle = res.value
      })
    }
  },
  mounted: function () {
    this.init()
  },
  data () {
    return {
      isMoney: function (val) {
        return {valid: /^\d{1,12}(?:\.\d{1,2})?$/.exec(val), msg: '请输入金钱格式'}
      },
      payType: 'jjq_h5',
      list: [],
      checkoutCounter: undefined,
      needToPayAmount: undefined,
      casherTitle: undefined,
      warnTips: undefined
    }
  }
}
</script>

<style lang="less" scoped>

.wrapper{
  height:fill-available;
  background:#F3F4F5;
}
.wrapper /deep/ .vux-check-icon{
  position:absolute;
  left:-68px;
  top:55px;
  transform:scale(0.9);
}
.wrapper .group /deep/ .weui-cells:before{
  border-top:none;
}
.wrapper .group /deep/ .weui-cells:after{
  border-bottom:none;
}

.noice{
  background:#FFFBF0;
  color:#C6A857;
  padding-left:20px;
  line-height:80px;
  height:80px;
  padding-right:20px;
  i{
    margin-right:15px;
  }
}
.select{
  color:#6B6A72;
  padding:38px 0 16px 20px;
}
.block{
  padding:20px 38px;
  margin-bottom:10px;
  background:#fff;
}
.block.b1{
  p{
    span{
      width:170px;
      display:inline-block;
    }
  }
  p:nth-of-type(1){
    margin-bottom:8px;
    color:#222222;
  }
  p:nth-of-type(2){
    margin-bottom:8px;
    color:#222222;
  }
  p:nth-of-type(3) span{
    color:#222222;
  }
  p:nth-of-type(4) span{
    color:#222222;
  }
}
.block.b2{
  p{
    color:#A1A7AE;
    span{
      width:170px;
      display:inline-block;
      color:#222222;
    }
  }
}
.block.b3{
  padding:29px 0 129px 20px;
  img{
    vertical-align:top;
    margin:0 20px 0 30px;
  }
  p{padding:26px 0;border-bottom:1px #EBEBEB solid;}
  p:first-of-type{
    padding-top:0;
  }
  p:last-of-type{
    padding-bottom:0;
    border:none;
  }
  p:nth-of-type(1) img{
    width:152px;
    height:42px;
  }
  p:nth-of-type(2) img{
    width:120px;
    height:42px;
  }
  p:nth-of-type(3) img{
    width:142px;
    height:42px;
  }
  p:nth-of-type(4) img{
    width:144px;
    height:42px;
  }
  p:nth-of-type(5) img{
    width:146px;
    height:42px;
  }
  p:nth-of-type(6) img{
    width:132px;
    height:42px;
  }
}

.gray{
  color:#a1a7ae!important;
  span{ color:#222;}
}
.payBtn{
  position:fixed;
  left:0;
  bottom:0;
  width:100%;
  background:#FFB000;
  color:#fff;
  text-align:center;
  line-height:100px;
}
</style>

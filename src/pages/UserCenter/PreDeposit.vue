<template>
<div class="wrapper">
  <head-nav></head-nav>
  <tab :line-width="2" custom-bar-width="20px" active-color="#222222" default-color="#6B6A72">
  <tab-item selected @on-item-click="deposit">预存款</tab-item>
  <tab-item @on-item-click="wallet">钱包</tab-item>
  </tab>
  <div class="block">
    <p>余额</p>
    <p>{{data.balance | money}}</p>
    <p v-if="type===1">有效期：{{data.validityEnd | date}}</p>
  </div>
  <p class="title">收支细明</p>
  <ul v-for="item in list" :key="item.entryId" >
    <li>{{item.ruleName}} <span class="fr">{{item.dealAmount>0?"+":""}}{{item.dealAmount | money}}</span></li>
    <li class="fs12">{{item.orderId}} <span class="fr">{{item.createdTime | date('yyyy-MM-dd hh:mm')}}</span></li>
  </ul>
  <divider class="divider">没有更多了</divider>
</div>
</template>

<script>
import {
  Tab, TabItem, Divider
} from 'vux'
import http from '@/http'
import {headNav} from '@/components'

export default {
  components: {
    TabItem,
    Tab,
    Divider,
    'head-nav':headNav
  },
  methods: {
    portalpredepositdeal (currPage = 1, pageSize = 9999) {
      http('ht-mj-account-server/portalpredepositdeal', {currPage, pageSize}).then((suc) => {
        this.predepositList = suc.dataList
        this.list = this.predepositList
      })
    },
    getPaypredeposit () {
      http('ht-mj-account-server/portalpredeposit').then((suc) => {
        this.predeposit = suc
        this.data = this.predeposit
      })
    },
    getPortalwallet () {
      http('ht-mj-account-server/portalwallet').then((suc) => {
        this.portalwallet = suc
      })
    },
    portalwalletdeal (currPage = 1, pageSize = 9999) {
      http('ht-mj-account-server/portalwalletdeal').then((suc) => {
        this.portalwalletList = suc.dataList
      })
    },
    deposit () {
      this.list = this.predepositList
      this.data = this.predeposit
      this.type = 1
    },
    wallet () {
      this.list = this.portalwalletList
      this.data = this.portalwallet
      this.type = 2
    }
  },
  mounted: function () {
    this.portalpredepositdeal()
    this.getPaypredeposit()
    this.getPortalwallet()
    this.portalwalletdeal()
  },
  data () {
    return {
      predeposit: {},
      predepositList: {},
      portalwallet: {},
      portalwalletList: {},
      type: 1,
      list: [],
      data: {}
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper /deep/ .vux-tab .vux-tab-item {font-size:12PX;}
.wrapper /deep/ .divider {font-size:12PX;color:#6B6A72;padding:30px 0;}
.wrapper {
  background:#F3F4F5;
  min-height:-webkit-fill-available;
}
.block{
  padding:30px 0 23px 0;
  background:#fff;
  text-align:center;
  p:nth-of-type(1){font-size:12PX;}
  p:nth-of-type(2){font-size:20PX;}
  p:nth-of-type(3){font-size:12PX;color:#6B6A72;}
}
.title{
  margin:52px 0 20px 20px;
  color:#6B6A72;
}
ul{
  padding:0 0 24px 20px;
  background:#fff;
  li{margin-right:24px;padding-left:6px;}
  li:nth-child(2){
    color:#A1A7AE;
    border-bottom:1px solid #EBEBEB;
    padding:25px 0 30px 0;
    overflow:hidden;
  }
}
ul:first-of-type{
  padding-top:24px;
}
ul:last-of-type li{
  border-bottom:none;
}


</style>

<template>
<div class="wrapper">
  <head-nav></head-nav>
  <tab :line-width="2" custom-bar-width="20px" active-color="#222222" default-color="#6B6A72">
  <tab-item selected @on-item-click="getList(2)">最近一个月的订单</tab-item>
  <tab-item @on-item-click="getList(1)">一个月前的订单</tab-item>
  </tab>
  <template v-if="list && list.length>0">
  <div class="block" v-for="item in list" :key="item.orderSn">
    <p class="head halfpx_buttom">
    <flexbox :gutter="0">
    <flexbox-item span="20">
    <i class="order-home"></i>
    </flexbox-item>
    <flexbox-item>
    <span class="title display1line store" @click="gotoStore(item.merchantGoodsList[0]['merchantId'])">{{(item.parentOrderSn===''&& item.orderGoodsType!==3)?'恒腾密蜜家居平台':item.merchantGoodsList[0]['merchantName']}}<i class="fa fa-angle-right" :style="{marginLeft:'10px'}"></i></span>
    </flexbox-item>
    <flexbox-item span="70">
    <span class="status fr">{{item.orderStatus | option(orderStatusListOpt)}}</span>
    </flexbox-item>
    </flexbox>
    </p>
    <router-link :to="'/Order/detail/'+item.orderId">
    <template v-if="item.orderGoodsType===3&&[4,5,6].indexOf(item.orderStatus)>-1">
    <good-item
    :goodsList="item.merchantGoodsList[0].wxOrderGoodsVOList.filter((v)=>{return v.isRemark===2})"
    :goodsTypeOpt="goodsTypeOpt" :canLink="false"
    :showDiscount="item.orderGoodsType!==3&&item.orderStatus>=4&&item.orderStatus<7"
    :showPasteArr="[3]"
    :showPrice="item.orderGoodsType!==3"
    >
    </good-item>
    </template>
    <template v-else-if="checkGoodNum(item)>1">
    <div class="content">
      <div class="fl" v-for="merchant in item.merchantGoodsList" :key="merchant.merchantId">
        <template v-if="item.orderGoodsType === 3" >
        <div  v-for="goods in merchant.wxOrderGoodsVOList.slice(0,4)" v-show="(goods.isRemark===1)" class="fl imgbox" :style="{backgroundImage:'url('+imgFormat(goods.mainImgUrl, '160X160')+')'}" :key="goods.goodsId" ></div>
        </template>
        <template v-else>
        <div v-for="goods in merchant.wxOrderGoodsVOList.slice(0,4)" class="fl imgbox" :style="{backgroundImage:'url('+imgFormat(goods.mainImgUrl, '160X160')+')'}" :key="goods.goodsId"></div>
        </template>
      </div>
    </div>
    </template>
    <template v-else>
    <div class="content" v-for="merchant in item.merchantGoodsList" :key="merchant.merchantId">
      <template v-if="merchant.wxOrderGoodsVOList[0]">
      <div class="fl imgbox" :style="{backgroundImage:'url('+imgFormat(merchant.wxOrderGoodsVOList[0].mainImgUrl, '160X160')+')'}"></div>
      <template>
      <span class="price" v-if="item.orderGoodsType===3 && item.orderStatus===1 && item.depositAmountPaid>0">部分支付</span>
      <span class="price" v-if="item.orderGoodsType===3 && item.orderStatus===3 && item.remainAmountPaid>0">部分支付</span>
      <span class="price" v-if="item.orderGoodsType!==3 && item.orderStatus===1 && item.orderAmountPaid>0">部分支付</span>
      <template v-else>
      <span v-show="item.orderGoodsType !== 3" class="price">¥{{merchant.wxOrderGoodsVOList[0].salePrice | money}}</span>
      <p class="p2 display1line">{{merchant.wxOrderGoodsVOList[0].propertyValue}}</p>
      <span class="num">x{{merchant.wxOrderGoodsVOList[0].goodsNum}}</span>
      </template>
      </template>
      <p class="p1 display2line">{{merchant.wxOrderGoodsVOList[0].goodsName}}</p>
      </template>
    </div>
    </template>
    </router-link>
    <p class="cb"></p>
    <div class="tips halfpx_top">
      <template v-if="item.orderStatus===1 && item.orderGoodsType===3 && item.depositAmountPaid===0 && item.orderAmountReal+item.transportFee > 0 ">
      共{{item.goodsTotalNum}}件商品，待付定金:
      <span>¥{{item.orderAmountReal+item.transportFee | money}}</span>
      </template>
      <template v-else-if="item.orderStatus===2">
      共{{item.goodsTotalNum}}件商品，已付定金:
      <span>¥{{item.depositAmountPaid>item.orderAmountReal?item.orderAmountReal:item.depositAmountPaid | money}}</span>
      </template>
      <template v-else-if="item.orderStatus===3 && item.remainAmountPaid === 0 &&item.orderAmountReal+item.transportFee-item.orderAmountPaid>0">
      共{{item.goodsTotalNum}}件商品，待付尾款:
      <span>¥{{item.orderAmountReal+item.transportFee-item.orderAmountPaid | money}}</span>
      </template>
      <template v-else-if="(item.orderStatus===1 || item.orderStatus===3 ) && item.orderAmountPaid>0">
      共{{item.goodsTotalNum}}件商品，还需支付:
      <span>¥{{item.orderAmountReal+item.transportFee-item.orderAmountPaid | money}}</span>
      </template>
      <template v-else>
      共{{item.goodsTotalNum}}件商品，合计:
      <span>¥{{item.orderAmountReal | money}}</span>
      </template>
      <br>
      <div v-if="item.orderStatus===1 && item.orderAmountPaid===0" class="fr pay"><a :href="`/Pay/${item.orderSn}`">支付</a></div>

      <div v-if="item.orderGoodsType!=3 && item.orderStatus===1 &&item.orderAmountPaid>0&&item.orderAmountPaid<item.orderAmountReal" class="fr pay">
        <a :href="`/Pay/${item.orderSn}`">
        继续支付
        </a>
      </div>
      <div v-if="item.orderGoodsType===3 && item.orderStatus===1&&item.depositAmountPaid>0&&item.orderAmountPaid<item.orderAmountReal" class="fr pay">
        <a :href="`/Pay/${item.orderSn}`">
        继续支付
        </a>
      </div>
      <div v-if="item.orderGoodsType===3 && item.orderStatus===3 &&item.remainAmountPaid>0&&item.orderAmountPaid<item.orderAmountReal" class="fr pay">
        <a :href="`/Pay/${item.orderSn}`">
        继续支付
        </a>
      </div>

      <div v-else-if="item.orderStatus===3&&item.remainAmountPaid===0&&item.remainAmount>0" class="fr pay"><a :href="`/Pay/${item.orderSn}`">付尾款</a></div>
      <div v-else-if="item.orderStatus===5" class="fr pay" @click="keyUp(item.orderSn)"><a>签收</a></div>
    </div>
  </div>
  </template>
  <template v-if="list && list.length==0">
  <div class="order-empty">
    <img src="./images/empty.png" alt="empty">
    <p>你还没有相关的订单</p>
    <div class="btn">
      <router-link to="/Mall" >去购物</router-link>
    </div>
  </div>
  </template>
</div>
</template>

<script>
import {
  ConfirmPlugin, Tab, TabItem, XHeader, Flexbox, FlexboxItem
} from 'vux'
import http from '@/http'
import {orderStatusListOpt, goodsTypeOpt} from './js/attr'
import Vue from 'vue'
import goodsItem from './components/goodsItem'
import {headNav} from '@/components'
import mixin from '@/lib/mixins/drop-down'

Vue.use(ConfirmPlugin)

export default {
  mixins: [mixin],
  components: {
    TabItem, Tab, XHeader, ConfirmPlugin, Flexbox, FlexboxItem, 'good-item': goodsItem, 'head-nav': headNav
  },
  methods: {
    checkGoodNum (merchant) {
      let count = 0
      merchant.merchantGoodsList.forEach((v) => {
        v.wxOrderGoodsVOList.forEach((v2) => {
          count++
        })
      })

      return count
    },
    getList (timeRange, isDrop) {
      if (this.isDropEnd && isDrop) return;
      let range = 1;
      if(timeRange){
        range = timeRange;
      }else if(this.searchData.timeRange){
        range = this.searchData.timeRange;
      }
      let data = {timeRange: range, currentPage: this.searchData.currentPage ? isDrop ? ++this.searchData.currentPage : 1 : 1, pageSize: 10}
      this.searchData = data

      http('ht-mj-order-server/order/wx/list', {wxOrderQueryVO: data}).then((suc) => {
        this.list = this.list || []

        let list = suc.dataList.map((v, i) => {
          v.remarkgoodsNum = 0
          v.merchantGoodsList.map((merchant, j) => {
            merchant.wxOrderGoodsVOList = merchant.wxOrderGoodsVOList.map((goods, k) => {
              if (goods.isRemark === 1) {
                v.remarkgoodsNum += goods.goodsNum
                v.goodsTotalNum = v.remarkgoodsNum
                goods.mainImgUrl = goods.mainImgUrl || '/static/goods-default.png'
              }
              return goods
            })
          })
          return v
        })

        if (isDrop) {
          this.list = this.list.concat(list)
        } else {
          this.list = list
        }

        this.isDropEnd = list.length === 0
      })
    },
    receipt (orderSn) {
      http('ht-mj-order-server/order/wx/receipt', {orderSn}).then((res) => {
        this.getList()
      })
    },
    keyUp (orderSn) {
      this.$vux.confirm.show({
        content: '请确认收到商品后再签收 ？',
        onConfirm: () => {
          this.receipt(orderSn)
        }
      })
    },
    gotoStore (merchantId) {
      if (merchantId !== 0) {
        this.$router.push(`/Search/Store/${merchantId}`)
      }
    },
    dropDownEnd () {
      this.getList(undefined, 1)
    }
  },
  mounted: function () {
    this.getList(2)
  },
  data () {
    return {
      list: null,
      orderStatusListOpt,
      goodsTypeOpt,
      searchData: {}
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper{background-color:#F3F4F5;min-height:-webkit-fill-available;}

.wrapper /deep/ .vux-tab .vux-tab-item {font-size:12PX;}

.order-home{
  background:url(./images/house.png) no-repeat;
  background-size:26px;
  width:26px;
  height:26px;
  display:inline-block;
  vertical-align:middle;
}

.order-empty{
  text-align:center;
  img{
    margin-top:175px;
    width:240px;
    height:240px;
  }
  p{
    color:#6B6A72;
  }
  .btn{
    width:240px;
    margin:0 auto;
    border:1px #979797 solid;
    line-height:80px;
    border-radius:40px;
    margin-top:40px;
  }
}
.block{
  padding:0 20px;
  background:#fff;
  margin:10px 0;
  .head{
    color:#222222;
    font-size:12PX;
    overflow:hidden;
    line-height:76px;
    i{margin-right:6px;}
    .status{
      color:#6B6A72;
    }
    .store{
      line-height: 28px;
      max-height: 28px;
    }
  }
  .imgbox{
    width:160px;
    height:160px;
    margin-right:20px;
    background-size:contain;
    background-repeat:no-repeat;
    background-position:center;
  }
  .imgbox:last-of-type{margin-right:0;}
  .content{
    overflow:hidden;
    position:relative;
    margin:24px 0;
    .p1{
      margin-left:190px;
      line-height: 38px;
      max-height: 76px;
    }
    .price{
      float:right;
      margin-left:20px;
    }
    .p2{
      position:absolute;
      bottom:0px;
      font-size:12PX;
      margin-left:190px;
      color:#A1A7AE;
      margin-right:30px;
      line-height:12PX;
    }
    .num{
      position:absolute;
      bottom:0;
      right:0;
      color:#222222;
      line-height:14PX;
    }

  }
  .tips{font-size:12PX;
    line-height:80px;
    text-align:right;
    overflow:hidden;
    color:#A1A7AE;
    span{
      font-size:16PX;
      color:#222222;
      margin-left:15px;
    }
    .pay{
      width:146px;
      height:56px;
      border:#F5A623 1px solid;
      border-radius:40px;
      text-align:center;
      line-height:60px;
      margin-bottom:10px;
      a{
        color:#F5A623;
        width:100%;
        height:100%;
        display:inline-block;
      }
    }
  }
}
</style>

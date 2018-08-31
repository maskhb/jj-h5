<template>
<div class="wrapper" v-if="data">
  <x-header title="物流详情" :left-options="{backText: ''}"></x-header>
  <tab :line-width=2 active-color='#222222' custom-bar-width="20px" v-model="tabIndex">
  <tab-item class="vux-center" v-for="(item, index) in tab" :key="index" @on-item-click="aa">{{item}}</tab-item>
  </tab>
  <div class="info" v-if="data.logisticsNumber && data.logisticsCompany" @click="aa">
    快递单号：{{data.logisticsNumber}}<br>
    国内承运人：{{data.logisticsCompany}}
  </div>

  <good-item class="box" v-if="hackReset" :goodsList="data.orderGoodsVOList" :canLink="true" :showPrice="true"></good-item>
  <timeline  v-if="data.logisticsItemList && data.logisticsItemList.length>0">
  <timeline-item v-for="(item, index) in data.logisticsItemList" :key="index">
  <h4 class="recent">{{item.context}}</h4>
  <p class="recent">{{item.time}}</p>
  </timeline-item>
  </timeline>
</div>
</template>

<script>
import {
  Tab, TabItem, XHeader, Timeline, TimelineItem
} from 'vux'
import goodsItem from './components/goodsItem'
import http from '@/http'

export default {
  components: {
    TabItem,
    Tab,
    XHeader,
    'good-item': goodsItem,
    Timeline,
    TimelineItem
  },
  methods: {
    getExpress () {
      http('ht-mj-order-server/order/wx/logisticsDetail', {orderId: this.$route.params.Id}).then((res) => {
        this.list = res
        this.list = this.list.map((v, index) => {
          v.merchantId = index
          v.index = index
          v.wxOrderGoodsVOList = v.orderGoodsVOList.map((v) => {
            return {
              goodsName: v.goodsName,
              mainImgUrl: v.mainImgUrl,
              goodsType: v.goodsType,
              propertyValue: v.propertyValue,
              goodsNum: v.goodsNum
            }
          })
          return v
        })
        this.data = res[0]
        this.currentIndex = 0
        this.tab = this.list.map((v, index) => {
          return '包裹' + (index + 1)
        })
      })
    },
    aa (index) {
      if (index !== this.currentIndex) {
        this.data = this.list[index]
        this.currentIndex = index

        this.hackReset = false
        this.$nextTick(() => {
          this.hackReset = true
        })
      }
    }
  },
  mounted: function () {
    this.getExpress()
  },
  data () {
    return {
      data: undefined,
      hackReset: true,
      tabIndex: 0,
      currentIndex: 0,
      list: [],
      tab: []
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper{
  margin-bottom:20px;
  background:#F3F4F5;
  height:fill-available;
  /deep/ .vux-timeline{
    padding:40px 0 0 27px;
    background:#fff;
  }
  /deep/ .vux-timeline-item-content{
    padding:0 0 0.5rem 0.8rem;

    h4{
      color:#222222;
      font-size:14px;
    }
    p{
      color:#A1A7AE;
      font-size:12px;
    }
  }

  /deep/ .vux-tab{
    height:40PX;
    .vux-tab-item{
      font-size:12PX;
      line-height:40PX;
    }
  }
}
.info{
  padding:26px 20px;
  margin-bottom:10px;
  color:#6B6A72;
  background:#fff;
}
.box{
  padding:24px 0;
  background:#fff;
  margin-bottom:10px;
  border-bottom:10px solid #F3F4F5;
}
.block{
  padding:0 20px;
  background:#fff;
  margin-bottom:10px;
  .head{
    color:#222222;
    font-size:12PX;
    overflow:hidden;
    line-height:76px;
    border-bottom:1px #EBEBEB solid;
    i{margin-right:6px;}
    .status{
      color:#6B6A72;
    }
  }
  img{width:160px;height:160px;margin-right:20px;}
  img:last-of-type{margin-right:0;}
  .content{
    overflow:hidden;
    position:relative;
    .p1{
      width:374px;
      margin-left:190px;
    }
    .price{
      position:absolute;
      right:0;
      font-size:32px;
      color:#A1A7AE;
      top:0;
    }
    .p2{
      position:absolute;
      bottom:0px;
      font-size:12PX;
      margin-left:190px;
      color:#A1A7AE;
    }
    .num{
      position:absolute;
      bottom:0;
      right:0;
      color:#222222;
    }

  }
}
</style>

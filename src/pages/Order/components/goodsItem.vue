<template>
<div>
  <!--显示商家信息的商品列表-->
  <div class="block" v-if="merchantGoodsList" v-for="merchant in merchantGoodsList" :key="merchant.merchantId">
    <template v-if="!canLink">
      <p v-if="merchant.merchantName" class="head"><i class="fa fa-home"></i><span class="title ">{{merchant.merchantName}}</span></p>
    </template>
    <template v-else>
      <router-link v-if="merchant.merchantName" :to="`/Search/Store/${merchant.merchantId}`">
        <p class="head"><i class="order-home"></i><span class="title ">{{merchant.merchantName}}</span></p>
      </router-link>
    </template>
    <div class="content" v-for="goods in merchant.wxOrderGoodsVOList" v-if="goods.isRemark!==1" :key="goods.orderGoodsId">
      <template v-if="!canLink || goods.skuId<=0">
        <div class="contentInner">
          <div class="fl imgbox" :style="{backgroundImage:'url('+imgFormat(goods.mainImgUrl, '160X160')+')'}"></div>
          <div class="price" v-if="showPrice">
            <span class="sp1">¥{{goods.salePrice | money}}</span><br />
            <span v-if="showDiscount && goods.merchantDiscount!==0" class="sp2 fs12">-¥{{goods.merchantDiscount | money}}</span>
          </div>
          <p class="p1 display2line">
            <span style="color:#FFB000" v-if="showPasteArr && showPasteArr.indexOf(goods.goodsType) >= 0">{{goods.goodsType | option(goodsTypeOpt)}}</span>
            {{showPasteArr && showPasteArr.indexOf(goods.goodsType) >= 0 ? '|' : ''}}{{goods.goodsName}}
          </p>
          <p class="p2 display1line">{{goods.propertyValue}}</p>
          <span class="num">x{{goods.goodsNum}}</span>
        </div>
      </template>
      <template v-else>
        <router-link :to="`/Product/detail/${goods.skuId}`">
          <div class="contentInner">
            <div class="fl imgbox" :style="{backgroundImage:'url('+imgFormat(goods.mainImgUrl, '160X160')+')'}"></div>
            <div class="price" v-if="showPrice">
              <span class="sp1">¥{{goods.salePrice | money}}</span><br />
              <span v-if="showDiscount && goods.merchantDiscount!==0" class="sp2 fs12">-¥{{goods.merchantDiscount | money}}</span>
            </div>
            <p class="p1 display2line">
              <span style="color:#FFB000" v-if="showPasteArr && showPasteArr.indexOf(goods.goodsType) >= 0">{{goods.goodsType | option(goodsTypeOpt)}}</span>
              {{showPasteArr && showPasteArr.indexOf(goods.goodsType) >= 0 ? '|' : ''}}{{goods.goodsName}}
            </p>
            <p class="p2 display1line">{{goods.propertyValue}}</p>
            <span class="num">x{{goods.goodsNum}}</span>
          </div>
        </router-link>
      </template>
    </div>
  </div>
  <!--不显示商家信息的商品列表-->
  <div class="block" v-if="goodsListTmp">
    <div class="content" v-for="good in goodsListTmp" :key="good.skuId">
      <template v-if="!canLink || good.skuId<=0">
        <div class="contentInner">
          <div class="fl imgbox" :style="{backgroundImage:'url('+imgFormat(good.mainImgUrl, '160X160')+')'}"></div>
          <div class="price" v-if="showPrice">
            <span class="sp1">¥{{good.salePrice | money}}</span><br />
            <span v-if="showDiscount && good.merchantDiscount!==0" class="sp2 fs12">-¥{{good.merchantDiscount | money}}</span>
          </div>
          <p class="p1 display2line">
            <span style="color:#FFB000" v-if="showPasteArr && showPasteArr.indexOf(good.goodsType) >= 0">{{good.goodsType | option(goodsTypeOpt)}}</span>
            {{showPasteArr && showPasteArr.indexOf(good.goodsType) >= 0 ? '|' : ''}}{{good.goodsName}}
          </p>
          <p class="p2 display1line">{{good.propertyValue}}</p>
          <span class="num">x{{good.goodsNum}}</span>
        </div>
      </template>
      <template v-else>
        <router-link  :to="`/Product/detail/${good.skuId}`">
          <div class="contentInner">
            <div class="fl imgbox" :style="{backgroundImage:'url('+imgFormat(good.mainImgUrl, '160X160')+')'}"></div>
            <div class="price" v-if="showPrice">
              <span class="sp1">¥{{good.salePrice | money}}</span><br />
              <span v-if="showDiscount && good.merchantDiscount!==0" class="sp2 fs12">-¥{{good.merchantDiscount | money}}</span>
            </div>
            <p class="p1 display2line">
              <span style="color:#FFB000" v-if="showPasteArr && showPasteArr.indexOf(good.goodsType) >= 0">{{good.goodsType | option(goodsTypeOpt)}}</span>
              {{showPasteArr && showPasteArr.indexOf(good.goodsType) >= 0 ? '|' : ''}}{{good.goodsName}}
            </p>
            <p class="p2 display1line">{{good.propertyValue}}</p>
            <span class="num">x{{good.goodsNum}}</span>
          </div>
        </router-link>
      </template>
    </div>
  </div>
</div>
</template>
<script>
export default {
  props: {
    merchantGoodsList: Array,
    goodsTypeOpt: Object,
    order: Object,
    canLink: Boolean, // 是否可以跳转到商家和商品详情  默认为false，不可以
    goodsList: Array, // 只显示商品列表不显示商家信息时传入
    showDiscount: Boolean, // 是否显示商家优惠
    showPrice: Boolean, // 是否显示价格区域
    showPasteArr: Array // 标题旁边显示标签的商品类型集合
  },
  mounted () {
    if (this.goodsList) {
      this.goodsListTmp = this.goodsList.map(v => {
        v.mainImgUrl = v.mainImgUrl || '/static/goods-default.png'
        return v
      })
    }
  },
  methods: {
  },
  data () {
    return {
      goodsListTmp: undefined
    }
  }
}
</script>

<style lang="less" scoped>
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
  .imgbox{
    width:160px;
    height:160px;
    margin-right:20px;
    background-size:contain;
    background-repeat:no-repeat;
    background-position:center;
  }
  .imgbox:last-of-type{margin-right:20;}
  .content{
    .contentInner{
      overflow:hidden;
      position:relative;
      .p1{
        margin-left:190px;
      }
      .price{
        float:right;
        margin-left:20px;
        .sp2{
          color:#6B6A72;
        }
      }
      .p2{
        position:absolute;
        bottom:13px;
        font-size:12PX;
        margin-left:190px;
        color:#A1A7AE;
        margin-right:30px;
      }
      .num{
        position:absolute;
        bottom:8px;
        right:0;
        color:#222222;
      }
    }
    padding:24px 0;
   }
    .content:first-child{
      padding-top:0;
    }
}

.order-home{
  background:url(../images/house.png) no-repeat;
  background-size:26px;
  width:26px;
  height:26px;
  display:inline-block;
  vertical-align:middle;
}

</style>

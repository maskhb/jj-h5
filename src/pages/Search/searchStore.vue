
<template>
  <div :style="{height:clientHeight + 'px'}">
    <view-box ref="viewBox" body-padding-bottom="0" >
      <div ref="viewBoxBody">
        <search-header placeholder="搜索"></search-header>
        <div class="storeCover">
          <div class="imgDom">
            <img v-if="merchantBase.mainImgUrl" :src="merchantBase.mainImgUrl|imgFormat('750X240')"/>
          </div>
          <div class="storeLogo">
            <div class="imgDom">
              <img v-if="merchantBase.logoImgUrl" :src="merchantBase.logoImgUrl|imgFormat('60X60')"/>
            </div>
            <span>{{merchantBase.merchantName}}</span>
          </div>
        </div>
        <div style="height:44px;">
          <sticky  scroll-box="vux_view_box_body" :check-sticky-support="false">
            <tab :line-width="2">
              <tab-item @on-item-click="priceSort" selected>综合</tab-item>
              <tab-item @on-item-click="priceSort">销量</tab-item>
              <tab-item @on-item-click="priceSort">
                <span class="price" :class="priceClass">价格</span>
              </tab-item>
              <tab-item disabled @click.native="filtrate">
                <span class="filter" :class="{selected:isFilter}">筛选</span>
              </tab-item>
            </tab>
          </sticky>
        </div>

        <!--套餐-->
        <ul class="comboList">
          <li v-if="packageList" v-for="(item, index) in packageList" :key="index">
            <router-link :to="'/Product/ComboDetail/' + item.packageId">
              <div class="imgDom">
                <img :src="item.mainImgUrl|imgFormat('640X300')"/>
              </div>
              <div class="comboTitle display1line">
                {{item.packageName}}
              </div>
              <div class="comboPrice">
                <span>套餐价</span><b>&yen;{{item.totalPrice|money}}</b>
              </div>
              <ul class="tagList" v-if="item.houseTypeShow">
                <li v-for="(tag, tIndex) in item.decorateStyleTShow" :key="'t1_' + tIndex">{{tag.tagName}}</li>
                <li v-for="(tag, tIndex) in item.houseTypeShow" :key="'t2_' + tIndex">{{tag.tagName}}</li>
              </ul>
            </router-link>
          </li>
        </ul>

        <!--商品-->
        <div class="productList">
          <ul>
            <li v-for="product in productList">
              <router-link :to="'/Product/Detail/' + product.skuId">
                <div class="imgDom"><img v-if="product && product.goodsImgVos" v-lazy="imgFormat(product.goodsImgVos[0].imgUrl, '320X320')"/></div>
                <div class="title">{{product.goodsName}}</div>
                <div class="productPrice">
                  &yen;{{product.salePrice|money}}
                </div>
              </router-link>
            </li>
          </ul>
          <load-more :tip="productPager.finish?'没有更多了':''" :show-loading="!productPager.finish"></load-more>
        </div>
      </div>
    </view-box>

    <div v-transfer-dom>
      <popup v-model="filterVisiable" position="right"  width="80%">
        <div class="filterDialog" lock-x :scrollbar-y=false :bounce=false>
          <scroller lock-x :scrollbar-y=false :bounce=false>
            <ul class="drawerList">
              <li v-for="(pItem, pIndex) in drawerList" :key="pIndex">
                <h1>
                  {{pItem.value}}
                  <a v-if="pItem.goodsScreenAttrVos.length>3" class="hideBtn" @click="pItem.expand = !pItem.expand">{{pItem.expand?'收起':'全部'}}<i class="fa" :class="{'fa-angle-down':!pItem.expand, 'fa-angle-up':pItem.expand}"></i></a>
                </h1>
                <ul class="categoryList">
                  <li :class="{current:item.isSelected, hide:pItem.expand===false &&index>2}" v-for="(item,index) in pItem.goodsScreenAttrVos" :key="index" @click="selectCategory(pIndex, index)">{{item.name}}</li>
                </ul>
              </li>
            </ul>
          </scroller>
          <div class="optionsBar">
            <flexbox :gutter="0">
              <flexbox-item :span="2/5">
                <a class="cleanSelect" @click="cleanSelect">清除条件</a>
              </flexbox-item>
              <flexbox-item :span="3/5">
                <a class="selectOk" @click="filterOk">确定</a>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
      </popup>
    </div>
    <a class="stickBtn" v-if="showStick" @click="goTop"></a>
  </div>
</template>

<script>
  import SearchStore from './js/searchStore.js';
  export default SearchStore;
</script>
<style lang="less" scoped>
  @import './css/style.less';

</style>

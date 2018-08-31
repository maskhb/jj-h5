
<template>
  <div :style="{height:clientHeight + 'px'}">
    <view-box ref="viewBox" body-padding-bottom="0">
      <div ref="viewBoxBody">
        <search-header placeholder="搜索"></search-header>

        <!--<swiper height="100px" :list="bannerList" auto loop></swiper>-->
        <div class="imgDom h_200">
          <img :src="category.categoryUrl|imgFormat('750X200')">
        </div>

        <div style="height:44px;">
          <sticky  scroll-box="vux_view_box_body" :check-sticky-support="false">
            <tab :line-width="1">
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
        <div class="productList">
          <ul>
            <li v-for="product in productList">
              <router-link :to="'/Product/Detail/' + product.skuId">
                <div class="imgDom"><img v-if="product && product.goodsImgVos" :src="product.goodsImgVos[0].imgUrl|imgFormat('320X320')"/></div>
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
        <div class="filterDialog">
          <scroller lock-x :scrollbar-y=false :bounce=false>
            <ul class="drawerList">
              <li v-for="(pItem, pIndex) in drawerList" :key="pIndex">
                <h1>
                  {{pItem.value}}
                </h1>
                <ul class="categoryList">
                  <li :class="{current:item.isSelected}" v-for="(item,index) in pItem.goodsScreenAttrVos" :key="index" @click="selectCategory(pIndex, index)">{{item.name}}</li>
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
  import SearchList from './js/searchList.js';
  export default SearchList;
</script>
<style lang="less" scoped>
  @import './css/style.less';

</style>

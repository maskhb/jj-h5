
<template>
  <div :style="{height:clientHeight + 'px'}">
    <view-box ref="viewBox" body-padding-bottom="0" >
      <div ref="viewBoxBody">
        <MJSearch :text="searchTxt" no-link @search="search"></MJSearch>
        <tab :line-width="2" custom-bar-width="60px" active-color='#222'>
          <tab-item @on-item-click="changeType" :selected="selectedType==0">商品</tab-item>
          <tab-item @on-item-click="changeType" :selected="selectedType==1">店铺</tab-item>
        </tab>
        <div v-if="selectedType==0">
          <div v-if="(productList && productList.length>0) || productPager.hasPost==false">
            <div style="height:44px;">
              <sticky scroll-box="vux_view_box_body" :check-sticky-support="false">
                <tab :line-width="0" class="noLine">
                  <tab-item @on-item-click="priceSort" selected>综合</tab-item>
                  <tab-item @on-item-click="priceSort">销量</tab-item>
                  <tab-item @on-item-click="priceSort">
                    <span class="price" :class="priceClass">价格</span>
                  </tab-item>
                </tab>
              </sticky>
            </div>
            <div class="productList">
              <ul>
                <li v-for="(product, index) in productList" :key="index">
                  <router-link :to="'/Product/Detail/' + product.skuId">
                    <div class="imgDom">
                      <img v-if="product && product.goodsImgVos" :src="product.goodsImgVos[0].imgUrl|imgFormat('320X320')"/>
                    </div>
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
          <div v-else class="empty">
            <p>抱歉，没有找到与 “{{searchTxt}}” 相关的结果，您可以换个关键词再试</p>
          </div>
        </div>
        <div v-if="selectedType==1">
          <div v-if="(storeList && storeList.length>0) || storePager.hasPost==false" class="storeList">
            <ul>
              <li v-for="store in storeList">
                <router-link :to="'/Search/Store/' + store.merchantId">
                  <flexbox :gutter="0">
                    <flexbox-item span="60">
                      <div class="imgDom"><img :src="store.logoImg|imgFormat('60X60')"/></div>
                    </flexbox-item>
                    <flexbox-item>
                      <div class="storeContent">
                        <div class="title">{{store.merchantName}}</div>
                        <div class="desc">共{{store.sellGoodsNumber}}件商品</div>
                      </div>
                    </flexbox-item>
                    <flexbox-item span="60">
                      <a class="toStoreBtn">
                        <span>进店</span>
                        <i class="fa fa-angle-right"></i>
                      </a>
                    </flexbox-item>
                  </flexbox>
                </router-link>

              </li>
            </ul>
            <load-more :tip="storePager.finish?'没有更多了':''" :show-loading="!storePager.finish"></load-more>
          </div>
          <div v-else class="empty">
            <p>抱歉，没有找到与 “{{searchTxt}}” 相关的结果，您可以换个关键词再试</p>
          </div>
        </div>
      </div>

    </view-box>
    <a class="stickBtn" v-if="showStick" @click="goTop"></a>
  </div>
</template>

<script>
  import { dateFormat } from 'vux'
  import SearchList from './js/searchResult.js';
  export default SearchList;
</script>
<style lang="less" scoped>
  @import './css/style.less';

</style>

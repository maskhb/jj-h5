
<template>
  <div>
    <div class="wrapper" :class="{pb_130:isIphoneX}">
      <div class="topBar1" v-if="!searchShow">
        <div class="searchDom">
          <x-input :placeholder="placeholder" disabled @click.native="toSearch"></x-input>
          <icon type="search"></icon>
        </div>
      </div>
      <scroller lock-x @on-scroll="handleScroll" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200" height="-60">
        <div>
          <!--search start-->
          <flexbox :gutter="0" class="topBar" v-if="searchShow">
            <flexbox-item :span="1/3" class="location_box">
              <div class="location" @click="selectArea">
                <i class="location_w"></i><span>{{communityName}}</span>
              </div>
            </flexbox-item>
            <flexbox-item :span="2/3">
              <div class="searchDom">
                <!--<search @on-submit="onSubmit" placeholder="搜索店铺、商品" :auto-fixed="false" cancel-text="" @on-focus="onFocus" @on-cancel="onCancel"></search>-->
                <x-input :placeholder="placeholder" disabled @click.native="toSearch"></x-input>
                <icon type="search"></icon>
              </div>
            </flexbox-item>
          </flexbox>

          <!--search end-->
          <swiper :aspect-ratio="160/375" :list="bannerList" auto loop :show-dots="bannerList.length>1"></swiper>
          <swiper :aspect-ratio="110/400" dots-position="center" :show-dots="menuList.length>1">
            <swiper-item class="menuList" v-for="(page, pageIndex) in menuList" :key="pageIndex">
              <flexbox :gutter="0">
                <flexbox-item :span="'1/' + page.children.length" v-for="(item, index) in page.children" :key="index" class="menuItem" link="/Search/List">
                  <router-link :to="item.linkUrl">
                    <div class="imgDom">
                      <img :src="item.picUrl|imgFormat('60X60')">
                    </div>
                    <div>
                      {{item.adName}}
                    </div>
                  </router-link>
                </flexbox-item>
              </flexbox>
              <!--<grid>-->
              <!--<grid-item :label="menu.label" v-for="(menu, index) in page.children" :key="index">-->
              <!--<img v-if="menu.label" slot="icon" src="../../assets/images/grid_icon.png">-->
              <!--</grid-item>-->
              <!--</grid>-->
            </swiper-item>
          </swiper>

          <ul class="shopList">
            <template v-for="(shop,index) in shopList">
              <li v-if="index%2==0" class="padding">
                <router-link class="shopName" :to="'/Search/Store/' + shop.merchantId">
                  <img v-if="shop.logoImg" :src="shop.logoImg|imgFormat('60X60')"/>
                  <span>
                    {{shop.merchantName}}
                     <i>共{{shop.sellGoodsNumber}}件商品</i>
                  </span>
                  <router-link class="goShopBtn" :to="'/Search/Store/' + shop.merchantId">
                    进店<i class="fa fa-chevron-right ml_10"></i>
                  </router-link>
                </router-link>
                <flexbox :gutter="0" v-if="shop.goodsSkuList && shop.goodsSkuList.length>0">
                  <flexbox-item :span="1/2">
                    <router-link :to="'/Product/detail/' +  shop.goodsSkuList[1]['skuId']" class="imgDom h_170 relative mr_10">
                      <img v-if="shop.goodsSkuList[1]['goodsImgVos'] && shop.goodsSkuList[1]['goodsImgVos'].length>0"
                           v-lazy="imgFormat(shop.goodsSkuList[1]['goodsImgVos'][0]['imgUrl'], '345X360')">
                      <span class="price">&yen;{{shop.goodsSkuList[1]['salePrice']|money}}</span>
                    </router-link>
                  </flexbox-item>
                  <flexbox-item :span="1/2">
                    <ul class="gridList">
                      <li v-for="(item, gIndex) in shop.goodsSkuList" :key="gIndex">
                        <router-link v-if="gIndex!=1" :to="'/Product/detail/' +  item['skuId']">
                          <img v-if="item.goodsImgVos && item.goodsImgVos.length>0" v-lazy="imgFormat(item['goodsImgVos'][0]['imgUrl'], '170X170')"/>
                        </router-link>
                      </li>
                    </ul>
                  </flexbox-item>
                </flexbox>
                <swiper v-if="shop.packageList && shop.packageList.length>0" height="250px" dots-position="center" :show-dots="shop.packageList.length>1">
                  <swiper-item v-for="(item, pIndex) in shop.packageList" :key="pIndex">
                    <div class="comboItem">
                      <router-link :to="'/Product/ComboDetail/' + item.packageId">
                        <div class="imgDom">
                          <img v-lazy="imgFormat(item.mainImgUrl, '233X200')"/>
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
                    </div>
                  </swiper-item>
                </swiper>
              </li>
              <li v-else>
                <div class="diyBg" :class="{greenBg:(index+1)%4==0}">
                  <router-link :to="'/Search/Store/' + shop.merchantId">
                    <div class="shopName">
                      <div class="imgDom">
                        <img v-if="shop.logoImg" :src="shop.logoImg|imgFormat('60X60')"/>
                      </div>

                      {{shop.merchantName}}
                    </div>
                    <div class="center">
                      <a class="more" >查看店铺</a>
                    </div>
                  </router-link>

                  <div class="gridList2">
                    <div>
                      <flexbox :gutter="0">
                        <flexbox-item :span="1/3" v-for="(item, gIndex) in shop.goodsSkuList" :key="gIndex">
                          <router-link :to="'/Product/detail/' + item.skuId" class="gridItem">
                            <div class="gridImg">
                              <img v-if="item.goodsImgVos && item.goodsImgVos.length>0" v-lazy="imgFormat(item.goodsImgVos[0]['imgUrl'], '105X105')"/>
                            </div>
                            <div class="priceTxt">&yen;{{item.salePrice|money}}</div>
                          </router-link>
                        </flexbox-item>
                      </flexbox>
                    </div>
                  </div>
                </div>
                <div class="m_20">
                  <swiper v-if="shop.packageList && shop.packageList.length>0" height="250px" dots-position="center" :show-dots="shop.packageList.length>1">
                    <swiper-item v-for="(item, pIndex) in shop.packageList" :key="pIndex">
                      <div class="comboItem">
                        <router-link :to="'/Product/ComboDetail/' + item.packageId">
                          <div class="imgDom">
                            <img v-lazy="imgFormat(item.mainImgUrl, '233X200')"/>
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
                      </div>
                    </swiper-item>
                  </swiper>
                </div>
              </li>
            </template>
          </ul>
          <divider class="miniDivider">更多店铺</divider>
          <ul class="moreShopList">
            <li v-for="shop in moreShopList">
              <router-link :to="'/Search/Store/' + shop['merchantId']">
                <div class="shopName">
                  <img v-if="shop.logoImg" v-lazy="imgFormat(shop.logoImg, '60X60')"/>
                  {{shop.merchantName}}
                </div>
                <div class="imgDom" v-if="shop && shop['goodsSkuList'] && shop['goodsSkuList'][0]">
                  <img v-if="shop['goodsSkuList'][0]['goodsImgVos'] && shop['goodsSkuList'][0]['goodsImgVos'][0]"
                       v-lazy="imgFormat(shop['goodsSkuList'][0]['goodsImgVos'][0]['imgUrl'], '345X360')"/>
                </div>
              </router-link>

            </li>
          </ul>
          <!--<divider class="miniDivider">没有更多了</divider>-->

          <load-more :tip="loading.tip" :show-loading="loading.show"></load-more>
        </div>
      </scroller>

    </div>
    <div class="footBar">
      <tabbar :class="{pb_30:isIphoneX}">
        <tabbar-item :link="item.linkUrl" v-for="(item, index) in footerList" :key="index" :selected="item.adName=='商城'">
          <div slot="icon" class="tabbarImgDom">
            <img :src="item.picUrl|imgFormat('60X60')" />
            <span v-if="item.linkUrl==='/Cart' && cartNum>0">{{cartNum}}</span>
          </div>
          <span slot="label">{{item.adName}}</span>
        </tabbar-item>
        <!--<tabbar-item link="/Mall" selected>-->
          <!--<i slot="icon" class="fa fa-building-o fa-1x"></i>-->
          <!--<span slot="label">商城</span>-->
        <!--</tabbar-item>-->
        <!--<tabbar-item link="/login">-->
          <!--<i slot="icon" class="fa fa-shopping-cart fa-1x"></i>-->
          <!--<span slot="label">购物车</span>-->
        <!--</tabbar-item>-->
        <!--<tabbar-item link="UserCenter/">-->
          <!--<img slot="icon" src="http://www.iconpng.com/png/ios7-set-lined-2/user65.png"></img>-->
          <!--<span slot="label">我的</span>-->
        <!--</tabbar-item>-->
      </tabbar>
    </div>
  </div>

</template>

<script>
  import Index from './js/index.js';
  export default Index;
</script>

<style lang="less" scoped>
  @import './css/style.less';
</style>

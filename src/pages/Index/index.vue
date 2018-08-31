
<template>
  <div>
    <div class="wrapper" :class="{pb_130:isIphoneX}">
      <!--search start-->
      <flexbox :gutter="0" class="topBar" v-if="searchShow" >
        <flexbox-item :span="1/3" class="location_box">
          <div class="location" @click="selectArea">
            <i class="location_w"></i><span>{{communityName}}</span>
          </div>
        </flexbox-item>
        <flexbox-item :span="2/3">
          <div class="searchDom">
            <x-input placeholder="搜索商品、店铺" readonly @click.native="toSearch"></x-input>
            <icon type="search"></icon>
          </div>
        </flexbox-item>
      </flexbox>
      <div class="topBar1" v-else>
        <div class="searchDom">
          <x-input placeholder="家具" readonly @click.native="toSearch"></x-input>
          <icon type="search"></icon>
        </div>
      </div>
      <!--search end-->
      <swiper :aspect-ratio="160/375" :list="bannerList" auto loop :show-dots="bannerList.length>1"></swiper>

      <!--精选套餐-->
      <div class="webpart">
        <h1 class="wp_title">精选套餐</h1>
        <div class="wp_content">
          <scroller lock-y :scrollbar-x=false :bounce=false>
            <ul class="comboList" :style="{width:330*packageList.length + 'PX'}">
              <li v-if="packageList" v-for="(item, index) in packageList" :key="index">
                <router-link :to="'/Product/ComboDetail/' + item.packageId">
                  <div class="imgDom">
                    <img v-lazy="imgFormat(item.mainImgUrl, '640X300')"/>
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
          </scroller>

        </div>
      </div>

      <!--家居资讯-->
      <div class="webpart" v-if="hide">
        <h1 class="wp_title">家居资讯</h1>
        <div class="wp_content">
          <ul class="adList">
            <li v-for="(item, index) in packageList" :key="index">
              <div class="imgDom">
                <img src="http://img.jiaju.htmimi.cn/img/2017/11/26/18504884015999824602286_240X240.jpg"/>
              </div>
              <h1 class="adTitle">
                冬日暖阳迎接新家的一缕阳光
              </h1>
              <div class="adData">
                <span><i class="fa fa-commenting-o fa-1x"></i>56</span>
                <span><i class="fa fa-heart-o fa-1x"></i>28</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!--晒家行动-->
      <div class="webpart" v-if="hide">
        <h1 class="wp_title">晒家行动</h1>
        <div class="wp_content">
          <scroller lock-y :scrollbar-x=false :bounce=false>
            <ul class="homeList" :style="{width:160*packageList.length + 'PX'}">
              <li v-for="(item, index) in packageList" :key="index">
                <div class="imgDom">
                  <img src="http://img.jiaju.htmimi.cn/img/2017/11/26/18504884015999824602286_240X240.jpg"/>
                </div>
                <div class="homeTitle">
                  现代简约客厅 舒适和时髦兼具
                </div>
              </li>
            </ul>
          </scroller>
        </div>
      </div>

      <!--热门评论-->
      <div class="webpart" v-if="hide">
        <h1 class="wp_title">热门评论</h1>
        <div class="wp_content">
          <ul class="commentList">
            <li v-for="(item, index) in packageList" :key="index">
              <div class="imgDom">
                <img src="https://ht-img1.htmimi.com/group1/M00/02/36/CjMAyVb81YWAcSk3AAEhWLMwx1s928.jpg"/>
              </div>
              <div class="commentInfo">
                <h1 class="commentName">fankwin</h1>
                <div class="commentKey">评论了：</div>
                <p class="commentContent">是干货无疑，非常棒，值得收藏!是干货无疑，非常棒，值得收藏!是干货无疑，非常棒，值得收藏!是干货无疑，非常棒，值得收藏!</p>
                <a>
                  <div class="imgDom">
                    <img src="http://img.jiaju.htmimi.cn/img/2017/11/26/18504884015999824602286_240X240.jpg"/>
                  </div>
                  <div class="linkTitle">别只沉迷冷淡风，用冷淡色也能装出超有特色的家</div>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>

    </div>
    <div class="footBar">
      <tabbar :class="{pb_30:isIphoneX}">
        <tabbar-item :link="item.linkUrl" v-for="(item, index) in footerList" :key="index" :selected="item.adName=='首页'">
          <div slot="icon" class="tabbarImgDom">
            <img :src="item.picUrl|imgFormat('60X60')" />
            <span v-if="item.linkUrl==='/Cart' && cartNum>0">{{cartNum}}</span>
          </div>
          <span slot="label">{{item.adName}}</span>
        </tabbar-item>
        <!--<tabbar-item link="/" selected>-->
          <!--<i slot="icon" class="fa fa-home fa-1x"></i>-->
          <!--<span slot="label">首页</span>-->
        <!--</tabbar-item>-->
        <!--<tabbar-item link="/Mall">-->
          <!--<i slot="icon" class="fa fa-building-o fa-1x"></i>-->
          <!--<span slot="label">商城</span>-->
        <!--</tabbar-item>-->
        <!--<tabbar-item link="/login">-->
          <!--<i slot="icon" class="fa fa-shopping-cart fa-1x"></i>-->
          <!--<span slot="label">购物车</span>-->
        <!--</tabbar-item>-->
        <!--<tabbar-item link="/UserCenter">-->
          <!--<i slot="icon" class="fa fa-user-o fa-1x"></i>-->
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

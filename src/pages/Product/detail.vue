
<template>
  <div>
    <div class="wrapper" :class="{pb_100:detail.packageId==0 && detail.goodsType != 4}">
      <div class="detailImg" :class="{soldout:selectedSku.status == 3}">
        <swiper :aspect-ratio="375/375" auto loop>
          <swiper-item class="menuList" v-for="(item, index) in selectedSku.goodsImgVoList" :key="index">
            <div @click="showImg(index)">
              <img :src="item.imgUrl|imgFormat('750X750')">
            </div>
          </swiper-item>
        </swiper>
        <router-link to="/" class="indexBtn"></router-link>
      </div>
      <div class="detailInfo">
        <h1 class="title display2line">{{detail.goodsName}}</h1>
        <div class="price">
          <!--赠品-->
          <template v-if="detail.packageId==0 && detail.goodsType==4">
            <b>&yen;0.00</b><span class="remove">&yen;{{selectedSku.marketPrice|money}}</span>
          </template>

          <template v-if="detail.packageId==0 && (detail.goodsType==1 || detail.goodsType==2)">
            <b>&yen;{{selectedSku.salePrice|money}}</b><span class="remove">&yen;{{selectedSku.marketPrice|money}}</span>
          </template>

          <template v-if="detail.packageId==0 && detail.goodsType==3">
            <b class="orderPrice fs12">定金</b><span class="orderPrice fs16">&yen;{{selectedSku.salePrice|money}}</span>
          </template>


          <!--套餐商品详情-->
          <template v-if="detail.packageId">
            <div>
              <span class="small black">套餐价：</span><b>&yen;{{selectedSku.packagePrice|money}}</b>
            </div>
            <div class="small">
              <span class="black">销售价：&yen;{{selectedSku.salePrice|money}}</span><span class="ml_20">市场价：</span><span class="remove">&yen;{{selectedSku.marketPrice|money}}</span>
            </div>
          </template>
          <!--<b>&yen;{{selectedSku.salePrice|price}}</b><span class="remove">暂无价格</span>-->
        </div>
        <ul class="remark" v-if="detail.packageId==0 && (detail.goodsType==1 || detail.goodsType==2)">
          <li v-for="(promotion, index) in promotionList" :key="index" :class="{subtract:promotion.conditionType<=2, present:promotion.conditionType>2}">
            <a v-if="promotion.activityUrlApp" :href="promotion.activityUrlApp">{{promotion.promotionName}}</a>
            <span v-else>{{promotion.promotionName}}</span>
          </li>
        </ul>
      </div>
      <div class="rater groupLink" @click="showCart">
        <group>
          <cell title="已选">
            <div slot="title" class="selectedTxt">
              <span>已选：</span><b>{{selectedSku.skuPropertyRelationVoSList|getSkuStr}}</b>
            </div>
            <i slot="default" class="more" v-if="detail.packageId==0 && (detail.goodsType==1 || detail.goodsType==2)">. . .</i>
          </cell>
        </group>
      </div>
      <div class="store groupLink">
        <group>
          <cell is-link :link="'/Search/Store/' + merchant.merchantId">
            <div slot="icon" class="storeIcon">
              <img width="30" :src="merchant.logoImgUrl|imgFormat('60X60')"/>
            </div>
            <div slot="title" class="storeTitle">
              <h1>{{merchant.merchantName}}</h1>
              <p>在售商品<i>{{merchant.sellGoodsNumber}}</i>件</p>
            </div>
          </cell>
          <div class="diyCell">
            <flexbox :gutter="0" >
              <flexbox-item :span="1/2">
                <a class="cellLink border_r" @click="showTel=true"><i class="fa fa-phone fa-1x"></i>电话咨询</a>
              </flexbox-item>
              <flexbox-item :span="1/2">
                <a class="cellLink" target="_blank" href="https://v2.live800.com/live800/chatClient/chatbox.jsp?companyID=670661&configID=126097&jid=9225818664&s=1">
                  <i class="fa fa-commenting fa-1x"></i>在线咨询
                </a>
              </flexbox-item>
            </flexbox>
          </div>
        </group>
      </div>
      <div class="details">
        <tab v-model="detailIndex" :line-width="2" custom-bar-width="60px">
          <tab-item @on-item-click="detailChange" selected>商品介绍</tab-item>
          <tab-item @on-item-click="detailChange">规格参数</tab-item>
        </tab>
        <div v-if="detailIndex == 0" class="htmlContent">
          <div>{{productDetailTitle}}</div>
          <div v-html="detail.goodsDetail"></div>
        </div>
        <div v-if="detailIndex == 1" class="paramsTable">
          <x-table full-bordered>
            <tr v-for="(item, index) in detail.goodsPropertyRelationVoSList" :key="index">
              <th>{{item.propertyKey}}</th>
              <td>{{item.propertyValue}}</td>
            </tr>
          </x-table>
        </div>
      </div>
    </div>
    <a class="stickBtn" v-if="showStick" @click="goTop"></a>
    <div class="footer" v-if="detail.packageId==0 && detail.goodsType != 4">
      <flexbox :gutter="0" v-if="detail.goodsType==1 || detail.goodsType==2">
        <flexbox-item :span="1/3">
          <router-link to="/Cart" class="footerLink">
          <div><i class="cartIcon"></i><div v-if="mjcarttotalnum" class="cart-total"><span>{{mjcarttotalnum}}</span></div></div>
          </router-link>
        </flexbox-item>
        <flexbox-item :span="2/3">
          <a class="yellowBtn footerLink" @click="showCart" :class="{'disabled':detail.status == 3 ||sameCommunity==false}">加入购物车</a>
        </flexbox-item>
      </flexbox>
      <flexbox :gutter="0" v-if="detail.goodsType==3">
        <flexbox-item>
          <a class="yellowBtn footerLink"
             :class="{'disabled':detail.status == 3 || selectedSku.status == 3 || selectedSku.remainNum == 0 || sameCommunity==false}"
             @click="toBuy(selectedSku.skuId)">
            {{(detail.status == 3 || selectedSku.status == 3)?'已下架':(selectedSku.remainNum==0?'已售罄':'立即购买')}}
          </a>
        </flexbox-item>
      </flexbox>
    </div>

    <div v-transfer-dom>
      <sku-select :showPopup="showPopup" :skuId="skuId" :detail="detail" @selectOK="selectOK" @onHide="onHide"></sku-select>
    </div>
    <div v-transfer-dom>
      <popup v-model="showTel" position="bottom" class="groupLink">
        <group title="电话咨询">
          <cell title="商家电话" @click.native="toTel(merchant.telphoneNo)">
            <a class="blue" :href="'tel:' + merchant.telphoneNo">{{merchant.telphoneNo}}</a>
          </cell>
          <cell title="平台电话" @click.native="toTel('02022363636')">
            <a class="blue" href="tel:02022363636">020-22363636</a>
          </cell>
        </group>
      </popup>
    </div>
    <div v-transfer-dom>
      <previewer :list="imgList" ref="previewer"></previewer>
    </div>
  </div>
</template>

<script>
  import Detail from './js/detail.js';
  export default Detail;
</script>
<style lang="less" scoped>
  @import './css/style.less';
</style>



<template>
  <div>
    <div class="wrapper pb_200">
      <div class="relative detailImg" :class="{soldout:package.status == 2}">
        <swiper :aspect-ratio="375/375" auto loop>
          <swiper-item class="menuList" v-for="(item, index) in package.album" :key="index">
            <div @click="showImg(index)">
              <img :src="item|imgFormat('750X750')">
            </div>
          </swiper-item>
        </swiper>
        <a class="threeDimen smallBtn" v-if="package.threeDimenUrl" :href="package.threeDimenUrl">查看3D图</a>

        <router-link to="/" class="indexBtn"></router-link>
      </div>
      <!--<div class="price">-->
      <!--<b>&yen;299.00</b><span class="remove">暂无价格</span>-->
      <!--</div>-->
      <div class="detailInfo">
        <h1 class="title display2line">{{package.packageName}}</h1>
        <ul class="tagList">
          <li v-for="(tag, tIndex) in package.decorateStyleTShow" :key="'t1_' + tIndex">{{tag.tagName}}</li>
          <li v-for="(tag, tIndex) in package.houseTypeShow" :key="'t2_' + tIndex">{{tag.tagName}}</li>
        </ul>
        <div class="describe">
          {{package.packageDesc}}
        </div>
      </div>

      <div class="details pt_10 pb_10">
        <div class="detallTab">
          <button-tab>
            <button-tab-item @on-item-click="detailChange" selected>商品清单</button-tab-item>
            <button-tab-item @on-item-click="detailChange">商品介绍</button-tab-item>
          </button-tab>
        </div>
        <div v-if="detailIndex == 0">
          <div v-if="combo && combo.packageGoodsList && combo.packageGoodsList.length>0" v-for="(combo, comboIndex) in comboIncludeList" :key="comboIndex" class="spaceItem">
            <divider class="miniDivider">{{combo.spaceName}}</divider>
            <div v-if="product" v-for="(product, index) in combo.packageGoodsList" class="product">
              <flexbox :gutter="0">
                <flexbox-item span="35">
                  <span @click="changeChecked(comboIndex, index)">
                    <icon v-if="product.selected" type="success-circle"></icon>
                    <icon v-else type="circle"></icon>
                  </span>
                </flexbox-item>
                <flexbox-item span="85">
                  <div class="imgDom" :class="{soldout:product.status == 3, sellout:product.status==2&&product.remainNum==0}" @click="toDetail(product)">
                    <img :src="product.imgUrl|imgFormat('200X200')"/>
                  </div>
                </flexbox-item>
                <flexbox-item>
                  <div class="relative" >
                    <div class="productContent" @click="toDetail(product)">
                      <h1 class="title display2line">
                        <span>{{product.goodsName}}</span>
                        <i v-if="product.isDefault==0" class="fa fa-trash-o fa-fw" @click="delSku(comboIndex, index)"></i>
                      </h1>
                      <div class="desc">{{product.specifications}}</div>
                      <div class="mt_5">
                        <span class="price">&yen;{{product.packagePrice|money}}</span><i class="price_o">&yen;{{product.salePrice|money}}</i>
                      </div>
                    </div>
                    <div class="options">
                      <inline-x-number width="30px" @on-change="clickNum" :fillable="product.remainNum !== 0" v-model="comboIncludeList[comboIndex]['packageGoodsList'][index]['num']" button-style="round" :min="1" :max="product.remainNum"></inline-x-number>
                    </div>
                  </div>
                </flexbox-item>
              </flexbox>
            </div>
          </div>
        </div>
        <div v-if="detailIndex == 1" v-html="package.packageDetail" class="htmlContent">
        </div>
      </div>
      <div v-if="detailIndex == 0" class="p_20">
        <x-button class="whiteBtn" @click.native="addGoods()"><i class="fa fa-plus-square-o mr_10 vertical-m"></i>添加商品</x-button>
      </div>
    </div>

    <div class="footer h_200" ref="footer">
      <flexbox :gutter="0" class="comboPriceInfo">
        <flexbox-item :span="1/2">
          <span>共节省:</span><b>&yen;{{totalSalePrice-totalPackagePrice|money}}</b>
        </flexbox-item>
        <flexbox-item :span="1/2" class="text-r">
          <span>已选商品价格:</span><b>&yen;{{totalPackagePrice|money}}</b>
        </flexbox-item>
      </flexbox>

      <flexbox :gutter="0">
        <flexbox-item :span="1/3">
          <div @click="clickAll" class="">
            <icon v-if="selectAll" type="success-circle"></icon>
            <icon v-else type="circle"></icon>
            <span>全选</span>
          </div>
          <!--<check-icon :value.sync="selectAll" type="plain" class="ml_10">全选</check-icon>-->
        </flexbox-item>
        <flexbox-item :span="2/3">
          <a class="yellowBtn footerLink" :class="{'disabled':package.status == 2 || toOrderDisabled}" @click="placeOrder">
            {{package.status == 2?'已下架':'一键下单'}}
          </a>
        </flexbox-item>
      </flexbox>
    </div>


    <!--添加商品-->
    <div class="diyDialog" :class="{show:showAddProduct}">
      <div class="subMenu" :style="{height: viewHeight + 'px'}">
        <flexbox :gutter="0">
          <flexbox-item span="100">
            <div class="subMenuLeft" ref="subMenuLeft">
              <!--:style="{height: viewHeight + 'px'}"-->
              <view-box body-padding-bottom="0px">
                <ul>
                  <li v-for="(item,index) in comboList" :class="{current:selectSpaceIndex==index}" :key="index" @click="selectSpace(index)">
                    {{item.spaceName}}
                  </li>
                </ul>
              </view-box>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="subMenuRight">
              <view-box ref="viewBox_Product" body-padding-bottom="10px">
                <div class="spaceItem" v-if="comboList[selectSpaceIndex]">
                  <h1 class="spaceName">{{comboList[selectSpaceIndex]['spaceName']}}</h1>
                  <ul class="ml_20">
                    <li v-if="comboList[selectSpaceIndex]['selectPackageGoodsList']"
                        v-for="(product,pIndex) in comboList[selectSpaceIndex]['selectPackageGoodsList']" :key="pIndex" class="product">
                      <div @click="toDetail(product)">
                        <div class="imgDom p_left"  :class="{soldout:product.status == 3, sellout:product.status==2&&product.remainNum==0}">
                          <img :src="product.imgUrl|imgFormat('200X200')"/>
                        </div>
                        <div class="productContent p_right">
                          <div class="title display2line">{{product.goodsName}}</div>
                          <div class="price">
                            <span>&yen;{{product.packagePrice|money}}</span>
                            <i class="fl_r" v-if="product.children.length>0">X{{product.children.length}}</i>
                          </div>
                          <a class="rule display1line" @click="showSkuSelect(product)">{{product.children|getWholeSkuTxt}}</a>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </view-box>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <div class="footer">
        <a class="yellowBtn footerLink" @click="save">确定</a>
      </div>
    </div>

    <!--规格选择-->
    <div v-transfer-dom>
      <sku-select :showPopup="showPopup" :detail="detail" @selectOK="selectOK" @onHide="onHide"></sku-select>
    </div>

    <!--图片展示-->
    <div v-transfer-dom>
      <previewer :list="imgList" ref="previewer"></previewer>
    </div>
  </div>
</template>

<script>
  import ComboDetail from './js/comboDetail.js';
  export default ComboDetail;
</script>
<style lang="less" scoped>
  @import './css/style.less';

</style>

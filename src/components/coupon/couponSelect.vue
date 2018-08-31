
<template>
  <div>
    <div class="couponContent gray_bg">
      <view-box ref="viewBox" class="viewBox">
        <div ref="viewBoxBody">
          <x-header title="选择优惠券" :left-options="{backText: '',preventGoBack:true}" @on-click-back="ok(1)">
            <div slot="right" @click="showDialog=true" class="exchange">
              兑换
            </div>
          </x-header>
          <div style="height:44px;">
            <sticky scroll-box="vux_view_box_body" :check-sticky-support="false">
              <tab :line-width="2" custom-bar-width="60px" active-color='#222'>
                <tab-item @on-item-click="changeType" :selected="selectedType==0">可用优惠券({{couponList1.length}})</tab-item>
                <tab-item @on-item-click="changeType" :selected="selectedType==1">不可用优惠券({{couponList2.length}})</tab-item>
              </tab>
            </sticky>
          </div>
          <div v-if="selectedType===0">
            <ul class="couponList mb_20" v-if="couponList1 && couponList1.length>0">
              <li class="couponItem" :class="{'current':codeId==coupon.codeId}"
                  v-for="(coupon,index) in couponList1" :key="index" @click="selectCoupon(coupon)">
                <div class="content">
                  <h1 class="couponType">{{coupon.couponName}}</h1>
                  <div class="couponRule">
                    &yen;<b>{{coupon.amount|money(0)}}</b><span>[满{{coupon.conditionAmount|money(0)}}可用]</span>
                  </div>
                  <div class="couponTime">{{coupon.startTime|date('yyyy-MM-dd')}} 至 {{coupon.endTime|date('yyyy-MM-dd')}}</div>
                </div>
                <icon v-if="codeId===coupon.codeId" class="icon checked" type="success-circle"></icon>
                <icon v-if="codeId!==coupon.codeId" class="icon unchecked" type="circle"></icon>
              </li>
            </ul>
            <div v-else class="couponEmpty">
              <p>暂无可用优惠券</p>
              <a class="yellowBtn" @click="ok">返回</a>
            </div>

            <div class="footerBtn couponFooter">
              <span v-if="codeId!==0 && coupon && coupon.codeId">共优惠: <b class="red">&yen;{{coupon.amount|money(0)}}</b></span>
              <a class="yellowBtn" @click="ok">确定</a>
            </div>
          </div>
          <div v-if="selectedType===1">
            <ul class="couponList mb_20" v-if="couponList2 && couponList2.length>0">
              <li class="couponItem nocan" v-for="(coupon,index) in couponList2" :key="index">
                <div class="content">
                  <h1 class="couponType">{{coupon.couponName}}</h1>
                  <div class="couponRule">
                    &yen;<b>{{coupon.amount|money(0)}}</b><span>[满{{coupon.conditionAmount|money(0)}}可用]</span>
                  </div>
                  <div class="couponTime">{{coupon.startTime|date('yyyy-MM-dd')}} 至 {{coupon.endTime|date('yyyy-MM-dd')}}</div>
                  <div class="desc" v-if="coupon.notUseDesc">{{coupon.notUseDesc}}</div>
                </div>
              </li>
            </ul>
            <div v-else class="couponEmpty">
              <p>暂无不可用优惠券!</p>
              <a class="yellowBtn" @click="ok">返回</a>
            </div>
          </div>
        </div>
      </view-box>
    </div>

    <!--兑换优惠券-->
    <div class="diyDialog gray_bg" :class="{show:showDialog}">
      <x-header title="兑换优惠券" :left-options="{backText: '',preventGoBack:true}" @on-click-back="showDialog=false"/>
      <group class="firstGroup">
        <x-input title="" :max="50" placeholder="请输入激活码" v-model="form.couponCode"></x-input>
      </group>
      <div class="btnGroup m_20">
        <x-button class="yellowBtn" @click.native="toExchange">确定兑换</x-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import  { ConfirmPlugin, LoadingPlugin, AlertPlugin, ToastPlugin } from 'vux'
  Vue.use(ConfirmPlugin);
  Vue.use(LoadingPlugin);
  Vue.use(AlertPlugin);
  Vue.use(ToastPlugin);

  import http from "@/http";

  import {
    TransferDom,
    Cell, XInput, Group, Flexbox, FlexboxItem, XButton, Popup, PopupPicker, Scroller, ViewBox, Tab, TabItem, Sticky, Icon, XHeader
  } from 'vux'

  export default {
    props: ['coupon', 'orderInfo', 'skuId'],
    directives: {
      TransferDom
    },
    components: {
      Cell, XInput, Group, Flexbox, FlexboxItem, XButton, Popup, PopupPicker, Scroller, ViewBox, Tab, TabItem, Sticky, Icon, XHeader
    },
    methods: {
      changeType(index){
        this.selectedType = index;
      },
      selectCoupon(item){
        let coupon = this.couponObj;
        if(this.codeId===0 || this.codeId !== item.codeId){
          this.codeId = item.codeId;
          this.coupon = item;
        }else{
          this.codeId = 0;
        }
      },
      ok(flag){
        let list = this.couponList1;
        let codeId = this.codeId;
        let nowCoupon = {};
        if(codeId === 0){
          nowCoupon = {codeId:0};
        }else{
          list.map((v,i)=>{
            if(v['codeId']===codeId){
              nowCoupon = v;
            }
          });
        }
        if(flag===1){
          nowCoupon = false;
        }
        this.$emit('selectCoupon', nowCoupon);
      },
      /*去兑换*/
      toExchange(){
        let form = this.form;
        if(form.couponCode){
          http('ht-mj-promotion-server/promotionCouponCode/updateAcceptCouponCode', {couponCode :form.couponCode})
            .then(function(suc){
              this.$vux.toast.text('校验成功!');
              this.form.couponCode = '';
              this.getCouponList();

              setTimeout(function () {
                this.showDialog = false;
              }.bind(this), 1000);
            }.bind(this), function (err) {
            }.bind(this));
        }
      },
      getCouponList(){
        let skuId = this.skuId;
        let skuList = this.skuList;
        let searchParams = [];
        skuList.map((v,i)=>{
          searchParams.push({skuId:v['skuId'], count:v['goodsNum'], conditionId:v['conditionId'], promotionId:v['promotionId'], goodsCategoryId:v['goodsCategoryId'], merchantId:v['merchantId']});
        });
        if(skuId <= 0){
          http('ht-mj-promotion-server/promotionCouponCode/queryListMyCouponOrder', {listPromotionGoodsToCouponVo:searchParams})
            .then(function(suc){
              this.couponList1 = suc.canUse;
              this.couponList2 = suc.notCan;
              let enabled = false;
              if(suc.canUse && suc.canUse.length>0){
                enabled = true;
              }
              this.$emit('hasEnabled', enabled);
            }.bind(this));
        }

      }
    },
    mounted(){
      let coupon = this.coupon;
      this.isSelected = true;
      this.couponObj = coupon;
      this.codeId = coupon.codeId;
    },
    watch:{
      coupon(newVal){
        this.isSelected = true;
        this.couponObj = newVal;
        this.codeId = newVal.codeId;
      },
      orderInfo(newVal){
        if(newVal && newVal.orderItemVOList){
          this.skuList = newVal.orderItemVOList;
          this.getCouponList();
        }
      }
    },
    data () {
      return {
        isSelected:false,
        selectedType:0,
        paddingBottom:170,
        couponObj:{},
        codeId:'',
        couponList1:[
        ],
        couponList2:[
        ],
        form:{
          couponCode:''
        },
        showDialog:false
      }
    }
  }

</script>

<style lang="less" scoped>
  .firstGroup /deep/ .vux-cell-value{ color:#000;}
  .couponContent{ position: fixed; left: 0; top:0; width: 100%; bottom:0;}
  .couponList{ background-color: #fff; padding: 20px;}
  .couponItem{ background-color: #fff; margin-bottom: 20px; color:#222; border: 1PX solid #eee; position: relative;}
  .couponItem.current{ border: 1PX solid #ffb000;}
  .couponItem.disabled{ color:#aaa;}
  .couponItem .icon{ position: absolute; right:5px; bottom:10px;}
  .couponItem .unchecked{ display: block;}
  .couponItem.nocan{ color:#a1a7ae;}
  .couponItem .desc{ line-height: 60px; padding: 0 10px; background: #E0E3E9; color:#000;}
  .exchange{ color:#000;}

  .couponType{ border-bottom: 1px dotted #ebebeb; font-weight: normal; padding: 0 10px; line-height: 60px;}
  .couponRule{ padding: 0 10px;}
  .couponRule b{ font-size: 36PX;}
  .couponRule span{ color:#6b6a72; margin-left: 20px; display: inline-block;}
  .couponTime{ color:#6b6a72; padding: 0 10px; line-height: 60px;}

  .addBtn{ background-color: #fff; font-size: 16PX; line-height: 100px;}
  .addBtn i{ margin-right: 10px;}

  .areaTitle{ width: 105PX;}
  .btnGroup{ margin: 60px 20px 20px;}
  .saveBtn{ background-color: #FFB000; border-radius: 50px; line-height: 100px; height: 100px; color:#fff; font-size: 16PX;}
  .cancelBtn{ background-color: #A1A7AE; border-radius: 50px; line-height: 100px; height: 100px; color:#fff; font-size: 16PX;}
  .addressMain{ height:100%; position: relative;}
  .addressMain .gray_bg{ position: absolute; left: 0; top:0; right:0; bottom: 0;}
  .bottom_100{ bottom: 100px!important;}
  .couponEmpty{ background: url(../../assets/images/empty.png) no-repeat center 100px; margin-top: 20%; background-size: 150px 168px; min-height: 168px; padding: 300px 200px 100px; text-align: center; color:#5f5f5f;}
  .couponEmpty a{ display: block; line-height: 90px; margin-top: 20px;}
  .couponFooter{ text-align: center; background-color: #fff; border-top:1px solid #eee; padding-top: 10px;}
  .couponFooter .yellowBtn{ display: block; line-height: 90px; margin: 10px 20px;}
  .viewBox /deep/ .weui-tab__panel{ padding-bottom: 170px;}
</style>

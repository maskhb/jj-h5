
<template>
  <div>
    <div class="couponContent gray_bg">
      <view-box ref="viewBox" :body-padding-bottom="100">
        <div ref="viewBoxBody">
          <div style="height:44px;">
            <sticky  scroll-box="vux_view_box_body" :check-sticky-support="false">
              <tab :line-width="2" custom-bar-width="60px" active-color='#222'>
                <tab-item @on-item-click="changeItem" selected>未使用({{couponPager1.totalCount}})</tab-item>
                <tab-item @on-item-click="changeItem">已使用({{couponPager2.totalCount}})</tab-item>
                <tab-item @on-item-click="changeItem">已过期({{couponPager3.totalCount}})</tab-item>
              </tab>
            </sticky>
          </div>
          <div v-if="selectIndex===0">
            <div class="couponList" v-if="couponList1.length>0">
              <ul>
                <li v-for="(coupon, index) in couponList1">
                  <h1>{{coupon.couponName}}</h1>
                  <div class="couponInfo" :class="{isInvalid:coupon.startTime>new Date().getTime()}">
                    <div class="priceInfo">
                      <span>&yen;</span><b>{{coupon.amount|money(0)}}</b><span>[满{{coupon.conditionAmount|money(0)}}可用]</span>
                    </div>
                    <div class="time">{{coupon.startTime|date}} 至 {{coupon.endTime|date}}</div>
                  </div>
                </li>
              </ul>
              <load-more :tip="couponPager1.finish?'没有更多了':''" :show-loading="!couponPager1.finish"></load-more>
            </div>
            <div class="couponEmpty" v-else>
              暂时未有可用优惠券
            </div>
          </div>
          <div v-if="selectIndex===1">
            <div class="couponList" v-if="couponList2.length>0">
              <ul>
                <li v-for="(coupon, index) in couponList2">
                  <h1>{{coupon.couponName}}</h1>
                  <div class="couponInfo isUsed">
                    <div class="priceInfo">
                      <span>&yen;</span><b>{{coupon.amount|money(0)}}</b><span>[满{{coupon.conditionAmount|money(0)}}可用]</span>
                    </div>
                    <div class="time">{{coupon.startTime|date}} 至 {{coupon.endTime|date}}</div>
                  </div>
                </li>
              </ul>
              <load-more :tip="couponPager2.finish?'没有更多了':''" :show-loading="!couponPager2.finish"></load-more>
            </div>
            <div class="couponEmpty" v-else>
              暂时未有已使用优惠券
            </div>
          </div>
          <div v-if="selectIndex===2">
            <div class="couponList" v-if="couponList3.length>0">
              <ul>
                <li v-for="(coupon, index) in couponList3">
                  <h1>{{coupon.couponName}}</h1>
                  <div class="couponInfo isPast">
                    <div class="priceInfo">
                      <span>&yen;</span><b>{{coupon.amount|money(0)}}</b><span>[满{{coupon.conditionAmount|money(0)}}可用]</span>
                    </div>
                    <div class="time">{{coupon.startTime|date}} 至 {{coupon.endTime|date}}</div>
                  </div>
                </li>
              </ul>
              <load-more :tip="couponPager3.finish?'没有更多了':''" :show-loading="!couponPager3.finish"></load-more>
            </div>
            <div class="couponEmpty" v-else>
              暂时未有已过期优惠券
            </div>
          </div>
        </div>
      </view-box>
    </div>

    <div class="footerBtn couponFooter">
      <a class="yellowBtn" @click="showDialog=true">兑换</a>
    </div>

    <!--兑换优惠券-->
    <div class="diyDialog gray_bg" :class="{show:showDialog}">
      <x-header title="兑换优惠券" :left-options="{backText: '',preventGoBack:true}" @on-click-back="showDialog=false"/>
      <group class="firstGroup">
        <x-input title="" :max="50" placeholder="请输入激活码" v-model="form.couponCode"></x-input>
      </group>
      <div class="btnGroup m_20">
        <x-button class="yellowBtn" :disabled="!form.couponCode" @click.native="toExchange">确定兑换</x-button>
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
    Cell, XInput, Group, Flexbox, FlexboxItem, XButton, Popup, ViewBox, Sticky, Tab, TabItem, LoadMore, XHeader
  } from 'vux'

  export default {
    props: ['address'],
    directives: {
      TransferDom
    },
    components: {
      Cell, XInput, Group, Flexbox, FlexboxItem, XButton, Popup, ViewBox, Sticky, Tab, TabItem, LoadMore, XHeader
    },
    methods: {
      /*改变选中*/
      changeItem(index){
        this.selectIndex = index;
        this.$refs.viewBox.scrollTo(0);
        let status = 2;
        switch (index){
          case 0:
            break;
          case 1:
            status = 3;
            break;
          case 2:
            status = 5;
            break;
        }
        this.loadList(status, true);
      },
      /*去兑换*/
      toExchange(){
        let form = this.form;
        if(form.couponCode){
          http('ht-mj-promotion-server/promotionCouponCode/updateAcceptCouponCode', {couponCode :form.couponCode})
            .then(function(suc){
              this.$vux.toast.text('校验成功!');
              this.form.couponCode = '';
              this.couponList1=[];
              this.couponPager1 = {
                currPage:1,
                pageSize:20,
                finish:false,
                isLoading:false
              };
              this.loadList(2);

              setTimeout(function () {
                this.showDialog = false;
              }.bind(this), 1000);
            }.bind(this), function (err) {

            }.bind(this));
        }
      },
      /*监听滚动*/
      handleScroll(){
        let scrollTop = this.$refs.viewBox.getScrollTop();
        let scrollBodyHeight =  this.$refs.viewBoxBody.scrollHeight;
        if(scrollBodyHeight-scrollTop-this.clientHeight<50){
          let type = this.selectIndex;
          let status = 2;
          switch (type){
            case 0:
              break;
            case 1:
              status = 3;
              break;
            case 2:
              status = 5;
              break;
          }
          this.loadList(status);
        }
      },
      /*加载优惠券列表*/
      loadList(status, flag){
        let pager = {};
        let list = [];
        switch (status){
          case 2:
            pager = this.couponPager1;
            list = this.couponList1;
            break;
          case 3:
            pager = this.couponPager2;
            list = this.couponList2;
            break;
          case 5:
            pager = this.couponPager3;
            list = this.couponList3;
            break;
        }

        if(pager.isLoading === false && pager.finish === false){
          if(pager.currPage > 1 && flag === true){
            return;
          }
          pager.isLoading = true;
          let searchParams = {
            pageInfo: Object.assign({}, pager),
            status:status
          };
          delete searchParams.pageInfo.finish;
          delete searchParams.pageInfo.isLoading;
          delete searchParams.pageInfo.totalCount;
          http('ht-mj-promotion-server/promotionCouponCode/queryListByPageMyCoupon', {promotionCouponCodeVoQPage:searchParams})
            .then(function(suc){
              if(suc.dataList){
                suc.dataList.map((v,i)=>{
                  list.push(v);
                });
                if(suc.dataList.length<pager.pageSize){
                  pager.finish = true;
                }else{
                  pager.currPage++;
                }
              }
              pager.totalCount = suc.totalCount;
              pager.isLoading =false;
            }.bind(this), function (err) {
            }.bind(this));
        }
      }
    },
    mounted(){
      this.loadList(2);
      this.loadList(3);
      this.loadList(5);

      /*监听滚动事件*/
      this.$refs.viewBox.getScrollBody().addEventListener('scroll', this.handleScroll);
    },
    data () {
      return {
        clientHeight:document.documentElement.clientHeight,
        selectIndex:0,
        couponList1:[
        ],
        couponList2:[],
        couponList3:[],
        couponPager1:{
          currPage:1,
          pageSize:20,
          totalCount:0,
          finish:false,
          isLoading:false
        },
        couponPager2:{
          currPage:1,
          pageSize:20,
          totalCount:0,
          finish:false,
          isLoading:false
        },
        couponPager3:{
          currPage:1,
          pageSize:20,
          totalCount:0,
          finish:false,
          isLoading:false
        },
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
  .couponList ul{ margin: 20px; }
  .couponList li{ background-color: #fff; margin-bottom: 20px; padding: 10px 20px;}
  .couponList li h1{ line-height: 60px; border-bottom: 1px dotted #dcdcdc; font-weight: normal;}
  .couponList li .priceInfo{}
  .couponList li .priceInfo b{ font-size: 30PX; margin-right: 20px;}
  .couponList li .priceInfo span{display: inline-block;}
  .couponList li .time{ font-size: 12PX; color:#999;}
  .couponInfo{ position: relative;}
  .couponInfo.isUsed:after{ content:''; width: 92px; height: 92px; position: absolute; right:0; top:20px;
    background: url(./../../assets/images/isUsed.png) no-repeat left top; background-size: 92px 92px;}
  .couponInfo.isPast:after{ content:''; width: 92px; height: 92px; position: absolute; right:0; top:20px;
    background: url(./../../assets/images/isPast.png) no-repeat left top; background-size: 92px 92px;}
  .couponInfo.isInvalid:after{ content:''; width: 92px; height: 92px; position: absolute; right:0; top:20px;
    background: url(./../../assets/images/isInvalid.png) no-repeat left top; background-size: 92px 92px;}
  .couponFooter{ text-align: center; background-color: #fff; border-top:1px solid #eee; padding-top: 10px;}
  .couponFooter .yellowBtn{ display: block; line-height: 100px; margin: 10px 20px;}

  .couponEmpty{background: url(./../../assets/images/goods-empty.png) no-repeat center 100px; margin-top: 30%; background-size: 240px 240px; min-height: 240px; padding: 330px 100px 100px; text-align: center; color:#5f5f5f;}

</style>

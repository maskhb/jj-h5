import {
  Cell, XInput, Group, XButton, Flexbox, FlexboxItem, Grid, GridItem, XHeader, TransferDomDirective as TransferDom,
  XDialog, Qrcode
} from 'vux'
import http from "@/http";

export default {
  directives: {
    TransferDom
  },
  components: {
    Cell, XInput, Group, XButton, Flexbox, FlexboxItem, Grid, GridItem, XHeader, XDialog, Qrcode
  },
  methods: {
    getUserInfo(){
      http('user-center-server/user/current', {})
        .then(function(suc){
          if(suc){
            this.user = suc;
            this.qrcodeUrl = window.location.origin + '/Login/Index/' + suc.accountId;
          }
        }.bind(this),function (err) {});
    },
    /*获取订单数*/
    getOrderCount(){
      http('ht-mj-order-server/order/wx/myOrderCount', {})
        .then(function(suc){
          if(suc){
            this.orderCount = suc;
          }
        }.bind(this), function (err) {});
    },
    /*获取预存款*/
    getDeposit(){
      http('ht-mj-account-server/portalpredeposit', {})
        .then(function(suc){
          if(suc && suc.balance){
            this.deposit = suc.balance;
          }
        }.bind(this), function (err) {});
    },
    /*获取优惠券总数*/
    getCouponCount(){
      http('ht-mj-promotion-server/promotionCouponCode/queryCountMyCoupon', {promotionCouponCodeVoQ:{status:2}})
        .then(function(suc){
          this.myCoupon = suc;
        }.bind(this), function (err) {
        }.bind(this));
    }
  },
  mounted: function () {
    let token = localStorage['x-security-token'];
    if(token){
      this.getOrderCount();
      this.getUserInfo();
      this.getDeposit();
      this.getCouponCount();
    }else{
      this.$router.replace('/Login?redirect_uri=' + this.redirect_uri);
    }
  },
  data () {
    return {
      minHeight:document.documentElement.clientHeight,
      redirect_uri: encodeURIComponent(location.pathname),
      showHideOnBlur: false,
      qrcodeUrl:window.location.origin + '/Login',
      user:{},
      orderCount:0,
      deposit:0,
      myCoupon:0
    }
  }
}

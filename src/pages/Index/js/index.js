
import { Cell, XInput, Group, XButton, Flexbox, FlexboxItem, Search, Grid, GridItem,
  Tabbar, TabbarItem, Swiper, SwiperItem, Icon, Scroller
} from 'vux'
import http from "@/http";
import {imgFormat} from '@/utils/filter.js';
import {getCart} from '@/utils/cart'
import {checkLogin, isIphoneX} from '@/utils/common'
import wx from '@/lib/wxTools'

export default {
  components: {
    Cell, XInput, Group, XButton, Flexbox, FlexboxItem, Search, Grid, GridItem,
    Tabbar, TabbarItem, Swiper, SwiperItem, Icon, Scroller
  },
  methods: {
    selectArea(){
      this.$router.push('/SelectArea');
    },
    onSubmit (val) {
      window.alert('on submit' + val)
    },
    onCancel () {
      console.log('on cancel')
    },
    toSearch(){
      this.$router.push('/Search');
    },
    handleScroll(){
      let scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if(scroll>44){
        this.searchShow = false;
      }else{
        this.searchShow = true;
      }
    },
    /*设置最近小区*/
    setNearestCommunity(){
      let _this = this;

      /*获取五公里内小区*/
      let getNearestCommunity = function(s, communityList){
        var EARTH_RADIUS = 6378137.0;    //单位M
        var PI = Math.PI;
        var getRad = function(d){
          return d*PI/180.0;
        }
        let minDistance = 0;
        let minCommunity = {};

        /*获取经纬度之间的距离*/
        let getFlatternDistance = function(lat1,lng1, lat2,lng2){
          var f = getRad((lat1 + lat2)/2);
          var g = getRad((lat1 - lat2)/2);
          var l = getRad((lng1 - lng2)/2);

          var sg = Math.sin(g);
          var sl = Math.sin(l);
          var sf = Math.sin(f);

          var s,c,w,r,d,h1,h2;
          var a = EARTH_RADIUS;
          var fl = 1/298.257;

          sg = sg*sg;
          sl = sl*sl;
          sf = sf*sf;

          s = sg*(1-sl) + (1-sf)*sl;
          c = (1-sg)*(1-sl) + sf*sl;

          w = Math.atan(Math.sqrt(s/c));
          r = Math.sqrt(s*c)/w;
          d = 2*w*a;
          h1 = (3*r -1)/2/c;
          h2 = (3*r +1)/2/s;

          return parseInt(d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg)));
        };
        communityList.map((v,i)=>{
          v['nowDistance'] = getFlatternDistance(s['lat'], s['lng'], v['communityLatitude'], v['communityLongitude']);
          if(i===0){
            minDistance = v['nowDistance'];
            minCommunity = v;
          }else if(minDistance>v['nowDistance']){
            minDistance = v['nowDistance'];
            minCommunity = v;
          }
        });
        if(minDistance>5000){
          minCommunity = {};
        }
        return minCommunity;
      };

      http('community-api/community/base/getProvinces', {queryCondition:{
        isVirtual:0, platformField:3, isOpen:1
      }}, {includeApi:true})
        .then(function(suc){
          let provinceList = suc;

          /*定位*/
          new qq.maps.Geolocation('T46BZ-GJTK6-PGCSF-MDXHE-XMGXT-4XFV5', 'vux').getLocation(function(s) {
            console.log({s:s});
            let flag = false;

            provinceList.map((v,i)=>{
              if(s['province'] === v['provinceName']){

                /*获取省份数据*/
                http('community-api/community/base/listPage', {queryCondition:{
                  isVirtual:0, platformField:3, isOpen:1, provinceId:v['provinceId']
                }, pageSize:0, currentPage:0}, {includeApi:true})
                  .then(function(suc){
                    if(suc && suc.dataList){
                      let communityList = suc.dataList;
                      let community = getNearestCommunity(s, communityList);

                      if(community['provinceId'] && community['communityId'] && community['communityName']){
                        flag = true;
                        localStorage['selectArea'] = JSON.stringify(community);
                        localStorage.communityId = community.communityId;
                        localStorage.communityName = community.cityName + community.communityName;
                        localStorage['selectArea'] = JSON.stringify(community);
                        _this.communityName = localStorage.communityName;

                        _this.initIndex(community['communityId']);
                      }

                      if(flag === false){
                        _this.$router.push('/SelectArea');
                      }
                    }
                  });

              }
            });


          }, function (err) {
            console.log({err:err});
            _this.$router.push('/SelectArea');
          });
        });



    },
    /*获取首页广告位*/
    getAdInfoByPosId(commnuityId){
      let _this = this;
      let getBannerList = function (suc) {
        let imgList = [];
        if(suc && suc.length>0){
          suc.map((v,i)=>{
            imgList.push({url:v['linkUrl'], img:imgFormat(v['picUrl'],'750X200')})
          })
        }
        return imgList;
      };
      /*获取省份数据*/
      http('ht-mj-cms-server/adPos/getAdInfoByPosId', {adPosCommnuityVo:{commnuityId:commnuityId, posName:'首页-移动端'}})
        .then(function(suc){
          let bannerList = getBannerList(suc);
          _this.bannerList = bannerList;
        });
    },
    /*设置底部导航列表*/
    setFooterList(){
      http('ht-mj-cms-server/bottomNav/getList', {})
        .then(function(suc){
          this.footerList = suc;
        }.bind(this));
    },
    /*前端套餐列表*/
    getPackageList(communityId){
      http('ht-mj-goods-server/package/queryPackageListForWechat', {communityId:communityId})
        .then(function(suc){
          this.packageList = suc;
        }.bind(this), function (err) {});
    },
    /*获取标题*/
    getTitle(){
      http('ht-mj-cms-server/homeMobile/getTitle', {})
        .then(function(suc){
          if(suc && suc.adName){
            window.document.title = suc.adName;
          }
        }.bind(this), function (err) {});
    },
    /*获取购物车的数量*/
    getCartNum(communityId){
      if(checkLogin()){
        http('ht-mj-cart-server/mjcarttotalnum', {communityId:communityId}, {showLoading:false}).then((v)=>{
          this.cartNum = v;
        })
      }else{
        let cartNum = 0;
        let list = getCart().list;
        if(list && list.length>0){
          list.map((v,i)=>{
            cartNum+= v['goodsNum'];
          })
        }
        this.cartNum = cartNum;
      }
    },
    /*获取其他配置信息*/
    getConfigInfo(){
      http('ht-mj-cms-server/homePage/showNavPage', {})
        .then(function(suc){
          if(suc && suc.homeMobileTitle && suc.homeMobileTitle.adName){
            window.document.title = suc.homeMobileTitle.adName;
          }
          if(suc && suc.bottomNavList){
            this.footerList = suc.bottomNavList;
          }
        }.bind(this), function (err) {});
    },
    /*初始化首页*/
    initIndex(communityId){
      this.getAdInfoByPosId(communityId);
      this.getPackageList(communityId);
      this.getCartNum(communityId);

      // this.getTitle();
      // this.setFooterList();
      this.getConfigInfo();
      window.addEventListener('scroll', this.handleScroll);
    }
  },

  mounted:function(){
    wx.showAllNonBaseMenuItem();

    this.isIphoneX = isIphoneX();

    // let selectArea = localStorage['selectArea']?JSON.parse(localStorage['selectArea']):{};
    let communityId = parseInt(localStorage.communityId);
    if(!communityId){
      this.setNearestCommunity();
    }else{
      this.initIndex(communityId);
    }
  },
  data () {
    return {
      isIphoneX:false,
      hide:false,
      communityName: localStorage.communityName,
      searchShow:true,
      cartNum:0,
      bannerList:[],
      footerList:[],
      packageList:[]
    }
  }
}

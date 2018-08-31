
import {
  Cell, XInput, Group, XButton, Swiper, SwiperItem, CheckIcon, Divider, Flexbox, FlexboxItem, Search,
  Tabbar, TabbarItem, XSwitch, Icon, Scroller, LoadMore
} from 'vux'
import http from "@/http";
import {imgFormat} from '@/utils/filter.js';
import {checkLogin, isIphoneX} from '@/utils/common'
import {getCart} from '@/utils/cart'
import wx from '@/lib/wxTools'

export default {
  components: {
    Cell, XInput, Group, XButton, Swiper, SwiperItem, CheckIcon, Divider, Flexbox, FlexboxItem, Search,
    Tabbar, TabbarItem, XSwitch, Icon, Scroller, LoadMore
  },
  methods: {
    onScrollBottom(){
      let _this = this;
      let onFetching = this.loading.onFetching;
      if(onFetching==false){
        this.loading.onFetching = true;
        let shopPager = this.shopPager;
        let moreShopPager = this.moreShopPager;
        if(shopPager.finish == false){
          this.queryStore();
        }else if(moreShopPager.finish == false){
          this.queryMoreStore();
        }else{
          this.loading.show=false;
          this.loading.tip='没有更多了';
        }
      }
    },
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
    handleScroll(position){
      // let scroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      if(position.top>44){
        this.searchShow = false;
      }else{
        this.searchShow = true;
      }
    },
    /*设置最近小区*/
    setNearestCommunity(){
      let _this = this;


      /*获取最短路径*/
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
          if(i==0){
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


          });
        });
    },
    /*获取首页广告位*/
    getAdInfoByPosId(commnuityId){
      let _this = this;
      let getBannerList = function (suc) {
        let bannerList = [];
        if(suc && suc.length>0){
          suc.map((v,i)=>{
            bannerList.push({url:v['linkUrl'], img:imgFormat(v['picUrl'],'750X200')})
          })
        }
        return bannerList;
      };
      /*获取轮播图数据*/
      http('ht-mj-cms-server/adPos/getAdInfoByPosId', {adPosCommnuityVo:{commnuityId:commnuityId, posName:'商城页-移动端'}})
        .then(function(suc){
          let bannerList = getBannerList(suc);
          _this.bannerList = bannerList;
        });
    },
    /*设置导航入口列表接口*/
    setNavList(){
      http('ht-mj-cms-server/mallPage/getNavList', {})
        .then(function(suc){
          if(suc && suc.length>0){
            let menuList = [];
            let page = 0;
            suc.map((v,i)=>{
              if(i%4 == 0){
                page++;
                menuList.push({page:page, children:[v]});
              }else{
                menuList[page-1]['children'].push(v);
              }
            });
            this.menuList = menuList;
          }
          // this.merchantBase = suc;
        }.bind(this));
    },
    /*设置底部导航列表*/
    setFooterList(){
      http('ht-mj-cms-server/bottomNav/getList', {})
        .then(function(suc){
          this.footerList = suc;
        }.bind(this));
    },
    /*查询更多店铺*/
    queryMoreStore(){
      let _this = this;
      let moreShopList = this.moreShopList;
      let pager = this.moreShopPager;
      let communityId = localStorage.communityId;
      let searchParams = {
        communityId:parseInt(communityId),
        limitGoodsNum:5,
        pageInfo:{
          currPage:pager.currPage,
          pageSize:pager.pageSize
        }
      };
      if(pager.finish == false){
        http('ht-mj-merchant-server/merchantBase/queryMoreStore', {storeParam:searchParams})
          .then(function(suc){
            if(suc.dataList){
              _this.moreShopList = moreShopList.concat(suc.dataList);
              if(suc.dataList.length<pager.pageSize){
                pager.finish = true;

                _this.loading.show=false;
                _this.loading.tip='没有更多了';
              }else{
                pager.currPage++;
              }
            }
            _this.loading.onFetching = false;
          }.bind(this));
      }
    },
    /*查询小区项目内的商家店铺列表*/
    queryStore(){
      let _this = this;
      let shopList = this.shopList;
      let pager = this.shopPager;
      let communityId = localStorage.communityId;
      let searchParams = {
        communityId:parseInt(communityId),
        limitGoodsNum:5,
        pageInfo:{
          currPage:pager.currPage,
          pageSize:pager.pageSize
        }
      };
      if(pager.finish == false){
        http('ht-mj-merchant-server/merchantBase/queryRecommendStore', {storeParam:searchParams})
          .then(function(suc){
            if(suc.dataList){
              _this.shopList = shopList.concat(suc.dataList);
              if(suc.dataList.length<pager.pageSize){
                pager.finish = true;

                /*更多店铺*/
                let moreShopPager = this.moreShopPager;
                if(moreShopPager.finish == false){
                  this.queryMoreStore();
                }else{
                  this.loading.show=false;
                  this.loading.tip='没有更多了';
                }
              }else{
                pager.currPage++;
              }
            }
            _this.loading.onFetching = false;
          }.bind(this));
      }
    },
    /*获取标题*/
    getTitle(){
      http('ht-mj-cms-server/mallPage/getMallPageTitle', {})
        .then(function(suc){
          if(suc && suc.adName){
            window.document.title = suc.adName;
          }
        }.bind(this), function (err) {});
    },
    /*获取购物车的数量*/
    getCartNum(communityId){
      if(checkLogin()){
        http('ht-mj-cart-server/mjcarttotalnum', {communityId:communityId}).then((v)=>{
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
          if(suc && suc.mallPageTitle && suc.mallPageTitle.adName){
            window.document.title = suc.mallPageTitle.adName;
          }
          if(suc && suc.bottomNavList){
            this.footerList = suc.bottomNavList;
          }
          if(suc.mallPageNavList && suc.mallPageNavList.length>0){
            let menuList = [];
            let page = 0;
            suc.mallPageNavList.map((v,i)=>{
              if(i%4 == 0){
                page++;
                menuList.push({page:page, children:[v]});
              }else{
                menuList[page-1]['children'].push(v);
              }
            });
            this.menuList = menuList;
          }
        }.bind(this), function (err) {});
    },
    initIndex(communityId){
      this.getAdInfoByPosId(communityId);
      this.getCartNum(communityId);

      // this.setNavList();
      // this.setFooterList();
      // this.getTitle();
      this.getConfigInfo();
      this.queryStore();
    }
  },

  mounted:function(){
    wx.showAllNonBaseMenuItem();

    this.isIphoneX = isIphoneX();

    let communityId = localStorage.communityId;
    if(!communityId){
      this.setNearestCommunity();
    }else{
      this.initIndex(communityId);
      // window.addEventListener('scroll', this.handleScroll);
    }
  },
  data () {
    return {
      isIphoneX:false,
      placeholder:'搜索商品、店铺',
      communityName: localStorage.communityName,
      locationTxt:'',
      searchShow:true,
      cartNum:0,
      loading:{
        onFetching:false,
        show:true,
        tip:'',
      },
      shopList:[],
      shopPager:{
        finish:false,
        currPage:1,
        pageSize:10,
      },
      moreShopList:[],
      moreShopPager:{
        finish:false,
        currPage:1,
        pageSize:10,
      },
      bannerList:[],
      menuList:[],
      footerList:[],
      packageList:[
        {packageId:1, mainImgUrl:'http://wx.htmimi.com/36b983a9a78a5057a4705d48f855f357.jpg', packageName:'精选套餐', totalPrice:88900,
          decorateStyleTShow:[{tagName:'中式'}],
          houseTypeShow:[{tagName:'两房一厅'},{tagName:'三房一厅'}]
        },
        {packageId:1, mainImgUrl:'http://wx.htmimi.com/36b983a9a78a5057a4705d48f855f357.jpg', packageName:'精选套餐', totalPrice:88900,
          decorateStyleTShow:[{tagName:'中式'}],
          houseTypeShow:[{tagName:'两房一厅'},{tagName:'三房一厅'}]
        }
      ],
      gridList:[
        {url:'http://img.jiaju.htmimi.cn/img/2017/4/17/14810702260661711334952_240X240.jpg'},
        {url:'http://img.jiaju.htmimi.cn/img/2017/6/26/15703396087411078371535_240X240.jpg'},
        {url:'http://img.jiaju.htmimi.cn/img/2017/6/26/15703513808837471391259_240X240.jpg'},
        {url:'http://img.jiaju.htmimi.cn/img/2017/6/26/15703214264434838789670_240X240.jpg'}
      ],
      gridList2:[
        {url:'http://img.jiaju.htmimi.cn/img/2017/4/17/14810702260661711334952_240X240.jpg'},
        {url:'http://img.jiaju.htmimi.cn/img/2017/6/26/15703396087411078371535_240X240.jpg'},
        {url:'http://img.jiaju.htmimi.cn/img/2017/6/26/15703513808837471391259_240X240.jpg'}
      ]
    }
  }
}

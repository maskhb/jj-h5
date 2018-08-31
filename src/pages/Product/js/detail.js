import Vue from 'vue'
import {
  TransferDom,ToastPlugin,
  Cell, XInput, Group, XHeader, Search, Icon, Flexbox, FlexboxItem, ViewBox, Swiper, SwiperItem, Rater,
  Tab, TabItem, XTable, Popup, XButton, Previewer
} from 'vux'
import SkuSelect from '@/components/skuSelect.vue';
import http from "@/http";
import {checkLogin} from '@/utils/common'
import {getCart, setCart} from '@/utils/cart'
import {imgFormat} from '@/utils/filter.js';
import wx from '@/lib/wxTools'

Vue.use(ToastPlugin);

export default {
  directives: {
    TransferDom
  },
  components: {
    SkuSelect,
    Cell, XInput, Group, XHeader, Search, Icon, Flexbox, FlexboxItem, ViewBox, Swiper, SwiperItem, Rater,
    Tab, TabItem, XTable, Popup, XButton, Previewer
  },
  methods: {
    detailChange(index){
      this.detailIndex = index;
    },
    showImg(index){
      this.$refs.previewer.show(index)
    },
    toBuy(skuId){
      if(this.detail.status === 2 && this.selectedSku.status === 2 && this.selectedSku.remainNum!==0 && this.sameCommunity){
        this.$router.push('/Mall/Confirm/' + skuId);
      }
    },

    handleScroll(){
      let scrollTop = document.documentElement.scrollTop;
      if(scrollTop>=700){
        this.showStick = true;
      }else{
        this.showStick = false;
      }
    },
    /*回到顶部*/
    goTop(){
      document.documentElement.scrollTop = 0;
    },
    showCart(){
      if(this.sameCommunity && this.detail.status===2){
        this.showPopup = true;
      }

    },
    addCart(skuId) {
      if(checkLogin()){
        http('ht-mj-cart-server/addskutomjcart', {communityId:localStorage.communityId, skuId:skuId, num:1}).then((v)=>{
          if(v){
            this.$vux.toast.text('成功加入购物车');
            this.mjcarttotalnum++;

            let cartLocal = getCart();
            let item = cartLocal.list.find(v2=>{return v2.skuId === skuId});
            if(item && item['goodsNum']){
              item['goodsNum'] = this.mjcarttotalnum;
              setCart(cartLocal);
            }
          }
        })
      }else{
        let cartLocal = getCart();
        let item = cartLocal.list.find(v=>{return v.skuId === skuId});
        if(item && item['goodsNum']){
          item['goodsNum']++
        }else{
          cartLocal.list.push({checkoutState: true, goodsNum: 1, skuId: skuId});
        }
        this.$vux.toast.text('成功加入购物车');

        let mjcarttotalnum = 0;
        cartLocal.list.forEach((v)=>{
          mjcarttotalnum += v.goodsNum
        });

        this.mjcarttotalnum = mjcarttotalnum;
        setCart(cartLocal)
      }
    },
    selectOK(item){
      let goodsType = this.detail.goodsType;
      if(goodsType === 1 || goodsType ===2){
        this.addCart(item.skuId);
      }

      this.selectedSku = item;
      this.showPopup = false;
    },
    onHide(){
      this.showPopup = false;
    },

    getDetail(skuId, packageId, spaceId){
      let _this = this;
      let searchParams = {
        skuId:skuId
      };
      if(packageId && spaceId){
        searchParams = {
          skuId:skuId,
          packageId:packageId,
          spaceId:spaceId
        }
      }
      http('ht-mj-goods-server/goods/foreQueryDetail', {foreQueryVo:searchParams})
        .then(function(suc){
          // suc.goodsSkuVoList[0]['remainNum'] = 0;

          /*获取店铺详情*/
          http('ht-mj-merchant-server/merchantBase/queryDetail', {merchantId:suc.merchantId})
            .then(function(merchantsuc){
              this.merchant=merchantsuc;
            }.bind(this));

          /*获取促销信息*/
          let promotionQueryVos = {
            goodsCategoryId:suc.goodsCategoryId,
            merchantId:suc.merchantId,
            skuId:skuId
          };
          http('ht-mj-promotion-server/promotionRule/foreQueryGoodsPromotion', {promotionQueryVos:promotionQueryVos})
            .then(function(suc){
              this.promotionList=suc;
            }.bind(this));


          if(suc.goodsSkuVoList){
            suc.goodsSkuVoList.map((v,i)=>{
              if(v['skuId'] === skuId){
                _this.selectedSku = v;
              }
            })
          }

          if(suc.isArrivalAll === 2 && suc.communityId){
            let flag = false;
            suc.communityId.map((v,i)=>{
              if(localStorage['communityId'] && v === parseInt(localStorage['communityId'])){
                flag = true;
              }
            });
            if(flag === false){
              this.sameCommunity = false;

              this.$vux.toast.text('当前商品所属项目不存在');
            }
          }

          suc.packageId = packageId;
          _this.detail=suc;

        }.bind(this), function(err){
          console.log({err:err});
        });
    },
    getTotalnum(skuId) {
      if(checkLogin()){
      http('ht-mj-cart-server/mjcarttotalnum', {communityId:localStorage.communityId}).then((v)=>{
        this.mjcarttotalnum = v;
      })
      }else{
        let cartNum = 0;
        let list = getCart().list;
        if(list && list.length>0){
          list.map((v,i)=>{
            cartNum+= v['goodsNum'];
          })
        }
        this.mjcarttotalnum = cartNum;
      }
    },
    getDetailTitleSetting(){
      http('ht-mj-cms-server/setting/getValueByKey/productDetailTitle', {})
        .then(function(suc){
          this.productDetailTitle = suc.value;
        }.bind(this))
    },
    toTel(mobile){
      location.href = "tel:" + mobile;
    }
  },

  mounted:function(){
    wx.showAllNonBaseMenuItem();

    let {params} = this.$route;
    if(params && params.skuId) {
      let packageId = 0, spaceId = 0;
      if(params.packageId && params.spaceId){
        packageId = params.packageId;
        spaceId = params.spaceId;
      }
      this.skuId = params.skuId;
      this.getDetail(parseInt(params.skuId), packageId, spaceId);
      this.getTotalnum();
      this.getDetailTitleSetting();
    }

    /*监听滚动事件*/
    window.addEventListener('scroll', this.handleScroll);
  },
  watch:{
    selectedSku(newVal, oldVal) {
      let imgList = [];
      if(newVal && newVal.goodsImgVoList){
        newVal.goodsImgVoList.map((v,i)=>{
          imgList.push({src:imgFormat(v['imgUrl'], '750X750')})
        });
      }
      this.imgList = imgList;
    }
  },
  data () {
    return {
      minHeight:document.documentElement.clientHeight,
      selectedSku:{},
      sameCommunity:true,
      skuId:0,
      imgList:[],
      detailIndex:0,
      mjcarttotalnum:0,
      // content:"<p style=\"text-align:center\"><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405282966935237928812.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405278402508414030153.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405297520716316273639.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405309614396767344878.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405314014600632466036.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405327793121137023295.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405338804121266743322.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405342192569991057404.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405358841544061506699.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405365112152418243601.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405379143190363593017.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405384867549268924201.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405393641128699454748.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405402247948068068867.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405418693573859300434.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405420259950098991253.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405439154442050232518.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405440901359112146007.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405458435524147295686.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405467046641321027187.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405482495414785639784.jpg\" /><br /><img src=\"http://img.jiaju.htmimi.cn/img/2017/2/25/14405479994740246070670.jpg\" /><br />&nbsp;</p>",
      showStick:false,
      showPopup:false,
      showTel:false,
      productDetailTitle:'',
      detail:{
        // goodsName:'喜临门 泰国进口天然乳胶枕 舒眠系列',
        // goodsImgGroupVoList:[],
        // goodsSkuVoList:[
        //   {isDefault:1, salePrice:88800, skuPropertyRelationVoSList:[
        //     { propertyKeyId:1, propertyKey:'颜色', propertyValueId:11, propertyValue:'红'},
        //     { propertyKeyId:2, propertyKey:'大小', propertyValueId:21, propertyValue:'大'},
        //     { propertyKeyId:3, propertyKey:'版本', propertyValueId:31, propertyValue:'1.0'},
        //   ]},
        //   {isDefault:0, salePrice:88800, skuPropertyRelationVoSList:[
        //     { propertyKeyId:1, propertyKey:'颜色', propertyValueId:11, propertyValue:'红'},
        //     { propertyKeyId:2, propertyKey:'大小', propertyValueId:22, propertyValue:'小'},
        //     { propertyKeyId:3, propertyKey:'版本', propertyValueId:31, propertyValue:'1.0'},
        //   ]},
        //   {isDefault:0, salePrice:88800, skuPropertyRelationVoSList:[
        //     { propertyKeyId:1, propertyKey:'颜色', propertyValueId:12, propertyValue:'白'},
        //     { propertyKeyId:2, propertyKey:'大小', propertyValueId:22, propertyValue:'小'},
        //     { propertyKeyId:3, propertyKey:'版本', propertyValueId:32, propertyValue:'2.0'},
        //   ]},
        //   {isDefault:0, salePrice:88800, skuPropertyRelationVoSList:[
        //     { propertyKeyId:1, propertyKey:'颜色', propertyValueId:13, propertyValue:'蓝'},
        //     { propertyKeyId:2, propertyKey:'大小', propertyValueId:22, propertyValue:'小'},
        //     { propertyKeyId:3, propertyKey:'版本', propertyValueId:32, propertyValue:'2.0'},
        //   ]},
        //   {isDefault:0, salePrice:88800, skuPropertyRelationVoSList:[
        //     { propertyKeyId:1, propertyKey:'颜色', propertyValueId:14, propertyValue:'黄'},
        //     { propertyKeyId:2, propertyKey:'大小', propertyValueId:22, propertyValue:'小'},
        //     { propertyKeyId:3, propertyKey:'版本', propertyValueId:33, propertyValue:'3.0'},
        //   ]}
        // ]
      },
      merchant:{
      },
      promotionList:[]
    }
  }
}

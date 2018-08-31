import MJSearch from '@/components/search.vue'
import SearchHeader from '@/components/searchHeader.vue'

import { TransferDom, Cell, XInput, Group, XHeader, Search, Icon, Flexbox, FlexboxItem, Sticky,
  Tab, TabItem, Drawer, ViewBox, Popup, Scroller, Swiper, LoadMore
} from 'vux'
import http from "@/http";

export default {
  directives: {
    TransferDom
  },
  components: {
    MJSearch, SearchHeader,
    Cell, XInput, Group, XHeader, Search, Icon, Flexbox, FlexboxItem, Sticky,
    Tab, TabItem, Drawer, ViewBox, Popup, Scroller, Swiper, LoadMore
  },
  methods: {
    priceSort(index){
      this.selectedIndex = index;
      if(index === 2){
        if(this.priceClass === ''){
          this.priceClass = 'top';
        }else if(this.priceClass === 'top'){
          this.priceClass = 'bottom';
        }else{
          this.priceClass = 'top';
        }
      }else{
        this.priceClass = '';
      }
      this.loadProductList(true);
    },
    filtrate(){
      this.filterVisiable = true;
    },
    handleScroll(){
      let scrollTop = this.$refs.viewBox.getScrollTop();
      if(scrollTop>=700){
        this.showStick = true;
      }else{
        this.showStick = false;
      }
      let scrollBodyHeight =  this.$refs.viewBoxBody.scrollHeight;
      if(scrollBodyHeight-scrollTop-this.clientHeight<50){
        this.loadProductList()
      }
    },
    loadProductList(isReset){
      let _this = this;
      let merchantId = this.merchantBase.merchantId;
      let pager = this.productPager;
      let productList = this.productList;
      if(isReset){
        pager.finish = false;
        pager.isLoading = false;
        pager.currPage = 1;
        productList = [];

        this.$refs.viewBox.scrollTo(0);
      }

      if(pager.finish == false && pager.isLoading == false){
        pager.isLoading =true;

        let drawerList = this.drawerList;
        let goodsCategoryIds=[],marketingCategoryIds=[],spaceIds=[];
        drawerList.map((v,i)=>{
          let arr = [];
          if(v['goodsScreenAttrVos']){
            v['goodsScreenAttrVos'].map((gv,gi)=>{
              if(gv['isSelected']){
                arr.push(parseInt(gv['id']));
              }
            });
            switch (v['key']){
              case 'marketingCategoryId':
                marketingCategoryIds = arr;
                break;
              case 'goodsCategoryId':
                goodsCategoryIds = arr;
                break;
              case 'spaceId':
                spaceIds = arr;
                break;
            }
          }
        });

        let selectedIndex = this.selectedIndex;
        let searchParams = {
          merchantId: parseInt(merchantId),
          pageInfo: {
            currPage: pager.currPage,
            pageSize: pager.pageSize
          }
        };
        if(goodsCategoryIds.length>0){
          searchParams.goodsCategoryIds = goodsCategoryIds;
        }
        if(marketingCategoryIds.length>0){
          searchParams.marketingCategoryIds = marketingCategoryIds;
        }
        if(spaceIds.length>0){
          searchParams.spaceIds = spaceIds;
        }
        if(goodsCategoryIds.length>0 || marketingCategoryIds.length>0 || spaceIds.length>0){
          this.isFilter = true;
        }else{
          this.isFilter = false;
        }
        switch (selectedIndex){
          case 0:
            searchParams['pageInfo']['orderField'] = 'sa.updated_time';
            break;
          case 1:
            searchParams['pageInfo']['orderField'] = 'sa.sales_volume';
            break;
          case 2:
            searchParams['pageInfo']['orderField'] = 'sa.sale_price';
            if(this.priceClass == 'top'){
              searchParams['pageInfo']['orderType'] = 'asc';
            }
            break;
        }
        http('ht-mj-goods-server/goods/foreQueryListByPage', {goodsSkuInfoQ:searchParams})
          .then(function(suc){
            if(suc.dataList){
              _this.productList = productList.concat(suc.dataList);
              if(suc.dataList.length<pager.pageSize){
                pager.finish = true;
              }else{
                pager.currPage++;
              }
            }
            pager.isLoading =false;
          }.bind(this));
      }
    },
    /*回到顶部*/
    goTop(){
      this.$refs.viewBox.scrollTo(0);
    },
    /*选择品类*/
    selectCategory(pIndex, index){
      let drawerList = this.drawerList;
      let selectItem = drawerList[pIndex]['goodsScreenAttrVos'][index];
      if(selectItem && selectItem.isSelected){
        selectItem.isSelected = false;
      }else{
        selectItem.isSelected = true;
      }
      this.$set(drawerList[pIndex]['goodsScreenAttrVos'], index, selectItem);
    },
    /*获取店铺详情*/
    getStoreDetail(merchantId){
      http('ht-mj-merchant-server/merchantBase/queryDetail', {merchantId:merchantId})
        .then(function(suc){
          this.merchantBase = suc;
        }.bind(this));
    },
    /*获取筛选分类*/
    getDrawerList(merchantId){
      let searchParams = { merchantId:merchantId};
      http('ht-mj-goods-server/goods/queryGoodsScreen', {goodsScreenQ:searchParams})
        .then(function(suc){
          suc.map((v,i)=>{
            v['expand'] = false;
          });
          this.drawerList = suc;
        }.bind(this));
    },
    /*获取店铺套餐列表*/
    getStorePackage(merchantId){
      let searchParams = { merchantId:merchantId};
      http('ht-mj-goods-server/package/queryPackageListForShop', searchParams)
        .then(function(suc){
          this.packageList = suc;
        }.bind(this));
    },
    /*清空选中*/
    cleanSelect(){
      let drawerList = this.drawerList.concat([]);
      drawerList.map((v,i)=>{
        if(v['goodsScreenAttrVos']){
          v['goodsScreenAttrVos'].map((gv,gi)=>{
            gv['isSelected'] = false;
          })
        }
      });
      this.drawerList = drawerList;
    },
    /*筛选查询*/
    filterOk(){
      this.filterVisiable = false;
      this.loadProductList(true);
    }
  },

  mounted:function(){
    let {params} = this.$route;
    if(params && params.mid){
      let merchantId = parseInt(params.mid);
      this.merchantBase.merchantId = merchantId;

      this.getStoreDetail(merchantId);
      this.getDrawerList(merchantId);
      this.getStorePackage(merchantId);
      this.loadProductList();
    }

    /*监听滚动事件*/
    this.$refs.viewBox.getScrollBody().addEventListener('scroll', this.handleScroll);
  },
  data () {
    return {
      clientHeight:document.documentElement.clientHeight,
      showStick:false,
      isFilter:false,
      priceClass:'',
      filterVisiable:false,
      selectedIndex:0,
      merchantBase:{
        merchantId:'',
        logoImgUrl:'',
        mainImgUrl:'',
        merchantName:''
      },
      packageList:[
      ],
      drawerList:[
      ],
      productPager:{
        currPage:1,
        pageSize:20,
        isLoading:false,
        finish:false,
      },
      productList:[
      ]
    }
  }
}

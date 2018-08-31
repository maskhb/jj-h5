import MJSearch from '@/components/search.vue'
import SearchHeader from '@/components/searchHeader.vue'
import http from "@/http";

import { TransferDom,
  Cell, XInput, Group, XHeader, Search, Icon, Flexbox, FlexboxItem, Sticky,
  Tab, TabItem, Drawer, ViewBox, Popup, Scroller, LoadMore
} from 'vux'

export default {
  directives: {
    TransferDom
  },
  components: {
    MJSearch, SearchHeader,
    Cell, XInput, Group, XHeader, Search, Icon, Flexbox, FlexboxItem, Sticky,
    Tab, TabItem, Drawer, ViewBox, Popup, Scroller, LoadMore
  },
  methods: {
    changeType(index){
      this.selectedType = index;
    },
    priceSort(index){
      this.selectedIndex = index;
      if(index == 2){
        if(this.priceClass == ''){
          this.priceClass = 'top';
        }else if(this.priceClass == 'top'){
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
      if(scrollBodyHeight-scrollTop-this.clientHeight<10){
        let selectedType = this.selectedType;
        switch (selectedType){
          case 0:
            this.loadProductList();
            break;
          case 1:
            this.loadStoreList();
            break;
        }

      }
    },
    loadProductList(isReset){
      let _this = this;
      let searchTxt = this.searchTxt;
      let pager = this.productPager;
      let productList = this.productList;
      if(isReset){
        pager.finish = false;
        pager.isLoading = false;
        pager.currPage = 1;
        productList = [];
        this.$refs.viewBox.scrollTo(0);
      }

      if(pager.finish === false && pager.isLoading === false){
        pager.isLoading =true;

        let selectedIndex = this.selectedIndex;
        let searchParams = {
          communityId:localStorage['communityId'],
          goodsName: searchTxt,
          pageInfo: {
            currPage: pager.currPage,
            pageSize: pager.pageSize
          }
        };
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
            pager.hasPost = true;
          }.bind(this));
      }

    },
    loadStoreList(isReset){
      let _this = this;
      let storePager = this.storePager;
      let storeList = this.storeList;
      let searchTxt = this.searchTxt;
      if(isReset){
        storePager.finish = false;
        storePager.isLoading = false;
        storePager.currPage = 1;
        storeList = [];
        this.$refs.viewBox.scrollTo(0);
      }

      if(storePager.isLoading === false && storePager.finish===false){
        storePager.isLoading =true;

        let searchParams = {
          storeParam:{
            communityId:localStorage.communityId,
            limitGoodsNum:5,
            merchantStoreName:searchTxt,
            pageInfo:{
              currPage:storePager.currPage,
              pageSize:storePager.pageSize
            }
          }
        };

        /*获取店铺详情*/
        http('ht-mj-merchant-server/merchantBase/searchStore', searchParams)
          .then(function(suc){
            if(suc.dataList){
              _this.storeList = storeList.concat(suc.dataList);
              if(suc.dataList.length<storePager.pageSize){
                storePager.finish = true;
              }else{
                storePager.currPage++;
              }
            }
            storePager.isLoading =false;
            storePager.hasPost = true;
          }.bind(this));
      }

    },

    /*回到顶部*/
    goTop(){
      this.$refs.viewBox.scrollTo(0);
    },
    /*选择品类*/
    selectCategory(pindex, index){
      let selectItem = this.drawerList[pindex]['children'][index];
      if(selectItem && selectItem.isSelected){
        selectItem.isSelected = false;
      }else{
        selectItem.isSelected = true;
      }
    },
    /*搜索*/
    search(key){
      if(key){
        // this.$router.push('/Search/Result/' + key);
        this.searchTxt = key;
        this.loadProductList(true);
        this.loadStoreList(true);
      }

    }
  },

  mounted(){
    /*监听滚动事件*/
    this.$refs.viewBox.getScrollBody().addEventListener('scroll', this.handleScroll);

    let {params} = this.$route;
    if(params && params.searchTxt){
      this.searchTxt = params.searchTxt;

      this.loadProductList();
      this.loadStoreList();

    }
  },
  data () {
    return {
      clientHeight:document.documentElement.clientHeight,
      showStick:false,
      priceClass:'',
      filterVisiable:false,
      searchTxt:'',
      selectedType:0,
      selectedIndex:0,
      productList:[
        // {name:'康尔馨浴巾 纯棉 成人吸水柔软大浴巾 纯净白', price:6900, imgUrl:'http://img.jiaju.htmimi.cn/img/2017/7/25/16208953558888104266353_200X200.png'},
        // {name:'康尔馨浴巾 纯棉 成人吸水柔软大浴巾 纯净白', price:5900, imgUrl:'http://img.jiaju.htmimi.cn/img/2017/7/25/16208953558888104266353_200X200.png'},
        // {name:'康尔馨浴巾 纯棉 成人吸水柔软大浴巾 纯净白', price:8900, imgUrl:'http://img.jiaju.htmimi.cn/img/2017/7/25/16208953558888104266353_200X200.png'},
        // {name:'康尔馨浴巾 纯棉 成人吸水柔软大浴巾 纯净白', price:4900, imgUrl:'http://img.jiaju.htmimi.cn/img/2017/7/25/16208953558888104266353_200X200.png'},
        // {name:'康尔馨浴巾 纯棉 成人吸水柔软大浴巾 纯净白', price:5700, imgUrl:'http://img.jiaju.htmimi.cn/img/2017/7/25/16208953558888104266353_200X200.png'},
        // {name:'康尔馨浴巾 纯棉 成人吸水柔软大浴巾 纯净白', price:6800, imgUrl:'http://img.jiaju.htmimi.cn/img/2017/7/25/16208953558888104266353_200X200.png'},
        // {name:'康尔馨浴巾 纯棉 成人吸水柔软大浴巾 纯净白', price:8900, imgUrl:'http://img.jiaju.htmimi.cn/img/2017/7/25/16208953558888104266353_200X200.png'},
        // {name:'康尔馨浴巾 纯棉 成人吸水柔软大浴巾 纯净白', price:4900, imgUrl:'http://img.jiaju.htmimi.cn/img/2017/7/25/16208953558888104266353_200X200.png'},
        // {name:'康尔馨浴巾 纯棉 成人吸水柔软大浴巾 纯净白', price:5700, imgUrl:'http://img.jiaju.htmimi.cn/img/2017/7/25/16208953558888104266353_200X200.png'},
        // {name:'康尔馨浴巾 纯棉 成人吸水柔软大浴巾 纯净白', price:6800, imgUrl:'http://img.jiaju.htmimi.cn/img/2017/7/25/16208953558888104266353_200X200.png'},
      ],
      productPager:{
        hasPost:false,
        currPage:1,
        pageSize:20,
        isLoading:false,
        finish:false,
      },
      storeList:[
        // { name:'安庆恒大自营店1', amount:20},
        // { name:'安庆恒大自营店2', amount:20},
        // { name:'安庆恒大自营店3', amount:20},
        // { name:'安庆恒大自营店4', amount:20},
        // { name:'安庆恒大自营店5', amount:20},
        // { name:'安庆恒大自营店6', amount:20},
      ],
      storePager:{
        hasPost:false,
        currPage:1,
        pageSize:20,
        isLoading:false,
        finish:false,
      }
    }
  }
}

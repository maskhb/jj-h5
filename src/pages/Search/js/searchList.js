import MJSearch from '@/components/search.vue'
import SearchHeader from '@/components/searchHeader.vue'

import { TransferDom,
  Cell, XInput, Group, XHeader, Search, Icon, Flexbox, FlexboxItem, Sticky,
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
      if(scrollBodyHeight-scrollTop-this.clientHeight<50){
        this.loadProductList();
      }
    },
    loadProductList(isReset){
      let _this = this;
      let goodsCategoryId = this.goodsCategoryId;
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

        /*获取筛选条件*/
        let drawerList = this.drawerList;
        let newGoodsCategoryIds = [];
        drawerList.map((v,i)=>{
          if(v['key'] == 'goodsCategoryId' && v['goodsScreenAttrVos']){
            v['goodsScreenAttrVos'].map((gv,gi)=>{
              if(gv['isSelected']){
                newGoodsCategoryIds.push(parseInt(gv['id']));
              }
            })
          }
        });

        let selectedIndex = this.selectedIndex;
        let searchParams = {
          communityId: localStorage['communityId'],
          goodsCategoryIds: [parseInt(goodsCategoryId)],
          pageInfo: {
            currPage: pager.currPage,
            pageSize: pager.pageSize
          }
        };
        if(newGoodsCategoryIds.length>0){
          this.isFilter = true;
          searchParams.goodsCategoryIds = newGoodsCategoryIds;
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
    /*获取品类列表*/
    queryGoodsScreen(goodsCategoryId){
      let searchParams = {goodsCategoryId:goodsCategoryId};
      http('ht-mj-goods-server/goods/queryGoodsScreen', {goodsScreenQ:searchParams} )
        .then(function(suc){
          suc.map((v,i)=>{
            v['expand'] = false;
          });
          this.drawerList = suc;
        }.bind(this));
    },
    /*查询分类详情*/
    queryCategoryDetail(goodsCategoryId){
      http('ht-mj-goods-server/goodsCategory/queryDetail', {categoryId :goodsCategoryId} )
        .then(function(suc){
          this.category = suc;
          window.document.title = suc.categoryName;
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
    if(params && params.cid){
      let goodsCategoryId = parseInt(params.cid);
      this.goodsCategoryId = goodsCategoryId;
      this.queryGoodsScreen(goodsCategoryId);
      this.loadProductList();
      this.queryCategoryDetail(goodsCategoryId);
    }


    /*监听滚动事件*/
    this.$refs.viewBox.getScrollBody().addEventListener('scroll', this.handleScroll);
  },
  data () {
    return {
      clientHeight:document.documentElement.clientHeight,
      goodsCategoryId:0,
      showStick:false,
      selectedIndex:0,
      isFilter:false,
      priceClass:'',
      category:{
        categoryName:'',
        categoryUrl:''
      },
      filterVisiable:false,
      bannerList:[{
        url: 'javascript:',
        img: 'http://img.jiaju.htmimi.com/img/2016/6/13/861796_640X640.jpg',
        title: ''
      }, {
        url: 'javascript:',
        img: 'http://img.jiaju.htmimi.com/img/2015/12/24/91320_640X640.jpg',
        title: ''
      }, {
        url: 'javascript:',
        img: 'http://img.jiaju.htmimi.com/img/2016/1/14/191131_640X640.jpg',
        title: '',
        fallbackImg: 'http://img.jiaju.htmimi.com/img/2015/12/23/80089_640X640.jpg'
      }],
      drawerList:[
        // {name:'品类1', children:[
        //   {name:'餐厨器具', isSelected:true},
        //   {name:'精致家纺', isSelected:false},
        //   {name:'小家电', isSelected:false},
        // ]},
        // {name:'品类2', children:[
        //   {name:'餐厨器具', isSelected:false},
        //   {name:'精致家纺', isSelected:false},
        //   {name:'小家电', isSelected:false},
        // ]},
        // {name:'品类3', children:[
        //   {name:'餐厨器具', isSelected:false},
        //   {name:'精致家纺', isSelected:false},
        //   {name:'小家电', isSelected:false},
        // ]}
      ],
      productPager:{
        currPage:1,
        pageSize:20,
        finish:false,
        isLoading:false
      },
      productList:[
        // {},{},{},{},{},{},
      ]
    }
  }
}

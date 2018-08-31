
import {
  Cell, XInput, Group, XHeader, Search, Icon, Flexbox, FlexboxItem, ViewBox
} from 'vux'
import http from "@/http";
import {clearCart} from '@/utils/cart'

export default {
  components: {
    Cell, XInput, Group, XHeader, Search, Icon, Flexbox, FlexboxItem, ViewBox
  },
  methods: {
    selectProvince(index){
      this.selectProvinceIndex = index;
      this.communityList = [];
      this.loadCommunityList();
    },
    selectAfter(item){
      let selectArea = item;
      localStorage['selectArea'] = JSON.stringify(selectArea);
      localStorage.communityId = selectArea.communityId;
      localStorage.communityName = selectArea.cityName + selectArea.communityName;
      clearCart();
      // let provinceId = this.provinceList[selectProvinceIndex]['provinceId'];
      // let communityId = this.provinceList[selectProvinceIndex]['children'][cIndex]['communityId'];
      // let communityName = this.provinceList[selectProvinceIndex]['children'][cIndex]['communityName'];
      // localStorage.provinceId = provinceId;
      // localStorage.communityId = communityId;
      // localStorage.communityName = communityName;
      //
      this.$router.back(-1);
    },
    getProvinceList(data){
      let provinceList = [];
      if(data&&data.length>0){
        data.map((v,i)=>{
          let flag = true;
          provinceList.map((pv,pi)=>{
            if(pv['provinceId'] == v['provinceId']){
              flag = false;
              pv['children'].push(v);
            }
          });
          if(flag){
            provinceList.push({provinceName:v['provinceName'], provinceId:v['provinceId'], children:[v]})
          }
        })
      }
      return provinceList;
    },

    /*加载省*/
    loadProvinceList(){
      let _this = this;
      http('community-api/community/base/getProvinces', {queryCondition:{
        isVirtual:0, platformField:3, isOpen:1
      }}, {includeApi:true})
        .then(function(suc){
          _this.provinceList = suc;

          /*初始化*/
          _this.selectProvinceIndex = 0;
          _this.provinceList.map((v,i)=>{
            if(_this.provinceId && v['provinceId'] === _this.provinceId){
              _this.selectProvinceIndex = i;
            }
          });

          _this.loadCommunityList();

        });
    },
    /*加载小区*/
    loadCommunityList(){
      let provinceList = this.provinceList;
      let selectProvinceId = provinceList[this.selectProvinceIndex]['provinceId'];
      http('community-api/community/base/listPage', {queryCondition:{
        isVirtual:0, platformField:3, isOpen:1, provinceId:selectProvinceId
      }, pageSize:0, currentPage:0}, {includeApi:true})
        .then(function(suc){
          if(suc && suc.dataList){
            this.communityList = suc.dataList;
          }
        }.bind(this));

    },
    /*头部文案配置*/
    getProjectItemTitleSetting(){
      http('ht-mj-cms-server/setting/getValueByKey/projectItemTitle', {})
        .then(function(suc){
          this.projectItemTitle = suc.value;
        }.bind(this))
    }
  },

  mounted:function(){
    let selectArea = localStorage['selectArea']?JSON.parse(localStorage['selectArea']):{};
    this.communityId = selectArea['communityId'];
    this.provinceId = selectArea['provinceId'];
    this.loadProvinceList();
    this.getProjectItemTitleSetting();
  },
  data () {
    return {
      viewHeight:document.documentElement.clientHeight-35,
      communityId: '',
      provinceId:'',
      selectProvinceIndex:'',
      projectItemTitle:'',
      provinceList:[],
      communityList:[]
    }
  }
}

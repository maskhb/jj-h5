<template>
  <div>
    <scroller lock-x scrollbar-y use-pullup use-pulldown
              :pulldown-config="pulldownConfig"
              :pullup-config="pullupConfig"
              @on-pullup-loading="onReachBottom" @on-pulldown-loading="onPullDownRefresh"
              v-model="status" ref="scroller">
      <div class="container">
        <div class="broadList">
          <router-link class="broadItem" v-for="(item, index) in broadList" :key="index" :to="'/broadCast/detail/' + item['broadcastId']">
            <span class="bTitle">{{item.title}}</span>
            <div class="infoView">
              <span class="bTime">{{new Date(item.announceTime).format('MM-dd')}}</span>
              <span class="bType type_1"></span>
            </div>
            <div v-if="item.header">

              <div class="imgDom">
                <img :src="item.header" />
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <!--pulldown slot-->
      <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
        <span v-show="status.pulldownStatus === 'default'"></span>
        <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' || status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">↓</span>
        <span v-show="status.pulldownStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
      <!--pullup slot-->
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up" style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="status.pullupStatus === 'default'"></span>
        <span class="pullup-arrow" v-show="status.pullupStatus === 'down' || status.pullupStatus === 'up'" :class="{'rotate': status.pullupStatus === 'up'}">↑</span>
        <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
    </scroller>

  </div>
</template>

<script>
import { Cell, Scroller, Spinner, XSwitch } from 'vux'
import http from "@/http";
import appObj from "@/lib/appTools/request-app.js";

export default {
  components: {
    Cell,
    Scroller,
    Spinner,
    XSwitch
  },
  methods: {
    /*加载列表*/
    loadList: function (postData, cb) {
      let _this = this;
      const ht_env = process.env.HT_ENV;
      http('property-api/broadcast/findBroadcasts', postData, {useEncrypt:true, includeApi:true})
          .then(function(data){
            _this.broadList = data;
            if(cb && typeof cb == 'function'){
              cb();
            }
          }, function(err){
            console.log({err:err});
          });

//      http('user-api/user/getUserInfo')
//        .then(function(suc){
//          console.log({suc:suc});
//        }, function(err){
//        });
    },
    /* 上拉加载 */
    onReachBottom: function(){
      let _this = this;
      let pager = _this.pager;
      pager.currentPage++ ;
      let postData = Object.assign({}, this.searchParam, pager);
      http('property-api/broadcast/findBroadcasts', postData)
        .then(function(data){
          let broadList = _this.broadList;
          if(data && data.result && data.result.length>0){
            broadList = broadList.concat(data.result);
          }else{
            pager.currentPage--;
          }
          _this.broadList = broadList;
          _this.status.pullupStatus = 'default';
//          _this.$refs.scroller.donePullup();
        }, function(err){

        });
    },
    /* 下拉刷新 */
    onPullDownRefresh:function(){
      let _this = this;
      let pager = this.pager;
      pager.currentPage = 1;
      let postData = Object.assign({}, this.searchParam, pager);
      this.loadList(postData, function (){
        _this.$nextTick(() => {
//        this.$refs.scroller.donePulldown();
          _this.status.pulldownStatus = 'default';
        })
      });


    }
  },

  mounted:function(){
    let postData = Object.assign({}, this.searchParam, this.pager);



    this.loadList(postData);
  },
  data () {
    return {
      pulldownConfig:{
        content: '下拉刷新',
        downContent: '下拉刷新',
        upContent: '加载中...',
        loadingContent: '加载完成',
        clsPrefix: 'xs-plugin-pulldown-'
      },
      pullupConfig: {
        content: '上拉加载更多',
        downContent: '松开进行加载',
        upContent: '上拉加载更多',
        loadingContent: '加载中...'
      },
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },
      broadList:[],
      searchParam:{broadcast:{communityId:139, isDelete:1}},
      pager:{
        pageSize:10,
        currentPage:1
      }
    }
  }
}
</script>

<style scoped>
  .broadMain{ position: absolute;left: 0; top:0; bottom: 0;}
  .broadList{ padding: 30px; font-size: 12PX; background-color: #fff;}
  .broadItem{ border-bottom: 1PX solid #e5e4e8; margin-bottom: 15px; display: block; color:#000;}
  .bTitle{ font-size: 14PX; font-weight: bold; margin-bottom: 10px; display: inline-block;}
  .bTime{ color:#6a6970;}
  .bType{ color:#f2a944; border: 1PX solid #FFBD63; font-size: 10PX; padding: 0 6px; margin-left: 20px; border-radius: 8px; line-height: 20px;}
  .bType.type_1{ color:red; border-color: red;}
  .bType.type_2{ color:#f2a944; border-color: #FFBD63;}
  .bType.type_3{ color:#12c8bf; border-color: #12c8bf;}
  .bType.type_1:before{content:'通知';}
  .bType.type_2:before{content:'提醒';}
  .bType.type_3:before{content:'活动';}
  .infoView{ margin-bottom: 30px;}
  .broadItem:last-child{ border: none;}
  .broadItem img{ width: 100%; }
  .imgDom{ max-height: 200px; overflow: hidden;}

  .rotate { transform: rotate(-180deg); }
  .pullup-arrow { transition: all linear 0.2s; color: #666; font-size: 25PX; }
  .pulldown-arrow { display: inline-block; transition: all linear 0.2s; color: #666; font-size: 25PX; }
</style>

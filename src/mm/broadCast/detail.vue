<template>
  <div class="wrapper">
    <scroller lock-x scrollbar-y use-pulldown
              :pulldown-config="pulldownConfig"
              @on-pulldown-loading="onReachBottom"
              v-model="status" ref="scroller">
      <div class="container">
        <div class="broadContent">
          <span class="broadTitle">{{broadCast.title}}</span>
          <div class="announceTime">{{new Date(broadCast.announceTime).format('yyyy年MM月dd日')}}</div>
          <div class="browseTimes">浏览量：{{broadCast.browseTimes}}</div>
          <div class="broadHtml" v-html="broadCast.content">

          </div>
        </div>
      </div>
      <!--pulldown slot-->
      <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
        <span v-show="status.pulldownStatus === 'default'"></span>
        <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' || status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">↓</span>
        <span v-show="status.pulldownStatus === 'loading'"><spinner type="ios-small"></spinner></span>
      </div>
    </scroller>

  </div>
</template>

<script>
import { Cell, Scroller, Spinner } from 'vux'
import http from "@/http";

export default {
  components: {
    Scroller,
    Spinner
  },
  methods: {
    /*加载列表*/
    loadData: function (broadcastId, cb) {
      let _this = this;
      let postData = {broadcastId:broadcastId};
      http('property-api/broadcast/getBroadcast', postData, {includeApi:true})
        .then(function(suc){
          _this.broadCast = suc;
          if(cb && typeof cb == 'function'){
            cb();
          }
        }, function(err){
          console.log({err:err});
        });
    },
    /* 下拉刷新 */
    onReachBottom:function(){
      let _this = this;
      let broadcastId = this.broadCast.broadcastId;
      if(broadcastId){
        this.loadData(broadcastId, function (){
          _this.$nextTick(() => {
//        this.$refs.scroller.donePulldown();
            _this.status.pulldownStatus = 'default';
          })
        });
      }
    }
  },

  mounted:function(){
    let {params} = this.$route;
    if(params && params.id){
      this.loadData(params.id)
    }
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
      status: {
        pullupStatus: 'default',
        pulldownStatus: 'default'
      },

      broadCast:{}
    }
  }
}
</script>

<style scoped>
  .wrapper{ background-color: #fff;}
  .broadMain{ position: absolute;left: 0; top:0; bottom: 0;}
  .broadList{ padding: 30px; font-size: 12PX;}
  .broadItem{ border-bottom: 1PX solid #e5e4e8; margin-bottom: 30px; display: block; color:#000;}
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

  .broadContent{ margin: 30px;}
  .broadTitle{ font-size: 14PX; font-weight: bold;}
  .announceTime, .browseTimes{ color:#6a6970;font-size: 12PX; line-height: 40px;}
  .broadHtml{ font-size: 14PX; margin-top: 10px; line-height: 50px;}
  .broadHtml image{ width: 100%;}

  .rotate { transform: rotate(-180deg); }
  .pullup-arrow { transition: all linear 0.2s; color: #666; font-size: 25PX; }
  .pulldown-arrow { display: inline-block; transition: all linear 0.2s; color: #666; font-size: 25PX; }
</style>

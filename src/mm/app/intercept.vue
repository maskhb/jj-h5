<template>
  <ul class="appInfoList">
    <li>
      <p>token:</p>
      <p>{{token}}</p>
    </li>
    <li>
      <p>当前用户小区:</p>
      <p>{{community}}</p>
    </li>
    <li>
      <x-button :gradients="['#FF2719', '#FF61AD']" type="primary" action-type="button" @click.native="showAlert">showAlert</x-button>
    </li>
    <li>
      <x-button :gradients="['#1D62F0', '#19D5FD']" type="primary" action-type="button" @click.native="toHouseAuth">跳转到app的房产认证页面</x-button>
    </li>
    <li>
      <x-button :gradients="['#A644FF', '#FC5BC4']" type="primary" action-type="button" @click.native="isWeiXin">是否微信浏览器</x-button>
    </li>
    <li>
      <x-button :gradients="['#6F1BFE', '#9479DF']" type="primary" action-type="button" @click.native="showIntegralAlert">显示获取积分弹窗</x-button>
    </li>
    <li>
      <x-button :gradients="['#FF2719', '#FF61AD']" type="primary" action-type="button" @click.native="jumpToInviteNeighbor">跳转至邀请注册页</x-button>
    </li>
    <li>
      <x-button :gradients="['#A644FF', '#FC5BC4']" type="primary" action-type="button" @click.native="jumpToInviteRecords">跳转至查看已邀请好友数</x-button>
    </li>
    <li>
      <x-button :gradients="['#1D62F0', '#19D5FD']" type="primary" action-type="button" @click.native="jumpToInviteMain">跳转到蜜积分页面</x-button>
    </li>
  </ul>
</template>

<script>
import { XButton } from 'vux'
import appObj from "@/lib/appTools/request-app.js";

export default {
  components: {
    XButton
  },
  methods: {
    /*加载*/
    loadData: function () {
      let _this = this;
      appObj.getToken(function (token) {
        _this.token = token;

        appObj.getCurrentCommunityId(function (community) {
          _this.community = community;
        })
      })
    },
    showAlert:function () {
      appObj.showAlert('sss');
    },
    isWeiXin:function () {
      let iswx = appObj.isWeiXin();
      alert(iswx);
    },
    toHouseAuth:function () {
      appObj.toHouseAuth();
    },
    showIntegralAlert:function () {
      appObj.showIntegralAlert(200);
    },
    jumpToInviteNeighbor:function () {
      appObj.jumpToInviteNeighbor();
    },
    jumpToInviteRecords:function () {
      appObj.jumpToInviteRecords();
    },
    jumpToInviteMain:function () {
      appObj.jumpToInviteMain();
    }
  },
  mounted: function () {
    this.loadData();
  },
  data() {
    return {
      token: '',
      community:''
    }
  }
}
</script>

<style scoped>
  .appInfoList{ padding: 10px;}
  .appInfoList li{ border-bottom: 1px dotted #ccc; list-style: none; white-space: normal; word-wrap:break-word; padding: 10px;}
</style>

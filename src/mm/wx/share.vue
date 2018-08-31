<template>
  <div class="shareInfo">
    <div class="weui-cells__title">微信分享</div>
    <group>
      <cell title="title" :value="shareObj.title"></cell>
      <cell title="desc" :value="shareObj.desc"></cell>
      <cell title="link" :value="shareObj.link"></cell>
      <cell title="imgUrl" >
        <img :src="shareObj.imgUrl" class="smallSize">
      </cell>
    </group>
  </div>
</template>

<script>
import { Cell, Group } from 'vux'
import wx from '@/lib/wxTools'

export default {
  components: {
    Cell,
    Group
  },
  methods: {
    /*微信分享*/
    loadData: function () {
		wx.toFriend(this.shareObj);
		wx.toTimeLine(this.shareObj);
    }
  },
  mounted: function () {
    this.loadData();
  },
  data() {
    return {
      shareObj: {
        title: '我的心意，诞愿ni知道',
        desc: '好友送你一张圣诞贺卡',
        link: 'http://baidu.com',
        imgUrl: 'https://ht-img1-test.htmimi.com/group1/M00/02/48/CmSjC1o8bVSABR6HAAE-c3ZvcAw654.jpg',
      }
    }
  }
}
</script>

<style scoped>
  .smallSize{ width: 100px;}
</style>

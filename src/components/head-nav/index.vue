<template>
<div class="topHeader">
  <x-header :title="$route.name" :left-options="{backText: '', preventGoBack:true}" @on-click-back="backFn">
    <router-link to="/" slot="right" class="home_icon"></router-link>
  </x-header>
</div>
</template>

<script>
import {
  XHeader
} from 'vux'

export default {
  props: {
    back: String
  },
  components: {
    XHeader
  },
  methods: {
    backFn () {
      if(this.back){
        this.$router.push(this.back)
      }else{
        this.$router.back(-1)
      }
    }
  },
  mounted(){
    console.log(this.backPath);
  },
  data () {
    return {
      backPath:this.back
    }
  }
}
</script>

<style lang="less" scoped>
.topHeader .vux-header{ background-color: #fff; border-bottom: 1PX solid #f2f3f4}
.topHeader /deep/ .vux-header .vux-header-title{ color:#5f5f5f;}
</style>

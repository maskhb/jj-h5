
<template>
  <x-header class="search" :left-options="{backText: ''}">
    <div slot="overwrite-title">
      <div class="searchDom">
        <x-input :placeholder="placeholder" v-model="key"></x-input>
        <icon type="search"></icon>
      </div>
    </div>
    <a class="rightLink" slot="right" @click="search">搜索</a>
  </x-header>
</template>

<script>

  import { XInput, XHeader, Icon, Flexbox, FlexboxItem
  } from 'vux'

  export default {
    props: ['placeholder','text','noLink'],
    components: {
      XInput, XHeader, Icon, Flexbox, FlexboxItem
    },
    methods: {
      search(){
        if(this.key){
          if(this.isLink){
            this.$router.push('/Search/Result/' + this.key);
          }else{
            this.$emit('search',this.key);
          }
        }
      }
    },
    mounted(){
      if(typeof this.noLink != 'undefined'){
        this.isLink = false
      }
    },
    watch:{
      text(newVal, oldVal){
        this.key=newVal;
      }
    },
    data () {
      return {
        isLink:true,
        key:this.text
      }
    }
  }

</script>

<style lang="less" scoped>
  .search /deep/ .vux-header-title-area{ margin: 0 112px;}
  .rightLink{ line-height:36px; color:#222!important;}

  .search{ background-color: #fff; border-bottom: 1px solid #f0f0f0;}
  .search /deep/ .vux-header-back, .search /deep/ .vux-header-left{ color:#000;}
  .searchDom{ margin-top: 6PX;}
  .vux-header .vux-header-left /deep/ .left-arrow:before{ border:1PX solid #000;}
  .search .searchDom /deep/ .weui-cell{ line-height: normal; height: auto; padding: 0!important; }
  .search .searchDom /deep/ .weui_icon_search{ top:8PX; left: 5PX;}
  .search .searchDom /deep/ .weui-cell__ft{display: block; position: absolute; right: 3PX; top:5px;}
  .search .searchDom /deep/ .weui-input{background-color: #efefef; height: 28PX;}

  .searchDom{ position: relative;}
  .searchDom /deep/ .weui-search-bar{ background-color: unset;}
  .searchDom /deep/ .weui-search-bar:before, .searchDom /deep/ .weui-search-bar:after{ border: none;}
  .searchDom /deep/ .weui-search-bar__form{ background-color: unset;}
  .searchDom /deep/ .weui-search-bar__label{ border-radius: 48px;}
  .searchDom /deep/ .weui-search-bar__form:after{ border-radius: 48px;}
  .searchDom /deep/ .weui-input{ background-color: #fff; border:0; line-height: 28PX; height: 28PX; border-radius: 14PX;
    padding-left: 25PX; box-sizing: border-box; }
  .searchDom /deep/ .weui_icon_search{ position: absolute; left:40px; top: 34px;}
  .searchDom .weui-cell__ft{ display:none;}
</style>

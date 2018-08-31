<template>
<div class="wrapper">
  <p class="fs16">如需浏览，请长按网址复制后使用浏览器访问</p>
  <div class="fs12">
    {{url}}
  </div>
</div>
</template>

<script>
export default {
  mounted: function () {
    this.url = decodeURIComponent(this.$route.query.url)
  },
  data () {
    return {
      url: undefined
    }
  }
}
</script>
<style lang="less" scoped>
p{text-align:center;padding:100px 20px 20px;}
div{text-align:center;padding:0 10px 0 10px;word-break:break-all;}
</style>

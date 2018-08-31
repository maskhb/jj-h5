<template>
<div class="noice fs12">
  <i class="fa fa-volume-up fa-lg"></i>
  <div class="father">
    <div class="son" ref="son">
      <p ref="tips"><slot></slot></p>
    </div>
  </div>
</div>
</template>

<script>
export default {
  updated: function () {
    if (this.countLines(this.$refs.tips) > 1) {
      this.$refs.tips.classList.add('transition')
      this.$refs.son.style.width = '1000px'
    }
    this.$refs.tips.style.visibility = 'visible'
  },
  methods: {
    countLines (ele) {
      var styles = window.getComputedStyle(ele, null)
      var lh = parseInt(styles.lineHeight, 10)
      var h = parseInt(styles.height, 10)
      var lc = Math.round(h / lh)
      return lc
    }
  }
}
</script>

<style lang="less" scoped>
.noice{
  font-size:12PX;
  background:#FFFBF0;
  color:#C6A857;
  padding:0 20px;
  line-height:80px;
  height:80px;
  i{
    margin-right:15px;
    float:left;
    margin-top:32px;
  }
  .father{
    overflow:hidden;
    .son{
      p{
        visibility:hidden;
        display:inline-block;
        transition: transform 7s linear 1s;
      }
      .transition{
        transform: translate(-100%, 0);
        animation: keyframes 14s linear 8s infinite;
      }
    }
  }
  @keyframes keyframes
  {
    0%   {transform:translate(100%, 0);}
    100% {transform:translate(-100%, 0);}
  }
}
</style>

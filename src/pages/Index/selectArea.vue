
<template>
  <div>
    <div class="notice display1line">
      {{projectItemTitle}}
    </div>
    <div class="subMenu" :style="{height: viewHeight + 'px'}">
      <flexbox :gutter="0">
        <flexbox-item span="100">
          <div class="subMenuLeft">
            <view-box body-padding-bottom="0px">
              <ul>
                <li v-for="(item,index) in provinceList" :class="{current:selectProvinceIndex==index}" :key="index" @click="selectProvince(index)">
                  {{item.provinceName}}
                </li>
              </ul>
            </view-box>
          </div>
        </flexbox-item>
        <flexbox-item>
          <div class="subMenuRight">
            <view-box body-padding-bottom="0px">
              <ul class="housesList">
                <li v-for="(item, index) in communityList" :key="index" :class="{current:communityId==item.communityId}" @click="selectAfter(item)">
                  {{item.cityName}}{{item.communityName}}
                </li>
              </ul>
            </view-box>
          </div>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>

<script>
  import selectArea from './js/selectArea.js';
  export default selectArea;
</script>

<style lang="less" scoped>
  @import './css/style.less';

  .search .vux-header{ background-color: #fff; border-bottom: 1PX solid #f0f0f0;}
  .search .vux-header /deep/ .vux-header-back, .search .vux-header /deep/ .vux-header-left{ color:#000;}
  .search .vux-header /deep/ .vux-header-title{ color:#000; font-size: 16PX;}
  .vux-header .vux-header-left .left-arrow:before{ border:1PX solid #000;}

  .notice{ font-size: 12PX; background-color: #FFFBF0; color:#c6a857; line-height: 70px; height: 70px; padding-left: 40px;}


  .housesList{ margin: 0 20px;}
  .housesList >li{ height: 90px; line-height: 90px; border-bottom: 1PX solid #f0f0f0; text-align: center; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;}
  .housesList >li.current{ color:#FFB000;}
</style>

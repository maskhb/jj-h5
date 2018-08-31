
<template>
  <div>
    <div class="wrapper" :style="{minHeight:minHeight+'px'}">
      <div class="topHeader">
        <x-header title="个人中心" :left-options="{backText: ''}">
          <router-link to="/" slot="right" class="home_icon"></router-link>
        </x-header>
      </div>
      <div class="info">
        <div class="headImg">
          <img v-if="user.avatarUrl" :src="user.avatarUrl"/>
        </div>
        <!--<a class="loginLink">登录 / 注册></a>-->
        <div class="userInfo">{{user.nickName}}</div>
        <div class="qrcode" @click="showHideOnBlur=true"></div>
        <div class="centerMenu">
          <flexbox :gutter="0">
            <flexbox-item :span="1/2">
              <div class="userMsg">
                <b class="bolck">{{orderCount}}</b>
                 <span><router-link to="/Order" >我的订单</router-link></span>
              </div>
            </flexbox-item>
            <flexbox-item :span="1/2">
              <div class="userMsg">
                <b class="bolck">0</b>
                <span>我的评价</span>
              </div>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
      <div class="myAsset">
        <h1>我的资产</h1>
        <flexbox :gutter="0">
          <flexbox-item :span="1/6">
            <div class="userMsg">
              <span>预存款</span>
            </div>
          </flexbox-item>
          <flexbox-item :span="1/3">
            <div class="userMsg border_r">
              <b><router-link to="/UserCenter/PreDeposit" >&yen;{{deposit|money}}</router-link></b>
            </div>
          </flexbox-item>
          <flexbox-item :span="1/6">
            <div class="userMsg">
              <span>优惠券</span>
            </div>
          </flexbox-item>
          <flexbox-item :span="1/3">
            <div class="userMsg">
              <b><router-link to="/Coupon" >{{myCoupon}}</router-link></b>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <div class="groupLink">
        <group>
          <cell title="安全中心" :is-link="true" link="/UserCenter/Safe"></cell>
          <cell title="收货地址" link="/Address"></cell>
          <!--<cell title="我的晒家" :is-link="true" ></cell>-->
        </group>
        <group>
          <cell title="常见问题" link="http://wx.htmimi.com/#/help?_k=kt1xue"></cell>
          <cell title="更多帮助" link="http://wx.htmimi.com/#/CustomServicePage?_k=0dg41b"></cell>
        </group>
      </div>


      <div v-transfer-dom class="htDialog">
        <x-dialog v-model="showHideOnBlur" hide-on-blur>
          <div class="dialogBox">
            <div class="info">
              <div class="headImg">
                <img v-if="user.avatarUrl" :src="user.avatarUrl"/>
              </div>
              <div class="userInfo">{{user.nickName}}</div>
            </div>
            <qrcode :value="qrcodeUrl" type="img" :size="220"></qrcode>
            <p class="qrcodeRemark">扫一扫上方的二维码，马上注册</p>
          </div>
          <div @click="showHideOnBlur=false" class="vux-close">
            <span>X</span>
          </div>
        </x-dialog>
      </div>
    </div>

    <x-button class="exitBtn" :link="'/Login?redirect_uri=' + redirect_uri">退出登录</x-button>
  </div>
</template>

<script>
  import Index from './js/index.js';
  export default Index;
</script>

<style lang="less" scoped>
  @import './css/style.less';
</style>

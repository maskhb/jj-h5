
<template>
  <div>
    <div class="loginForm">
      <group v-if="step==1">
        <x-input placeholder="请输入手机号" @on-change="change1" :max="20" v-model="user.mobile"></x-input>
        <x-input placeholder="请输入图形验证码" @on-change="change1" :max="20" v-model="user.imgCode" class="weui-cell_vcode">
          <img slot="right" class="codeImg" :src="code.codeImgUrl" @click="changeCodeImg">
        </x-input>
        <x-input placeholder="请输入6位短信验证码" @on-change="change1" :max="20" v-model="user.code" class="weui-vcode">
          <x-button slot="right" type="primary" plain mini class="sendCodeBtn" @click.native="sendCode" :disabled="sendCodeObj.sendCodeDisabled" :text="sendCodeObj.text"></x-button>
        </x-input>
      </group>
      <group v-if="step==2">
        <x-input type="password" :max="20" placeholder="请输入新密码" @on-change="change" v-model="pwd.pwd1"></x-input>
        <x-input type="password" :max="20" placeholder="请再次输入新密码" @on-change="change" v-model="pwd.pwd2"></x-input>
      </group>
    </div>
    <div class="m_15">
      <x-button v-if="step==1" plain type="primary" class="yellowBtn" @click.native="checkPic" :disabled="stepBtnDisabled">下一步</x-button>
      <!--<x-button v-if="step==2" type="primary" class="yellowBtn" @click.native="step=1">上一步</x-button>-->
      <x-button v-if="step==2" plain class="yellowBtn" type="primary" :disabled="setBtnDisabled" @click.native="setPwd">确定</x-button>
    </div>
  </div>
</template>

<script>
import { Cell, XInput, Group, XButton, Toast, ToastPlugin } from 'vux';
import Vue from "vue";
import http from "@/http";
import httpConfig from "@/http/config";

Vue.use(ToastPlugin);

export default {
  components: {
    Cell,
    XInput,
    Group,
    XButton
  },
  methods: {
    sendCode(){
      let _this = this;
      let i = 120;

      if(this.user.mobile && /^1\d{10}$/.test(this.user.mobile)){
        http('user-center-server/captcha/sendSmsCaptcha', {phone:this.user.mobile, smsBizType:2})
        // http('verify-api/captcha/smsCaptcha', {phone:this.user.mobile}, {includeApi:true})
          .then(function(suc){
            if(suc){
              _this.sendCodeObj.sendCodeDisabled = true;
              _this.sendCodeObj.text = i + 's';
              let time1 = setInterval(function () {
                i--;
                if(i==0){
                  _this.sendCodeObj.text = '重新获取';
                  _this.sendCodeObj.sendCodeDisabled = false;
                  clearInterval(time1);
                }else{
                  _this.sendCodeObj.text = i + 's';
                }
              }, 1000);
            }
          }.bind(this));
      }else{
        this.$vux.toast.text('手机号码输入有误!');
      }
    },
    /*修改图片验证码*/
    changeCodeImg(){
      this.code.uid = new Date().getTime();
      this.code.codeImgUrl = httpConfig.getRequestUrl('verify-api') + '/captcha/imgCaptcha/' + this.code.uid;
    },
    checkPic(){
      let code = this.code;
      let user = this.user;
      let checkParams = {
        mobile:user.mobile,
        smsVerifyCode:user.code,
        uid:code.uid,
        picCode:user.imgCode,
        accountType:1
      };
      if(user.mobile && /^1\d{10}$/.test(user.mobile)){
        http('user-center-server/secure/mobile/check-pic', checkParams)
          .then(function(suc){
            if(suc){
              this.step = 2;
            }

          }.bind(this),function (err) {
            if(err.busCode === 40001){
              this.changeCodeImg();
            }
          }.bind(this));
      }else{
        this.$vux.toast.text('手机号码输入有误!');
      }
    },

    setPwd(){
      let _this = this;
      if(this.pwd.pwd1 === this.pwd.pwd2){
        let pwd = this.pwd.pwd1;

        let user = this.user;
        let postData = {
          mobile:user.mobile,
          smsVerifyCode:user.code,
          newPassword:pwd,
          accountType:1
        };
        http('user-center-server/secure/password/forget', postData)
          .then(function(suc){
            if(suc){
              this.$vux.toast.text('密码修改成功！');
              setTimeout(function () {
                _this.$router.push('/Login');
              },2000)
            }
          }.bind(this),function (err) {});
      }else{
        this.$vux.toast.text('两次密码输入不一致！')
      }
    },
    change1(){
      let code = this.code;
      let user = this.user;
      if(user.mobile && user.imgCode){
        this.sendCodeObj.sendCodeDisabled = false;
      }else{
        this.sendCodeObj.sendCodeDisabled = true;
      }


      if(user.mobile && user.imgCode && user.code && /^1\d{10}$/.test(user.mobile)){
        this.stepBtnDisabled = false;
      }else{
        this.stepBtnDisabled = true;
      }
    },
    change(){
      if(this.pwd.pwd1 && this.pwd.pwd2){
        this.setBtnDisabled = false;
      }else{
        this.setBtnDisabled = true;
      }
    }
  },

  mounted:function(){
    this.code.uid = new Date().getTime();
    this.code.codeImgUrl = httpConfig.getRequestUrl('verify-api') + '/captcha/imgCaptcha/' + this.code.uid;
  },
  data () {
    return {
      step:1,
      sendCodeObj:{
        sendCodeDisabled:true,
        text:'获取验证码'
      },
      code:{
        uid:'',
        codeImgUrl:''
      },
      user:{
        mobile:'',
        imgCode:'',
        code:''
      },
      stepBtnDisabled:true,

      showPositionValue:true,
      setBtnDisabled:true,
      pwd:{
        pwd1:'',
        pwd2:''
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import './css/style.less';
</style>

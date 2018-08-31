
<template>
  <div class="wrapper relative" :style="{minHeight:minHeight+'px'}">
    <div class="logo">
    </div>
    <div class="loginForm">
      <div v-if="loginType=='code'">
        <group>
          <x-input placeholder="请输入手机号" @on-change="change" :max="20" v-model="user.mobile"></x-input>
          <x-input placeholder="请输入图形验证码" @on-change="change" :max="20" v-model="user.imgCode" class="weui-cell_vcode">
            <img slot="right" class="codeImg" :src="code.codeImgUrl" @click="changeCodeImg">
          </x-input>
          <x-input placeholder="请输入6位短信验证码" @on-change="change" :max="20" v-model="user.code" class="weui-vcode">
            <x-button slot="right" plain type="primary" class="sendCodeBtn" mini @click.native="sendCode" :disabled="sendCodeObj.sendCodeDisabled" :text="sendCodeObj.text"></x-button>
          </x-input>
        </group>
        <agree v-model="valueTrue">同意<a href="javascript:void(0);" @click="showAgree=true">《恒腾密蜜家居商城注册协议》</a></agree>
      </div>
      <div v-else>
        <group title="">
          <x-input placeholder="请输入手机号" :max="20" v-model="user.mobile"></x-input>
          <x-input placeholder="请输入密码" :max="20" @on-change="change" type="password" v-model="user.password"></x-input>
        </group>
        <router-link class="fl_r" to="/Login/ForgetPwd">忘记密码?</router-link>
      </div>
    </div>
    <div class="m_15">
      <x-button plain type="primary" class="yellowBtn" @click.native="login" :disabled="loginBtnDisabled || (!valueTrue && loginType==='code')">登录</x-button>
    </div>
    <divider class="miniDivider" @click.native="changeLogin">{{loginType=='code'?'使用帐号密码登录':'手机号快捷登录'}}</divider>

    <div class="loginRemark">
      未注册用户可通过手机号验证码直接登录
    </div>

    <!--注册协议-->
    <div v-transfer-dom>
      <popup v-model="showAgree" position="bottom" class="agreeDialog" height="100%">
        <div class="relative h_100per">
          <x-header title="密蜜家居商城注册协议" :left-options="{backText: '',preventGoBack:true}" @on-click-back="showAgree=false"/>
          <div class="agreeContent">
            <view-box body-padding-bottom="0px">
              <div class="p_20">
                <p><b>尊敬的客户，欢迎您注册成为本网站用户。在注册前请您仔细阅读如下服务条款：</b></p>
                <p>本协议是用户与恒腾密蜜家居商城（简称"本站"，网址：jiaju.htmimi.com）所有者（以下简称为"密蜜家居"）之间就恒腾密蜜家居商城服务等相关事宜所订立的契约，请用户仔细阅读本注册协议，用户点击"同意并继续"按钮后，本协议即构成对双方有约束力的法律文件。</p>
                <p><b>协议细则</b></p>
                <p><b>1、本网站服务条款的确认和接纳</b></p>
                <p>本网站各项服务的所有权和运作权归本网站拥有。</p>
                <p><b>2、用户必须：</b></p>
                <p>(1)自行配备上网的所需设备，包括个人电脑、调制解调器或其他必备上网装置。</p>
                <p>(2)自行负担个人上网所支付的与此服务有关的电话费用、 网络费用。</p>
                <p><b>3、用户在本网站交易平台上不得发布下列违法信息：</b></p>
                <p>(1)反对宪法所确定的基本原则的；</p>
                <p>(2)危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p>
                <p>(3)损害国家荣誉和利益的；</p>
                <p>(4)煽动民族仇恨、民族歧视，破坏民族团结的；</p>
                <p>(5)破坏国家宗教政策，宣扬邪教和封建迷信的；</p>
                <p>(6)散布谣言，扰乱社会秩序，破坏社会稳定的；</p>
                <p>(7)散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；</p>
                <p>(8)侮辱或者诽谤他人，侵害他人合法权益的；</p>
                <p>(9)含有法律、行政法规禁止的其他内容的。</p>
                <p><b>4、有关个人资料</b></p>
                <p>用户同意：</p>
                <p>(1) 提供及时、详尽及准确的个人资料。</p>
                <p>(2) 同意接收来自本网站的信息。</p>
                <p>(3) 不断更新注册资料，符合及时、详尽准确的要求。所有原始键入的资料将引用为注册资料。</p>
                <p><b>5、服务条款的修改</b></p>
                <p>本网站有权在必要时修改服务条款，本网站服务条款一旦发生变动，将会在重要页面上提示修改内容。如果不同意所改动的内容，用户可以主动取消获得的本网站信息服务。如果用户继续享用本网站信息服务，则视为接受服务条款的变动。本网站保留随时修改或中断服务而不需通知用户的权利。本网站行使修改或中断服务的权利，不需对用户或第三方负责。</p>
                <p><b>6、用户的帐号、密码和安全性</b></p>
                <p>你一旦注册成功成为用户，你将得到一个密码和帐号。如果你不保管好自己的帐号和密码安全，将负全部责任。另外，每个用户都要对其帐户中的所有活动和事件负全责。你可随时根据指示改变你的密码，也可以结束旧的帐户重开一个新帐户。用户同意若发现任何非法使用用户帐号或安全漏洞的情况，请立即通知本网站。</p>
                <p><b>7、其他权利和义务</b></p>
                <p>（1）如用户不具备本协议约定的注册资格，则家居平台有权拒绝用户进行注册。同时，家居平台保留其他任何情况下决定是否接受用户注册的权利。</p>
                <p>（2）家居平台发现账户使用者并非账户初始注册人时，有权中止该账户的使用。</p>
                <p>（3）家居平台通过技术检测、人工抽检等检测方式合理怀疑用户提供的信息错误、不实、失效或不完整时，有权通知用户更正、更新信息或中止、终止为其提供家居平台服务。</p>
                <p>（4）家居平台有权在发现家居平台上显示的任何信息存在明显错误时，对信息予以更正。</p>
                <p>（5）家居平台保留修改、中止或终止家居平台服务的权利，家居平台行使前述权利将按照法律规定的程序及方式告知用户。</p>
                <p>（6）家居平台应当采取必要的技术手段和管理措施保障家居平台的正常运行，并提供必要、可靠的交易环境和交易服务，维护交易秩序。</p>
                <p>（7）家居平台有权在本协议履行期间及本协议终止后保留用户的注册信息及用户应用家居平台服务期间的全部交易信息，但不得非法使用该等信息。</p>
                <p><b>8、客户服务</b></p>
                <p>家居平台建立专业的客服团队，并建立完善的客户服务制度，从技术、人员和制度上保障用户提问及投诉渠道的畅通，为用户提供及时的疑难解答与投诉反馈。</p>
                <p><b>9、拒绝提供担保</b></p>
                <p>用户明确同意信息服务的使用由用户个人承担风险。本网站不担保服务不会受中断，对服务的及时性，安全性，出错发生都不作担保，但会在能力范围内，避免出错。</p>
                <p><b>10、有限责任</b></p>
                <p>本网站对任何直接、间接、偶然、特殊及继起的损害不负责任，这些损害来自：不正当使用本网站服务，或用户传送的信息不符合规定等。这些行为都有可能导致本网站形象受损，所以本网站事先提出这种损害的可能性，同时会尽量避免这种损害的发生。</p>
                <p><b>11、信息的储存及限制</b></p>
                <p>本网站有判定用户的行为是否符合本网站服务条款的要求和精神的权利，如果用户违背本网站服务条款的规定，本网站有权中断其服务的帐号。</p>
                <p><b>12、用户管理</b></p>
                <p>用户必须遵循：</p>
                <p>(1) 使用信息服务不作非法用途。</p>
                <p>(2) 不干扰或混乱网络服务。</p>
                <p>(3) 遵守所有使用服务的网络协议、规定、程序和惯例。用户的行为准则是以因特网法规，政策、程序和惯例为根据的。</p>
                <p><b>13、保障</b></p>
                <p>用户同意保障和维护本网站全体成员的利益，负责支付由用户使用超出服务范围引起的律师费用，违反服务条款的损害补偿费用，其它人使用用户的电脑、帐号和其它知识产权的追索费。</p>
                <p><b>14、结束服务</b></p>
                <p>用户或本网站可随时根据实际情况中断一项或多项服务。本网站不需对任何个人或第三方负责而随时中断服务。用户若反对任何服务条款的建议或对后来的条款修改有异议，或对本网站服务不满，用户可以行使如下权利：</p>
                <p>(1) 不再使用本网站信息服务。</p>
                <p>(2) 通知本网站停止对该用户的服务。</p>
                <p>结束用户服务后，用户使用本网站服务的权利马上中止。从那时起，用户没有权利，本网站也没有义务传送任何未处理的信息或未完成的服务给用户或第三方。</p>
                <p><b>15、特别声明</b></p>
                <p>不论在何种情况下，家居平台对由于信息网络设备维护、信息网络连接故障、电脑、通讯或其他系统的故障、电力故障、罢工、劳动争议、暴乱、起义、骚乱、生产力或生产资料不足、火灾、洪水、风暴、爆炸、战争、政府行为、司法行政机关的命令、其他不可抗力或第三方的不作为而造成的不能服务或延迟服务不承担责任。</p>
                <p><b>16、通告</b></p>
                <p>所有发给用户的通告都可通过重要页面的公告或电子邮件或常规的信件传送。服务条款的修改、服务变更、或其它重要事件的通告都会以此形式进行。</p>
                <p><b>17、信息内容的所有权</b></p>
                <p>本网站定义的信息内容包括：文字、软件、声音、相片、录象、图表；在广告中全部内容；本网站为用户提供的其它信息。所有这些内容受版权、商标、标签和其它财产所有权法律的保护。所以，用户只能在本网站和广告商授权下才能使用这些内容，而不能擅自复制、再造这些内容、或创造与内容有关的派生产品。</p>
                <p><b>18、法律</b></p>
                <p>本网站信息服务条款要与中华人民共和国的法律解释一致。用户和本网站一致同意服从本网站所在地有管辖权的法院管辖。</p>
              </div>
            </view-box>
          </div>
        </div>
      </popup>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  TransferDom, ToastPlugin,
  Cell, XInput, Group, XButton, Swiper, CheckIcon, Agree, Divider, Popup, XHeader, ViewBox
} from 'vux'
import http from "@/http";
import httpConfig from "@/http/config";

import Params from '@/lib/appTools/get-params'
import * as common from '@/utils/common'
import {getCart, clearCart} from '@/utils/cart'
Vue.use(ToastPlugin);

export default {
  directives: {
    TransferDom
  },
  components: {
    Cell, XInput, Group, XButton, Swiper, CheckIcon, Agree, Divider, Popup, XHeader, ViewBox
  },
  methods: {
    change(){
      let code = this.code;
      let user = this.user;
      let loginType = this.loginType;

      if(user.imgCode && user.mobile){
        this.sendCodeObj.sendCodeDisabled = false;
      }else{
        this.sendCodeObj.sendCodeDisabled = true;
      }

      switch (loginType) {
        case 'code':
          if(user.imgCode && user.mobile && user.code){
            this.loginBtnDisabled = false;
          }else{
            this.loginBtnDisabled = true;
          }
          break;
        case 'password':
          if(user.mobile && user.password){
            this.loginBtnDisabled = false;
          }else{
            this.loginBtnDisabled = true;
          }
          break;
      }
    },
    /*登录*/
    login(){
      let code = this.code;
      let user = this.user;
      let loginType = this.loginType;
      let params = {};
      if(user.mobile && /^1\d{10}$/.test(user.mobile)){
        switch (loginType){
          case 'code':
            params = {
              identifier:user.mobile,
              smsVerifyCode:user.code,
              uid:code.uid,
              picCode:user.imgCode,
              businessType:2,
              accountType:1
            };
            let postUrl = 'user-center-server/login/mobile/picode';

            if(common.isWeiXin && window.wxInfo){
              let wxInfo = window.wxInfo;
              let wxObj = {
                unionId:wxInfo.unionid,
                openId:wxInfo.openid,
                wechatName:wxInfo.nickname,
                genderType:1,
                avatarUrl:wxInfo.headimgurl
              };
              postUrl = 'user-center-server/login/wechat/mobile/picCode';
              params = Object.assign({}, params, wxObj);
            }

            http(postUrl, params)
              .then(function(suc){
                this.loginChecked(suc);

              }.bind(this),function (err) {
                if(err.busCode === 40001){
                  this.changeCodeImg();
                }
              }.bind(this));
            break;
          case 'password':
            params = {
              identifier:user.mobile,
              password :user.password,
              businessType:2,
              accountType:1
            };

            http('user-center-server/login/password', params)
              .then(function(suc){
                this.loginChecked(suc);
              }.bind(this),function (err) {

              }.bind(this));
            break;
        }
      }else{
        this.$vux.toast.text('手机号码输入有误!');
      }
//      http('user-center-server/login/wechat/mobile/picCode', params)

    },
    loginChecked(suc){
      if(suc && suc['token'] && suc['accountId']){
        localStorage['x-security-token'] = suc['token'];
        localStorage['accountId'] = suc['accountId'];

        let cart = getCart();
        if(cart.accountId && cart.accountId !== suc['accountId']){
          clearCart();
        }

        console.log({Params:Params});

        if(Params['redirect_uri']){
          this.$router.push(Params['redirect_uri']);
        }else{
          this.$router.push('/');
        }


      }
    },
    /*发送验证码*/
    sendCode(){

      let _this = this;
      let i = 120;

      if(this.user.mobile && /^1\d{10}$/.test(this.user.mobile)){
        http('user-center-server/captcha/sendSmsCaptcha', {phone:this.user.mobile, smsBizType:1})
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
    changeLogin(){
      if(this.loginType === 'code'){
        this.loginType = 'password'
      }else{
        this.loginType = 'code'
      }
      this.change();
    },
    /*修改图片验证码*/
    changeCodeImg(){
      this.code.uid = new Date().getTime();
      this.code.codeImgUrl = httpConfig.getRequestUrl('verify-api') + '/captcha/imgCaptcha/' + this.code.uid;
    }
  },

  mounted:function(){

    this.code.uid = new Date().getTime();
    this.code.codeImgUrl = httpConfig.getRequestUrl('verify-api') + '/captcha/imgCaptcha/' + this.code.uid;
    let {params} = this.$route;
    if(params && params.uid) {
    }
  },
  data () {
    return {
      minHeight:document.documentElement.clientHeight,
      code:{
        uid:'',
        codeImgUrl:''
      },
      loginBtnDisabled:true,
      showAgree:false,
      sendCodeObj:{
        sendCodeDisabled:true,
        text:'获取验证码'
      },
      banner:{
        bannerIndex:0,
        imgList:[{
          url: 'javascript:',
          img: 'https://static.vux.li/demo/1.jpg',
          title: ''
        }, {
          url: 'javascript:',
          img: 'https://static.vux.li/demo/2.jpg',
          title: ''
        }, {
          url: 'javascript:',
          img: 'https://static.vux.li/demo/5.jpg',
          title: '',
          fallbackImg: 'https://static.vux.li/demo/3.jpg'
        }],
      },
      loginType:'code',
      valueTrue:true,
      user:{
        mobile:'',
        password:'',
        imgCode:'',
        code:''
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import './css/style.less';
</style>

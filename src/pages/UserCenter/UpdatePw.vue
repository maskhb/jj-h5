<template>
<div class="wrapper">
  <group class="oldpw">
    <x-input title="原密码" type="password" :max="20" placeholder="请输入原登录密码" label-width="5" @on-change="change" v-model="pwd.pwd3" :required="true"></x-input>
  </group>
  <group class="group">
    <x-input title="新密码" type="password" :max="20" placeholder="请输入新登录密码" label-width="5" @on-change="change" v-model="pwd.pwd1" :required="true"></x-input>
    <x-input title="确认密码" type="password" :max="20" placeholder="请再次输入新登录密码" label-width="5" @on-change="change" v-model="pwd.pwd2" :required="true"></x-input>
  </group>
  <div>
    <div class="m_15">
      <x-button class="btn" :class="{ active: !setBtnDisabled }" type="primary" :disabled="setBtnDisabled" @click.native="setPwd">确认</x-button>
    </div>
  </div>
</div>
</template>

<style lang="less" scoped>
.oldpw{
  margin:20px 0 20px 0;
}
.btn{
  border-radius:100px;height:100px;background:#E3CD9B;margin-top:80px;
}
.active{background:#FFB000;}
.wrapper{background-color:#F3F4F5;min-height:-webkit-fill-available;overflow:hidden;}
</style>

<script>
import { Cell, XInput, Group, XButton, Toast, ToastPlugin } from 'vux'
import Vue from 'vue'
import http from '@/http'

Vue.use(ToastPlugin)

export default {
  components: {
    Cell,
    XInput,
    Group,
    XButton,
    Toast
  },
  methods: {
    setPwd () {
      if (this.pwd.pwd1 === this.pwd.pwd2) {
        http('user-center-server/secure/password/reset', {oldPassword: this.pwd.pwd3, newPassword: this.pwd.pwd1}).then((res) => {
          if (res === true) {
            this.$vux.toast.text('设置密码成功')
            this.$router.push('/UserCenter')
          }
        })
      } else {
        this.$vux.toast.text('两次密码输入不一致！')
      }
    },
    change () {
      if (this.pwd.pwd1 && this.pwd.pwd2) {
        this.setBtnDisabled = false
      } else {
        this.setBtnDisabled = true
      }
    }
  },

  mounted: function () {
  },
  data () {
    return {
      showPositionValue: true,
      setBtnDisabled: true,
      pwd: {
        pwd1: '',
        pwd2: '',
        pwd3: ''
      }
    }
  }
}
</script>

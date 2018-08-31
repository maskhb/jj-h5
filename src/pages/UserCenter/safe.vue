<template>
<div class="wrapper">
  <group>
    <cell v-if="hasPassword===true" title="修改登录密码" :is-link="true" link="UpdatePw"></cell>
    <cell v-if="hasPassword===false" title="设置登录密码" :is-link="true" link="SetPw"></cell>
  </group>
</div>
</template>

<script>
import { Cell, Group } from 'vux'
import http from '@/http'

export default {
  components: {
    Cell,
    Group
  },
  mounted () {
    http('user-center-server/secure/hasPassword').then((res) => {
      this.hasPassword = res
    })
  },
  data () {
    return {
      hasPassword: undefined
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper{background-color:#F3F4F5;min-height:-webkit-fill-available;overflow:hidden;padding-top:10px;}
</style>

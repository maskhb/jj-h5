
<template>
  <div>
    <div class="topHeader">
      <x-header title="收货地址" :left-options="{backText: ''}">
        <router-link to="/" slot="right" class="home_icon"></router-link>
      </x-header>
    </div>
    <div class="addressContent">
      <address-select></address-select>
    </div>

  </div>
</template>

<script>
  import AddressSelect from '@/components/addressSelect.vue';
  import {
    XHeader
  } from 'vux';
  export default {
    components: {
      AddressSelect,
      XHeader
    },
    methods: {
    },
    mounted:function(){

    },
    data () {
      return {
      }
    }
  };
</script>
<style lang="less" scoped>
  .topHeader{ position: fixed; width: 100%; left: 0;}
  .addressContent{ position: fixed; left: 0; top:50PX; width: 100%; bottom:0;}
</style>

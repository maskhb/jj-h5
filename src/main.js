// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import * as route from './router/index'
import store from './lib/animation/store/'
import './utils/global'
import 'lib-flexible'
import wx from '@/lib/wxTools'
import './assets/css/font-awesome-4.7.0/css/font-awesome.min.css'
import * as customFilter from './utils/filter'
import * as Loading from '@/components/loading'
import VueLazyLoad from 'vue-lazyload'

// import setWechatTitle from './utils/setWechatTitle'

wx.setDefaultShareConf({
  title: '密蜜家居',
  desc: '',
  link: location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : ''),
  imgUrl: location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/static/logo.png'
})

wx.hideAllNonBaseMenuItem()

/* 过滤器 */
Object.keys(customFilter).forEach(key => {
  Vue.filter(key, customFilter[key])
})

// 全局注册，方便在style上使用filter
Vue.prototype.imgFormat = customFilter['imgFormat']

Vue.use(VueLazyLoad, {preLoad: 1})

const router = route['default']

router.beforeEach((to, from, next) => {
  Loading.show()
  next()
})

router.afterEach(function (to, form) {
  if (form && form['matched'] && form['matched'][0]) {
    let matched = form['matched'][0]
    let path = matched.path
    if (path === '/pay/:orderSn' && to && to.meta && to.meta.title === '确认订单') {
      location.href = '/Order'
    }

    if ((form && form.meta && form.meta.title !== '商品详情') && (form && form.meta && form.meta.title !== '确认订单') && (to && to.meta && to.meta.title === '套餐详情')) {
      // location.href = '/Order'
      localStorage.removeItem('packageInfo')
    }

    // document.body.style['overflow-y'] = 'auto';
  }

  let link = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + to.fullPath

  wx.refreshTicket(link)

  // isPush = false;
  /* title */
  if (to.meta && to.meta.title) {
    window.document.title = to.meta.title
  } else {
    window.document.title = '密蜜家居'
  }

  let shareObj = {
    title: window.document.title,
    desc: '',
    link: location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + to.fullPath,
    imgUrl: location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/static/logo.png'
  }

  wx.toFriend(shareObj)
  wx.toTimeLine(shareObj)
  wx.hideAllNonBaseMenuItem()

  Loading.hide()
  // setWechatTitle(window.document.title)
})

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')

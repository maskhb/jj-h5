export default [
  {
    path: '/alipay',
    meta: {
      title: '提示'
    },
    component: () => import('./alipay.vue')
  },
  {
    path: '/result/:type',
    component: () => import('./result.vue')
  },
  {
    path: '/result/:type/:orderNo',
    component: () => import('./result.vue')
  },
  {
    path: '/result/:type',
    component: () => import('./result.vue')
  },
  {
    path: '/lkl/:orderSn/:orderID/:needToPayAmount',
    meta: {
      title: '收银台'
    },
    component: () => import('./lkl.vue')
  },
  {
    path: '/:orderSn',
    meta: {
      title: '收银台'
    },
    component: () => import('./index.vue')
  },
  {
    path: '/mockTest/:payOrderNo/:notifyUrl/:payAmount/:signMsg/:transactionId',
    meta: {
      title: '收银台'
    },
    component: () => import('./mockTest.vue')
  }
]

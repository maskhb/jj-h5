export default [
  {
    name: '我的订单',
    component: () => import('./index.vue')
  },
  {
    name: '订单详情',
    path: '/detail/:orderId',
    component: () => import('./detail.vue')
  },
  {
    meta: {
      title: '恒腾密蜜家居'
    },
    path: '/express/:Id',
    component: () => import('./express.vue')
  }
]

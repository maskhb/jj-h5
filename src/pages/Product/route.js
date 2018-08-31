export default [
  {
    path:'/Detail/:skuId',
    meta: {
      title: '商品详情'
    },
    component: () => import('./detail.vue')
  },
  {
    path:'/Detail/:skuId/:packageId/:spaceId',
    meta: {
      title: '商品详情'
    },
    component: () => import('./detail.vue')
  },
  {
    path:'/ComboDetail/:pid',
    meta: {
      title: '套餐详情'
    },
    component: () => import('./comboDetail.vue')
  }
]

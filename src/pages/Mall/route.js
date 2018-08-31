export default [
	{
		meta: {
			title: '商城'
		},
		component:  () => import('./index.vue')
	},
  {
    path: '/Confirm',
    meta: {
      title: '确认订单'
    },
    component:  () => import('./confirm.vue')
  },
  {
    path: '/Confirm/:skuId',
    meta: {
      title: '确认订单'
    },
    component:  () => import('./confirm.vue')
  }
]

export default [
	{
		meta: {
			title: '搜索'
		},
		component:  () => import('./search.vue')
	},
  {
    path:'/List/:cid',
    meta: {
      title: '商品分类'
    },
    component:  () => import('./searchList.vue')
  },
  {
    path:'/Store/:mid',
    meta: {
      title: '店铺详情'
    },
    component:  () => import('./searchStore.vue')
  },
  {
    path:'/Result/:searchTxt',
    meta: {
      title: '搜索结果'
    },
    component:  () => import('./searchResult.vue')
  },
  {
    path:'/Result',
    meta: {
      title: '搜索结果'
    },
    component:  () => import('./searchResult.vue')
  }
]

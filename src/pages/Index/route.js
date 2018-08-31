export default [
	{
		meta: {
			title: '首页'
		},
		component: () => import('./index.vue')
	},
  {
    path:'Index',
    meta: {
      title: '首页'
    },
    component: () => import('./index.vue')
  },
	{
		path:'selectArea',
		meta: {
			title: '选择附近项目'
		},
		component: () => import('./selectArea.vue')
	}
]

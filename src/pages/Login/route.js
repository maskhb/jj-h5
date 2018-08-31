export default [
	{
		meta: {
			title: '登录'
		},
		component: () => import('./index.vue')
	},
  {
    path: '/Index/:uid',
    meta: {
      title: '登录'
    },
    component: () => import('./index.vue')
  },
	{
		path: '/ForgetPwd',
		meta: {
			title: '找回密码'
		},
		component: () => import('./forgetPwd.vue')
	}
]

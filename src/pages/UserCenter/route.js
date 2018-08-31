export default [
  {
    meta: {
      title: '个人中心'
    },
    component: () => import('./index.vue')
  },
  {
    path: '/Safe',
    meta: {
      title: '安全中心'
    },
    component: () => import('./safe.vue')
  },
  {
    path: '/SetPw',
    meta: {
      title: '设置登录密码'
    },
    component: () => import('./setPw.vue')
  },
  {
    path: '/UpdatePw',
    meta: {
      title: '修改登录密码'
    },
    component: () => import('./UpdatePw.vue')
  },
  {
    path: '/PreDeposit',
    name: '预存款',
    component: () => import('./PreDeposit.vue')
  }
]

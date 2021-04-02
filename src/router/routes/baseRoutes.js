export default [
  {
    path: '/login',
    name: '登录',
    component: () => import('@/views/account/Login')
  },
  {
    path: '/findPassword',
    name: '忘记密码',
    component: () => import('@/views/account/FindPassword')
  },
  {
    path: '/resetPassword',
    name: '重置密码',
    component: () => import('@/views/account/ResetPassword')
  },
  {
    path: '*',
    name: '404',
    component: () => import('@/views/error/404')
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403')
  }
]
// import PageView from '@/layouts/PageView';
export default {
  path: 'personal',
  name: '用户设置',
  meta: {
    icon: 'user'
  },
  component: () => import('@/layouts/BlankView.vue'),
  children: [
    {
      path: 'modifyPassword',
      name: '修改密码',
      component: () => import('@/views/user/modifyPassword.vue')
    },
    {
      path: 'personalInfo',
      name: '个人信息',
      component: () => import('@/views/user/student/PersonalInfo.vue')
    }
  ]
};

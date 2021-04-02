import PageView from '@/layouts/PageView';
export default {
  path: 'stuInfo',
  name: '个人信息',
  meta: {
    icon: 'solution'
  },
  component: PageView,
  children: [
    {
      path: 'competition',
      name: '竞赛获奖信息',
      component: () => import('@/views/stuInfo/Competition.vue')
    },
    {
      path: 'reward',
      name: '奖学金信息',
      component: () => import('@/views/stuInfo/Reward.vue')
    },
    {
      path: 'paper',
      name: '论文信息',
      component: () => import('@/views/stuInfo/Paper.vue')
    },
    {
      path: 'cet4',
      name: '四级信息',
      component: () => import('@/views/stuInfo/Cet4.vue')
    },
    {
      path: 'cet6',
      name: '六级信息',
      component: () => import('@/views/stuInfo/Cet6.vue')
    },
    {
      path: 'internship',
      name: '实习信息',
      component: () => import('@/views/stuInfo/Internship.vue')
    },
    {
      path: 'employment',
      name: '就业信息',
      component: () => import('@/views/stuInfo/Employment.vue')
    }
  ]
};

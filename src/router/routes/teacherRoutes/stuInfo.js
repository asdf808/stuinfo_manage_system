// {
//   path: 'dashboard',
//   name: 'Dashboard',
//   meta: {
//     icon: 'dashboard'
//   },
//   component: BlankView,
//   children: [
//     {
//       path: 'workplace',
//       name: '工作台',
//       component: () => import('@/views/student/StuList.vue')
//     },
//     {
//       path: 'analysis',
//       name: '分析页',
//       component: () => import('@/views/student/StuList.vue')
//     }
//   ]
// },
import PageView from '@/layouts/PageView';
export default {
  path: 'stuInfo',
  name: '学生信息统计',
  meta: {
    icon: 'solution'
  },
  component: PageView,
  children: [
    {
      path: 'competition',
      name: '竞赛获奖统计',
      component: () => import('@/views/stuInfo/Competition.vue')
    },
    {
      path: 'reward',
      name: '奖学金统计',
      component: () => import('@/views/stuInfo/Reward.vue')
    },
    {
      path: 'paper',
      name: '论文统计',
      component: () => import('@/views/stuInfo/Paper.vue')
    },
    {
      path: 'cet4',
      name: '四级统计',
      component: () => import('@/views/stuInfo/Cet4.vue')
    },
    {
      path: 'cet6',
      name: '六级统计',
      component: () => import('@/views/stuInfo/Cet6.vue')
    },
    {
      path: 'internship',
      name: '实习统计',
      component: () => import('@/views/stuInfo/Internship.vue')
    },
    {
      path: 'employment',
      name: '就业统计',
      component: () => import('@/views/stuInfo/Employment.vue')
    }
  ]
};

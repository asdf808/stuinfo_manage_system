import stuInfo from './stuInfo';
import personal from './personal';
export default {
  path: 'student',
  meta: {
    auth: 'STUDENT'
  },
  component: () => import('@/layouts/PageView'),
  // component: () => import('@/layouts/BlankView.vue'),
  children: [
    stuInfo,
    {
      path: 'score',
      name: '学生成绩统计',
      meta: {
        icon: 'file-text'
      },
      component: () => import('@/views/score/StudentScoreList.vue')
    },
    personal
  ]
};

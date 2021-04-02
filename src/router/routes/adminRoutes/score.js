import PageView from '@/layouts/PageView';
export default {
  path: 'score',
  name: '学生成绩统计',
  meta: {
    icon: 'solution'
  },
  component: PageView,
  children: [
    {
      path: 'inputScore',
      name: '成绩信息上传',
      component: () => import('@/views/score/InputScore.vue')
    },
    {
      path: 'scoreList',
      name: '成绩信息',
      component: () => import('@/views/score/ScoreList.vue')
    }
  ]
};

export default {
  path: 'score',
  name: '学生成绩统计',
  meta: {
    icon: 'file-text'
  },
  component: () => import('@/views/score/PersonalScore.vue')
};

import stuInfo from './stuInfo';
import score from './score';
import personal from './personal';
import user from './user';
import course from './course';
export default {
  path: 'admin',
  meta: {
    auth: 'ADMIN',
    root: true
  },
  component: () => import('@/layouts/BlankView.vue'),
  children: [
    stuInfo,
    score,
    {
      path: 'class',
      name: '班级管理',
      component: () => import('@/views/class'),
      meta: {
        icon: 'database'
      }
    },
    course,
    user,
    personal
  ]
};

import PageView from '@/layouts/PageView';
export default {
  path: 'course',
  name: '课程管理',
  meta: {
    icon: 'book'
  },
  component: PageView,
  children: [
    {
      path: 'info',
      name: '课程信息',
      component: () => import('@/views/course/Course.vue')
    },
    {
      path: 'classScore',
      name: '班级课程',
      component: () => import('@/views/course/ClassCourse.vue')
    }
  ]
};

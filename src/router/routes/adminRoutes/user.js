import PageView from '@/layouts/PageView';
export default {
  path: 'user',
  name: '用户管理',
  meta: {
    icon: 'team'
  },
  component: PageView,
  children: [
    {
      path: 'student',
      name: '学生管理',
      component: () => import('@/views/user/admin/StudentList.vue')
    },
    {
      path: 'teacher',
      name: '教师管理',
      component: () => import('@/views/user/admin/TeacherList.vue')
    },
    {
      path: 'addStudent',
      name: '添加学生',
      component: () => import('@/views/user/admin/AddStudent.vue')
    },
    {
      path: 'addTeacher',
      name: '添加教师',
      component: () => import('@/views/user/admin/AddTeacher.vue')
    },
  ]
};

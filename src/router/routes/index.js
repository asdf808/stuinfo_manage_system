import TabsView from '@/layouts/tabs/TabsView';
import baseRoutes from './baseRoutes';
import teacherRoutes from './teacherRoutes';
import studentRoutes from './studentRoutes';
import adminRoutes from './adminRoutes';
// 路由配置
const routes = [
  ...baseRoutes,
  {
    path: '/',
    name: '首页',
    component: TabsView,
    // redirect: '/login',
    children: [
      teacherRoutes,
      studentRoutes,
      adminRoutes
    ]
  }
];

export default routes;

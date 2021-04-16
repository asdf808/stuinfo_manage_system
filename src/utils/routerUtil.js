import routes from '../router/routes';
export function loadRoutes(){

}

// {
//   *    name: '菜单名称',
//   *    path: '菜单路由',
//   *    meta: {
//   *      icon: '菜单图标',
//   *      invisible: 'boolean, 是否不可见, 默认 false',
//   *    },
//   *    children: [子菜单配置]
//   *  },
export function createMenu(role){
  let menuRoutes = routes.find(route => route.path === '/').children;
  let currentRoutes = menuRoutes.find(route => {
    if (route.meta) {
      return route.meta.auth === role;
    } 
    return false;
  }).children;
  let menuData = create(currentRoutes);
  menuData.forEach(route => {
    route.path = role.toLowerCase() + '/' + route.path;
  })
  return menuData;
}

function create(menuRoutes){
  let menuData = [];
  menuRoutes.forEach(route => {
    let obj = { name: route.name, path: route.path, meta: route.meta || {} }
    if (route.children) {
      obj.children = create(route.children);
    }
    menuData.push(obj);
  })
  return menuData;
}

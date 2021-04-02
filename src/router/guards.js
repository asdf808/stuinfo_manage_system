// import Vue from 'vue';
import store from '../store';
import baseRoutes from './routes/baseRoutes';

// const loginIgnore = {
//   paths: ['/login'],
//   names: ['404', '403'],
//   includes(route) {
//     return (
//       this.names.includes(route.name) ||
//       this.paths.some(path => route.path.startsWith(path))
//     );
//   }
// };

async function checkLogin(route) {
  console.log(route);
  if (store.state.account.user) {
    return true;
  }
  if (localStorage.getItem('token') || sessionStorage.getItem('token')) {
    let flag = await store.dispatch('account/validate');
    console.log(flag);
    return flag;
  }
  return false;
}

/**
 * 登录守卫
 * @param to
 * @param form
 * @param next
 * @param options
 */
const ignorePath = baseRoutes.map(route => route.path);
async function loginGuard(to, from, next) {
  console.log(to);
  if (ignorePath.includes(to.path)) {
    next();
  } else {
    let isLogin = await checkLogin(to.path);
    console.log(isLogin);
    if (isLogin) {
      // Vue.prototype.$message.warning('登录已失效，请重新登录');
      const role = store.state.account.role;
      let route = to.matched[1];
      // console.log(route.meta.auth, role);
      if (to.path === '/') {
        next({ path: '/' + role });
      }
      if (typeof route === 'undefined' || typeof route.meta === 'undefined' || typeof route.meta.auth === 'undefined' || route.meta.auth === role) {
        next();
      } else {
        next({ path: '/403' });
      }
    } else {
      next({ path: '/login' });
    }
  }

  // console.log(to);
  // next()
}

/**
 * 权限守卫
 * @param to
 * @param form
 * @param next
 * @param options
 */
// function authorityGuard(to, from, next) {
//   const role = store.state.account.role;
//   // let route = to.matched[1];
//   if (
//     to.includes("role")
//   ) {
//     next();
//   } else {
//     next({ path: '/403' });
//   }
// }

function loadGuards(router) {
  router.beforeEach(loginGuard);
  // router.beforeEach(authorityGuard);
}

export default loadGuards;

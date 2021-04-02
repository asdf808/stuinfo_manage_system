
import store from '../store';

const loginIgnore = {
  paths: ['/login'],
  names: ['404', '403'],
  includes(route) {
    return (
      this.names.includes(route.name) ||
      this.paths.some(path => route.path.startsWith(path))
    );
  }
};

function checkLogin(route) {
  console.log(route);
  if (loginIgnore.includes(route)) {
    return true;
  }
  if (store.state.account.user) {
    return true;
  }
  return false;
}
export { checkLogin };

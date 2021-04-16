import Vue from 'vue';
import './assets/css/index.less';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import antdvComponent from './utils/antdv-component';
import init from './init';
import VueJsonExcel from 'vue-json-excel';
Vue.use(antdvComponent);
Vue.component('downloadExcel', VueJsonExcel);

Vue.config.productionTip = false;

Vue.prototype.$axios = axios;

init();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

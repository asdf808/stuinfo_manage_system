import Vue from "vue";
import VueRouter from "vue-router";
import routes from './routes';
import loadGuards from './guards';

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});
loadGuards(router);

export default router;

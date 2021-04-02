import Vue from "vue";
import Vuex from "vuex";
import modules from './modules'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //定义动画是否显示
    isShowLoading: false
  },
  mutations: {
    //使动画显示
    showLoading(state){
      state.isShowLoading = true;
    },
    //使动画隐藏
    hideLoading(state){
      state.isShowLoading = false;
    }
  },
  modules
});

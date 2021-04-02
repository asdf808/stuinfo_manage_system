import store from './store';
import { message } from 'ant-design-vue';
import axios from 'axios';
import qs from 'qs';

let reqCount = 0;
function initAxios() {
  axios.defaults.baseURL = '/api';
  axios.interceptors.request.use(
    config => {
      // 每次发送请求之前判断vuex中是否存在token
      // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
      // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
      if (config.headers['Content-Type'] === undefined) {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        config.transformRequest = [
          data => {
            // 在请求之前对data传参进行格式转换
            // delete data.date;
            data = qs.stringify(data);
            console.log(data);
            return data;
          }
        ];
      }
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      token && (config.headers.authorization = token);
      if (config.cancelLoading && reqCount === 0) {
        store.commit('showLoading');
      }
      reqCount++;
      return config;
    },
    error => {
      return Promise.error(error);
    }
  );
  axios.interceptors.response.use(
    res => {
      //删除queue里面的链接，如果同一个按钮，你一秒之内点击无数次，但是他只处理第一次操作
      reqCount--;
      //隐藏loading动画
      if (reqCount === 0) {
        store.commit('hideLoading');
      }
      //返回的结果
      if (!res.data.state && res.data.msg) {
        message.error(res.data.msg);
      }
      return res.data || {};
    },
    error => {
      message.error('error', error);
      reqCount--;
      //隐藏loading动画
      if (reqCount === 0) {
        store.commit('hideLoading');
      }
      return {};
    }
  );
}

export default function() {
  // initUser();
  initAxios();
}

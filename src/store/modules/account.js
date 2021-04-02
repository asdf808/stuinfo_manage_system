import { createMenu } from '../../utils/routerUtil';
import axios from 'axios';
import { VUE_APP_USER_KEY, VUE_APP_ROLE_KEY } from '../../config';
export default {
  namespaced: true,
  state: {
    user: null,
    permissions: null,
    role: null,
    menuData: []
  },
  getters: {
    user: state => {
      if (!state.user) {
        try {
          const user = localStorage.getItem(VUE_APP_USER_KEY);
          console.log(user);
          state.user = JSON.parse(user);
        } catch (e) {
          console.error(e);
        }
      }
      return state.user || {};
    },
    permissions: state => {
      if (!state.permissions) {
        try {
          const permissions = localStorage.getItem(process.env.VUE_APP_PERMISSIONS_KEY);
          state.permissions = JSON.parse(permissions);
          state.permissions = state.permissions ? state.permissions : [];
        } catch (e) {
          console.error(e.message);
        }
      }
      return state.permissions;
    },
    role: state => {
      if (!state.role) {
        try {
          const role = localStorage.getItem(VUE_APP_ROLE_KEY);
          state.role = JSON.parse(role);
          state.role = state.role ? state.role : [];
        } catch (e) {
          console.error(e.message);
        }
      }
      return state.role;
    },
    username: state => {
      if (state.user) {
        return state.user.stuName || state.user.teacherName || state.user.adminName;
      }
      return null;
    }
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      // localStorage.setItem(VUE_APP_USER_KEY, JSON.stringify(user));
    },
    setPermissions(state, permissions) {
      state.permissions = permissions;
      localStorage.setItem(process.env.VUE_APP_PERMISSIONS_KEY, JSON.stringify(permissions));
    },
    setRole(state, role) {
      state.role = role;
      // localStorage.setItem(VUE_APP_ROLE_KEY, JSON.stringify(role));
      state.menuData = createMenu(role);
      // console.log(state.menuData);
    },
    setUserItem(state, payload) {
      state.user[payload.key] = payload.value;
      // localStorage.setItem(VUE_APP_USER_KEY, JSON.stringify(user));
    }
  },
  actions: {
    getUser({ commit }) {
      axios.get('/user/getUser').then(res => {
        if (res.state === true) {
          commit('setUser', res.user);
          commit('setRole', res.role);
        }
      });
    },
    async validate({ commit }) {
      const res = await axios.get('/user/getUser');
      console.log(res);
      if (res.state === true) {
        commit('setUser', res.user);
        commit('setRole', res.role);
        return true;
      }
      return false;
    }
  }
};

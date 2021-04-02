<template>
  <a-layout-sider :class="['side-menu', 'beauty-scroll', 'shadow']" width="256px" :collapsible="collapsible" v-model="collapsed" :trigger="null">
    <div :class="['logo']">
      <router-link to="/dashboard/workplace">
        <img src="@/assets/img/logo.png" />
        <h1>{{ systemName }}</h1>
      </router-link>
    </div>
    <i-menu theme="dark" :collapsed="collapsed" :options="menuData" @select="onSelect" class="menu" />
    <!-- <a-menu>
      <template>

      </template>
      <a-menu-item v-for="(item, index) in menuData" :key="index">
        <a-icon type="pie-chart" />
        <span>{{ item.name }}</span>

      </a-menu-item>
    </a-menu> -->
  </a-layout-sider>
</template>

<script>
import IMenu from './menu';
import { systemName } from '@/config';
// import {mapState} from 'vuex'
export default {
  name: 'SideMenu',
  components: { IMenu },
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menuData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      systemName
    };
  },
  created() {
    // console.log('Side');
    // console.log(this.menuData);
  },
  methods: {
    onSelect(obj) {
      this.$emit('menuSelect', obj);
    }
  }
};
</script>

<style lang="less" scoped>
@import 'index';
</style>

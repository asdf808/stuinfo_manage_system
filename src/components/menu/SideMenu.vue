<template>
  <a-layout-sider :class="['side-menu', 'beauty-scroll', 'shadow']" width="256px" :collapsible="collapsible" v-model="collapsed" :trigger="null">
    <div :class="['logo']">
      <img src="@/assets/img/logo.png" />
      <h1>{{ systemName }}</h1>
    </div>
    <i-menu theme="dark" :collapsed="collapsed" :options="menuData" @select="onSelect" class="menu" />
  </a-layout-sider>
</template>

<script>
import IMenu from './menu2';
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

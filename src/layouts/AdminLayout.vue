<template>
  <a-layout :class="['admin-layout', 'beauty-scroll']">
    <drawer v-if="isMobile" v-model="drawerOpen">
      <side-menu
        :menuData="menuData"
        :collapsed="false"
        :collapsible="false"
        @menuSelect="onMenuSelect"
      />
    </drawer>
    <side-menu
      :class="[fixedSideBar ? 'fixed-side' : '']"
      v-else-if="layout === 'side' || layout === 'mix'"
      :menuData="menuData"
      :collapsed="collapsed"
      :collapsible="true"
    />
    <div
      v-if="fixedSideBar && !isMobile"
      :style="
        `width: ${sideMenuWidth}; min-width: ${sideMenuWidth};max-width: ${sideMenuWidth};`
      "
      class="virtual-side"
    ></div>
    <a-layout class="admin-layout-main beauty-scroll">
      <admin-header
        :style="headerStyle"
        :menuData="menuData"
        :collapsed="collapsed"
        @toggleCollapse="toggleCollapse"
      />
      <a-layout-header v-if="fixedHeader"></a-layout-header>
      <a-layout-content class="admin-layout-content">
        <div :style="`min-height: ${minHeight}px; position: relative`">
          <slot></slot>
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
import AdminHeader from './header/AdminHeader';
// import PageFooter from './footer/PageFooter';
import Drawer from '../components/tools/Drawer';
import SideMenu from '../components/menu/SideMenu';
// import {mapState, mapMutations, mapGetters} from 'vuex';
import { mapState } from 'vuex';
const minHeight = window.innerHeight - 64 - 24 - 122;

export default {
  name: 'AdminLayout',
  components: { SideMenu, Drawer, AdminHeader },
  data() {
    return {
      minHeight: minHeight,
      collapsed: false,
      showSetting: false,
      drawerOpen: false,
      isMobile: false,
      layout: 'side',
      fixedSideBar: true,
      fixedHeader: true
    };
  },
  created(){
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
    })
  },
  watch: {
    $route(val) {
      this.setActivated(val);
    },
    layout() {
      this.setActivated(this.$route);
    },
    isMobile(val) {
      if (!val) {
        this.drawerOpen = false;
      }
    }
  },
  computed: {
    // ...mapState('setting', ['isMobile', 'theme', 'layout', 'footerLinks', 'copyright', 'fixedHeader', 'fixedSideBar',
    //   'hideSetting']),
    // ...mapGetters('setting', ['firstMenu', 'subMenu', 'menuData']),
    ...mapState('account', ['menuData']),
    sideMenuWidth() {
      return this.collapsed ? '80px' : '256px';
    },
    headerStyle() {
      let width =
        this.fixedHeader && this.layout !== 'head' && !this.isMobile
          ? `calc(100% - ${this.sideMenuWidth})`
          : '100%';
      let position = this.fixedHeader ? 'fixed' : 'static';
      let transition = this.fixedHeader ? 'transition: width 0.2s' : '';
      return `width: ${width}; position: ${position}; ${transition}`;
    },
    headMenuData() {
      const { layout, menuData, firstMenu } = this;
      return layout === 'mix' ? firstMenu : menuData;
    },
    sideMenuData() {
      const { layout, menuData, subMenu } = this;
      return layout === 'mix' ? subMenu : menuData;
    }
  },
  methods: {
    // ...mapMutations('setting', ['correctPageMinHeight', 'setActivatedFirst']),
    toggleCollapse () {
      this.collapsed = !this.collapsed
    },
    onMenuSelect() {
      this.toggleCollapse();
    },
    setActivated(route) {
      if (this.layout === 'mix') {
        let matched = route.matched;
        matched = matched.slice(0, matched.length - 1);
        const { firstMenu } = this;
        for (let menu of firstMenu) {
          if (matched.findIndex(item => item.path === menu.fullPath) !== -1) {
            this.setActivatedFirst(menu.fullPath);
            break;
          }
        }
      }
    }
  },
  // created() {
  //   this.correctPageMinHeight(minHeight - 1);
  //   this.setActivated(this.$route);
  // },
  // beforeDestroy() {
  //   this.correctPageMinHeight(-minHeight + 1);
  // }
};
</script>

<style lang="less" scoped>
.admin-layout {
  .side-menu {
    &.fixed-side {
      position: fixed;
      height: 100vh;
      left: 0;
      top: 0;
    }
  }
  .virtual-side {
    transition: all 0.2s;
  }
  .admin-layout-main {
    .admin-header {
      top: 0;
      right: 0;
    }
  }
  .admin-layout-content {
    padding: 24px;
    overflow-x: hidden;
    min-height: calc(100vh - 64px);
  }
  .setting {
    background-color: @primary-color;
    color: #fff;
    border-radius: 5px 0 0 5px;
    line-height: 40px;
    font-size: 22px;
    width: 40px;
    height: 40px;
    box-shadow: -2px 0 8px @shadow-color;
  }
}
</style>

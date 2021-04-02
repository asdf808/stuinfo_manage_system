<template>
  <admin-layout>
    <contextmenu
      :itemList="menuItemList"
      :visible.sync="menuVisible"
      @select="onMenuSelect"
    />
    <!-- <a-tabs
      v-if="multiPage"
      type="editable-card"
      :active-key="activePage"
      :class="['tabs-view', layout, pageWidth]"
      :hide-add="true"
      @change="changePage"
      @edit="editPage"
      @contextmenu="onContextmenu"
    >
      <a-tab-pane :key="page.fullPath" v-for="page in pageList">
        <span slot="tab" :pagekey="page.fullPath">{{pageName(page)}}</span>
      </a-tab-pane>
    </a-tabs> -->
    <div :class="['tabs-view-content', 'side', 'fixed']">
      <router-view />
    </div>
  </admin-layout>
</template>

<script>
import AdminLayout from '@/layouts/AdminLayout';
import Contextmenu from '@/components/menu/Contextmenu';

export default {
  name: 'TabsView',
  components: { Contextmenu, AdminLayout },
  data() {
    return {
      clearCaches: [],
      pageList: [],
      activePage: '',
      menuVisible: false
    };
  },
  computed: {
    menuItemList() {
      return [
        { key: '1', icon: 'vertical-right', text: 'closeLeft' },
        { key: '2', icon: 'vertical-left', text: 'closeRight' },
        { key: '3', icon: 'close', text: 'closeOthers' }
      ];
    },
    // tabsOffset() {
    //   return this.multiPage ? 24 : 0;
    // }
  },
  created() {
    this.loadCachedTabs();
    const route = this.$route;
    if (
      this.pageList.findIndex(item => item.fullPath === route.fullPath) === -1
    ) {
      this.pageList.push(this.createPage(route));
    }
    this.activePage = route.fullPath;
    if (this.multiPage) {
      this.$nextTick(() => {
        this.setCachedKey(route);
      });
      this.addListener();
    }
  },
  // mounted() {
  //   this.correctPageMinHeight(-this.tabsOffset);
  // },
  beforeDestroy() {
    this.removeListener();
    // this.correctPageMinHeight(this.tabsOffset);
  },
  watch: {
    $route: function(newRoute) {
      this.activePage = newRoute.fullPath;
      if (!this.multiPage) {
        this.pageList = [this.createPage(newRoute)];
      } else if (
        this.pageList.findIndex(item => item.fullPath === newRoute.fullPath) ===
        -1
      ) {
        this.pageList.push(this.createPage(newRoute));
      }
      if (this.multiPage) {
        this.$nextTick(() => {
          this.setCachedKey(newRoute);
        });
      }
    },
    multiPage: function(newVal) {
      if (!newVal) {
        this.pageList = [this.createPage(this.$route)];
        this.removeListener();
      } else {
        this.addListener();
      }
    },
    // tabsOffset(newVal, oldVal) {
    //   this.correctPageMinHeight(oldVal - newVal);
    // }
  },
  methods: {
    changePage(key) {
      this.activePage = key;
      this.$router.push(key);
    },
    editPage(key, action) {
      this[action](key); // remove
    },
    remove(key, next) {
      if (this.pageList.length === 1) {
        return this.$message.warning('warn');
      }
      //清除缓存
      let index = this.pageList.findIndex(item => item.fullPath === key);
      this.clearCaches = this.pageList
        .splice(index, 1)
        .map(page => page.cachedKey);
      if (next) {
        this.$router.push(next);
      } else if (key === this.activePage) {
        index =
          index >= this.pageList.length ? this.pageList.length - 1 : index;
        this.activePage = this.pageList[index].fullPath;
        this.$router.push(this.activePage);
      }
    },
    onContextmenu(e) {
      const pageKey = getPageKey(e.target);
      if (pageKey) {
        e.preventDefault();
        this.menuVisible = true;
      }
    },
    onMenuSelect(key, target) {
      let pageKey = getPageKey(target);
      switch (key) {
        case '1':
          this.closeLeft(pageKey);
          break;
        case '2':
          this.closeRight(pageKey);
          break;
        case '3':
          this.closeOthers(pageKey);
          break;
        default:
          break;
      }
    },
    // closeOthers (pageKey) {
    //   // 清除缓存
    //   this.clearCaches = this.pageList.filter(item => item.fullPath !== pageKey).map(item => item.cachedKey)
    //   this.pageList = this.pageList.filter(item => item.fullPath === pageKey)
    //   // 判断跳转
    //   if (this.activePage != pageKey) {
    //     this.activePage = pageKey
    //     this.$router.push(this.activePage)
    //   }
    // },
    // closeLeft(pageKey) {
    //   const index = this.pageList.findIndex(item => item.fullPath === pageKey)
    //   // 清除缓存
    //   this.clearCaches = this.pageList.filter((item, i) => i < index).map(item => item.cachedKey)
    //   this.pageList = this.pageList.slice(index)
    //   // 判断跳转
    //   if (!this.pageList.find(item => item.fullPath === this.activePage)) {
    //     this.activePage = pageKey
    //     this.$router.push(this.activePage)
    //   }
    // },
    // closeRight(pageKey) {
    //   // 清除缓存
    //   const index = this.pageList.findIndex(item => item.fullPath === pageKey)
    //   this.clearCaches = this.pageList.filter((item, i) => i > index).map(item => item.cachedKey)
    //   this.pageList = this.pageList.slice(0, index + 1)
    //   // 判断跳转
    //   if (!this.pageList.find(item => item.fullPath === this.activePage)) {
    //     this.activePage = pageKey
    //     this.$router.push(this.activePage)
    //   }
    // },
    /**
     * 添加监听器
     */
    addListener() {
      window.addEventListener('page:close', this.closePageListener);
      window.addEventListener('unload', this.unloadListener);
    },
    /**
     * 移出监听器
     */
    removeListener() {
      window.removeEventListener('page:close', this.closePageListener);
      window.removeEventListener('unload', this.unloadListener);
    },
    /**
     * 页签关闭事件监听
     * @param event 页签关闭事件
     */
    closePageListener(event) {
      const { closeRoute, nextRoute } = event.detail;
      const closePath =
        typeof closeRoute === 'string' ? closeRoute : closeRoute.path;
      this.remove(closePath, nextRoute);
    },
    /**
     * 页面 unload 事件监听器，添加页签到 session 缓存，用于刷新时保留页签
     */
    unloadListener() {
      const tabs = this.pageList.map(item => ({ ...item, _init_: false }));
      sessionStorage.setItem(
        process.env.VUE_APP_TBAS_KEY,
        JSON.stringify(tabs)
      );
    },
    createPage(route) {
      return {
        keyPath: route.matched[route.matched.length - 1].path,
        fullPath: route.fullPath
      };
    },
    /**
     * 设置页面缓存的key
     * @param route 页面对应的路由
     */
    setCachedKey(route) {
      const page = this.pageList.find(item => item.fullPath === route.fullPath);
      if (!page._init_) {
        page.cachedKey = this.$refs.tabContent.$vnode.key;
        page._init_ = true;
      }
    },
    /**
     * 加载缓存的 tabs
     */
    loadCachedTabs() {
      const cachedTabsStr = sessionStorage.getItem(
        process.env.VUE_APP_TBAS_KEY
      );
      if (cachedTabsStr) {
        try {
          const cachedTabs = JSON.parse(cachedTabsStr);
          if (cachedTabs.length > 0) {
            this.pageList = cachedTabs;
          }
        } catch (e) {
          console.warn('failed to load cached tabs, got exception:', e);
        } finally {
          sessionStorage.removeItem(process.env.VUE_APP_TBAS_KEY);
        }
      }
    }
  }
};
/**
 * 由于ant-design-vue组件库的TabPane组件暂不支持自定义监听器，无法直接获取到右键target所在标签页的 pagekey 。故增加此方法用于
 * 查询右键target所在标签页的标识 pagekey ，以用于自定义右键菜单的事件处理。
 * 注：TabPane组件支持自定义监听器后可去除该方法并重构 ‘自定义右键菜单的事件处理’
 * @param target 查询开始目标
 * @param depth 查询层级深度 （查找层级最多不超过3层，超过3层深度直接返回 null）
 * @returns {String}
 */
function getPageKey(target, depth = 0) {
  if (depth > 2 || !target) {
    return null;
  }
  return (
    target.getAttribute('pagekey') ||
    getPageKey(target.firstElementChild, ++depth)
  );
}
</script>

<style scoped lang="less">
.tabs-view {
  margin: -16px auto 8px;
  &.head.fixed {
    max-width: 1400px;
  }
}
.tabs-view-content {
  position: relative;
  &.head.fixed {
    width: 1400px;
    margin: 0 auto;
  }
}
</style>

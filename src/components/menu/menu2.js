/**
 * 根据菜单配置自动生成 ANTD menu组件
 * menuOptions示例：
 * [
 *  {
 *    name: '菜单名称',
 *    path: '菜单路由',
 *    meta: {
 *      icon: '菜单图标',
 *      invisible: 'boolean, 是否不可见, 默认 false',
 *    },
 *    children: [子菜单配置]
 *  },
 *  {
 *    name: '菜单名称',
 *    path: '菜单路由',
 *    meta: {
 *      icon: '菜单图标',
 *      invisible: 'boolean, 是否不可见, 默认 false',
 *    },
 *    children: [子菜单配置]
 *  }
 * ]
 **/
import Menu from 'ant-design-vue/es/menu';
import fastEqual from 'fast-deep-equal';

export default {
  name: 'IMenu',
  props: {
    options: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    openKeys: Array
  },
  data() {
    return {
      selectedKeys: [],
      sOpenKeys: [],
      cachedOpenKeys: []
    };
  },
  computed: {
    menuTheme() {
      return this.theme == 'light' ? this.theme : 'dark';
    }
  },
  created() {
    this.updateMenu();
    if (this.options.length > 0 && !this.options[0].fullPath) {
      this.formatOptions(this.options, '');
    }
  },
  watch: {
    options(val) {
      if (val.length > 0 && !val[0].fullPath) {
        this.formatOptions(this.options, '');
      }
    },
    collapsed(val) {
      if (val) {
        this.cachedOpenKeys = this.sOpenKeys;
        this.sOpenKeys = [];
      } else {
        this.sOpenKeys = this.cachedOpenKeys;
      }
    },
    $route: function() {
      this.updateMenu();
    },
    sOpenKeys(val) {
      this.$emit('openChange', val);
      this.$emit('update:openKeys', val);
    }
  },
  methods: {
    renderIcon: function(h, icon, key) {
      if (this.$scopedSlots.icon && icon && icon !== 'none') {
        const vnodes = this.$scopedSlots.icon({ icon, key });
        vnodes.forEach(vnode => {
          vnode.data.class = vnode.data.class ? vnode.data.class : [];
          vnode.data.class.push('anticon');
        });
        return vnodes;
      }
      return !icon || icon == 'none' ? null : <a-icon type={icon} />;
    },
    renderMenuItem: function(h, menu) {
      return (
        <a-menu-item key={menu.fullPath}>
          <router-link to={menu.fullPath} style="overflow:hidden;white-space:normal;text-overflow:clip;">
            {this.renderIcon(h, menu.meta ? menu.meta.icon : 'none', menu.fullPath)}
            {menu.name}
          </router-link>
        </a-menu-item>
      );
    },
    renderSubMenu: function(h, menu) {
      let itemArr = [];
      menu.children.forEach(item => {
        itemArr.push(this.renderItem(h, item));
      });
      return (
        <a-sub-menu key={menu.fullPath}>
          <span slot="title" style="overflow:hidden;white-space:normal;text-overflow:clip;">{[this.renderIcon(h, menu.meta ? menu.meta.icon : 'none', menu.fullPath), menu.name]}</span>
          {menu.children.map(item => this.renderItem(h, item))}
        </a-sub-menu>
      );
    },
    renderItem: function(h, menu) {
      return menu.children ? this.renderSubMenu(h, menu) : this.renderMenuItem(h, menu);
    },
    renderMenu(h, menuTree) {
      let menuArr = [];
      menuTree.forEach((menu, i) => {
        menuArr.push(this.renderItem(h, menu, '0', i));
      });
      return menuArr;
    },
    formatOptions(options, parentPath) {
      options.forEach(route => {
        let isFullPath = route.path.substring(0, 1) == '/';
        route.fullPath = isFullPath ? route.path : parentPath + '/' + route.path;
        if (route.children) {
          this.formatOptions(route.children, route.fullPath);
        }
      });
    },
    updateMenu() {
      const menuRoutes = this.$route.matched.filter(item => item.path !== '');
      this.selectedKeys = this.getSelectedKey(this.$route);
      let openKeys = menuRoutes.map(item => item.path);
      if (!fastEqual(openKeys, this.sOpenKeys)) {
        this.collapsed || this.mode === 'horizontal' ? (this.cachedOpenKeys = openKeys) : (this.sOpenKeys = openKeys);
      }
    },
    getSelectedKey(route) {
      return route.matched.map(item => item.path);
    }
  },
  render(h) {
    return h(
      Menu,
      {
        props: {
          theme: this.menuTheme,
          selectedKeys: this.selectedKeys,
          openKeys: this.openKeys ? this.openKeys : this.sOpenKeys,
          mode: 'inline'
        },
        on: {
          'update:openKeys': val => {
            this.sOpenKeys = val;
          },
          click: obj => {
            obj.selectedKeys = [obj.key];
            this.$emit('select', obj);
          }
        }
      },
      this.renderMenu(h, this.options)
    );
  }
};

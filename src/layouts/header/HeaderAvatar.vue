<template>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer; padding-right: 50px">
      <a-avatar class="avatar" size="small" shape="circle" style="width: 38px; height: 38px" :src="avatarSrc" />
      <span class="name">{{ username }}</span>
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <a-menu-item @click="toPersonalCenter">
        <a-icon type="user" />
        <span>个人中心</span>
      </a-menu-item>
      <a-menu-divider />
      <a-menu-item @click="logout">
        <a-icon style="margin-right: 8px" type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { SERVER_STATIC_BASE_URL } from '@/config';
export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapState('account', ['user', 'username', 'role']),
    avatarSrc() {
      if (this.user && this.user.avatar) {
        return SERVER_STATIC_BASE_URL + this.user.avatar;
      } else {
        return require('@/assets/img/default_avatar.png');
      }
    }
  },
  methods: {
    ...mapMutations('account', ['setUser']),
    logout() {
      this.setUser(null);
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      this.$message.success('退出成功');
      this.$router.push('/login');
    },
    toPersonalCenter(){
      this.$router.push(`/${this.role}/personal/personalInfo`);
    }
  }
};
</script>

<style lang="less">
.header-avatar {
  display: inline-flex;
  .avatar,
  .name {
    align-self: center;
  }
  .avatar {
    margin-right: 8px;
  }
  .name {
    font-weight: 500;
  }
}
.avatar-menu {
  width: 150px;
}
</style>

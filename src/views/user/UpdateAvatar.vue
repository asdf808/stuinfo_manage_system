<template>
  <div class="avatar-box">
    <span style="display: inline-block; position: relative" @mouseenter="showShadow = true" @mouseleave="showShadow = false">
      <!-- <img  /> -->
      <a-avatar :size="100" :src="avatarSrc" style="border: 1px #888 dashed" />
      <div :class="['shadow', showShadow ? 'show-shadow' : '']">
        <a-button type="primary" size="small" @click="$refs.avatarFile.click()">修改头像</a-button>
      </div>
      <input type="file" style="display: none" accept="image/*" ref="avatarFile" @change="uploadAvatar" />
    </span>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { SERVER_STATIC_BASE_URL } from '@/config';
export default {
  data() {
    return {
      showShadow: false
    };
  },
  computed: {
    ...mapState('account', ['user', 'role']),
    avatarSrc() {
      if (this.user && this.user.avatar) {
        return SERVER_STATIC_BASE_URL + this.user.avatar;
      } else {
        return require('@/assets/img/default_avatar.png');
      }
    }
  },
  methods: {
    ...mapMutations('account', ['setUser', 'setUserItem']),
    uploadAvatar(e) {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image')) {
          this.$message.error('请选择图片文件！');
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          this.$message.error('图片大小不得超过2MB！');
          return;
        }
        const reader = new FileReader();
        reader.onload = e => {
          this.$confirm({
            title: '确认更换头像？',
            content: () => (
              <div style="padding-left:17%;font-size: 16px">
                预览：
                <img src={e.target.result} style="width:100px;height:100px;border-radius: 50%" />
              </div>
            ),
            class: 'confirm',
            onOk: async () => {
              let formData = new FormData();
              formData.append('avatar', file);
              const res = await this.$axios.post('/user/uploadAvatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
              console.log(res);
              if (res.state === true) {
                this.setUserItem({ key: 'avatar', value: res.avatar });
                this.$message.success('上传成功！');
              } else {
                this.$message.error('上传失败！');
              }
            }
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.avatar-box {
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
  .shadow {
    position: absolute;
    opacity: 0;
    background: rgba(255, 255, 255, 0.6);
    z-index: 999;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    transition: 0.5s;
  }
  .show-shadow {
    opacity: 0.9;
    transition: 0.8s;
  }
}
</style>
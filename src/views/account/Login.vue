<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">{{ systemName }}</span>
      </div>
      <div class="desc"></div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs size="large" :tabBarStyle="{ textAlign: 'center' }" style="padding: 0 2px" @change="tabChange">
          <a-tab-pane tab="学生登录" key="0">
            <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px" />
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="用户名"
                v-decorator="[
                  'userId',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入用户名',
                        whitespace: true
                      }
                    ]
                  }
                ]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder="密码"
                autocomplete="autocomplete"
                type="password"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                        whitespace: true
                      }
                    ]
                  }
                ]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane tab="教师登录" key="1">
            <a-alert type="error" :closable="true" v-show="error" :message="error" showIcon style="margin-bottom: 24px" />
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="用户名"
                v-decorator="[
                  'userId',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入用户名',
                        whitespace: true
                      }
                    ]
                  }
                ]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder="密码"
                autocomplete="autocomplete"
                type="password"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                        whitespace: true
                      }
                    ]
                  }
                ]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <div>
          <a-checkbox v-model="remember">记住我</a-checkbox>
          <a-checkbox v-model="isAdmin" v-show="userType === '1'">是否管理员</a-checkbox>
          <router-link to="/findPassword" style="float: right">忘记密码</router-link>
        </div>
        <a-form-item>
          <a-button :loading="loading" style="width: 100%; margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout';
import { systemName } from '@/config';
import { mapMutations } from 'vuex';

export default {
  name: 'Login',
  components: { CommonLayout },
  data() {
    return {
      systemName,
      loading: false,
      error: '',
      form: this.$form.createForm(this),
      remember: true,
      userType: 0,
      isAdmin: false,
      confirmLoading: false
    };
  },
  mounted() {
    console.log(systemName);
  },
  computed: {},
  methods: {
    ...mapMutations('account', ['setUsername', 'setRole']),
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields(err => {
        if (!err) {
          this.loading = true;
          this.login();
        }
      });
    },
    login() {
      const userId = this.form.getFieldValue('userId');
      const password = this.form.getFieldValue('password');
      console.log(userId, password, this.remember, this.userType);
      let loginRole;
      if (this.userType == 0) {
        loginRole = 0;
      } else {
        if (this.isAdmin) {
          loginRole = 2;
        } else {
          loginRole = 1;
        }
      }
      this.$axios.post('/auth/login', { userId, password, loginRole }).then(this.afterLogin, () => {
        this.loading = this.confirmLoading = false;
        this.$message.error('error');
      });
    },
    afterLogin(loginRes) {
      console.log(loginRes);
      this.loading = this.confirmLoading = false;
      if (loginRes.state === true) {
        const { username, role } = loginRes.user;
        this.setUsername(username);
        this.setRole(role);
        if (this.remember) {
          localStorage.setItem('token', loginRes.token);
        } else {
          sessionStorage.setItem('token', loginRes.token);
        }
        this.$router.push('/' + role.toLowerCase());
        this.$message.success('登录成功', 3);
      } else {
        this.error = loginRes.msg;
      }
    },
    tabChange(key) {
      this.userType = key;
    }
  }
};
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;
    .header {
      height: 44px;
      line-height: 44px;
      a {
        text-decoration: none;
      }
      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }
      .title {
        font-size: 33px;
        color: @title-color;
        font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
  .login {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>

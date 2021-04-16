<template>
  <common-layout>
    <div class="continer">
      <div style="margin: 20px 0 25px 10px;">
        已向您的邮箱<span style="color: #00f;font-weight: 600;">{{ email }}</span
        >发送验证码
      </div>
      <a-form @submit="onSubmit" :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
        <a-form-item label="验证码">
          <a-input v-decorator="['verificationCode', { rules: [{ required: true, message: '请输入验证码' }] }]">
            <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-item>
        <a-form-item label="新密码">
          <a-input v-decorator="['password', { rules: [{ required: true, message: '' }] }]" type="password">
            <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-item>
        <a-form-item label="确认密码">
          <a-input v-decorator="['password2', { rules: [{ required: true, message: '' }] }]" type="password" placeholder="Password">
            <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
          </a-input>
        </a-form-item>
        <a-button :loading="loading" class="submitButton" size="large" htmlType="submit" type="primary">提交</a-button>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout';
export default {
  components: {
    CommonLayout
  },
  beforeCreate() {
    console.log(this.$route.params);
    let email = this.$route.params.email;
    if (!email) {
      // this.$router.replace('/findPassword');
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false,
      email: this.$route.params.email
    };
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          if (values.password === values.password2) {
            this.$axios.post('/findPassword/resetPassword', values).then(res => {
              if (res.state === true) {
                this.loading = false;
                this.$message.success('密码重置成功！');
                this.$router.push('/login');
              } else {
                this.loading = false;
                this.$message.error(res.msg);
              }
            });
          } else {
            this.$message.error('两次密码输入不一致！');
            this.loading = false;
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.continer {
  width: 50%;
  min-width: 350px;
  max-width: 450px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  .submitButton {
    width: 80%;
    margin: 10px auto;
    display: block;
  }
}
</style>
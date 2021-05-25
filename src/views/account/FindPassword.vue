<template>
  <common-layout>
    <div class="continer">
      <h2>第一步：输入要重置密码的账号</h2>
      <a-divider />
      <a-form @submit="onSubmit" :form="form">
        <a-form-item>
          <a-input size="large" placeholder="账号" v-decorator="['userId', { rules: [{ required: true, message: '请输入用户名', whitespace: true }] }]">
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-radio-group v-decorator="['selectedRole', { rules: [{ required: true, message: '请选择用户类型' }] }]">
            <a-radio value="STUDENT"> 学生 </a-radio>
            <a-radio value="TEACHER"> 教师 </a-radio>
            <a-radio value="ADMIN"> 管理员 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item>
          <a-button :loading="loading" style="width: 100%" size="large" htmlType="submit" type="primary">下一步</a-button>
        </a-form-item>
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
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false
    };
  },
  methods:{
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          this.$axios.get(`/findPassword/sendEmail?userId=${values.userId}&role=${values.selectedRole}`).then(res => {
            if (res.state === true) {
              this.loading = false;
              console.log(res.email);
              this.$router.replace({ name: '重置密码', params: { email: res.email } });
            } else {
              this.loading = false;
              this.$message.error('邮箱未绑定或绑定错误!请联系管理员重置密码');
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.continer {
  width: 50%;
  min-width: 335px;
  max-width: 450px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
}
</style>
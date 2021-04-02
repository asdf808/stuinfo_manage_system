<template>
  <div>
    <a-form class="form" @submit="onSubmit" :form="form" :hideRequiredMark="true" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
      <a-form-item label="原 密 码">
        <a-input type="password" v-decorator="['oldPassword']" />
      </a-form-item>
      <a-form-item label="新 密 码">
        <a-input type="password" v-decorator="['password1']" />
      </a-form-item>
      <a-form-item label="确认新密码">
        <a-input type="password" v-decorator="['password2']" />
      </a-form-item>
      <a-button :loading="loading" class="submit-button" htmlType="submit" type="primary">确认修改</a-button>
    </a-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      loading: false
    };
  },
  methods: {
    onSubmit(e){
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          if(values.password1 !== values.password2){
            this.$message.error('两次新密码输入不一致');
            return;
          }
          this.loading = true;
          this.$axios.put('/user/modifyPassword', values).then(res => {
            if (res.state === true) {
              this.loading = false;
              this.form.setFieldsValue({ oldPassword: null, password1: null, password2: null });
              this.$message.success('修改成功！');
            } else {
              this.loading = false;
              this.$message.error('原密码错误！');
            }
          });
        }
      });
    }
  }
}
</script>

<style>
.form {
  width: 500px;
  margin: 10px;
}
.submit-button {
  display: block;
  width: 25%;
  margin: 0 auto;
}
</style>

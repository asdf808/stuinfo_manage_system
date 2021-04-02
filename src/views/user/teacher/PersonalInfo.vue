<template>
  <div class="continer">
    <update-avatar></update-avatar>
    <a-form @submit="onSubmit" :form="form" :hideRequiredMark="true" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
      <a-form-item label="教工号">
        <a-input disabled :value="personalData.teacherId" />
      </a-form-item>
      <a-form-item label="姓名">
        <a-input disabled :value="personalData.teacherName" />
      </a-form-item>
      <a-form-item label="班级">
        <a-input disabled :value="personalData.teacherClass" />
      </a-form-item>
      <a-form-item label="性别">
        <a-radio-group v-decorator="['teacherSex']">
          <a-radio :value="0">男</a-radio>
          <a-radio :value="1">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input v-decorator="['email']" />
      </a-form-item>
      <a-button class="submit-button" htmlType="submit" type="primary">修改</a-button>
    </a-form>
  </div>
</template>

<script>
import UpdateAvatar from '../UpdateAvatar';
export default {
  components: {
    UpdateAvatar
  },
  data() {
    return {
      personalData: {},
      form: this.$form.createForm(this)
    };
  },
  created() {
    this.$axios.get('/user/getUser').then(res => {
      if (res.state) {
        this.personalData = res.user;
        this.form.setFieldsValue({
          teacherSex: res.user.teacherSex,
          email: res.user.email
        });
      }
    });
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          this.$confirm({
            title: '确认修改？',
            class: 'confirm',
            onOk: async () => {
              const res = await this.$axios.put('/user/updateTeacher', values);
              if (res.state === true) {
                this.$message.success('修改成功！');
              } else {
                this.$message.error('修改失败！');
              }
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.continer {
  width: 50%;
  min-width: 400px;
  border: 2px #222 solid;
  border-radius: 10px;
  padding: 20px;
}
.submit-button {
  display: block;
  width: 40%;
  margin: 0 auto;
}
.confirm {
  top: 200px;
}
</style>

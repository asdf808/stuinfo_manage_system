<template>
  <div class="continer">
    <update-avatar></update-avatar>
    <a-form @submit="onSubmit" :form="form" :hideRequiredMark="true" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
      <a-form-item label="学号">
        <a-input disabled :value="personalData.stuId" />
      </a-form-item>
      <a-form-item label="姓名">
        <a-input disabled :value="personalData.stuName" />
      </a-form-item>
      <a-form-item label="年级">
        <a-input disabled :value="personalData.stuGrade" />
      </a-form-item>
      <a-form-item label="班级">
        <a-input disabled :value="personalData.stuClass" />
      </a-form-item>
      <a-form-item label="专业">
        <a-input disabled :value="personalData.major" />
      </a-form-item>
      <a-form-item label="性别">
        <a-radio-group v-decorator="['stuSex']">
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
import { mapState, mapMutations } from 'vuex';
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
  computed: {
    ...mapState('account', ['user'])
  },
  created() {
    this.$axios.get('/user/getUser').then(res => {
      if (res.state) {
        this.personalData = res.user;
        this.form.setFieldsValue({
          stuSex: res.user.stuSex,
          email: res.user.email
        });
      }
    });
  },
  methods: {
    ...mapMutations('account', ['setUsername', 'setUserItem']),
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          this.$confirm({
            title: '确认修改？',
            class: 'confirm',
            onOk: async () => {
              const res = await this.$axios.put('/user/updateStudent', values);
              if (res.state === true) {
                this.$message.success('修改成功！');
                this.setUsername(values.adminName);
                for (let key in values) {
                  this.setUserItem({ key, value: values[key] });
                }
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

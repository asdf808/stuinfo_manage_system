<template>
  <div class="continer">
    <update-avatar></update-avatar>
    <a-form @submit="onSubmit" :form="form" :hideRequiredMark="true" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
      <a-form-item label="账号">
        <a-input disabled :value="user.adminId" />
      </a-form-item>
      <a-form-item label="姓名">
        <a-input v-decorator="['adminName', { initialValue: user.adminName }]" />
      </a-form-item>
      <a-form-item label="邮箱">
        <a-input v-decorator="['email', { initialValue: user.email }]" />
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
      form: this.$form.createForm(this)
    };
  },
  computed: {
    ...mapState('account', ['user'])
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
              const res = await this.$axios.put('/user/updateAdmin', values);
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

<style lang="less" scoped>
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

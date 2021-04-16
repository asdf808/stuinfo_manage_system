<template>
  <div>
    <div class="add-form">
      <a-form @submit="onSubmit" :form="form" :hideRequiredMark="true" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
        <a-form-item label="教师号">
          <a-input v-decorator="['teacherId', { rules: [{ required: true, message: '学号不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-decorator="['teacherName', { rules: [{ required: true, message: '姓名不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="所带班级">
          <a-select show-search option-filter-prop="children" v-decorator="['teacherClass', { rules: [{ required: true, message: '班级不能为空' }] }]">
            <a-select-option v-for="(item, index) in selectItems" :key="index" :value="item">
              {{ item }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-button :loading="loading" class="submit-button" htmlType="submit" type="primary">添加</a-button>
      </a-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      selectItems: [],
      loading: false
    };
  },
  created() {
    this.$axios.get('/class/getAllClasses').then(res => {
      if (res.state) {
        this.selectItems = res.data;
      }
    });
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          this.$axios.post('/user/addTeacher', values).then(res => {
            if (res.state) {
              this.$message.success('添加成功');
            } else {
              this.$message.error('添加失败');
            }
            this.loading = false;
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.add-form {
  border: 2px #888 solid;
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  margin: 20px 0;
}
.submit-button {
  display: block;
  width: 40%;
  margin: 0 auto;
}
</style>

<template>
  <div>
    <a-tooltip title="Excel中需包含标题为学号、姓名、年级、班级、专业的列" placement="right">
      <upload-excel :on-success="handleSuccess" :before-upload="beforeUpload"></upload-excel>
    </a-tooltip>
    <a-modal title="上传预览" :visible="visible" :confirm-loading="confirmLoading" okText="确认上传" cancelText="取消" @ok="handleOk" @cancel="visible = false">
      <a-table :columns="columns" :data-source="uploadData" :pagination="false" :scroll="{ y: 250 }" bordered></a-table>
    </a-modal>
    <div class="add-form">
      <a-form @submit="onSubmit" :form="form" :hideRequiredMark="true" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
        <a-form-item label="学号">
          <a-input v-decorator="['stuId', { rules: [{ required: true, message: '学号不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-decorator="['stuName', { rules: [{ required: true, message: '姓名不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="专业">
          <a-input v-decorator="['major', { rules: [{ required: true, message: '专业不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="年级">
          <a-input v-decorator="['stuGrade', { rules: [{ required: true, message: '年级不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="班级">
          <a-select show-search option-filter-prop="children" v-decorator="['stuClass', { rules: [{ required: true, message: '班级不能为空' }] }]">
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
import UploadExcel from '@/components/tools/UploadExcel';
export default {
  components: {
    UploadExcel
  },
  data() {
    return {
      columns: [
        { title: '学号', dataIndex: 'stuId', align: 'center' },
        { title: '姓名', dataIndex: 'stuName', align: 'center' },
        { title: '专业', dataIndex: 'major', align: 'center' },
        { title: '年级', dataIndex: 'stuGrade', align: 'center' },
        { title: '班级', dataIndex: 'stuClass', align: 'center' }
      ],
      uploadData: [],
      confirmLoading: false,
      visible: false,
      form: this.$form.createForm(this),
      selectItems: [],
      loading: false
    };
  },
  created() {
    this.$axios.get('/getAllClasses').then(res => {
      if (res.state) {
        this.selectItems = res.data;
      }
    });
  },
  methods: {
    beforeUpload(file) {
      // 取文件大小，限制文件大小超过10mb
      if (file.size > 1024 * 1024 * 10) {
        this.$message.warning('上传的Excel文件不能大于10MB.');
        return false;
      }
      return true;
    },
    handleSuccess({ results, header }) {
      console.log(header);
      console.log(results);
      if (header.includes('学号') && header.includes('姓名') && header.includes('年级') && header.includes('班级') && header.includes('专业')) {
        let dataList = results.map(item => ({
          stuId: item['学号'],
          stuName: item[''],
          major: item['专业'],
          stuGrade: item['年级'],
          stuClass: item['班级']
        }));
        this.uploadData = dataList;
        this.visible = true;
        // this.upload(dataList);
      } else {
        this.$message.error('表格导入模板错误!');
        return;
      }
    },
    handleOk() {
      this.confirmLoading = true;
      this.upload(this.uploadData);
    },
    upload(dataList) {
      this.$axios
        .post('user/batchAddStudent', dataList, {
          headers: { 'Content-Type': 'application/json' }
        })
        .then(res => {
          if (res.state === true) {
            this.visible = false;
            this.$message.success('上传成功');
          } else {
            this.$message.error('上传失败');
          }
          this.confirmLoading = false;
        });
    },
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          this.$axios.post('/user/addStudent', values).then(res => {
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

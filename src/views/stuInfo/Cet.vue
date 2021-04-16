<template>
  <div>
    <stu-info-display-for-student v-if="$store.state.account.role === 'STUDENT'" :columns="columns" :dataSource="dataSource" @edit="edit" @add="add"></stu-info-display-for-student>
    <stu-info-display v-else :columns="columns" :dataSource="dataSource" @edit="edit" @add="add"></stu-info-display>
    <a-modal :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
      <a-form :form="form">
        <a-form-item label="学号" v-if="$store.state.account.role !== 'STUDENT'">
          <a-input v-decorator="['stuId', { rules: [{ required: true, message: '学号不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="成绩">
          <a-input
            v-decorator="[
              'score',
              {
                rules: [
                  {
                    required: true,
                    pattern: /^\d{1,3}$/,
                    message: '请填写正确的成绩'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="考试时间">
          <a-date-picker style="width: 100%" v-decorator="['date', { rules: [{ required: true, type: 'date', message: '请选择考试时间' }] }]" />
        </a-form-item>
        <a-form-item label="证书">
          <a-upload :file-list="fileList" :before-upload="beforeUpload">
            <a-button> <a-icon type="upload" /> Select File </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import StuInfoDisplay from '@/components/stuInfo/StuInfoDisplay';
import StuInfoDisplayForStudent from '@/components/stuInfo/StuInfoDisplayForStudent';
export default {
  props: ['type'],
  components: {
    StuInfoDisplay,
    StuInfoDisplayForStudent
  },
  inject: ['reload'],
  data() {
    return {
      current: 1,
      dataSource: [],
      visible: false,
      confirmLoading: false,
      submitType: '',
      columns: [
        {
          title: '学号',
          dataIndex: 'stuId'
        },
        {
          title: '姓名',
          dataIndex: 'stuName'
        },
        {
          title: '成绩',
          dataIndex: 'score'
        },
        {
          title: '考试时间',
          dataIndex: 'date'
        },
        {
          title: '证书',
          scopedSlots: { customRender: 'image' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      form: this.$form.createForm(this, { name: '四级' }),
      fileList: [],
      currentRecord: {}
    };
  },
  created() {
    this.$axios.get(`/stuInfo/cet${this.type}`).then(res => {
      if (res.state === true) {
        console.log(res.data);
        res.data.forEach(item => {
          item.key = item.id;
        });
        this.dataSource = res.data;
      }
    });
    this.columns.forEach(column => {
      column.align = 'center';
    });
  },
  methods: {
    beforeUpload(file) {
      if (!file.type.startsWith('image')) {
        this.$message.error('请选择图片文件');
        return false;
      }
      if (!file.size > 2 * 1024 * 1024) {
        this.$message.error('图片大小不能超过2MB！');
        return false;
      }

      this.fileList = [file];
      console.log(file);
      return false;
    },
    setVisible(flag) {
      this.visible = flag;
    },
    add() {
      this.currentRecord = {};
      this.submitType = 'add';
      this.fileList = [];
      let fieldsValue = this.form.getFieldsValue();
      for (let key in fieldsValue) {
        fieldsValue[key] = null;
      }
      this.form.setFieldsValue(fieldsValue);
      this.visible = true;
    },
    edit(record) {
      this.currentRecord = record;
      this.submitType = 'edit';
      this.fileList = [];
      this.visible = true;
      this.$nextTick(() => this.form.setFieldsValue(record));
    },
    handleOk() {
      let url = '/stuInfo/cet' + this.type;
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          let param = new FormData();
          if (typeof values.date === 'object') {
            values.date = values.date.format('YYYY-MM-DD');
          }
          for (let key in values) {
            param.append(key, values[key]);
          }
          param.append('img', this.fileList[0]);
          if (this.submitType === 'add') {
            this.$axios
              .post(url, param, {
                headers: { 'Content-Type': 'multipart/form-data' }
              })
              .then(res => {
                if (res.state === true) {
                  this.$message.success('添加成功');
                  this.reload();
                } else {
                  this.$message.error('添加失败');
                }
              });
          }
          if (this.submitType === 'edit') {
            param.append('id', this.currentRecord.id);
            this.$axios
              .put(url, param, {
                headers: { 'Content-Type': 'multipart/form-data' }
              })
              .then(res => {
                if (res.state === true) {
                  this.$message.success('修改成功');
                  this.reload();
                } else {
                  this.$message.error('修改失败');
                }
              });
          }
        }
      });
    },
    handleCancel() {
      this.visible = false;
    }
  }
};
</script>

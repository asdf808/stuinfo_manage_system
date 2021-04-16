<template>
  <div>
    <stu-info-display-for-student v-if="$store.state.account.role === 'STUDENT'" :columns="columns" :dataSource="dataSource" @edit="edit" @add="add"></stu-info-display-for-student>
    <stu-info-display v-else :columns="columns" :dataSource="dataSource" @edit="edit" @add="add"></stu-info-display>
    <a-modal :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
      <a-form :form="form">
        <a-form-item label="学号" v-if="$store.state.account.role !== 'STUDENT'">
          <a-input v-decorator="['stuId', { rules: [{ required: true, message: '学号不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="论文题目">
          <a-input v-decorator="['title', { rules: [{ required: true, message: '论文题目不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="第X作者">
          <a-input v-decorator="['authorLevel', { rules: [{ required: true, message: '第X作者不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="会议or期刊">
          <a-radio-group v-decorator="['type', { rules: [{ required: true, message: '请选择会议or期刊' }] }]">
            <a-radio value="会议"> 会议 </a-radio>
            <a-radio value="期刊"> 期刊 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="会议(期刊)名称">
          <a-input v-decorator="['conferenceName', { rules: [{ required: true, message: '会议(期刊)名称不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="发表时间">
          <a-date-picker v-decorator="['publishDate', { rules: [{ required: true, type: 'date', message: '请选择发表时间' }] }]" />
        </a-form-item>
        <a-form-item label="电子版">
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
  components: {
    StuInfoDisplay,
    StuInfoDisplayForStudent
  },
  inject: ['reload'],
  data() {
    return {
      dataSource: [],
      columns: [
        {
          title: '学号',
          dataIndex: 'stuId'
        },
        {
          title: '作者',
          dataIndex: 'stuName'
        },
        {
          title: '论文题目',
          dataIndex: 'title'
        },
        {
          title: '第X作者',
          dataIndex: 'authorLevel'
        },
        {
          title: '会议or期刊',
          dataIndex: 'type'
        },
        {
          title: '会议(期刊)名称',
          dataIndex: 'conferenceName'
        },
        {
          title: '发表时间',
          dataIndex: 'publishDate'
        },
        {
          title: 'pdf电子版',
          scopedSlots: { customRender: 'electronicEditionLink' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      fileList: [],
      form: this.$form.createForm(this, { name: '就业信息' }),
      currentRecord: {},
      visible: false,
      confirmLoading: false
    };
  },
  created() {
    this.$axios.get('/stuInfo/paper/').then(res => {
      if (res.state === true) {
        console.log(res.data);
        this.dataSource = res.data;
        this.dataSource.forEach(item => {
          item.key = item.id;
        });
      }
    });
    this.columns.forEach(column => {
      column.align = 'center';
    });
  },
  methods: {
    beforeUpload(file) {
      if (!file.name.endsWith('.pdf')) {
        this.$message.error('请选择pdf文件');
        return false;
      }
      this.fileList = [file];
      console.log(file);
      return false;
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
      let url = '/stuInfo/paper/';
      this.form.validateFields((err, values) => {
        if (!err && (this.submitType === 'edit' || this.fileList[0])) {
          console.log(values);
          let param = new FormData();
          if (typeof values.publishDate === 'object') {
            values.publishDate = values.publishDate.format('YYYY-MM-DD');
          }
          for (let key in values) {
            param.append(key, values[key]);
          }
          param.append('pdf', this.fileList[0]);
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

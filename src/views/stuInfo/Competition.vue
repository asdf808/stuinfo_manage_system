<template>
  <div>
    <stu-info-display-for-student v-if="$store.state.account.role === 'student'" :columns="columns" :dataSource="dataSource" @edit="edit" @add="add"></stu-info-display-for-student>
    <stu-info-display v-else :columns="columns" :dataSource="dataSource" @edit="edit" @add="add"></stu-info-display>
    <a-modal class="form-modal" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
      <a-form :form="form">
        <a-form-item label="学号" v-if="$store.state.account.role !== 'student'">
          <a-input v-decorator="['stuId', { rules: [{ required: true, message: '学号不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="比赛名称">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '比赛名称不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="参加时间">
          <a-date-picker v-decorator="['joinTime', { rules: [{ required: true, type: 'date', message: '请选择参加时间' }] }]" />
        </a-form-item>
        <a-form-item label="参加地点">
          <a-input v-decorator="['place', { rules: [{ required: true, message: '参加地点不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="比赛等级">
          <a-select v-decorator="['level', { rules: [{ required: true, message: '请选择比赛等级' }] }]" placeholder="请选择比赛等级">
            <a-select-option value="院系级"> 院系级 </a-select-option>
            <a-select-option value="校级"> 校级 </a-select-option>
            <a-select-option value="省级"> 省级 </a-select-option>
            <a-select-option value="国家级"> 国家级 </a-select-option>
            <a-select-option value="国际级"> 国际级 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="比赛名次">
          <a-input v-decorator="['ranking', { rules: [{ required: true, message: '比赛名次不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="指导老师">
          <a-input v-decorator="['guideTeacher', { rules: [{ required: true, message: '指导老师不能为空' }] }]" />
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
          title: '姓名',
          dataIndex: 'stuName'
        },
        {
          title: '比赛名称',
          dataIndex: 'name'
        },
        {
          title: '参加时间',
          dataIndex: 'joinTime'
        },
        {
          title: '参加地点',
          dataIndex: 'place'
        },
        {
          title: '比赛等级',
          dataIndex: 'level'
        },
        {
          title: '比赛名次',
          dataIndex: 'ranking'
        },
        {
          title: '证书',
          scopedSlots: { customRender: 'image' }
        },
        {
          title: '指导老师',
          dataIndex: 'guideTeacher'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      form: this.$form.createForm(this, { name: '比赛' }),
      fileList: [],
      currentRecord: {},
      visible: false,
      confirmLoading: false
    };
  },
  created() {
    this.$axios.get('/stuInfo/competition/').then(res => {
      console.log(res);
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
      let url = '/stuInfo/competition/';
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          if (typeof values.joinTime === 'object') {
            values.joinTime = values.joinTime.format('YYYY-MM-DD');
          }
          let param = new FormData();
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
            console.log(param.get('joinTime'));
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

<style></style>

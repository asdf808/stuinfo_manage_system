<template>
  <div>
    <stu-info-display-for-student v-if="$store.state.account.role === 'student'" :columns="columns" :dataSource="dataSource" @edit="edit" @add="add"></stu-info-display-for-student>
    <stu-info-display v-else :columns="columns" :dataSource="dataSource" @edit="edit" @add="add"></stu-info-display>
    <a-modal :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="visible = false">
      <a-form :form="form">
        <a-form-item label="学号" v-if="$store.state.account.role !== 'student'">
          <a-input v-decorator="['stuId', { rules: [{ required: true, message: '学号不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="奖励名称">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '奖励名称不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="获得时间">
          <a-date-picker v-decorator="['date', { rules: [{ required: true, type: 'date', message: '请选择获得时间' }] }]" />
        </a-form-item>
        <a-form-item label="奖励等级">
          <a-select v-decorator="['level', { rules: [{ required: true, message: '请选择奖励等级' }] }]" placeholder="请选择比赛等级">
            <a-select-option value="院系级"> 院系级 </a-select-option>
            <a-select-option value="校级"> 校级 </a-select-option>
            <a-select-option value="省级"> 省级 </a-select-option>
            <a-select-option value="国家级"> 国家级 </a-select-option>
          </a-select>
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
          title: '奖励名称',
          dataIndex: 'name'
        },
        {
          title: '获得时间',
          dataIndex: 'date'
        },
        {
          title: '奖励等级',
          dataIndex: 'level'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      form: this.$form.createForm(this, { name: '就业信息' }),
      currentRecord: {},
      visible: false,
      confirmLoading: false
    };
  },
  created() {
    this.$axios.get('/stuInfo/reward/').then(res => {
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
    add() {
      this.currentRecord = {};
      this.submitType = 'add';
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
      this.visible = true;
      this.$nextTick(() => this.form.setFieldsValue(record));
    },
    handleOk() {
      let url = '/stuInfo/reward/';
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          if (typeof values.date === 'object') {
            values.date = values.date.format('YYYY-MM-DD');
          }
          if (this.submitType === 'add') {
            this.$axios.post(url, values).then(res => {
              if (res.state === true) {
                this.$message.success('添加成功');
                this.reload();
              } else {
                this.$message.error(res.msg);
              }
            });
          }
          if (this.submitType === 'edit') {
            this.$axios
              .put(url, {
                ...values,
                id: this.currentRecord.id
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
    }
  }
};
</script>

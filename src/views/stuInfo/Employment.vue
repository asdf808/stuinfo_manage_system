<template>
  <div>
    <stu-info-display-for-student v-if="$store.state.account.role === 'STUDENT'" :columns="columns" :dataSource="dataSource" @edit="edit" @add="add"></stu-info-display-for-student>
    <stu-info-display v-else :columns="columns" :dataSource="dataSource" @edit="edit" @add="add"></stu-info-display>
    <a-modal :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="visible = false">
      <a-form :form="form">
        <a-form-item label="学号" v-if="$store.state.account.role !== 'STUDENT'">
          <a-input v-decorator="['stuId', { rules: [{ required: true, message: '学号不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="就业意向">
          <a-input v-decorator="['intention', { rules: [{ required: true, message: '就业意向不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="就业单位">
          <a-input v-decorator="['company', { rules: [{ required: true, message: '就业单位不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="就业地点">
          <a-input v-decorator="['place', { rules: [{ required: true, message: '就业地点不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="单位属性">
          <a-select v-decorator="['companyNature', { rules: [{ required: true, message: '请选择单位属性' }] }]" placeholder="请选择单位属性">
            <a-select-option value="国企"> 国企 </a-select-option>
            <a-select-option value="私企"> 私企 </a-select-option>
            <a-select-option value="事业单位"> 事业单位 </a-select-option>
            <a-select-option value="学校"> 学校 </a-select-option>
            <a-select-option value="科研机构"> 科研机构 </a-select-option>
            <a-select-option value="其他"> 其他 </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="签订时间">
          <a-date-picker style="width: 100%" v-decorator="['signDate', { rules: [{ required: true, type: 'date', message: '请选择签订时间' }] }]" />
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
          title: '就业意向',
          dataIndex: 'intention'
        },
        {
          title: '就业单位',
          dataIndex: 'company'
        },
        {
          title: '就业地点',
          dataIndex: 'place'
        },
        {
          title: '单位属性',
          dataIndex: 'companyNature'
        },
        {
          title: '签订时间',
          dataIndex: 'signDate'
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
    this.$axios.get('/stuInfo/employment/').then(res => {
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
      this.visible = true;
      let fieldsValue = this.form.getFieldsValue();
      for (let key in fieldsValue) {
        fieldsValue[key] = null;
      }
      this.form.setFieldsValue(fieldsValue);
    },
    edit(record) {
      this.currentRecord = record;
      this.submitType = 'edit';
      this.visible = true;
      this.$nextTick(() => this.form.setFieldsValue(record));
    },
    handleOk() {
      let url = '/stuInfo/employment/';
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          if (typeof values.signDate === 'object') {
            values.signDate = values.signDate.format('YYYY-MM-DD');
          }
          if (this.submitType === 'add') {
            this.$axios.post(url, values).then(res => {
              if (res.state === true) {
                this.$message.success('添加成功');
                this.reload();
              } else {
                this.$message.error('添加失败');
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

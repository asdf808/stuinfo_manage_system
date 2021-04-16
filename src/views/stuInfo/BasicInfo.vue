<template>
  <div>
    <stu-info-display-for-student v-if="$store.state.account.role === 'STUDENT'" :columns="columns" :dataSource="dataSource" @edit="edit" @add="add"></stu-info-display-for-student>
    <stu-info-display v-else :columns="columns" :dataSource="dataSource" @edit="edit" @add="add"></stu-info-display>
    <a-modal :title="title" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="学号" v-if="$store.state.account.role !== 'STUDENT'">
          <a-input v-decorator="['stuId', { rules: [{ required: true, message: '学号不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="民族">
          <a-input v-decorator="['nation', { rules: [{ required: true, message: '民族不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="籍贯">
          <a-input v-decorator="['nativePlace', { rules: [{ required: true, message: '籍贯不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="政治面貌">
          <a-input v-decorator="['politicsStatus', { rules: [{ required: true, message: '政治面貌不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="职务">
          <a-input v-decorator="['position', { rules: [{ required: true, message: '职务不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="宿舍门牌号">
          <a-input v-decorator="['dormitoryNumber', { rules: [{ required: true, message: '宿舍门牌号不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="生日">
          <a-date-picker v-decorator="['birthday', { rules: [{ required: true, type: 'date', message: '请选择生日' }] }]" />
        </a-form-item>
        <a-form-item label="家庭住址">
          <a-input v-decorator="['homeAddress', { rules: [{ required: true, message: '家庭住址不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="父亲姓名">
          <a-input v-decorator="['fatherName', { rules: [{ required: true, message: '父亲姓名不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="母亲姓名">
          <a-input v-decorator="['motherName', { rules: [{ required: true, message: '母亲姓名不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="家庭联系电话">
          <a-input v-decorator="['homePhone', { rules: [{ required: true, message: '家庭联系电话不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="是否孤儿">
          <a-radio-group v-decorator="['orphan', { rules: [{ required: true, message: '未选择是否孤儿' }] }]">
            <a-radio :value="false"> 否 </a-radio>
            <a-radio :value="true"> 是 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否单亲">
          <a-radio-group v-decorator="['singleParent', { rules: [{ required: true, message: '未选择是否单亲' }] }]">
            <a-radio :value="false"> 否 </a-radio>
            <a-radio :value="true"> 是 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否有低保证">
          <a-radio-group v-decorator="['lowIncomeProof', { rules: [{ required: true, message: '未选择是否有低保证' }] }]">
            <a-radio :value="false"> 否 </a-radio>
            <a-radio :value="true"> 是 </a-radio>
          </a-radio-group>
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
          title: '班级',
          dataIndex: 'stuClass'
        },
        {
          title: '民族',
          dataIndex: 'nation'
        },
        {
          title: '籍贯',
          dataIndex: 'nativePlace'
        },
        {
          title: '政治面貌',
          dataIndex: 'politicsStatus'
        },
        {
          title: '职务',
          dataIndex: 'position'
        },
        {
          title: '宿舍门牌号',
          dataIndex: 'dormitoryNumber'
        },
        {
          title: '电话号码',
          dataIndex: 'phoneNumber'
        },
        {
          title: '生日',
          dataIndex: 'birthday'
        },
        {
          title: '家庭住址',
          dataIndex: 'homeAddress'
        },
        {
          title: '父亲姓名',
          dataIndex: 'fatherName'
        },
        {
          title: '母亲姓名',
          dataIndex: 'motherName'
        },
        {
          title: '家庭联系电话',
          dataIndex: 'homePhone'
        },
        {
          title: '是否孤儿',
          dataIndex: 'orphan'
        },
        {
          title: '是否单亲',
          dataIndex: 'singleParent'
        },
        {
          title: '是否有低保证',
          dataIndex: 'lowIncomeProof'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      form: this.$form.createForm(this, { name: '基本信息' }),
      currentRecord: {},
      visible: false,
      confirmLoading: false
    };
  },
  created() {
    this.$axios.get('/stuInfo/basicInfo/').then(res => {
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
    },
    edit(record) {
      this.currentRecord = record;
      this.submitType = 'edit';
      this.visible = true;
      this.$nextTick(() => this.form.setFieldsValue(record));
    },
    handleOk() {
      let url = '/stuInfo/basicInfo/';
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          let param = new FormData();
          if (typeof values.joinTime === 'object') {
            values.birthday = values.birthday.format('YYYY-MM-DD');
          }
          for (let key in values) {
            param.append(key, values[key]);
          }
          if (this.submitType === 'add') {
            this.$axios.post(url, param).then(res => {
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
            this.$axios.put(url, param).then(res => {
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

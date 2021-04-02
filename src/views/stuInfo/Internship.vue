<template>
  <div>
    <stu-info-display-for-student v-if="$store.state.account.role === 'student'" :columns="columns" :dataSource="dataSource" @edit="edit" @add="add"></stu-info-display-for-student>
    <stu-info-display v-else :columns="columns" :dataSource="dataSource" @edit="edit" @add="add"></stu-info-display>
    <a-modal :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="visible = false">
      <a-form :form="form">
        <a-form-item label="学号" v-if="$store.state.account.role !== 'student'">
          <a-input v-decorator="['stuId', { rules: [{ required: true, message: '学号不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="实习单位">
          <a-input v-decorator="['company', { rules: [{ required: true, message: '实习单位不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="实习地点">
          <a-input v-decorator="['place', { rules: [{ required: true, message: '实习地点不能为空' }] }]" />
        </a-form-item>
        <!-- <a-form-item label="是否省内实习">
          <a-radio-group
            v-decorator="[
              'inProvince',
              {
                initialValue: currentRecord.inProvince,
                rules: [
                  {
                    required: true,
                    message: '请选择是否省内实习'
                  }
                ]
              }
            ]"
          >
            <a-radio :value="true">
              是
            </a-radio>
            <a-radio :value="false">
              否
            </a-radio>
          </a-radio-group>
        </a-form-item> -->
        <a-form-item label="实习职位">
          <a-input v-decorator="['post', { rules: [{ required: true, message: '实习职位不能为空' }] }]" />
        </a-form-item>
        <!-- <a-form-item label="实习起始时间">
          <a-date-picker
            v-decorator="[
              'startDate',
              {
                initialValue: currentRecord.startDate,
                rules: [
                  {
                    required: true,
                    type: 'date',
                    message: '请选择实习起始时间'
                  }
                ]
              }
            ]"
          />
        </a-form-item>
        <a-form-item label="实习结束时间">
          <a-date-picker
            v-decorator="[
              'endDate',
              {
                initialValue: currentRecord.endDate,
                rules: [
                  {
                    required: true,
                    type: 'date',
                    message: '请选择实习结束时间'
                  }
                ]
              }
            ]"
          />
        </a-form-item> -->
        <a-form-item label="实习时间">
          <a-range-picker v-decorator="['dateRange', { rules: [{ required: true, type: 'array', message: '请选择实习时间' }] }]" />
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
          title: '实习单位',
          dataIndex: 'company'
        },
        {
          title: '实习地点',
          dataIndex: 'place'
        },
        {
          title: '实习职位',
          dataIndex: 'post'
        },
        {
          title: '实习起始时间',
          dataIndex: 'startDate'
        },
        {
          title: '实习结束时间',
          dataIndex: 'endDate'
        },
        {
          title: '实习证明',
          scopedSlots: { customRender: 'image' }
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      form: this.$form.createForm(this, { name: '实习信息' }),
      currentRecord: {},
      visible: false,
      fileList: [],
      confirmLoading: false
    };
  },
  created() {
    this.$axios.get('/stuInfo/internship/').then(res => {
      if (res.state === true) {
        console.log(res.data);
        let data = res.data;
        data.forEach(item => {
          item.key = item.id;
          item.dateRange = [item.startDate, item.endDate];
        });
        this.dataSource = data;
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
      let url = '/stuInfo/internship/';
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          let param = new FormData();
          for (let key in values) {
            if (key === 'dateRange') {
              param.append('startDate', typeof values[key][0] === 'object' ? values[key][0].format('YYYY-MM-DD') : values[key][0]);
              param.append('endDate', typeof values[key][1] === 'object' ? values[key][1].format('YYYY-MM-DD') : values[key][1]);
              continue;
            }
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
    }
  }
};
</script>

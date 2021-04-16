<template>
  <div>
    <div style="margin-bottom: 20px">
      <span>班级：</span>
      <a-select style="width: 120px" v-model="selectedClass" @change="handleChange">
        <a-select-option v-for="item in classes" :key="item" :value="item">{{ item }}班</a-select-option>
      </a-select>
    </div>
    <a-table v-if="selectedClass" bordered :columns="columns" :data-source="data" :rowKey="record => record.id" :loading="loading">
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm title="确认删除?" @confirm="remove(record.id)">
          <a>删除</a>
        </a-popconfirm>
      </template>
      <template slot="footer">
        <div>
          <a-button @click="handleClick">{{ showForm ? '取消' : '添加' }}</a-button>
          <a-form v-if="showForm" @submit="onSubmit" :form="form" :hideRequiredMark="true" :label-col="{ span: 2 }" :wrapper-col="{ span: 10 }" style="margin-top: 10px">
            <a-form-item label="课程">
              <a-select class="select" show-search option-filter-prop="children" v-decorator="['courseId', { rules: [{ required: true, message: '请选择课程' }] }]">
                <a-select-option v-for="(item, index) in courses" :key="index" :value="item.id">
                  {{ item.id + '--' + item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="学年">
              <a-select class="select" v-decorator="['studyYear', { rules: [{ required: true, message: '请选择学年' }] }]">
                <a-select-option :value="1">第1学年</a-select-option>
                <a-select-option :value="2">第2学年</a-select-option>
                <a-select-option :value="3">第3学年</a-select-option>
                <a-select-option :value="4">第4学年</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="学期">
              <a-select class="select" v-decorator="['semester', { rules: [{ required: true, message: '请选择学期' }] }]">
                <a-select-option :value="1">第1学期</a-select-option>
                <a-select-option :value="2">第2学期</a-select-option>
              </a-select>
            </a-form-item>
            <a-button :load；ing="loading2" style="margin-left: 37%; width: 100px" htmlType="submit">添加</a-button>
          </a-form>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
const columns = [
  {
    title: '班级',
    dataIndex: 'classId',
    width: '15%'
  },
  {
    title: '课程代码',
    dataIndex: 'courseId',
    width: '15%'
  },
  {
    title: '课程名称',
    dataIndex: 'courseName',
    width: '20%'
  },
  {
    title: '学年',
    dataIndex: 'studyYear',
    width: '20%',
    filters: [
      { text: '第1学年', value: 1 },
      { text: '第2学年', value: 2 },
      { text: '第3学年', value: 3 },
      { text: '第4学年', value: 4 }
    ]
  },
  {
    title: '学期',
    dataIndex: 'semester'
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'operation' }
  }
];
columns.forEach(column => {
  column.align = 'center';
});
export default {
  data() {
    return {
      classes: [],
      data: [],
      columns,
      selectedClass: '',
      showForm: false,
      loading: false,
      loading2: false,
      courses: [],
      form: this.$form.createForm(this)
    };
  },
  created() {
    this.$axios.get('/class/getAllClasses').then(res => {
      if (res.state) {
        this.classes = res.data.sort();
      }
    });
    this.$axios.get('/course/getAll').then(res => {
      if (res.state) {
        this.courses = res.data;
      }
    });
  },
  methods: {
    doSort(data){
      return data.sort((a, b) => {
        if (a.studyYear !== b.studyYear) {
          return a.studyYear - b.studyYear;
        } else if (a.semester !== b.semester) {
          return a.semester - b.semester;
        }
        return a.courseId > b.courseId ? 1 : -1;
      });
    },
    handleChange(val) {
      this.loading = true;
      this.showForm = false;
      this.form.resetFields();
      console.log(val);
      this.$axios.get('/class/getClassCourse?classId=' + val).then(res => {
        console.log(res);
        if (res.state) {
          this.data = this.doSort(res.data);
        }
        this.loading = false;
      });
    },
    handleClick() {
      this.showForm = !this.showForm;
    },
    remove(id) {
      this.$axios.delete('/class/removeClassCourse/' + id).then(res => {
        if (res.state) {
          this.data = this.data.filter(item => item.id != id);
        } else {
          this.$message.error('删除失败！');
        }
      });
    },
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading2 = true;
          this.$axios.post('/class/addClassCourse', { ...values, classId: this.selectedClass }).then(res => {
            if (res.state) {
              let newData = res.data;
              newData.courseName = this.courses.find(course => course.id === newData.courseId).name;
              this.data = this.doSort([...this.data, newData]);
              // newData.push()
              this.$message.success('添加成功');
              this.form.resetFields();
            } else {
              this.$message.error('添加失败');
            }
            this.loading2 = false;
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.select {
  width: 200px;
}
</style>

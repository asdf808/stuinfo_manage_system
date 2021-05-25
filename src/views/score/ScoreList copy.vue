<template>
  <div>
    <div class="select-box">
      <template v-if="role === 'ADMIN'">
        <span>班级：</span>
        <a-select default-value="全部" v-model="selectedClass" class="select">
          <a-select-option :value="''">全部</a-select-option>
          <a-select-option v-for="item in classes" :key="item" :value="item">{{ item }}班</a-select-option>
        </a-select>
      </template>
      <span>学年：</span>
      <a-select default-value="全部" v-model="selectedStudyYear" class="select">
        <a-select-option :value="0">全部</a-select-option>
        <a-select-option :value="1">第1学年</a-select-option>
        <a-select-option :value="2">第2学年</a-select-option>
        <a-select-option :value="3">第3学年</a-select-option>
        <a-select-option :value="4">第4学年</a-select-option>
      </a-select>
      <span>学期：</span>
      <a-select default-value="全部" v-model="selectedSemester" class="select">
        <a-select-option :value="0">全部</a-select-option>
        <a-select-option :value="1">第1学期</a-select-option>
        <a-select-option :value="2">第2学期</a-select-option>
      </a-select>
      <span>课程：</span>
      <a-select default-value="全部" v-model="selectedCourse" class="select" style="width: 200px">
        <a-select-option :value="0">全部</a-select-option>
        <a-select-option v-for="course in courses" :key="course.courseId" :value="course.courseId">{{ course.courseId + '—' + course.courseName }}</a-select-option>
      </a-select>
      <download-excel-component :xls_fields="xls_fields" :excelData="currentScoreData" :fileName="$route.name" style="display: inline-block; margin-left: 20px"></download-excel-component>
    </div>
    <a-table v-if="showTable" :columns="columns" :data-source="currentScoreData" bordered :pagination="paginationOpt" :rowKey="record => record.id">
      <template slot="semester" slot-scope="text, record">
        <span
          >第<b>{{ record.studyYear }}</b
          >学年 第<b>{{ record.semester }}</b
          >学期</span
        >
      </template>
      <template slot="score" slot-scope="text, record">
        <div>
          <a-input v-if="record.editable" style="width: 100px" :defaultValue="text" @change="e => handleChange('score', e)" />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.id)">保存</a>
            <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.id)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a :disabled="editingKey !== ''" @click="() => edit(record.id)">编辑</a>
            <span style="display: inline-block; width: 10%"></span>
            <a-popconfirm title="确认删除?" @confirm="() => remove(record.id)">
              <a :disabled="editingKey !== ''">删除</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import DownloadExcelComponent from '../../components/tools/DownloadExcel';
import { mapState } from 'vuex';
const paginationOpt = {
  defaultCurrent: 1, // 默认当前页数
  defaultPageSize: 10, // 默认当前页显示数据的大小
  total: 0, // 总数，必须先有
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '30', '50'],
  showTotal: total => `共 ${total} 条`, // 显示总数
  onShowSizeChange(current, pageSize) {
    this.defaultCurrent = 1;
    this.defaultPageSize = pageSize;
  },
  // 改变每页数量时更新显示
  onChange(current, size) {
    this.defaultCurrent = current;
    this.defaultPageSize = size;
  }
};
const columns = [
  {
    title: '学号',
    dataIndex: 'stuId',
    width: '15%'
  },
  {
    title: '姓名',
    dataIndex: 'stuName',
    width: '15%'
  },
  {
    title: '课程名称',
    dataIndex: 'courseName',
    width: '20%'
  },
  {
    title: '学年学期',
    scopedSlots: { customRender: 'semester' },
    width: '20%'
  },
  {
    title: '分数',
    dataIndex: 'score',
    sorter: (a, b) => a.score - b.score,
    scopedSlots: { customRender: 'score' },
    width: '15%'
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
  components: {
    DownloadExcelComponent
  },
  data() {
    return {
      paginationOpt,
      columns,
      scoreData: [],
      courses: [],
      selectedStudyYear: 0,
      selectedSemester: 0,
      selectedCourse: 0,
      editingKey: '',
      cacheData: null,
      classes: [],
      selectedClass: '',
      xls_fields: { stuId: '学号', stuName: '姓名', courseName: '课程名称', score: '分数' }
    };
  },
  created() {
    this.$axios.get('/score/getList').then(res => {
      if (res.state === true) {
        console.log(res.data);
        this.paginationOpt.total = res.data.length;
        this.scoreData = res.data;
        let obj = {};
        let courses = [];
        this.scoreData.forEach(item => {
          if (!obj[item.courseId]) {
            obj[item.courseId] = true;
            courses.push({ courseId: item.courseId, courseName: item.courseName });
          }
        });
        this.courses = courses;
      }
    });
    if (this.role === 'ADMIN') {
      this.$axios.get('/class/getAllClasses').then(res => {
        if (res) {
          this.classes = res.data.sort();
        }
      });
    }
  },
  computed: {
    ...mapState('account', ['role']),
    currentScoreData() {
      return this.scoreData.filter(item => {
        let flag = true;
        if (this.selectedStudyYear) {
          flag = flag && this.selectedStudyYear == item.studyYear;
        }
        if (this.selectedSemester) {
          flag = flag && this.selectedSemester == item.semester;
        }
        if (this.selectedCourse) {
          flag = flag && this.selectedCourse == item.courseId;
        }
        if (this.selectedClass) {
          flag = flag && this.selectedClass == item.classId;
        }
        return flag;
      });
    }
  },
  methods: {
    handleChange(col, e){
      this.cacheData[col] = e.target.value;
    },
    edit(key) {
      const newData = [...this.scoreData];
      const target = newData.find(item => key === item.id);
      this.editingKey = '1';
      target.editable = true;
      this.scoreData = newData;
      this.cacheData = { ...target };
    },
    cancel(key) {
      const newData = [...this.scoreData];
      const target = newData.find(item => key === item.id);
      this.editingKey = '';
      target.editable = false;
      this.scoreData = newData;
    },
    remove(id) {
      this.$axios.delete('/score/remove/' + id).then(res => {
        if (res.state) {
          this.scoreData = this.scoreData.filter(item => item.id !== id);
          this.$message.success('删除成功');
        } else {
          this.$message.error('删除失败！');
        }
      });
    },
    save(key){
      console.log(this.cacheData);
      const param = { id: this.cacheData.id, score: this.cacheData.score };
      this.$axios.put('/score/update', param).then(res => {
        if (res.state) {
          const newData = [...this.scoreData];
          const target = newData.find(item => key === item.id);
          for (let key in this.cacheData){
            target[key] = this.cacheData[key];
          }
          target.editable = false;
          this.editingKey = '';
          this.scoreData = newData;
        } else {
          this.$message.error('修改失败！');
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
.select-box {
  margin-bottom: 20px;
  .select {
    width: 120px;
    margin-right: 20px;
  }
}
.editable-row-operations a {
  margin-right: 8px;
}
</style>

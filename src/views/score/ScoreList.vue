<template>
  <div>
    <div class="select-box">
      <span>学年：</span>
      <a-select default-value="全部" v-model="selectedStudyYear" class="select">
        <a-select-option :value="0">全部</a-select-option>
        <a-select-option :value="1">第一学年</a-select-option>
        <a-select-option :value="2">第二学年</a-select-option>
        <a-select-option :value="3">第三学年</a-select-option>
        <a-select-option :value="4">第四学年</a-select-option>
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
    <a-table :columns="columns" :data-source="currentScoreData" bordered :pagination="paginationOpt" :rowKey="record => record.id"></a-table>
  </div>
</template>

<script>
import DownloadExcelComponent from '../../components/tools/DownloadExcel';
const paginationOpt = {
  defaultCurrent: 1, // 默认当前页数
  defaultPageSize: 30, // 默认当前页显示数据的大小
  total: 0, // 总数，必须先有
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['20', '30', '50', '80'],
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
    dataIndex: 'stuId'
  },
  {
    title: '姓名',
    dataIndex: 'stuName'
  },
  {
    title: '课程名称',
    dataIndex: 'courseName'
  },
  {
    title: '分数',
    dataIndex: 'score'
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
  },
  computed: {
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
        return flag;
      });
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
</style>

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
    </div>
    <a-table :columns="columns" :data-source="currentScoreData" bordered :pagination="paginationOpt" :rowKey="record => record.id">
      <template slot="semester" slot-scope="text, record">
        <span>第<b>{{ record.studyYear }}</b>学年 第<b>{{ record.semester }}</b>学期</span>
      </template>
    </a-table>
  </div>
</template>

<script>
const paginationOpt = {
  defaultCurrent: 1, // 默认当前页数
  defaultPageSize: 30, // 默认当前页显示数据的大小
  total: 0, // 总数，必须先有
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['3', '20', '30', '50', '80'],
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
    title: '学年学期',
    scopedSlots: { customRender: 'semester' }
  },
  {
    title: '分数',
    dataIndex: 'score',
    sorter: (a, b) => a.score - b.score
  }
];
columns.forEach(column => {
  column.align = 'center';
});
export default {
  data() {
    return {
      paginationOpt,
      columns,
      scoreData: [],
      selectedStudyYear: 0,
      selectedSemester: 0
    };
  },
  created() {
    this.$axios.get('/score/getList').then(res => {
      if (res.state === true) {
        console.log(res.data);
        this.paginationOpt.total = res.data.length;
        this.scoreData = res.data;
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

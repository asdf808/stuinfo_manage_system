<template>
  <div>
    <div>
      <span>选择课程：</span>
      <a-select style="width: 400px" v-model="selectedCourse" @change="handleChange">
        <a-select-option v-for="item in classCourses" :key="item.id" :value="item.courseId">
          {{ item.courseId }}--{{ item.courseName }}--第{{ item.studyYear }}学年--第{{ item.semester }}学期
        </a-select-option>
      </a-select>
    </div>
    <div v-show="selectedCourse">
      <h2 style="margin: 20px 0">成绩分布情况：</h2>
      <a-row v-show="result.num">
        <a-col :span="12">
          <div id="histogramChart"></div>
        </a-col>
        <a-col :span="1"></a-col>
        <a-col :span="11">
          <div id="pieChart" style="width:80%"></div>
        </a-col>
      </a-row>
      <h3 style="margin: 20px 0">
        <span>考试人数：{{ result.num }}</span>
        <span style="margin-left: 50px">及格人数：{{ result.passNum }}</span>
        <span style="margin-left: 50px">平均分数：{{ result.averageScore }}</span>
      </h3>
    </div>
  </div>
</template>

<script>
import { Histogram, Pie } from '@antv/g2plot';

export default {
  data() {
    return {
      classCourses: [],
      selectedCourse: '',
      scoreData: [],
      scoreRangeData: [],
      histogram: null,
      pie: null
    };
  },
  created() {
    this.$axios.get('/class/getClassCourse').then(res => {
      if (res.state) {
        console.log(res);
        this.classCourses = res.data;
      }
    });
    this.$axios.get('/score/getList').then(res => {
      if (res.state === true) {
        this.scoreData = res.data;
      }
    });
  },
  mounted() {

    this.histogram = new Histogram('histogramChart', {
      data: [],
      binField: 'score',
      binWidth: 10,
      meta: {
        range: {
          min: 0,
          max: 100,
          tickInterval: 10
        }
      },
      tooltip: {
        formatter: datum => ({
          title: datum.range[0] + '-' + datum.range[1] + '分',
          name: '人数',
          value: datum.count + '人'
        })
      },
      yAxis: {
        tickInterval: 3
      }
    });
    this.pie = new Pie('pieChart', {
      data: [],
      angleField: 'value',
      colorField: 'type'
    });
    this.histogram.render();
    this.pie.render();
  },
  computed: {
    curScoreData() {
      if (!this.selectedCourse) {
        return [];
      }
      return this.scoreData.filter(score => score.courseId === this.selectedCourse);
    },
    result() {
      let passNum = this.curScoreData.filter(item => item.score > 60).length;
      let scoreSum = this.curScoreData.reduce((pre, cur) => pre + cur.score, 0);
      let averageScore = (scoreSum / this.curScoreData.length).toFixed(2);
      return {
        num: this.curScoreData.length,
        passNum,
        averageScore
      };
    },
    scoreDistribution() {
      let scoreRangeData = [0, 0, 0, 0, 0];
      this.curScoreData.forEach(item => {
        if (item.score >= 90) {
          scoreRangeData[0]++;
        } else if (item.score >= 80) {
          scoreRangeData[1]++;
        } else if (item.score >= 70) {
          scoreRangeData[2]++;
        } else if (item.score >= 60) {
          scoreRangeData[3]++;
        } else {
          scoreRangeData[4]++;
        }
      });
      scoreRangeData.map;
      return this.scoreRangeData;
    }
  },
  watch: {
    curScoreData(newValue) {
      console.log(newValue);
      let scoreRangeData = [0, 0, 0, 0, 0];
      this.curScoreData.forEach(item => {
        if (item.score >= 90) {
          scoreRangeData[0]++;
        } else if (item.score >= 80) {
          scoreRangeData[1]++;
        } else if (item.score >= 70) {
          scoreRangeData[2]++;
        } else if (item.score >= 60) {
          scoreRangeData[3]++;
        } else {
          scoreRangeData[4]++;
        }
      });
      console.log(scoreRangeData);
      this.histogram.changeData(newValue);
      this.pie.changeData([
        { type: '60分以下', value: scoreRangeData[0] },
        { type: '60-70分', value: scoreRangeData[1] },
        { type: '70-80分', value: scoreRangeData[2] },
        { type: '80-90分', value: scoreRangeData[3] },
        { type: '90分及以上', value: scoreRangeData[4] }
      ]);
    }
  },
  methods: {
    handleChange() {
      // this.$axios.get()
    }
  }
};
</script>

<style lang="less" scoped>
</style>

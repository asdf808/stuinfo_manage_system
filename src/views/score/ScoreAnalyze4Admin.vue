<template>
  <div>
    <div>
      <h2>各班平均分统计</h2>
      <div id="avgScore"></div>
      <h2 style="margin-top: 20px">各班不及格人数统计</h2>
      <div id="passedStackedColumnPlot"></div>
      <h2 style="margin-top: 20px">各班及格率统计</h2>
      <div id="passedRatio"></div>
    </div>
  </div>
</template>

<script>
import { Column } from '@antv/g2plot';
export default {
  data() {
    return {
      classes: [],
      scoreList: [],
      baseData: [],
      avgScoreData: [],
      avgScoreColumnPlot: null,
      passedStackedColumnPlot: null
    };
  },
  created() {
    this.$axios.get('/class/getAllClasses').then(res => {
      if (res.state) {
        this.classes = res.data.sort();
      }
    });
    this.$axios.get('/score/getList').then(res => {
      if (res.state === true) {
        console.log(res);
        this.scoreList = res.data;
        let baseData = {};
        this.scoreList.forEach(item => {
          if (!baseData[item.classId]) {
            baseData[item.classId] = [item.score];
          } else {
            baseData[item.classId].push(item.score);
          }
        });
        this.baseData = baseData;
      }
    });
  },
  watch: {
    baseData(data) {
      let avgScoreData = [];
      let passedData = [];
      let passedRatio = [];
      for (const key in data) {
        let sum = 0;
        let unpassedNum = 0;
        let passedNum = 0;
        data[key].forEach(score => {
          sum += score;
          if (score < 60) {
            unpassedNum++;
          } else {
            passedNum++;
          }
        });
        let avgScore = Number((sum / data[key].length).toFixed(2));
        let ratio = Number(((unpassedNum * 100) / data[key].length).toFixed(2));
        avgScoreData.push({ class: key + '班', avgScore });
        passedData.push({ class: key + '班', num: unpassedNum, type: '未及格人数' });
        passedData.push({ class: key + '班', num: passedNum, type: '及格人数' });
        passedRatio.push({ class: key + '班', ratio });
      }
      this.avgScoreData = avgScoreData;
      console.log(avgScoreData);
      this.avgScoreColumnPlot.changeData(avgScoreData);
      this.passedStackedColumnPlot.changeData(passedData);
      this.passedRatio.changeData(passedRatio);
    }
  },
  mounted() {
    this.avgScoreColumnPlot = new Column('avgScore', {
      data: [],
      xField: 'class',
      yField: 'avgScore',
      maxColumnWidth: 50,
      tooltip: {
        formatter: data => ({
          name: '平均分',
          value: data.avgScore
        })
      }
    });
    this.passedStackedColumnPlot = new Column('passedStackedColumnPlot', {
      data: [],
      isStack: true,
      xField: 'class',
      yField: 'num',
      seriesField: 'type',
      maxColumnWidth: 50,
      // meta: {
      //   num: {
      //     min: 0,
      //     tickInterval: 3
      //   }
      // },
      tooltip: {
        formatter: data => ({
          name: '不及格人数',
          value: data.num
        })
      }
    });
    this.passedRatio = new Column('passedRatio', {
      data: [],
      xField: 'class',
      yField: 'ratio',
      color: '#ee4d4d',
      maxColumnWidth: 50,
      meta: {
        ratio: {
          min: 0,
          max: 100,
          tickInterval: 10
        }
      },
      tooltip: {
        formatter: data => ({
          name: '及格率',
          value: data.ratio + '%'
        })
      }
    });
    this.avgScoreColumnPlot.render();
    this.passedStackedColumnPlot.render();
    this.passedRatio.render();
  }
};
</script>

<style>
</style>
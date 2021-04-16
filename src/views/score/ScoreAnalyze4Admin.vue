<template>
  <div>
    <div>
      <h3>各班平均分统计</h3>
      <div id="avgScore"></div>
      <h3 style="margin-top: 20px">各班不及格人数统计</h3>
      <div id="unpassedNum"></div>
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
      unpassedNumColumnPlot: null
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
      let unpassedData = [];
      for (const key in data) {
        let sum = 0;
        let unpassedNum = 0;
        data[key].forEach(score => {
          sum += score;
          if (score < 60) {
            unpassedNum++;
          }
        });
        let avgScore = Number((sum / data[key].length).toFixed(2));
        let ratio = Number(((unpassedNum * 100) / data[key].length).toFixed(2));
        avgScoreData.push({ class: key + '班', avgScore });
        unpassedData.push({ class: key + '班', num: unpassedNum, ratio });
      }
      this.avgScoreData = avgScoreData;
      console.log(avgScoreData);
      console.log(unpassedData);
      this.avgScoreColumnPlot.changeData(avgScoreData)
      this.unpassedNumColumnPlot.changeData(unpassedData);
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
    this.unpassedNumColumnPlot = new Column('unpassedNum', {
      data: [],
      xField: 'class',
      yField: 'num',
      color: '#ee4d4d',
      maxColumnWidth: 50,
      meta: {
        num: {
          min: 0,
          tickInterval: 1
        }
      },
      tooltip: {
        formatter: data => ({
          name: '不及格人数',
          value: data.num
        })
      },
    });
    this.avgScoreColumnPlot.render();
    this.unpassedNumColumnPlot.render();
  }
};
</script>

<style>
</style>
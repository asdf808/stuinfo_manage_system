<template>
  <div>
    <a-table :columns="columns" :data-source="scoreData" bordered></a-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scoreData: []
    }
  },
  created(){
    this.$axios.get('/score/getList').then(res => {
      if(res.state){
        this.scoreData = res.data;
      }
    })
  }
}
</script>

<style>

</style>
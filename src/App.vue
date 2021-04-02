<template>
  <a-spin :spinning="this.$store.state.isShowLoading" size="large">
    <router-view v-if="isRouterAlive" />
  </a-spin>
</template>

<script>
export default {
  created() {
    this.setPageTitle();
  },
  data(){
    return {
      loading: true,
      isRouterAlive: true
    }
  },
  provide(){
    return {
      reload: this.reload
    }
  },
  watch:{
    $route() {
      this.setPageTitle();
    }
  },
  methods: {
    setPageTitle() {
      document.title = this.$route.name;
    },
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    }
  }
}
</script>

<style lang="less">
.loading {
  width: 100%;
  height: 100%;
  // background: #ddd;
}
</style>

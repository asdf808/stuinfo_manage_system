<template>
  <page-layout :desc="desc" :linkList="linkList">
    <!-- <div v-if="this.extraImag" slot="extra" class="extraImg">
      <img :src="extraImage" />
    </div> -->
    <router-view ref="page" />
    <h2 v-if="this.$route.matched.length === 2">欢迎您，{{ this.$store.state.account.username }}</h2>
  </page-layout>
</template>

<script>
import PageLayout from './PageLayout';

export default {
  name: 'PageView',
  components: { PageLayout },
  data() {
    return {
      page: {}
    };
  },
  computed: {
    desc() {
      return this.page ? this.page.desc : null;
    },
    linkList() {
      return this.page ? this.page.linkList : null;
    }
    // extraImage() {
    //   return this.page.extraImage;
    // }
  },
  mounted() {
    this.page = this.$refs.page;
  },
  updated() {
    this.page = this.$refs.page;
  }
};
</script>

<style lang="less" scoped>
.extraImg {
  margin-top: -60px;
  text-align: center;
  width: 195px;
  img {
    width: 100%;
  }
}
</style>

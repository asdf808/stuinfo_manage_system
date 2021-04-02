<template>
  <error-page home-route="/dashboard/workplace" type="404" />
</template>

<script>
import ErrorPage from '@/components/error/ErrorPage';
export default {
  name: 'Exp404',
  components: { ErrorPage },
  computed: {
    minHeight() {
      return this.pageMinHeight ? this.pageMinHeight + 'px' : '100vh';
    }
  }
};
</script>

<style scoped lang="less">
</style>

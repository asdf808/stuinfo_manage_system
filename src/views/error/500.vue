<template>
  <error-page home-route="/dashboard/workplace" type="500" />
</template>

<script>
import ErrorPage from '@/components/error/ErrorPage';
export default {
  name: 'Exp500',
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

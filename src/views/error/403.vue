<template>
  <error-page home-route="/dashboard/workplace" type="403" />
</template>

<script>
import ErrorPage from '@/components/error/ErrorPage';
// import { mapState } from 'vuex';
export default {
  name: 'Exp403',
  components: { ErrorPage },
  computed: {
    // ...mapState('setting', ['pageMinHeight']),
    minHeight() {
      return this.pageMinHeight ? this.pageMinHeight + 'px' : '100vh';
    }
  }
};
</script>

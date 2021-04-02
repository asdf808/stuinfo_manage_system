<template>
  <a-modal
    title="Title"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form" @submit="handleSubmit">
      <slot name="formItem"></slot>
      <a-form-item>
        <a-button type="primary" html-type="submit">
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    edit: {
      required: true,
      type: Function
    }
  },
  data(){
    return {
      confirmLoading: false,
    }
  },
  methods: {
    handleOk() {
      this.ModalText = 'The modal will be closed after two seconds';
      this.confirmLoading = true;
      this.edit().then(res => {
        if (res.state === true){
          this.$message.success('修改成功');
        } else {
          this.$message.error('修改失败');
        }
        this.$emit('setVisible', false);
        // this.visible = false;
        this.confirmLoading = false;
      });
    },
    handleCancel() {
      this.$emit('setVisible', false);
    }
  }
}
</script>

<style>

</style>

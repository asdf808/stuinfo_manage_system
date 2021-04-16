<template>
  <div>
    <div>
      <a-input v-model="inputClass" suffix="班" style="width:120px;margin-right:20px" />
      <a-button @click="handleAdd">添加</a-button>
    </div>
    <h3 style="margin: 20px 0">现有班级</h3>
    <ul class="classList">
      <li v-for="cls in classes" :key="cls">
        <span style="margin-right:30px">{{ cls }}班</span>
        <a-popconfirm title="确认删除?" @confirm="remove(cls)">
          <a>删除</a>
        </a-popconfirm>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      classes: [],
      inputClass: ''
    };
  },
  created() {
    this.$axios.get('/class/getAllClasses').then(res => {
      if (res) {
        this.classes = res.data.sort();
      }
    });
  },
  methods: {
    handleAdd() {
      this.$axios.post('/class/add', { classId: this.inputClass }).then(res => {
        if (res.state) {
          let newData = [...this.classes];
          newData.push(this.inputClass);
          this.classes = newData.sort();
        } else {
          this.$message.error('添加失败');
        }
      });
    },
    remove(classId) {
      this.$axios.delete('/class/remove/' + classId).then(res => {
        if (res.state) {
          this.classes = this.classes.filter(item => item !== classId);
        } else {
          this.$message.error('删除失败');
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.classList {
  list-style: none;
  li:nth-of-type(1) {
    border-top: 1px #444 solid;
  }
  li {
    width: 200px;
    padding: 20px;
    border-bottom: 1px #444 solid;
  }
}
</style>
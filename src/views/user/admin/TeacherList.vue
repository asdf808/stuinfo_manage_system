<template>
  <a-table :columns="columns" :data-source="data" bordered :rowKey="record => record.teacherId" :pagination="paginationOpt">
    <template v-for="col in ['teacherName', 'teacherClass', 'email']" :slot="col" slot-scope="text, record">
      <div :key="col">
        <a-input v-if="record.editable" style="margin: -5px 0" :value="text" @change="e => handleChange(e.target.value, record.teacherId, col)" />
        <template v-else>
          {{ text }}
        </template>
      </div>
    </template>
    <template slot="teacherSex" slot-scope="text, record">
      <div key="teacherSex">
        <a-radio-group v-if="record.editable" style="margin: -5px 0" :value="text" @change="e => handleChange(e.target.value, record.teacherId, 'teacherSex')">
          <a-radio :value="0">男</a-radio>
          <a-radio :value="1">女</a-radio>
        </a-radio-group>
        <!-- <a-input v-if="record.editable" style="margin: -5px 0" :value="text" @change="e => handleChange(e.target.value, record.key, col)" /> -->
        <template v-else>
          {{ text == '0' ? '男' : text == '1' ? '女' : '' }}
        </template>
      </div>
    </template>
    <template slot="operation" slot-scope="text, record">
      <div class="editable-row-operations">
        <span v-if="record.editable">
          <a @click="() => save(record.teacherId)">保存</a>
          <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.teacherId)">
            <a>取消</a>
          </a-popconfirm>
        </span>
        <span v-else>
          <a :disabled="editingKey !== ''" @click="() => edit(record.teacherId)">编辑</a>
          <a-popconfirm title="确认删除?" @confirm="() => remove(record.teacherId)">
            <a :disabled="editingKey !== ''">删除</a>
          </a-popconfirm>
        </span>
      </div>
    </template>
  </a-table>
</template>
<script>
const paginationOpt = {
  defaultCurrent: 1, // 默认当前页数
  defaultPageSize: 30, // 默认当前页显示数据的大小
  total: 0, // 总数，必须先有
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['20', '30', '50', '80'],
  showTotal: total => `共 ${total} 条`, // 显示总数
  onShowSizeChange(current, pageSize) {
    this.defaultCurrent = 1;
    this.defaultPageSize = pageSize;
  },
  // 改变每页数量时更新显示
  onChange(current, size) {
    this.defaultCurrent = current;
    this.defaultPageSize = size;
  }
};
const columns = [
  {
    title: '教师号',
    dataIndex: 'teacherId',
    width: '15%'
  },
  {
    title: '姓名',
    dataIndex: 'teacherName',
    width: '15%',
    scopedSlots: { customRender: 'teacherName' }
  },
  {
    title: '性别',
    dataIndex: 'teacherSex',
    width: '12%',
    scopedSlots: { customRender: 'teacherSex' }
  },
  {
    title: '所带班级',
    dataIndex: 'teacherClass',
    width: '10%',
    scopedSlots: { customRender: 'teacherClass' }
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: '30%',
    scopedSlots: { customRender: 'email' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
];
columns.forEach(column => {
  column.align = 'center';
});
export default {
  data() {
    return {
      paginationOpt,
      data: [],
      cacheData: [],
      columns,
      editingKey: ''
    };
  },
  created() {
    this.$axios.get('/user/getTeacher').then(res => {
      if (res.state) {
        this.data = res.data;
        this.cacheData = this.data.map(item => ({ ...item }));
      }
    });
  },
  methods: {
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.teacherId)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.find(item => key === item.teacherId);
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    remove(key) {
      this.$axios.delete('/user/removeTeacher/' + key).then(res => {
        if (res.state) {
          this.data = this.data.filter(item => item.teacherId !== key);
          this.cacheData = this.cacheData.filter(item => item.teacherId !== key);
        } else {
          this.$message.error('删除失败！');
        }
      });
    },
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.find(item => key === item.teacherId);
      console.log(target);
      this.$axios.put('/user/updateTeacher', target).then(res => {
        if (res.state) {
          const targetCache = newCacheData.find(item => key === item.teacherId);
          if (target && targetCache) {
            delete target.editable;
            this.data = newData;
            Object.assign(targetCache, target);
            this.cacheData = newCacheData;
          }
          this.editingKey = '';
        } else {
          this.$message.error('修改失败！');
        }
      });
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.teacherId)[0];
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.teacherId)[0]);
        delete target.editable;
        this.data = newData;
      }
    }
  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>

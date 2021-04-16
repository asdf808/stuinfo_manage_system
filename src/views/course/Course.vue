<template>
  <div>
    <a-button @click="visible = true" style="margin-bottom: 15px">添加</a-button>
    <a-table :columns="columns" :data-source="data" bordered :rowKey="record => record.id" :pagination="paginationOpt">
      <template v-for="col in ['name', 'credit']" :slot="col" slot-scope="text, record">
        <div :key="col">
          <a-input v-if="record.editable" style="margin: -5px 0" :value="text" @change="e => handleChange(e.target.value, record.id, col)" />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.id)">保存</a>
            <a-popconfirm title="Sure to cancel?" @confirm="() => cancel(record.id)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a :disabled="editingKey !== ''" @click="() => edit(record.id)">编辑</a>
            <span style="display: inline-block; width: 10%"></span>
            <a-popconfirm title="确认删除?" @confirm="() => remove(record.id)">
              <a :disabled="editingKey !== ''">删除</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
    <a-modal title="添加课程" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="visible = false">
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 15 }">
        <a-form-item label="课程代码">
          <a-input v-decorator="['id', { rules: [{ required: true, message: '课程代码不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="课程名">
          <a-input v-decorator="['name', { rules: [{ required: true, message: '课程名不能为空' }] }]" />
        </a-form-item>
        <a-form-item label="学分">
          <a-input-number v-decorator="['credit', { rules: [{ required: true, message: '学分不能为空' }] }]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
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
    title: '课程代码',
    dataIndex: 'id',
    width: '20%'
  },
  {
    title: '课程名',
    dataIndex: 'name',
    scopedSlots: { customRender: 'name' },
    width: '30%'
  },
  {
    title: '学分',
    dataIndex: 'credit',
    width: '20%',
    scopedSlots: { customRender: 'credit' }
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
      editingKey: '',
      form: this.$form.createForm(this),
      confirmLoading: false,
      visible: false
    };
  },
  created() {
    this.$axios.get('/course/getAll').then(res => {
      if (res.state) {
        this.data = res.data;
        this.cacheData = this.data.map(item => ({ ...item }));
      }
    });
  },
  methods: {
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.id)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    edit(key) {
      const newData = [...this.data];
      const target = newData.find(item => key === item.id);
      this.editingKey = key;
      if (target) {
        target.editable = true;
        this.data = newData;
      }
    },
    remove(key) {
      this.$axios.delete('/course/remove/' + key).then(res => {
        if (res.state) {
          this.data = this.data.filter(item => item.id !== key);
          this.cacheData = this.cacheData.filter(item => item.id !== key);
          this.$message.success('删除成功');
        } else {
          this.$message.error('删除失败！');
        }
      });
    },
    save(key) {
      const newData = [...this.data];
      const newCacheData = [...this.cacheData];
      const target = newData.find(item => key === item.id);
      console.log(target);
      this.$axios.put('/course/update', target).then(res => {
        if (res.state) {
          const targetCache = newCacheData.find(item => key === item.id);
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
      const target = newData.filter(item => key === item.id)[0];
      this.editingKey = '';
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.id)[0]);
        delete target.editable;
        this.data = newData;
      }
    },
    handleOk() {
      this.confirmLoading = true;
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$axios.post('/course/add', values).then(res => {
            if (res.state) {
              this.$message.success('添加成功');
              this.visible = false;
              console.log(this.data);
              console.log(values);
              this.data.push({ ...values });
              this.cacheData.push(values);
            } else {
              this.$message.error('添加失败');
            }
            this.confirmLoading = false;
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>

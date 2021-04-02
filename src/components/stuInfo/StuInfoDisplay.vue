<template>
  <div>
    <a-button class="editable-add-btn" @click="$emit('add')"> 添加 </a-button>
    <span style="margin-left: 20px; vertical-align: text-bottom">年级：</span>
    <a-select :default-value="grades[0]" style="width: 120px" placeholder="请选择" @change="handleGradeChange">
      <a-select-option value=""> 不限 </a-select-option>
      <a-select-option v-for="(grade, index) in grades" :key="index" :value="grade">
        {{ grade }}
      </a-select-option>
    </a-select>
    <!-- <download-excel :data="checkedData" :fields="xls_fields" :name="$route.name + '.xls'" style="display: inline-block; margin-left: 20px">
      <a-button type="primary">导出Excel</a-button>
    </download-excel> -->
    <download-excel-component :xls_fields="xls_fields" :excelData="checkedData" :fileName="$route.name" style="display: inline-block; margin-left: 20px"></download-excel-component>
    <a-table bordered :title="() => '已审核信息'" :data-source="checkedData" :columns="columns" :scroll="{ x: true }">
      <template slot="operation" slot-scope="text, record">
        <div>
          <a-tag color="#2db7f5" style="padding: 4px 10px"><a @click="$emit('edit', record)">修改</a></a-tag>
          <a-popconfirm title="确认删除?" @confirm="() => onDelete(record.id)">
            <a-tag color="#f50" style="padding: 4px 10px"><a>删除</a></a-tag>
          </a-popconfirm>
        </div>
      </template>
      <template slot="image" slot-scope="text, record">
        <a v-if="record.certificate" :href="imgUrl + record.certificate" target="_blank">
          <img :src="imgUrl + record.certificate" alt="" style="height: 40px; display: block; margin: 0 auto" />
        </a>
      </template>
      <template slot="electronicEditionLink" slot-scope="text, record">
        <a v-if="record.electronicEdition" :href="imgUrl + record.electronicEdition" target="_blank"> 查看 </a>
      </template>
    </a-table>

    <a-table bordered :title="() => '未审核信息'" :data-source="uncheckedData" :columns="columns" :scroll="{ x: true }">
      <template slot="operation" slot-scope="text, record">
        <div>
          <a-popconfirm title="确认通过?" @confirm="() => doCheck(record.id)">
            <a-tag color="#87d068" style="padding: 4px 10px"><a>通过审核</a></a-tag>
          </a-popconfirm>
          <a-tag color="#2db7f5" style="padding: 4px 10px"><a @click="$emit('edit', record)">修改</a></a-tag>
          <a-popconfirm title="确认删除?" @confirm="() => onDelete(record.id)">
            <a-tag color="#f50" style="padding: 4px 10px"><a>删除</a></a-tag>
          </a-popconfirm>
        </div>
      </template>
      <template slot="image" slot-scope="text, record">
        <a v-if="record.certificate" :href="imgUrl + record.certificate" target="_blank">
          <img :src="imgUrl + record.certificate" alt="" style="height: 40px; display: block; margin: 0 auto" />
        </a>
      </template>
      <template slot="electronicEditionLink" slot-scope="text, record">
        <a v-if="record.electronicEdition" :href="imgUrl + record.electronicEdition" target="_blank"> 查看 </a>
      </template>
    </a-table>
  </div>
</template>
<script>
import { SERVER_STATIC_BASE_URL } from '@/config';
import DownloadExcelComponent from '../tools/DownloadExcel';
export default {
  props: {
    columns: {
      type: Array,
      required: true
    },
    dataSource: {
      type: Array,
      required: true
    }
  },
  components: {
    DownloadExcelComponent
  },
  data() {
    return {
      tableData: [],
      count: 0,
      imgUrl: SERVER_STATIC_BASE_URL
    };
  },
  computed: {
    checkedData() {
      return this.tableData.filter(item => item.isChecked);
    },
    uncheckedData() {
      return this.tableData.filter(item => !item.isChecked);
    },
    grades() {
      let set = new Set();
      this.dataSource.forEach(item => {
        set.add(item.stuGrade);
      });
      return Array.from(set).sort((a, b) => a - b);
    },
    xls_fields() {
      let fields = {};
      this.columns.forEach(item => {
        if (item.dataIndex) {
          // fields[item.title] = item.dataIndex;
          fields[item.dataIndex] = item.title;
        }
      });
      return fields;
    },
    route() {
      let path = this.$route.path;
      path = path.substr(path.lastIndexOf('/'));
      return path;
    }
  },
  watch: {
    dataSource(val) {
      this.tableData = val;
    }
  },
  methods: {
    onDelete(id) {
      this.$axios.delete(`/stuInfo${this.route}?id=${id}`).then(res => {
        if (res) {
          this.$message.success('删除成功');
          this.dataSource = this.dataSource.filter(item => item.id !== id);
        } else {
          this.$message.error('删除失败');
        }
      });
    },
    doCheck(id) {
      this.$axios.put(`/stuInfo${this.route}/`, { id, isChecked: true }).then(res => {
        if (res) {
          this.$message.success('已审核通过');
          let item = this.dataSource.find(item => item.id == id);
          item.isChecked = true;
        } else {
          this.$message.error('审核失败');
        }
      });
    },
    handleAdd() {
      console.log('add');
    },
    handleGradeChange(value) {
      if (value) {
        this.tableData = this.dataSource.filter(item => item.stuGrade === value);
      } else {
        this.tableData = this.dataSource;
      }
    }
  }
};
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>

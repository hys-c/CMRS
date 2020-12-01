<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表 -->
      <zk-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        border
        index-text="#"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="operation">
          <el-button type="warning" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </zk-table>
      <!-- 页码区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        layout="sizes, prev, pager, next, jumper"
        :page-sizes="[1, 2, 3, 5]"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
      width="30%"
      @close="handleClose"
    >
      <!-- 内容主题区域 -->
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            :props="selectCateProp"
            :options="parentCateList"
            @change="handleChange"
            :change-on-select="true"
            v-model="selectedArray"
            clearable
            style="width: 100%"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <!-- 尾部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Cate',
  data() {
    return {
      cateList: [],
      parentCateList: [],
      selectedArray: [],
      total: 0,
      selectCateProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      dialogVisible: false,
      addForm: {
        cat_name: '',
        // 默认添加1级分类
        cat_level: 0,
        cat_pid: 0
      },
      addFormRules: {
        cat_name: [{ required: true, message: '请输入角色名', trigger: 'blur' }]
      },
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        this.$message.error('获取商品列表失败')
      }
      this.total = res.data.total
      this.cateList = res.data.result
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    addCate() {
      this.getParentCateList()
      this.dialogVisible = true
    },
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        type: 2
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级列表失败')
      }
      this.parentCateList = res.data
    },
    handleChange() {
      if (this.selectedArray.length > 0) {
        this.addForm.cat_pid = this.selectedArray[this.selectedArray.length - 1]
        this.addForm.cat_level = this.selectedArray.length
      } else {
        this.addForm.cat_level = 0
        this.cat_pid = 0
      }
    },
    handleClose() {
      this.dialogVisible = false
      this.selectedArray = []
      this.addForm.cat_level = 0
      this.cat_pid = 0
      this.$refs.addForm.resetFields()
    },
    sureAddCate() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) {
          return undefined
        }
        const { data: res } = await this.$http.post('categories', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败')
        }
        this.dialogVisible = false
        this.getCateList()
      })
    }
  }
}
</script>
<style lang="less" scoped></style>

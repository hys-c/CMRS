<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        show-icon
      >
      </el-alert>

      <el-row class="top_row">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            expand-trigger="hover"
            :options="cateList"
            v-model="selectedArray"
            @change="getParams"
            :props="cateRules"
            :change-on-select="false"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeParamsName" @tab-click="handleParamsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled" @click="addParams"
            >添加参数</el-button
          >

          <el-table :data="manyParams" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="item.attr_id"
                  closable
                  @close="deleteTag(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  focus
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  style="width: 200px"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editParams(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" @click="addParams" :disabled="isBtnDisabled"
            >添加参数</el-button
          >
          <el-table :data="onlyParams" border stripe expanded>
            <el-table-column type="index" label="#"></el-table-column>
             <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="item.attr_id"
                  closable
                  @close="deleteTag(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  focus
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  style="width: 200px"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editParams(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加的对话框  -->
    <el-dialog
      :title="titleText"
      :visible.sync="AddParamsVisable"
      width="30%"
      @close="AddParamsClose"
    >
      <!-- 内容主题区域 -->
      <el-form
        ref="addParamsForm"
        :model="addParamsForm"
        :rules="addParamsFormRules"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 尾部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddParamsVisable = false">取 消</el-button>
        <el-button type="primary" @click="sureAddParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改的对话框 -->
    <el-dialog
      title="修改动态参数"
      :visible.sync="editParamsVisable"
      width="30%"
      @close="editParamsClose"
    >
      <!-- 内容主题区域 -->
      <el-form
        ref="editParamsForm"
        :model="editParamsForm"
        :rules="editParamsFormRules"
        label-width="80px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 尾部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsVisable = false">取 消</el-button>
        <el-button type="primary" @click="sureEditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Params',
  data() {
    return {
      cateList: [],
      selectedArray: [],
      cateRules: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      activeParamsName: 'many',
      manyParams: [],
      onlyParams: [],
      AddParamsVisable: false,
      addParamsForm: {
        attr_name: ''
      },
      addParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      },
      editParamsVisable: false,
      editParamsForm: {
        attr_name: ''
      },
      editParamsFormRules: {
        attr_name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isBtnDisabled() {
      console.log(this.selectedArray.length)
      return this.selectedArray.length !== 3
    },
    cateId() {
      return this.selectedArray.length === 3
        ? this.selectedArray[this.selectedArray.length - 1]
        : undefined
    },
    titleText() {
      return this.activeParamsName === 'many' ? '动态参数' : '静态参数'
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cateList = res.data
    },
    async getParams() {
      if (this.selectedArray.length !== 3) {
        this.selectedArray = []
        this.manyParams = []
        this.onlyParams = []
        return undefined
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: {
            sel: this.activeParamsName
          }
        }
      )
      if (res.meta.status !== 200) {
        this.$message.error('获取参数失败')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })

      if (this.activeParamsName === 'many') {
        this.manyParams = res.data
      } else {
        this.onlyParams = res.data
      }
    },
    handleParamsClick() {
      this.getParams()
    },
    async addParams() {
      this.AddParamsVisable = true
    },
    AddParamsClose() {
      this.$refs.addParamsForm.resetFields()
    },
    sureAddParams() {
      this.$refs.addParamsForm.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            `categories/${this.cateId}/attributes`,
            {
              attr_name: this.addParamsForm.attr_name,
              attr_sel: this.activeParamsName
            }
          )
          if (res.meta.status !== 201) {
            return this.$message.error('修改参数失败')
          }
          this.getParams()
          this.AddParamsVisable = false
        }
      })
    },
    async editParams(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      console.log(res.data)
      this.editParamsForm = res.data
      this.editParamsVisable = true
    },
    editParamsClose() {
      this.$refs.editParamsForm.resetFields()
    },
    async sureEditParams() {
      console.log(this.activeParamsName)
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`,
        {
          attr_sel: this.activeParamsName,
          attr_name: this.editParamsForm.attr_name
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('编辑参数失败')
      }
      this.getParams()
      this.editParamsVisable = false
    },
    async deleteParams(id) {
      const flag = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      console.log(id)
      if (flag === 'confirm') {
        const { data: res } = await this.$http.delete(
          `categories/${this.cateId}/attributes/${id}`
        )
        if (res.meta.status !== 200) {
          return this.$message.info('删除失败')
        }
        this.$message.success('删除成功')
        this.getParams()
      }
    },
    async handleInputConfirm(item) {
      item.inputVisible = false
      item.attr_vals.push(item.inputValue)
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${item.attr_id}`,
        {
          attr_sel: this.activeParamsName,
          attr_vals: item.attr_vals.join(' '),
          attr_name: item.attr_name
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('添加标签失败')
      }
    },
    showInput(item) {
      item.inputVisible = true
    },
    async deleteTag(i, item) {
      const flag = await this.$confirm(
        '此操作将永久删除该标签, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (flag === 'confirm') {
        item.attr_vals.splice(i, 1)
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${item.attr_id}`,
          {
            attr_sel: this.activeParamsName,
            attr_vals: item.attr_vals.join(' '),
            attr_name: item.attr_name
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.info('删除失败')
        }
        this.$message.success('删除成功')
        this.getParams()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.top_row {
  margin-top: 15px;
  font-size: 18px;
}
.el-tag,
.el-button {
  margin-left: 10px;
}
.el-input {
  margin-left: 10px;
}
</style>

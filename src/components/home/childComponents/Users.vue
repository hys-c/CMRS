<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="30">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
    </el-card>
    <!-- 对话框 -->
    <!-- 头部区域 -->
    <el-dialog
      title="添加用户"
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" type="email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 尾部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="userList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            @change="changeUserState(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="editButtonClick(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="small"
            @click="deleteClick(scope.row.id)"
          ></el-button>
          <el-tooltip
            class="item"
            effect="dark"
            content="分配角色"
            placement="top-start"
          >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 8, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 修改用户信息的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClose"
    >
      <!-- 内容主题区域 -->
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input disabled v-model="editForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" type="email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 尾部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Users',
  data() {
    const emailReg = (rule, value, cb) => {
      const reg = /^([a-z0-9_\\.-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6})$/
      if (reg.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确邮箱'))
    }
    const mobileReg = (rule, value, cb) => {
      const reg = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
      if (reg.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确电话号码'))
    }
    return {
      queryInfo: {
        query: null,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      userList: [],
      dialogVisible: false,
      editDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入你的邮箱', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: mobileReg, trigger: 'blur' }
        ]
      },
      editFormRules: {
        email: [{ required: true, message: '请输入你的邮箱', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: mobileReg, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表数据
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户数据失败')
      }
      this.total = res.data.total
      this.queryInfo.pagenum = res.data.pagenum
      this.userList = res.data.users
    },
    // 监听表单页大小改变
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getUserList()
    },
    // 监听当前的表单单页大小
    handleCurrentChange(newPageNum) {
      this.queryInfo.pagenum = newPageNum
      this.getUserList()
    },
    // 改变用户状态
    async changeUserState(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        this.$message.error('修改状态失败')
      }
      this.$message.success('修改状态成功')
    },
    // 监听添加用户对话框关闭
    handleClose() {
      this.$refs.addForm.resetFields()
    },
    // 添加用户
    addUser() {
      this.$refs.addForm.validate(async valid => {
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 编辑对话框关闭
    editDialogClose() {
      this.$refs.editForm.resetFields()
    },
    // 编辑用户完成
    editUser() {
      this.$refs.editForm.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            `users/${this.editForm.id}`,
            {
              email: this.editForm.email,
              mobile: this.editForm.mobile
            }
          )
          if (res.meta.status !== 200) {
            return this.$http.message('更新失败')
          }
          this.editDialogVisible = false
          this.getUserList()
          this.$message.success(res.meta.msg)
        }
      })
    },
    // 点击编辑按钮
    async editButtonClick(userInfo) {
      const { data: res } = await this.$http.get(`users/${userInfo.id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    async deleteClick(id) {
      const flag = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (flag === 'confirm') {
        const { data: res } = await this.$http.delete(`users/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.info('删除失败')
        }
        this.$message.success('删除成功')
        this.getUserList()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-table {
  margin-top: 15px;
}
</style>

<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRole">添加用户</el-button>
        </el-col>
      </el-row>
      <el-dialog
        title="添加角色"
        :visible.sync="addRoleVisiable"
        width="30%"
        @close="addRoleClose"
      >
        <!-- 内容主题区域 -->
        <el-form
          ref="addForm"
          :model="addForm"
          :rules="addFormRules"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 尾部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleClose">取 消</el-button>
          <el-button type="primary" @click="sureAddRole">确 定</el-button>
        </span>
      </el-dialog>
      <el-table :data="roleList" stripe border>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :class="[
                'normal_tag',
                index1 === 0 ? 'top_tag' : '',
                'vertail_center'
              ]"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :class="[index2 === 0 ? '' : 'top_tag', 'vertail_center']"
                  :key="item2.id"
                >
                  <!-- 渲染一级权限 -->
                  <el-col :span="7">
                    <el-tag type="success">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染二级权限 -->
                  <el-col :span="17">
                    <el-tag
                      v-for="item3 in item2.children"
                      type="warning"
                      :key="item3.id"
                      closable
                      @close="deleteRight(scope.row.id, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              :name="scope"
              @click="editRole(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="showDisattributeRight(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 编辑角色 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRoleVisiable"
      width="30%"
      @close="editRoleClose"
    >
      <!-- 内容主题区域 -->
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 尾部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleClose">取 消</el-button>
        <el-button type="primary" @click="sureEditRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="disattributeRightVisiable"
      width="30%"
      @close="disattributeRightClose"
    >
      <!-- 内容主题区域 -->
      <el-tree
        ref='roleTree'
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultCheckArr"
        :default-expand-all="true"
        :data="rightsList"
        :props="rightProps"
        @node-click="handleRightNodeClick"
      ></el-tree>
      <!-- 尾部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="disattributeRightClose">取 消</el-button>
        <el-button type="primary" @click="sureDisattributeRight"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Roles',
  data() {
    return {
      roleList: [],
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      editForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rightProps: {
        children: 'children',
        label: 'authName'
      },
      addRoleVisiable: false,
      editRoleVisiable: false,
      disattributeRightVisiable: false,
      roleId: '',
      rightsList: [],
      defaultCheckArr: [],
      addFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: false, message: '请输入密码名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      },
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: false, message: '请输入密码名称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色信息失败')
      }
      this.roleList = res.data
    },
    addRole() {
      this.addRoleVisiable = true
    },
    async editRole(id) {
      console.log(id)
      this.editRole.id = id
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.editForm = res.data
      this.editRoleVisiable = true
    },
    addRoleClose() {
      this.$refs.addForm.resetFields()
      this.addRoleVisiable = false
    },
    editRoleClose() {
      this.$refs.editForm.resetFields()
      this.editRoleVisiable = false
    },
    sureAddRole() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) {
          return undefined
        }
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败')
        }
        this.addRoleVisiable = false
        this.getRolesList()
      })
    },
    sureEditRole() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) {
          return undefined
        }
        const { data: res } = await this.$http.put(
          `roles/${this.editRole.id}`,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改角色失败')
        }
        this.editRoleVisiable = false
        this.getRolesList()
      })
    },
    async deleteRole(id) {
      const flag = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (flag === 'confirm') {
        const { data: res } = await this.$http.delete(`roles/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除角色失败')
        }
        this.$message.success('删除角色成功')
        this.getRolesList()
      }
    },
    async deleteRight(roleId, rightId) {
      const flag = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (flag === 'confirm') {
        const { data: res } = await this.$http.delete(
          `roles/${roleId}/rights/${rightId}`
        )
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败')
        }
        this.$message.success('删除权限成功')
        this.getRolesList()
      }
    },
    async showDisattributeRight(role) {
      this.roleId = role.id
      this.disattributeRightVisiable = true
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限失败')
      }
      this.rightsList = res.data
      this.getLeafTree(role, this.defaultCheckArr)
    },
    getLeafTree(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      for (const each of node.children) {
        this.getLeafTree(each, arr)
      }
    },
    handleRightNodeClick() {},
    disattributeRightClose() {
      this.defaultCheckArr = []
    },
    async sureDisattributeRight() {
      const arr = [
        ...this.$refs.roleTree.getCheckedKeys(),
        ...this.$refs.roleTree.getHalfCheckedKeys()
      ]
      const resStr = arr.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: resStr
      })
      if (res.meta.status !== 200) {
        this.$message.error('授权失败')
      }
      this.$message.success('授权成功')
      this.getRolesList()
      this.disattributeRightVisiable = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-row {
  padding: 10px;
}
.top_tag {
  border-top: 1px solid #eee;
}
.normal_tag {
  border-bottom: 1px solid #eee;
}
.vertail_center {
  display: flex;
  align-items: center;
}
</style>

<template>
  <div>
    <!-- 顶部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 中间卡片视图区域 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <el-steps
        :space="200"
        :active="activeSteps - 0"
        :align-center="true"
        finish-status="success"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- form区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeSteps"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品介绍" prop="goods_introduce">
              <el-input v-model="addForm.goods_introduce"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="cateList"
                v-model="addForm.goods_cat"
                :props="addProps"
                @change="handleChange"
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyParams"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals" border>
                <el-checkbox
                  v-for="(each, index) in item.attr_vals"
                  :label="each"
                  :key="index"
                >
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyParams"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://timemeetyou.com:8889/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="UploadHeader"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <!-- 图片预览对话框 -->
      <el-dialog
        title="图片预览"
        :visible.sync="imgDialogVisible"
        width="50%"
        :before-close="handleImgClose"
      >
        <img :src="previewPath" alt="" style="width: 80%;height:80%;" />
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import deepClone from 'assets/utils/deepClone'
export default {
  name: 'AddGoods',
  data() {
    return {
      activeSteps: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_introduce: '',
        goods_cat: [],
        pics: [],
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      // 商品分类列表数据
      cateList: [],
      // 分类列表级联选择器层级规则
      addProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyParams: [],
      onlyParams: [],
      UploadHeader: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      imgDialogVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('获取分类列表失败')
      }
      this.cateList = res.data
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave(nextTab, preTab) {
      if (preTab === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先完成基本信息的填写')
        return false
      }
    },
    async tabClick() {
      console.log(this.activeSteps)
      if (this.activeSteps === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('获取参数列表失败')
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals !== '' ? item.attr_vals.split(' ') : []
        })
        this.manyParams = res.data
      } else if (this.activeSteps === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('获取属性列表失败')
        }
        this.onlyParams = res.data
      }
    },
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.imgDialogVisible = true
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(item => item.pic === filePath)
      this.addForm.pics.splice(index, 1)
    },
    uploadSuccess(response) {
      this.addForm.pics.push({
        pic: response.data.tmp_path
      })
    },
    handleImgClose() {
      this.imgDialogVisible = false
    },
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        // 表单验证未通过
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }

        // 表单验证通过
        // 处理参数
        this.manyParams.forEach(item => {
          const dataInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(dataInfo)
        })
        this.onlyParams.forEach(item => {
          const dataInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(dataInfo)
        })
        console.log(this.manyParams)
        const cloneForm = deepClone(this.addForm)
        cloneForm.goods_cat = cloneForm.goods_cat.join(',')
        console.log(cloneForm)
        const { data: res } = await this.$http.post('goods', cloneForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        } else {
          this.$message.success('添加成功')
          this.$router.push('/goods')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.el-steps {
  margin: 20px 100px 20px;
}
.el-button {
  margin-top: 15px;
  float: right;
}
</style>

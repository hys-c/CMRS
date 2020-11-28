<template>
  <div class="login_container">
    <div class="login_box">
      <div class="logo">
        <img src="~assets/img/logo.svg" alt="" />
      </div>
      <el-form ref="form" :model='loginForm' label-width="60px" :rules='rules'>
        <el-form-item  label="账号" prop='username'>
          <el-input placeholder="请输入账号" v-model='loginForm.username' prefix-icon='iconfont icon-user'></el-input>
        </el-form-item>
        <el-form-item  label="密码" prop='password'>
          <el-input placeholder='请输入密码' v-model='loginForm.password' type='password' prefix-icon='iconfont icon-3702mima'></el-input>
        </el-form-item>
        <el-form-item class='login-button'>
          <el-button type='primary' @click='login'>登录</el-button>
          <el-button type='info' @click='resetFrom'>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '账号为5-10位', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetFrom() {
      this.$refs.form.resetFields()
    },
    login() {
      this.$refs.form.validate(async valid => {
        console.log(valid)
        if (valid) {
          const { data: res } = await this.$http.post('login', this.loginForm)
          if (res.meta.status !== 200) {
            return this.$message.error('用户名或密码不正确')
          }
          this.$message.success('登录成功')
          window.sessionStorage.setItem('ec_token', res.data.token)
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>
<style lang='less' scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .logo {
    border: 1px solid #eee;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;
    img {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
    }
  }
  .el-form {
    position: absolute;
    top: 20%;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    .el-form-item {
      width: 100%;
      height: 50px;
    }
    .login-button {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>

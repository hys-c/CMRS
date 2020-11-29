<template>
  <el-container class="home-container">
    <el-header>
      <div class="header-info">
        <img src="~assets/img/logo.svg" alt="" />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">注销</el-button>
    </el-header>
    <el-container>
      <el-aside :width="toggleFlag?'56px':'200px'">
        <div class='toggle-button' @click='toggleClick'>|||</div>
        <el-menu  :unique-opened='true' active-text-color='#528FF5'
         background-color='#333744' text-color='#fff' :router='true'
         :collapse-transition='false' :collapse='toggleFlag' :default-active='activeMenu'>
          <el-submenu :index="item.id + ''"  v-for='item in MenuList'
            :key='item.id'>
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item :index='"/" + each.path' v-for='each in item.children' @click='itemClick("/" + each.path)' :key='each.id'>
              <template>
                <i class="el-icon-menu"></i>
              <span>{{ each.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  name: 'Home',
  data() {
    return {
      MenuList: null,
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      toggleFlag: false,
      activeMenu: ''
    }
  },
  created() {
    this.getMenuList()
    console.log(window.sessionStorage.getItem('activePath'))
    this.activeMenu = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error('获取菜单数据失败')
      }
      this.MenuList = res.data
      this.$message.success('获取菜单数据成功')
    },
    toggleClick() {
      this.toggleFlag = !this.toggleFlag
    },
    itemClick(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activeMenu = activePath
    }
  }
}
</script>
<style lang='less' scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color: #373041;
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eae0f1;
  }
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  > .header-info {
    display: flex;
    align-items: center;
    > img {
      height: 30%;
      width: 30%;
    }
    > span {
      color: #fff;
      font-size: 20px;
    }
  }
}
.toggle-button {
  width: 100%;
  height: 25px;
  background-color: #373041;
  color: #fff;
  font-size: 10px;
  letter-spacing: 0.2em;
  border:none;
  border-radius: none;
  padding:none;
  text-align: center;
  line-height: 25px;
  cursor: pointer;
}
</style>

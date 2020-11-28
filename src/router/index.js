import Vue from 'vue'
import VueRouter from 'vue-router'
import 'assets/css/normalize.css'
// 导入组件
import Login from 'components/login/Login'
import Home from 'components/home/Home'
// 导入字体图标
import 'assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
Vue.use(VueRouter)

// 配置axios
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
Vue.prototype.$http = axios

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = new VueRouter({
  routes
})

// 通过路由导航守卫设置页面访问权限
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  }
  const tokenStr = window.sessionStorage.getItem('ec_token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router

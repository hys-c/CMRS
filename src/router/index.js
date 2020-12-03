import Vue from 'vue'
import VueRouter from 'vue-router'
import 'assets/css/normalize.css'
// 导入组件
import Login from 'components/login/Login'
import Home from 'components/home/Home'
import Welcome from 'components/home/childComponents/Welcome'
import Users from 'components/home/childComponents/Users'
import Rights from 'components/power/Power'
import Roles from 'components/power/Roles'
import Cate from 'components/goods/Cate'
import Params from 'components/goods/Params'
// 导入字体图标
import 'assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
Vue.use(VueRouter)

// 配置axios
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// axios.defaults.baseURL = 'http://119.23.53.78:8888/api/private/v1/login?'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 通过路由导航守卫设置页面访问权限
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router

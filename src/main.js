import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import ZkTable from 'vue-table-with-tree-grid'

Vue.component('zk-table', ZkTable)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

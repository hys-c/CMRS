<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <div id="main" style="width: 1000px;height:600px;"></div>
    </el-card>
  </div>
</template>
<script>
const echarts = require('echarts')
export default {
  name: 'Reports',
  data() {
    return {}
  },
  created() {},
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'))
    var options = {
      title: {
        text: '用户来源'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#E9EEF3'
          }
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          boundaryGap: false
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ]
    }
    const { data: res } = await this.$http.get('reports/type/1')
    const finalOption = {
      ...options,
      ...res.data
    }
    console.log(finalOption)
    myChart.setOption(finalOption)
  }
}
</script>
<style lang="less" scoped></style>

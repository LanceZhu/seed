let chart = {
  title: {
    show: false
  },
  legend: {
    show: false
  },
  xAxis: {
    type: 'category',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    data: ['1', '2', '3', '4', '5', '6', '7']
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      lineStyle: {
        color: '#DDF3E5'
      }
    }
  },
  series: [{
    data: [0, 0, 0, 0, 0, 0, 0],
    type: 'bar',
    itemStyle: {
      color: '#2DC3A6',
      barBorderRadius: 10
    },
    barWidth: 10
  }]
}

export default {
  chart: chart
}
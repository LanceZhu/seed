let qcloud = require('../../../vendor/wafer2-client-sdk/index.js')
let config = require('../../../config.js')
let app =getApp()
let util = require('../../../utils/util.js')
// init calendar
import initCalendar, { getSelectedDay, jumpToToday } from '../../../template/calendar/index.js';
import options from './options.js'

// init echart
import * as echarts from '../ec-canvas/echarts'
let chart = null

function initChart(chart, option) {
  chart.setOption(option)
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    options: [
      {
        title: '周',
        type: 'week'
      },
      {
        title: '月',
        type: 'month'
      },
      {
        title: '年',
        type: 'year'
      }
    ],
    choose: 'week',
    dateShow: false,
    selectedDate: {},
    chartOption: options.chart,
    diary: [],
    touchStart: 0,
    user: {},
    days: 0,
  },

  // method
  getOption(event) {
    if (this.data.dateShow) {
      this.pickDate()
    }
    this.setData({
      choose: event.currentTarget.dataset.type
    })
    this.getChoosenDate(this.data.choose)
  },

  pickDate() {
    console.log('choose', this.data.choose)
    if (this.data.choose !== 'week') return
    this.setData({
      dateShow: !this.data.dateShow
    })
    console.log('dateShow',this.data.dateShow)
  },

  getChoosenDate(type, currentSelected) {
    type = type ? type : 'week'
    let date = this.getDateObj(currentSelected)
    let handleDate = {
      'week': function () {
        return this.getWeek(date)
      },
      'month': function () {
        return this.getMonth(date)
      },
      year: function () {
        return this.getYear(date)
      }
    }

    let selectedDate = handleDate[type].call(this)
    this.setData({
      selectedDate: selectedDate
    })

    this.getAverageData()
  },

  getAverageData() {
    var forEach = getApp().lodash.forEach
    let selectedDate = this.data.selectedDate
    let type = this.data.choose
    let getKeyName = {
      'week': function (date) {
        return (date.getMonth() + 1) + '/' + date.getDate()
      },
      'month': function (date) {
        let start = Number(selectedDate.start)
        let end = Number(selectedDate.end)
        let timestamp = 7 * 24 * 60 * 60 * 1000
        if (date.getTime() > start && date.getTime() < start + timestamp * 1) {
          return '第一周'
        }
        if (date.getTime() > start + timestamp * 1 && date.getTime() < start + timestamp * 2) {
          return '第二周'
        }
        if (date.getTime() > start + timestamp * 2 && date.getTime() < start + timestamp * 3) {
          return '第三周'
        }
        if (date.getTime() > start + timestamp * 3 && date.getTime() < end) {
          return '第四周'
        }
      },
      'year': function (date) {
        let temp = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        return temp[date.getMonth()]
      }
    }

    let tempObj = {}
    let data = this.data.diary
    forEach(data, (obj) => {
      let date, keyName
      forEach(obj, (key, val) => {
        if (Number(key) < Number(selectedDate.start) || Number(key) >= Number(selectedDate.end)) return
        //date = new Date(Number(key))
        date = new Date(key)
        keyName = getKeyName[type](date)
        if (!tempObj[keyName]) {
          tempObj[keyName] = []
        }
        tempObj[keyName].push(val)
      })
    })
    console.log('[tempObj]', tempObj)

    let average = function (arr) {
      let sum = 0
      for (let i = 0; i < arr.length; i++) {
        //sum = sum + arr[i]
        sum+=1
      }
      //return sum / arr.length
      return sum
    }

    let dataObj = {
      label: [],
      value: []
    }
    switch (type) {
      case 'week':
        let timestamp = 24 * 60 * 60 * 1000
        let date, day
        for (let i = Number(selectedDate.start); i < Number(selectedDate.end); i = i + timestamp) {
          date = new Date(i)
          day = (date.getMonth() + 1) + '/' + date.getDate()
          dataObj.label.push(day)
          dataObj.value.push(tempObj[day] ? average(tempObj[day]) : 0)
          //dataObj.value.push(tempObj[day].length ? tempObj[day].length : 0)
        }
        console.log('[schedule][dataObj]', dataObj)
        break
      case 'month':
        let weekArr = ['第一周', '第二周', '第三周', '第四周']
        forEach(weekArr, (val) => {
          dataObj.label.push(val)
          dataObj.value.push(tempObj[val] ? average(tempObj[val]) : 0)
        })
        console.log('[schedule][dataObj]', dataObj)
        break
      case 'year':
        let monthArr = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
        forEach(monthArr, (val) => {
          dataObj.label.push(val)
          dataObj.value.push(tempObj[val] ? average(tempObj[val]) : 0)
        })
        console.log('[schedule][dataObj]', dataObj)
        break
    }

    let chartOption = this.data.chartOption
    chartOption.xAxis.data = dataObj.label
    chartOption.series[0].data = dataObj.value
    //chartOption.series[0].data = [10, 20, 30, 40, 50, 60, 70]

    if (!this.chart) {
      this.chartComponent.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        })
        initChart(chart, chartOption)
        this.chart = chart
        return chart
      })
    } else {
      this.chart.setOption(chartOption)
    }

  },

  getDateObj(timestamp) {
    let date = timestamp ? new Date(timestamp) : new Date()
    return {
      str: date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日',
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    }
  },

  getWeek(dateObj) {
    let timestamp = 24 * 60 * 60 * 1000
    let selected = new Date(dateObj.year, dateObj.month - 1, dateObj.day)
    let start = new Date(selected.getTime() - 3 * timestamp)
    let end = new Date(selected.getTime() + 4 * timestamp)
    return {
      str: start.getFullYear() + '年' + (start.getMonth() + 1) + '月' + start.getDate() + '日' + '至' + end.getFullYear() + '年' + (end.getMonth() + 1) + '月' + (end.getDate() - 1) + '日',
      start: start.getTime(),
      end: end.getTime(),
      selected: selected.getTime()
    }
  },

  getMonth(dateObj) {
    let endMonth = dateObj.month === 12 ? 1 : dateObj.month + 1
    let endYear = dateObj.month === 12 ? dateObj.year + 1 : dateObj.year
    return {
      str: dateObj.year + '年' + dateObj.month + '月',
      start: new Date(dateObj.year, dateObj.month - 1, 1).getTime(),
      end: new Date(endYear, endMonth - 1, 1).getTime(),
      selected: new Date(dateObj.year, dateObj.month - 1, dateObj.day).getTime()
    }
  },

  getYear(dateObj) {
    return {
      str: dateObj.year + '年',
      start: new Date(dateObj.year, 1, 1).getTime(),
      end: new Date(dateObj.year + 1, 1, 1).getTime(),
      selected: new Date(dateObj.year, dateObj.month, dateObj.day).getTime()
    }
  },

  getHandleDate(e) {
    let date = new Date(this.data.selectedDate.selected)
    let eventHandle = e.handle ? e.handle : e.currentTarget.dataset.handle
    let handle
    switch (eventHandle) {
      case 'pre':
        handle = -1
        break
      case 'next':
        handle = 1
        break
    }

    let type = this.data.choose
    let handleDate = {
      'week': function () {
        let timestamp = 7 * 24 * 60 * 60 * 1000
        return this.getWeek(this.getDateObj(date.getTime() + timestamp * handle))
      },
      'month': function () {
        let endMonth, endYear
        if (date.getMonth() + 1 === 1) {
          endYear = handle === -1 ? date.getFullYear() - 1 : date.getFullYear()
          endMonth = handle === -1 ? 12 : date.getMonth() + 1 + 1
        } else if (date.getMonth() + 1 === 12) {
          endYear = handle === -1 ? date.getFullYear() : date.getFullYear() + 1
          endMonth = handle === -1 ? date.getMonth() + 1 - 1 : 1
        } else {
          endYear = date.getFullYear()
          endMonth = date.getMonth() + 1 + handle
        }
        console.log(endMonth)
        return this.getMonth(this.getDateObj(new Date(endYear, endMonth - 1, date.getDate()).getTime()))
      },
      'year': function () {
        return this.getYear(this.getDateObj(new Date(date.getFullYear() + handle, date.getMonth(), date.getDate()).getTime()))
      }
    }

    let changedDate = handleDate[type].call(this)
    this.setData({
      selectedDate: changedDate
    })

    this.getAverageData()
  },

  handleTouchStart(e) {
    this.setData({
      touchStart: e.touches[0].pageX
    })
  },

  handleTouchEnd(e) {
    let result = e.changedTouches[0].pageX - this.data.touchStart
    if (result < 70 && result > -70) return
    let handle
    if (result >= 70) {
      handle = 'next'
    } else {
      handle = 'pre'
    }
    this.getHandleDate({ handle })
  },

  handleTouchMove(e) {

  },

  getDays(data) {
    let _ = getApp().lodash
    let dateArr = _.map(data, val => _.keys(val)[0])
    let dateObj = {}
    _.forEach(dateArr, val => {
      let date = new Date(Number(val))
      let str = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      if (!dateObj[str]) {
        dateObj[str] = 0
      }
      dateObj[str] += 1
    })
    this.setData({
      days: _.keys(dateObj).length
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '学习进度',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.chartComponent = this.selectComponent('#mychart-dom-bar')
    let _this = this
    qcloud.request({
      login: true,
      url: `${app.appData.baseUrl}question_history`,
      method: 'POST',
      data: {
        type: 'history'
      },
      success: res => {
        console.log('[history][success]', res.data.data)
        _this.setData({
          diary: res.data.data
        })
        this.getChoosenDate(this.data.choose)
      },
      fail: err=> {
        console.log('[history][fail]', err)
      }
    })
    /*
    wx.request({
      url: getApp().data.domain + 'modes/show',
      data: getApp().data.key,
      success(res) {
        let data = res.data.data
        _this.setData({
          diary: data
        })
        console.log(_this.data.diary)
        _this.getDays(data)
        _this.getChoosenDate(_this.data.choose)
      }
    })
    */
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    initCalendar({
      multi: false, // 是否开启多选,
      disablePastDay: false, // 是否禁选过去日期
      /**
       * 选择日期后执行的事件
       * @param { object } currentSelect 当前点击的日期
       * @param { array } allSelectedDays 选择的所有日期（当mulit为true时，才有allSelectedDays参数）
       */
      afterTapDay: (currentSelect, allSelectedDays) => {
        let date = new Date(currentSelect.year, currentSelect.month - 1, currentSelect.day).getTime()
        console.log(currentSelect)
        this.getChoosenDate(this.data.choose, date)
        this.pickDate()
      },
      /**
       * 日期点击事件（此事件
       * 会完全接管点击事件）
       * @param { object } currentSelect 当前点击的日期
       * @param { object } event 日期点击事件对象
       */
      // onTapDay(currentSelect, event) {
      //   console.log(currentSelect);
      //   console.log(event);
      // },
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "碎片时间学编程",
      path: "/pages/main/main"
    };
  }
})
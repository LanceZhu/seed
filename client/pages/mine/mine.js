import initCalendar, { getSelectedDay, setTodoLabels } from '../../template/calendar/index';
let qcloud = require('../../vendor/wafer2-client-sdk/index')
let config = require('../../config')
let util = require('../../utils/util.js')
let app = getApp()

Page({
  data: {
    userInfo: {},
    program: [
      { 'pic': '/images/icons/progress.png', 'desc': '学习进度', 'location': 'schedule' },
      { 'pic': '/images/icons/book.png', 'desc': '历史错题', 'location': 'mistake' },
      { 'pic': '/images/icons/calendar1.png', 'desc': '签到查询', 'location': 'calendar' },
      { 'pic': '/images/icons/news1.png', 'desc': '消息通知', 'location': 'news' },
      { 'pic': '/images/icons/upload.png', 'desc': '反馈', 'location': 'feedback' }
    ],
    program_bak: [
      { 'pic': '/images/icons/progress.png', 'desc': '学习进度', 'location': 'schedule'},
      { 'pic': '/images/icons/book.png', 'desc': '历史错题', 'location': 'mistake' },
      { 'pic': '/images/icons/upload.png', 'desc': '贡献题目', 'location': 'handIn' },
      { 'pic': '/images/icons/upload.png', 'desc': '签到查询', 'location': 'calendar' },
      { 'pic': '/images/icons/upload.png', 'desc': '消息通知', 'location': 'news' },
      { 'pic': '/images/icons/upload.png', 'desc': '反馈', 'location': 'feedback' }
    ]
  },

  navigateToDetail: function (e) {
    console.log(e.currentTarget.dataset.location);
    var urlName = e.currentTarget.dataset.location;
    wx.navigateTo({
      url: './' + urlName + '/' + urlName,
    })
  },

  onLoad: function (options) {
    var that = this
    that.setData({
      userInfo: app.globalData.userInfo
    })
  },

  onShow: function () {},

  onShareAppMessage: function () {
    return {
      title: "碎片时间学编程",
      path: "/pages/main/main"
    };
  }
})
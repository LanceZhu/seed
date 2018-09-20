var qcloud = require('../../../vendor/wafer2-client-sdk/index.js')
var util = require('../../../utils/util.js')
var config = require('../../../config.js')
var app = getApp()

Page({
  data: {
    winHeight: 0,
    winWidth: 0,
    ratio: 0,
    question: {},
    ask: {},
    right_answer: '',
    analysis: '',
    showsuccess: false
  },

  next: function(){
    wx.navigateBack({})
  },

  onLoad: function (options) {
    var that = this;
    that.setData({
      question: wx.getStorageSync('last_question'),
      id: options.id,
      chapter_id: options.chapter_id,
      unit_id: options.unit_id,
      ask: wx.getStorageSync('ask'),
      right_answer: wx.getStorageSync('right_answer'),
      analysis: wx.getStorageSync('analysis'),
    })
    that.setData({
      winHeight: wx.getStorageSync('winHeight'),
      winWidth: wx.getStorageSync('winWidth'),
      ratio: wx.getStorageSync('ratio')
    })
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {
    return {
      title: "碎片时间学编程",
      path: "/pages/main/main"
    };
  }
})
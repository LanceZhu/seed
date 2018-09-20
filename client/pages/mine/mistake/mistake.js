let qcloud = require('../../../vendor/wafer2-client-sdk/index.js')
let config = require('../../../config.js')
let app =getApp()
let util = require('../../../utils/util.js')

Page({
  data: {
    question_history: [],
    question_history_errors: [],
    question_sum: 0,
    question_error_sum: 0,
    currentTab: 0
  },
  question_history: function(e){
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    qcloud.request({
      login: true,
      url: `${app.appData.baseUrl}question_history`,
      method: 'POST',
      data: {
        type: 'answer_detail_update'
      },
      success: (res) => {
        let data_error = []
        let data = res.data.data
        for(let i in data){
          if(data[i].datetime){
            let date = new Date(data[i].datetime)
            data[i].datetime = util.formatTime(date)
          }
          if(!data[i].answer_right){
            data_error.push(data[i])
          }
        }
        that.setData({
          question_history: data,
          question_history_errors: data_error,
          question_sum: data.length,
          question_error_sum: data_error.length
        })
      },
      fail(error) {
        util.showSuccess('请求失败');
        console.log('[request fail]', error);
      },
      complete: res => {
        wx.hideLoading()
      }
    });
  },

  question_detail: function(e){
    wx.navigateTo({
      url: './tutorial/tutorial?questionid='+e.currentTarget.dataset.questionid,
    })
  },

  bindChange: function (e) {
    this.setData({ currentTab: e.detail.current });
  },

  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  onLoad: function (options) {
    var that = this
    that.question_history()
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
let qcloud = require('../../../vendor/wafer2-client-sdk/index')
let config = require('../../../config')
let util = require('../../../utils/util.js')
let app = getApp()

Page({
  data: {
    options: [{
      title: "Bug反馈",
      code: 103
    }, {
      title: "功能需求",
      code: 200
    }, {
      title: "吐槽",
      code: 300
    }],
    choose: 103,
    content: ""
  },
  getOption: function (e) {
    this.setData({
      choose: parseInt(e.currentTarget.dataset.code)
    });
  },
  getInputValue: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  confirm: function () {
    if (this.data.content) {
      let data = {
        type: this.data.choose,
        title: this.data.content.slice(0,19),
        content: this.data.content
      }
      wx.showLoading({
        title: '正在提交...',
      })
      qcloud.request({
        login: true,
        url: `${app.appData.baseUrl}feedback`,
        method: 'POST',
        data: data,
        success: res => {
          console.log('[feedback][success]', res)
          util.showSuccess('反馈成功！')
          setTimeout(function(){
            wx.navigateBack({})
          }, 1500)
        },
        fail: err =>{
          util.showSuccess('反馈失败！')
          console.log('[feedback][err]',err)
        },
        complete: res => {
          wx.hideLoading()
        }
      })
    }
  },
  onLoad: function (opt) { },
  onReady: function () { },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: "反馈"
    });
  },
  onHide: function () {
  },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () {
    return {
      title: "碎片时间学编程",
      path: "/pages/main/main"
    };
  }
});
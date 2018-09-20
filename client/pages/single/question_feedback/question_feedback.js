Page({
  data: {
    question: {},
    ask: '',
    analysis: ''
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      question: wx.getStorageSync('last_question'),
      ask: wx.getStorageSync('ask'),
      analysis: wx.getStorageSync('analysis')
    })
  },
  onShareAppMessage: function () {}
})
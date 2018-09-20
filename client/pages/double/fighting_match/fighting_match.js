const match = require('../../../utils/tunnelMatch.js').match //引入匹配函数
const app = getApp()

Page({
  data: {
    winHeight: 0,
    winWidht: 0,
    ratio: 0,
    number: 0
  },

  matchTimeRun(){
    let number = 1;
    setInterval(() => {
      this.setData({
        number: number
      });
      number++;
    }, 1000);
  },

  onLoad: function (opt) {
    var that = this
    this.matchTimeRun();
    app.pageGetUserInfo(that, match(that, app, opt))
    that.setData({
      winWidth: wx.getStorageSync('winWidth'),
      winHeight: wx.getStorageSync('winHeight'),
      ratio: wx.getStorageSync('ratio')
    })
  },
  onUnload(){
  }
})
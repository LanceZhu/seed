var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js')
var app =getApp()

Page({
  data: {
    items: [{ 'title': '新知学习', 'content': '知识点+题', 'desc': 'basic', 'src': '/images/icons/KnowledgePoint.png' },
    { 'title': '专属题场', 'content': '刷题', 'desc': 'single', 'src': '/images/icons/exercise.png' },
    { 'title': '双人PK', 'content': 'PK', 'desc': 'double', 'src': '/images/icons/PK.png' },
    { 'title': '个人中心', 'content': '用户', 'desc': 'mine', 'src': '/images/icons/user.png' },
    ],
    winWidth: 0,
    winHeight: 0,
    ratio: 0,
    userInfo: {},
    res: ''
  },

  navigateToDetail: function(e){
    var urlName = e.currentTarget.dataset.desc
    var urlTitle = e.currentTarget.dataset.title
    wx.navigateTo({
      url: '../'+urlName+'/'+urlName+'?title='+urlTitle,
    })
  },

  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log('[main][winHeight]'+res.windowHeight);
        console.log('[main][winWidth]' + res.windowWidth);
        console.log('[main][ratio]' + 750 / res.windowWidth);
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          ratio: 750 / res.windowWidth
        });
        wx.setStorageSync('winHeight', res.windowHeight);
        wx.setStorageSync('winWidth', res.windowWidth);
        wx.setStorageSync('ratio', 750/res.windowWidth);
      }
    })
    //判断用户是否登录
    if (!app.globalData.userInfo) {
      wx.navigateTo({
        url: "/pages/authorize/authorize"
      })
      console.log('[main]login please')
    } else {
      console.log('[main]login success')
    }
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onReady: function () {},
  onShow: function () {
    this.closeTunnel()
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {
    return {
      title: "碎片时间学编程",
      path: "/pages/main/main"
    };
  },
  closeTunnel() {
    //当信道连接或者重连了时，关闭已连接的信道
    if (app.appData.tunnelStatus === 'connect' || app.appData.tunnelStatus === 'reconnect') {
      app.tunnel.close();
    }
  }
})
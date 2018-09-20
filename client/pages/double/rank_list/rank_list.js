var qcloud = require('../../../vendor/wafer2-client-sdk/index.js')
const Session = require('../../../vendor/wafer2-client-sdk/lib/session.js')
var util = require('../../../utils/util.js')
var config = require('../../../config.js')
var app = getApp()

Page({
  data: {
    currentTab: 0,
    friendsData: [],
    globalData: [],
    loadNumber: 0, // 全球排名数据加载次数,
    globalData_done: false
  },
  onLoad: function (opt) {
    /*
    wx.showShareMenu({
      withShareTicket: true
    })
    */
    this.setData({
      winHeight: wx.getStorageSync('winHeight'),
      winWidth: wx.getStorageSync('winWidth'),
      ratio: wx.getStorageSync('ratio')
    })
    this.getRankFriendsData();
    this.getRankGlobalData();
  },
  onShow() {},
  loadMore: function () {//下拉加载
    const that = this
    if (that.data.currentTab && !that.data.globalData_done) {
      that.getRankGlobalData()
    }
  },

  getRankGlobalData() {//加载全球排名的数据
    const that = this
    qcloud.request({
      login: false,
      url: app.appData.baseUrl + 'getRankGlobalData',
      data: {
        loadNumber: that.data.loadNumber
      },
      success: (res) => {
        that.setData({
          globalData: that.data.globalData.concat(res.data.data.arr),//数据叠加
          loadNumber: that.data.loadNumber + 1
        })
        if(that.data.globalData.length == res.data.data.length){
          that.setData({
            globalData_done: true
          })
        }
      },
      fail(error) {
        util.showSuccess('请求失败');
        console.log('request fail', error);
      },
    })
  },

  getRankFriendsData: function () {
    const that = this;
    qcloud.request({
      login: false,
      url: app.appData.baseUrl + 'getRankFriendsData',
      data: {
        openId: app.globalData.userInfo.openId
      },
      success: (res) => {
        this.setData({
          friendsData: res.data.data
        })
      },
      fail(error) {
        util.showSuccess('暂无数据');
        console.log('request fail', error);
      },
    });
  },

  /*
  swichNav(e) {
    var that = this;
    that.setData({
      currentTab: e.target.dataset.current,
    })
  },
  */

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
})
// pages/main/main.js

// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../utils/wafer-client-sdk/index');

// 引入配置
var config = require('../../config');

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  });
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: {
      'user': {'avataUrl': '', 'name': 'f00bar', 'id': '001'}
    },
    winWidth: 0,
    winHeight: 0,
    userInfo: {},
    mine: {}
  },

  navigateToDetail: function (e) {
    console.log(e.currentTarget.dataset.desc);
    var urlName = e.currentTarget.dataset.desc;
    wx.navigateTo({
      url: '../' + urlName + '/' + urlName,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    /** 
    * 获取系统信息 
    */
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    console.log('[userInfo]');
    console.log(userInfo);
    if(userInfo){
      that.setData({
        userInfo: userInfo
      })
    };
    var mine = wx.getStorageSync('mine');
    if(mine){
      that.setData({
        mine: mine
      });
      console.log(mine);
    }else{
      qcloud.request({
        // 要请求的地址
        url: 'http://localhost:3000/mine',

        // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
        login: true,

        success(result) {
          showSuccess('请求成功完成');
          console.log('request success', result);
          that.setData({
            mine: result.data[0]
          });
          wx.setStorageSync('mine', result.data[0]);
          console.log(result.data[0]);
        },

        fail(error) {
          showModel('请求失败', error);
          console.log('request fail', error);
        },

        complete() {
          console.log('request complete');
        }
      });
    }
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

  }
})
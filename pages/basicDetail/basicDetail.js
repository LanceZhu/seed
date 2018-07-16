// pages/basic/basic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: {'title':'Arduino简介', 
      'fragment': ['Arduino是一个能够用来感应和控制现实物理世界的一套工具。它由一个基于单片机并且开放源码的硬件平台，和一套为Arduino板编写程序的开发环境组成。',
      'Arduino语言是建立在C/C++语言基础上的是简化的C语言；Arduino语言把AVR单片机相关的一些参数设置都函数化，不用我们去了解他的底层，让我们不了解AVR单片机的同学们也能轻松上手。',
      '虽然Arduino语言建立在C/C++语言基础上，但仍与C语言有所不同，尤其是在程序入口和程序执行的顺序上，这一点在之后会有讲解。']},
    winHeight: 0,
    winWidth: 0
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
// pages/tutorial/tutorial.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    winWidth: 0,
    ratio: 0
  },

  preview: function(){
    wx.navigateBack({
      
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var winHeight = wx.getStorageSync('winHeight');
    if (winHeight) {
      that.setData({
        winHeight: winHeight,
        winWidth: wx.getStorageSync('winWidth'),
        ratio: wx.getStorageSync('ratio')
      })
    } else {
      wx.getSystemInfo({
        success: function (res) {
          console.log('[tutorial][winHeight]' + res.windowHeight);
          console.log('[tutorial][winWidth]' + res.windowWidth);
          console.log('[tutorial][ratio]' + 750 / res.windowWidth);
          that.setData({
            winWidth: res.windowWidth,
            winHeight: res.windowHeight,
            ratio: 750 / res.windowWidth
          });
          wx.setStorageSync('winHeight', res.windowHeight);
          wx.setStorageSync('winWidth', res.windowWidth);
          wx.setStorageSync('ratio', 750 / res.windowWidth);
        }
      });
    }
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
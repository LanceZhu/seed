// pages/basic/basic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    winWidth: 0
  },

  jumpToFightingMatch: function(e){
    wx.navigateTo({
      url: '../double/fighting_match/fighting_match',
    })
  },

  jumpToRankList: function(e){
    wx.navigateTo({
      url: '../double/rank_list/rank_list',
    })
  },

  jumpToQuestionSort: function (e) {
    wx.navigateTo({
      url: '../double/fighting_sort/fighting_sort',
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
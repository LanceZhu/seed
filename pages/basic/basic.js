// pages/basic/basic.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[{'name': 'Arduino','children':['简介','开发环境搭建','语言特性'], 'id': '1','locked': false},
           {'name':'变量','children':['1','2','3','4','5'], 'id': '2', 'locked':false},
           { 'name': '运算符', 'children': ['1', '2', '3'], 'id': 3, 'locked': true },
           { 'name': '运算符', 'children': ['1', '2', '3'], 'id': 4, 'locked': true },
           { 'name': '运算符', 'children': ['1', '2', '3'], 'id': 5, 'locked': true },
           { 'name': '运算符', 'children': ['1', '2', '3'], 'id': 6, 'locked': true },
           { 'name': '运算符', 'children': ['1', '2', '3'], 'id': 7, 'locked': true },
           { 'name': '运算符', 'children': ['1', '2', '3'], 'id': 8, 'locked': true },
           { 'name': '运算符', 'children': ['1', '2', '3'], 'id': 9, 'locked': true },
           { 'name': '运算符', 'children': ['1', '2', '3'], 'id': 10, 'locked': true },
           { 'name': '运算符', 'children': ['1', '2', '3'], 'id': 11, 'locked': true }],
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
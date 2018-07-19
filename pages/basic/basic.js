// pages/basic/basic.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [{ 'name': 'Arduino语言介绍', 'children': ['简介', '开发环境的使用', '语言特性', '编程规范'], 'id': '1', 'locked': false },
    { 'name': '变量', 'children': ['变量和常量简介', 'int', 'double', 'char', 'bool'], 'id': '2', 'locked': true },
    { 'name': '运算符', 'children': ['算数运算符', '赋值运算符', '关系运算符', '逻辑运算符', 'siseof()'], 'id': 3, 'locked': true },
    { 'name': '控制语句', 'children': ['if', 'for', 'while', 'break;continue'], 'id': 4, 'locked': true },
    { 'name': '数组', 'children': ['数组简介', '字符串数组'], 'id': 5, 'locked': true },
    { 'name': '函数（一）', 'children': ['函数简介', '函数接口', '函数体', '函数调用'], 'id': 6, 'locked': true },
    { 'name': '函数（二）', 'children': ['通讯', '数字 I/O', '模拟 I/O', '高级 I/O', '时间', '位操作', '中断'], 'id': 7, 'locked': true },
    { 'name': '类和对象', 'children': ['定义', '访问类型', '对象实例化', '外部库的调用'], 'id': 8, 'locked': true }],
    winHeight: 0,
    winWidth: 0
  },

  navigateToDetail: function(e){
    console.log(e.currentTarget.dataset.id);
    if(!e.currentTarget.dataset.locked){
      wx.navigateTo({
        url: '../basicDetail/basicDetail',
      })
    }else{
      wx.showModal({
        title: ':<',
        content: '未开启',
      })
    }
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
// pages/main/main.js
Page({
  
  /**
   * 页面的初始数据
   */
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

  /**
   * 跳转到详情页
   */
  navigateToDetail: function(e){
    console.log('navigateTo:'+e.currentTarget.dataset.desc);
    var urlName = e.currentTarget.dataset.desc;
    wx.navigateTo({
      url: '../'+urlName+'/'+urlName,
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
    let that = this;
    /**
     * 判断用户是否登录
     */
    /**
    let userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/authorize/authorize"
      })
    } else {
      that.setData({
        userInfo: userInfo
      })
    }
     */
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
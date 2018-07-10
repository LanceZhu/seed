// pages/main/main.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [{'title': '知识点', 'content': '知识点+题', 'desc': 'basic'},
      { 'title': '个人', 'content': '刷题', 'desc': 'single' },
      { 'title': '双人', 'content': 'PK', 'desc': 'double' },
      { 'title': '我', 'content': '用户', 'desc': 'mine' },
      ],
    winWidth: 0,
    winHeight: 0,
  },

  navigateToDetail: function(e){
    console.log(e.currentTarget.dataset.desc);
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
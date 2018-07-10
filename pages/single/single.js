// pages/single/single.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      items: {
        'question': '1+1=',
        'answers': [{ 'answer': 1, 'id': 1, 'right': false},
          { 'answer': 2 ,'id': 2,'right': true},
          { 'answer': 3, 'id': 3, 'right': false},
          { 'answer': 4 ,'id': 4, 'right':false}
        ],
        'rightAnswer': '1+1 = 2'
      },
      answerColor: '',
      clickId: '',
      localClick: false,
      winWidth: 0,
      winHeight: 0
  },

  answer: function (e) {
    var that = this;
    //console.log(that.data.clickId);
    if(!that.data.localClick){
      if (e.currentTarget.dataset.right) {
        that.setData({
          answerColor: 'right', 
          clickId: e.currentTarget.dataset.id
        });
        wx.navigateTo({
          url: '../'
        });
      } else {
        that.setData({
          answerColor: 'error',
          clickId: e.currentTarget.dataset.id
        });
        wx.navigateTo({
          url: '../'
        });
      };
      that.setData({
        localClick: true
      });
    };
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
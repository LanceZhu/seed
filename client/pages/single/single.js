// pages/single/single.js

//引入vender中的sdk避免冲突
// 引入 QCloud 小程序增强 SDK
//var qcloud = require('../../utils/wafer-client-sdk/index');

// 引入配置
//var config = require('../../config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: {
      'question': '以下哪个不是setup()函数的常见作用？',
      'answers': [{ 'answer': '初始化变量', 'id': 1, 'right': false },
      { 'answer': '动态控制 Arduino 主控板', 'id': 2, 'right': true },
      { 'answer': '设置引脚的输出\输入类型', 'id': 3, 'right': false },
      { 'answer': '配置串口', 'id': 4, 'right': false }
      ],
      'rightAnswer': '动态控制 Arduino 主控板'
    },
      answerColor: '',
      clickId: '',
      localClick: false,
      winWidth: 0,
      winHeight: 0,
      ratio: 0
  },

  /**
   * 提交问题
   */
  answer: function (e) {
    var that = this;
    //console.log(that.data.clickId);
    if(!that.data.localClick){
      if (e.currentTarget.dataset.right) {
        that.setData({
          answerColor: 'right', 
          clickId: e.currentTarget.dataset.id
        });
        let number = 1;
        let time = setInterval(function() {
          if (number > 1) {
            that.sendAnswer(that);
            clearInterval(time);
          } else {
            console.log(number);
            number++;
          }
        }, 500);
      } else {
        that.setData({
          answerColor: 'error',
          clickId: e.currentTarget.dataset.id
        });
        wx.navigateTo({
          url: '../tutorial/tutorial'
        });
      };
      that.setData({
        localClick: true
      });
    };
  },

  /**
   * 提交请求
   */
  sendAnswer: function(that){
    /**
     * 提交请求
     */
    /**
    qcloud.request({

    });
    */
    /**
     * 模拟请求
     */
    that.setData({
      items: {
        'question': that.data.items.question+'asdf',
        'answers': [{ 'answer': '初始化变量', 'id': 1, 'right': false },
        { 'answer': '动态控制 Arduino 主控板', 'id': 2, 'right': true },
        { 'answer': '设置引脚的输出\输入类型', 'id': 3, 'right': false },
        { 'answer': '配置串口', 'id': 4, 'right': false }
        ],
        'rightAnswer': '动态控制 Arduino 主控板'
      },
      answerColor: '',
      clickId: '',
      localClick: false,
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
    var winHeight = wx.getStorageSync('winHeight');
    if(winHeight){
      that.setData({
        winHeight: winHeight,
        winWidth: wx.getStorageSync('winWidth'),
        ratio: wx.getStorageSync('ratio')
      })
    }else{
      wx.getSystemInfo({
        success: function (res) {
          console.log('[single][winHeight]' + res.windowHeight);
          console.log('[single][winWidth]' + res.windowWidth);
          console.log('[single][ratio]' + 750 / res.windowWidth);
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
// pages/test/test.js
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    list: [[], [], [], [],[],[],[],[],[]],
    header_image: '',
    header_image_display: 0
  },

  /**
  //页面跳转到类别demo页
  jumpToDetail: function (e) {
    wx.navigateTo({
      url: '../tutorial/tutorial',
    })
  },
  */


  jumpToDetail: function (e) {
    var name = e.currentTarget.dataset.categoryUrl;
    wx.navigateTo({
      url: '../' + name + '/' + name,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.showLoading({
      title: '拼命加载中...',
    });

    that.setData({
      header_image: options.categoryName,
      header_image_display: 1
    }),

      console.log(that.data.header_image);

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

    console.log(options);

    wx.request({
      url: 'http://localhost:3000/category?name=' + options.categoryName,
      method: 'GET',
      data: {

      },
      header: {

      },
      success: function (res) {
        console.log(res);
        var list = 'list';
        that.setData({
          [list]: res.data,
        })
      },

      fail: {

      },
      complete: {

      }
    })

    wx.hideLoading();

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
    console.log('PullDownRefresh');
    wx.showNavigationBarLoading();
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
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
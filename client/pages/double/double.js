let app = getApp()
Page({
  data: {
    winHeight: 0,
    winWidth: 0
  },

  jumpToDetail: function(e){
    let location = e.currentTarget.dataset.location
    wx.navigateTo({
      url: '../double/'+location+'/'+location,
    })
  },

  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: options.title
    })
    that.setData({
      winHeight: wx.getStorageSync('winHeight'),
      winWidth: wx.getStorageSync('winWidth'),
      ratio: wx.getStorageSync('ratio')
    })
  },
  onShow(e){
    this.quit()
  },

  quit: function () {
    if (app.tunnel && app.tunnel.isActive()) {
      app.tunnel.close()
      console.log('[tunnelGame][close]')
    }
  }
})
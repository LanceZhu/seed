// pages/double/fighting_match/figthing_match.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: '初始化...',
    number: 0
  },

  matchTimeRun(){
    let number = 1;
    let time = setInterval(() => {
      this.setData({
        number: number
      });
      console.log(this.data.number);
      if(this.data.number >= 3){
        wx.redirectTo({
          url: '../fighting_room/fighting_room',
        });
        clearInterval(time);
      }else{
        number++;
      }
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.matchTimeRun();
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
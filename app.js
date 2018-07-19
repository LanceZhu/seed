// 引入 QCloud 小程序增强 SDK
var qcloud = require('/utils/wafer-client-sdk/index');

// 引入配置
var config = require('/config');

var util = require('./utils/util');

//app.js
App({
  appData: {
    appId: config.service.appId,
    tunnelStatus: 'close',//统一管理的信道连接的状态:connect close reconnectin reconnect error
    friendsFightingRoom: undefined,//好友对战创建的唯一房间名，作为好友匹配的标识
  },

  globalData: {
    userInfo: null
  },

  onLaunch: function (opt) {
    this.appData.opt = opt
    //设置登录地址
    qcloud.setLoginUrl(config.service.loginUrl);

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    /**
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    */
  },

  /**
   * page中调用获取用户信息
   */
  pageGetUserInfo(page, openIdReadyCallback){
    const userInfo = wx.getStorageSync('user_info_F2C224D4-2BCE-4C64-AF9F-A6D872000D1A')
    //已有userInfo直接使用，否则调用userInfoReadyCallBack(再所需page中定义)
    if(userInfo){
      page.setData({
        userInfo,
        openId: userInfo.openId
      })
      this.appData.openId = userInfo.openId;
      if(openIdReadyCallback){
        openIdReadyCallback(userInfo.openId);
      }
    }else{
      this.userInfoReadyCallback = (userInfo) => {
        page.serData({
          userInfo,
          openId: userInfo.openId
        })
      }
      if(openIdReadyCallback){
        openIdReadyCallback(openId)
      }
    }
  },

  /**
   * 创建一个tunnel，监听相关数据变化
   */
  tunnelCreate(){
    const that = this
    const tunnel = that.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)
    tunnel.open()
    //监听信道连接
    tunnel.on('connect',()=>{
      console.info("tunnelStatus='connect'")
      this.appData.tunnelStatus = 'connect'
      if(that.tunnelConnectCallback){
        that.tunnelConnectCallback()
      }
    })
    //监听信道断开
    tunnel.on('close',()=>{
      console.info("tunnelStatus='close'")
      this.appData.tunnelStatus = 'close'
      if(that.tunnelCloseCallBack){
        taht.tunnelCloseCallBack
      }
    })
    //监听信道重连
    tunnel.on('reconnecting',()=>{
      console.info("tunnelStatus='reconnecting")
      this.appData.tunnelStatus = 'reconnecting'
      if(that.tunnelReconnectingCallback){
        that.tunnelReconnectingCallback()
      }
    })
    //监听信道重连成功
    tunnel.on('reconnect',()=>{
      console.info("tunnelStatus='reconnect'")
      console.info('重连后的信道为:' + tunnel.socketUrl.slice(tunnel.socketUrl.indexOf('tunnelId=') + 9, tunnel.socketUrl.indexOf('&')))
      this.appData.tunnelStatus = 'reconnect'
      if (that.tunnelReconnectCallback) {//设置回调
        that.tunnelReconnectCallback()
      }
    })
    //监听信道发成错误
    tunnel.on('error', () => {
      console.info("tunnelStatus = 'error'")
      this.appData.tunnelStatus = 'error'
      util.showSuccess('您已断线，请检查联网')
      wx.navigateBack({
        url: '../main/main'
      })
      if (that.tunnelErrorCallback) {
        that.tunnelErrorCallback()
      }
    })
    //PING-PONG机制：监听服务器PING
    tunnel.on('PING', () => {//PING-PONG机制:监听服务器PING
      console.info("接收到PING")
      tunnel.emit('PONG', {//给出回应
        openId: this.appData.openId
      })
      console.info("发出了PONG")
    })
  }
})
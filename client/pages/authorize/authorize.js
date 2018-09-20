let qcloud = require('../../vendor/wafer2-client-sdk/index');
let util = require('../../utils/util.js')
let app = getApp()

Page({
  /**
   * 用户授权登录
   */
  bindGetUserInfo: function (e) {
    util.showBusy('正在登录');
    const session = qcloud.Session.get()
    if (app.globalData.userInfo) {
      // 第二次登录
      // 或者本地已经有登录态
      // 可使用本函数更新登录态
      qcloud.loginWithCode({
        success: res => {
          util.showSuccess('登录成功')
          //console.log('登录成功', res)
          app.globalData.userInfo = res
          //wx.setStorageSync('userInfo', res)
          wx.setStorageSync('logged', true)
          wx.navigateBack()
        },
        fail: err => {
          console.log('[login][err]',err)
          util.showSuccess('登录失败！')
        }
      })
    } else {
      qcloud.login({
        success: res => {
          util.showSuccess('登录成功')
          //console.log('登录成功', res)
          app.globalData.userInfo = res
          wx.setStorageSync('logged', true )
          //wx.setStorageSync('userInfo', res)
          wx.navigateBack()
        },
        fail: err => {
          console.error(err)
          util.showSuccess('登录错误!')
          console.log('登录失败!', error)
        }
      })
    }
  },
});

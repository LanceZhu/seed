// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../vendor/wafer2-client-sdk/index');

// 引入配置
var config = require('../../config');

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  });
};

/**
 * 使用 Page 初始化页面，具体可参考微信公众平台上的文档
 */
Page({

  /**
   * 初始数据，我们把服务地址显示在页面上
   */
  data: {
    loginUrl: config.service.loginUrl,
    requestUrl: config.service.requestUrl,
    tunnelUrl: config.service.tunnelUrl,
    tunnelStatus: 'closed',
    tunnelStatusText: {
      closed: '已关闭',
      connecting: '正在连接...',
      connected: '已连接'
    }
  },

  /**
   * 点击「登录」按钮，测试登录功能
   */
  /**
  bindGetUserInfo() {
    showBusy('正在登录');

    // 登录之前需要调用 qcloud.setLoginUrl() 设置登录地址，不过我们在 app.js 的入口里面已经调用过了，后面就不用再调用了
    qcloud.login({
      success(result) {
        showSuccess('登录成功');
        console.log('登录成功', result);
        wx.setStorageSync('userInfo', result);
        wx.navigateBack();
      },

      fail(error) {
        showModel('登录失败', error);
        console.log('登录失败', error);
      }
    });
  },
  */

/**
 * 点击「登录」按钮，测试登录功能
 */
  bindGetUserInfo: function (e) {
    showBusy('正在登录');

    const session = qcloud.Session.get()

    if (session) {
      // 第二次登录
      // 或者本地已经有登录态
      // 可使用本函数更新登录态
      qcloud.loginWithCode({
        success: res => {
          this.setData({ userInfo: res, logged: true })
          showSuccess('登录成功')
          console.log('登录成功', res)
          wx.setStorageSync('userInfo', res)
          wx.navigateBack()
        },
        fail: err => {
          console.error(err)
          showModel('登录错误', err.message)
        }
      })
    } else {
      // 首次登录
      qcloud.login({
        success: res => {
          this.setData({ userInfo: res, logged: true })
          showSuccess('登录成功')
          console.log('登录成功', res)
          wx.setStorageSync('userInfo', res)
          wx.navigateBack()
        },
        fail: err => {
          console.error(err)
          showModel('登录错误', err.message)
          console.log('登录失败', error)
        }
      })
    }
  },
});

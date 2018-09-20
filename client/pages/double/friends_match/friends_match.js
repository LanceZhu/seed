var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var config = require('../../../config')
var util = require('../../../utils/util.js')
const match = require('../../../utils/tunnelMatch.js').match//引入匹配函数
const app = getApp();

Page({
  data: {
    status: '初始化...',
    opt: '', // 记录friedns_sort用户选择信息 用于再次分享
    userInfo: '', // match 匹配使用
    openId: '' // match 匹配使用
  },
  onLoad (opt) {
    console.log('[freingds_match][opt]',opt)
    //判断用户是否授权登录
    if (!app.globalData.userInfo) {
      wx.navigateTo({
        url: "/pages/authorize/authorize"
      })
      console.log('[friends_match]login please')
    } else {
      console.log('[friends_match]login success')
    }
    /* 操作user_network 不清楚作用
    app.appData.fromClickId = opt.currentClickId
    app.upDateUser_networkFromClickId = require('../../../utils/upDateUser_networkFromClickId.js').upDateUser_networkFromClickId
    */
    wx.showShareMenu({
      withShareTicket: true
    })
    this.setData({ opt }) // 记录friedns_sort用户选择信息 用于再次分享
    // 存储好友分享 对战 信息 
    if (opt.scene == 1044) {  //打开页面，若含opt.scene == 1044,则表示改页面来自转发
      app.pageGetUserInfo(this, this.storeFriensNetwork)
    } else {
      app.pageGetUserInfo(this) // 获取userInfo openId 可直接使用app.globalData.userInfo
    }
    app.pageGetUserInfo(this, match(this, app, opt))//开始匹配
  },
  onShareAppMessage (res) {
    const that = this
    return {
      title: '我才是' + this.data.opt.sortName + '领域的王者,敢来挑战吗?',
      path: '/pages/double/friends_match/friends_match?scene=1044&fromOpenId=' + this.data.openId + '&sortId=' + this.data.opt.sortId + '&sortName=' + this.data.opt.sortName + '&currentClickId=' + app.appData.currentClickId + '&friendsFightingRoom=' + this.data.opt.friendsFightingRoom+'&friends_match=1',
      success: (res) => {
        //转发时向用户关系表中更新一条转发记录(个人为person，群为GId)。 操作user_network 作用不清楚
        //require('../../../utils/upDateShareInfoToUser_network.js').upDateShareInfoToUser_network(app, that, res)
      }
    }
  },
  // 存储好友分享信息 (openId, appId, fromOpenId, fromGid='')
  storeFriensNetwork () {
    const that = this;
    let [page, app] = [this, getApp()];
    let baseData = {
      openId: this.data.openId,
      appId: app.appData.appId,
      fromOpenId: this.data.opt.fromOpenId,
      fromGId: ''
    }
    wx.getShareInfo({
      shareTicket: app.appData.opt.shareTicket,  //当是从后台打开转发小程序，这时无法获取群信息
      success: (res) => {
        if (app.appData.gId) {
          baseData.fromGId = app.appData.gId // 不存在gId
          storeFriendsNetwork(baseData)
        } else {
          app.gIdReadyCallback = (gId) => {
            baseData.fromGId = gId
            storeFriendsNetwork(baseData)
          }
        }
      },
      fail (res) {
        storeFriendsNetwork(baseData)
      }
    })
    function storeFriendsNetwork(data) {
      const that = this;
      qcloud.request({
        login: false,
        url: `${app.appData.baseUrl }storeFriendsNetwork`,
        data,
        success(res) {
          console.info('[storeFriensNetwork]：存储finalData和clickId成功')
        },
        fail(error) {
          util.showSuccess('请求失败!');
          console.log('request fail', error);
        },
      });
    }
  },
  
  goback() {
    wx.reLaunch({
      url: '../../main/main',
    })
  },
})

var qcloud = require('./vendor/wafer2-client-sdk/index');
var config = require('./config');
var util = require('./utils/util.js')
const Session = require('./vendor/wafer2-client-sdk/lib/session.js')
const Towxml = require('/towxml/main')

App({
    towxml: new Towxml,
    appData: {
      appId: config.service.appId,
      baseUrl: `${config.service.host}/weapp/`,
      tunnelStatus: 'close',//统一管理唯一的信道连接的状态：connect、close、reconnecting、reconnect、error
      friendsFightingRoom: undefined,//好友对战时创建的唯一房间名,作为好友匹配的标识
      opt: '', // 包含 shareTicket 好友匹配时判断是否分享到群
      openId: '',
      currentClickId: '',// 每个用户一个ClickId 分享时使用
    },

    globalData: {
      userInfo: null
    },
    
    lodash: {
      forEach: require("./utils/lodash.foreach/index.js"),
    },

    onLaunch: function (opt) {
      this.appData.opt = opt
      qcloud.setLoginUrl(config.service.loginUrl);
      if(Session.get()){
        this.globalData.userInfo = Session.get().userinfo // 判断用户是否登录
      }
    },
    onShow: function(opt){
      console.log('[app]opt:', opt)
      this.storeUser_network(opt)//每次打开程序都启动存储用户关系表
    },

    /**
     * page中调用获取用户信息
     */
    pageGetUserInfo(page, openIdReadyCallback) {
      let userInfo = this.globalData.userInfo
      //已有userInfo直接使用，否则调用userInfoReadyCallBack(再所需page中定义)
      if (userInfo) {
        page.setData({
          userInfo,
          openId: userInfo.openId
        })
        this.appData.openId = userInfo.openId;
        if (openIdReadyCallback) {
          console.log('[app][pageGetUserInfo][openIdReadyCallback]')
          openIdReadyCallback(userInfo.openId);
        }
      } else {
        this.userInfoReadyCallback = (userInfo) => {
          page.setData({
            userInfo,
            openId: userInfo.openId
          })
        }
        if (openIdReadyCallback) {
          console.log('[app][pageGetUserInfo][openIdReadyCallback]')
          openIdReadyCallback(openId)
        }
      }
    },

    /**
     * 创建一个tunnel，监听相关数据变化
     */
    tunnelCreate() {
      const that = this // that表示app=getApp()
      if (that.tunnel && that.tunnel.isActive()) {
        that.tunnel.close();
        console.log('信道关闭')
      }
      const tunnel = that.tunnel = new qcloud.Tunnel(config.service.tunnelGame)
      tunnel.on('connect', () => {
        console.info("[app][tunnelCreate]tunnelStatus='connect'")
        this.appData.tunnelStatus = 'connect'
        if (that.tunnelConnectCallback) {
          that.tunnelConnectCallback()
        }
      })
      tunnel.on('close', () => {
        console.info("[app][tunnelCreate]tunnelStatus='close'")
        this.appData.tunnelStatus = 'close'
        if (that.tunnelCloseCallBack) {
          taht.tunnelCloseCallBack
        }
      })
      tunnel.on('reconnecting', () => {
        console.info("[app][tunnelCreate]tunnelStatus='reconnecting")
        this.appData.tunnelStatus = 'reconnecting'
        if (that.tunnelReconnectingCallback) {
          that.tunnelReconnectingCallback()
        }
      })
      tunnel.on('reconnect', () => {
        console.info("[app][tunnelCreate]tunnelStatus='reconnect'")
        console.info('重连后的信道为:' + tunnel.socketUrl.slice(tunnel.socketUrl.indexOf('tunnelId=') + 9, tunnel.socketUrl.indexOf('&')))
        this.appData.tunnelStatus = 'reconnect'
        if (that.tunnelReconnectCallback) {//设置回调
          that.tunnelReconnectCallback()
        }
      })
      tunnel.on('error', () => {
        console.info("[app][tunnelCreate]tunnelStatus = 'error'")
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
      tunnel.open()
    },


  /******************用户关系点击表操作******************/
  //注意1：所有从分享中启动的页面onLoad都添加：  
  /*
    app.appData.fromClickId = opt.currentClickId
    app.upDateUser_networkFromClickId = require('../../utils/upDateUser_networkFromClickId.js').upDateUser_networkFromClickId
    wx.showShareMenu({
      withShareTicket: true
    })
  */
  //注意2：所有分享页面路径都添加：?currentClickId=' + app.appData.currentClickId,
  //注意3：所有分享页面的分享成功回调都添加： require('../../utils/upDateShareInfoToUser_network.js').upDateShareInfoToUser_network(app,that,res)

  storeUser_network(opt) { // 从微信群中打开程序
    const that = this
    const userInfo = that.globalData.userInfo
    if (userInfo) {//已缓存的用户数据直接用
      getGId(that, userInfo, opt)
    } else {
      this.userInfoReadyCallback = (userInfo) => {  //获取用户信息后的回调函数
        getGId(that, userInfo, opt)
      }
    }
    function getGId(that, userInfo, opt) {
      //判断是否是从微信群内打开该程序的
      if(opt.shareTicket){
        wx.getShareInfo({
          shareTicket: opt.shareTicket,
          //含GId的情况
          success: (res) => {
            console.log('[app][getGid] success')
            qcloud.request({
              login: false,
              data: {
                appId: that.appData.appId,
                openId: userInfo.openId,
                encryptedData: res.encryptedData,
                iv: res.iv
              },
              url: `${that.appData.baseUrl}getGId`,
              success: (res) => {
                let GId = res.data.data
                store(that, userInfo, opt, GId)
              }
            })
          },
          //不含GId的情况
          fail: function (res) {
            store(that, userInfo, opt)
          }
        })
      }
    }
    function store(that, userInfo, opt, GId = '') {  //参数内要写that：that作为一个对象不能凭空产生
      let data = {
        //clickId:自动生成的数据, table user_network clickId自增获得
        fromClickId: that.appData.fromClickId ? that.appData.fromClickId : 0,//从哪个clickId那里打开的
        appId: that.appData.appId,
        openId: userInfo.openId,
        fromGId: GId,
        scene: opt.scene,
        //time:自动生成的数据, table user_network time格式timestamp
        //param_1:转发时才会更新当前clickId中的param_1数据
      }
      //将数据存储到数据库点击表中,同时将得到的clickId放在全局变量供page分享时调用
      qcloud.request({
        login: false,
        data,
        url: `${that.appData.baseUrl}storeUserNetwork`,// 路径为storeUserNetwork暂不使用
        success: (res) => {
          let currentClickId = res.data.data
          console.log('[app][currentClickId]', currentClickId)
          that.appData.currentClickId = currentClickId//设置当前新插入的clickId为全局fromClickId
          let fromClickId = that.appData.fromClickId
          if (that.upDateUser_networkFromClickId && fromClickId) {//存在fromClickId，则进行数据库更新
            console.log('[app]upDateUser_networkFromClickId success')
            that.upDateUser_networkFromClickId(that, currentClickId, fromClickId)
          }
        }
      });
    }
  },
  /******************用户关系点击表操作******************/
});
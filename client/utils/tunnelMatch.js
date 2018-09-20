const util = require('./util')
const Session = require('../vendor/wafer2-client-sdk/lib/session.js')
/**
 * 玩家匹配函数 用于fightingMatch
 * @param page 当前页面
 * @param app 小程序实例
 * @param opt 当前页面相关数据
 */
function match(page, app, opt) {
  const that = page
  if (app.appData.tunnelStatus != 'close') {
    app.tunnel.close()
  }
  app.tunnelCreate()//app统一创建信道，并监听相关变化
  const tunnel = app.tunnel

  //获取当前信道id
  function getCurrentTunnelId() {
    console.log('[getCurrentTunnelId]', app.tunnel.socketUrl.slice(app.tunnel.socketUrl.indexOf('tunnelId=') + 9, app.tunnel.socketUrl.indexOf('&')))
    return app.tunnel.socketUrl.slice(app.tunnel.socketUrl.indexOf('tunnelId=') + 9, app.tunnel.socketUrl.indexOf('&'))
  }

  //信道连接成功回调函数
  app.tunnelConnectCallback = () => {
    let userInfo = Session.get().userinfo
    userInfo.tunnelId = getCurrentTunnelId()
    that.setData({
      status: '已连接，对手匹配中...',
      userInfo,//用户信息存储当前的信道Id
    })
    //发起匹配
    console.log('信道连接成功,发起匹配[emit][updateMatchInfo]')
    tunnel.emit('updateMatchInfo', {
      openId: that.data.openId,
      sortId: opt.sortId,
      friendsFightingRoom: opt.friendsFightingRoom//匹配者含friendsFightingRoom则说明是好友之间的匹配
    })
  }

  //信道连接关闭回调函数
  app.tunnelCloseCallback = () => {
    that.setData({ status: '连接已关闭' })
    util.showSuccess('连接已断开')
  }

  //信道重连回调函数
  app.tunnelReconnectCallback = () => {
    util.showSuccess('已重新连接')
    let userInfo = Session.get().userinfo
    userInfo.tunnelId = getCurrentTunnelId()
    that.setData({
      status: '网络已重连，匹配中...',
      userInfo,
    })
    tunnel.emit('updateMatchInfo', {//发起匹配
      openId: that.data.openId,
      sortId: opt.sortId,
      friendsFightingRoom: opt.friendsFightingRoom//匹配者含friendsFightingRoom则说明是好友之间的匹配
    })
  }

  //信道重连成功回调函数
  app.tunnelReconnectCallback = () => {
    util.showSuccess('已重新连接')
    let userInfo = Session.get().userinfo
    userInfo.tunnelId = getCurrentTunnelId()
    that.setData({
      status: '网络重连成功，对手匹配中...',
      userInfo,
    })
  }

  //信道连接错误回调函数
  app.tunnelErrorCallback = (error) => {
    that.setData({ status: '信道发生错误：' + error })
    util.showSuccess('连接错误')
  }

  //监听匹配成功
  tunnel.on('matchNotice', (res) => {//监听匹配成功
    console.log('[matchNotice]', res)
    let user_me, user_others
    if (res.player1.openId === that.data.openId) {
      user_me = res.player1
      user_others = res.player2
    } else {
      user_me = res.player2
      user_others = res.player1
    }
    wx.setStorageSync('user_me', user_me)
    wx.setStorageSync('user_others', user_others)
    that.setData({ status: user_me.nickName + ' VS ' + user_others.nickName })
    setTimeout(goto_fighting_room, 2000)//延迟1s跳转到战队页面
    let friends_match = opt.friends_match ? opt.friends_match : 0
    function goto_fighting_room() {
      wx.redirectTo({ //navigateTo不会会卸载该页面，只是将当前页面隐藏了,redirectTo会销毁当前页面
        url: `../fighting_room/fighting_room?roomName=${res.player1.roomName}`+'&friends_match='+friends_match
      })
    }
  })
}

module.exports = {
  match
}
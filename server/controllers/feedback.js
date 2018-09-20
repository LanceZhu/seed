module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    const { mysql } = require('../qcloud')
    let res = await mysql('feedback').insert({'openId': ctx.state.$wxInfo.userinfo.openId, 'type': ctx.request.body.type, title: ctx.request.body.title, content: ctx.request.body.content})
    ctx.state.data = 'feedbackSuccess'
  } else {
    ctx.state.code = -1
  }
}
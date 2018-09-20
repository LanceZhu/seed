module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    const { mysql } = require('../qcloud')
    ctx.state.data = await mysql('question_mark').where({ openId: ctx.request.body.openId }).select('*').orderByRaw('id')
  } else {
    ctx.state.code = -1
  }
}
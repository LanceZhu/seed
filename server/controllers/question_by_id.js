module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    const { mysql } = require('../qcloud')
    ctx.state.data = await mysql('question_detail').where({ id: ctx.request.body.id }).select('*').orderByRaw('RAND()').limit(1)
  } else {
    ctx.state.code = -1
  }
}
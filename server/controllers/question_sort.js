module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    const { mysql } = require('../qcloud')
    ctx.state.data = await mysql('question_sort').select('*')
   /**
    await mysql('question_sort').select('*').then(res => {
      ctx.state.data = res;
    })
     */
  } else {
    ctx.state.code = -1
  }
}
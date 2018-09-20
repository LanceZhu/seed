module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    const { mysql } = require('../qcloud')
    //ctx.state.data = await mysql('question_sort').select('*')
    ctx.state.data = await mysql('question_detail').select('*').orderByRaw('RAND()').limit(5)
    /**
     await mysql('question_sort').select('*').then(res => {
       ctx.state.data = res;
     })
      */
  } else {
    ctx.state.code = -1
  }
}
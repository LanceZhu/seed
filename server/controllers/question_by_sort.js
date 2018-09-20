module.exports = async (ctx, next) => {
  const Towxml = require('towxml');
  const towxml = new Towxml();

  if (ctx.state.$wxInfo.loginState === 1) {
    const { mysql } = require('../qcloud')
    //ctx.state.data = ctx.request.body
    let md = await mysql('basicDetail').where({name: ctx.request.body.name}).select('*').orderByRaw('RAND()').limit(1)
    //console.log(md[0].content)
    ctx.state.data = towxml.toJson(md[0].content,'markdown');
    /**
     await mysql('question_sort').select('*').then(res => {
       ctx.state.data = res;
     })
      */
  } else {
    ctx.state.code = -1
  }
}
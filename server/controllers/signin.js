const {mysql} = require('../qcloud')
module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState) {
    if(ctx.request.body.all){
      ctx.state.data = await mysql('signin').where({ openId: ctx.state.$wxInfo.userinfo.openId}).orderByRaw('id')
    }else{
      let res = await mysql('signin').where({ openId: ctx.state.$wxInfo.userinfo.openId, date: ctx.request.body.date })
      if(!res[0]){
        let res0 = await mysql('signin').insert({ openId: ctx.state.$wxInfo.userinfo.openId, date: ctx.request.body.date })
        ctx.state.data = 'signinSuccess'
      }else{
        ctx.state.data = 'singinAlready'
      }
    }
  }else{
    ctx.state.code = -1
  }
}

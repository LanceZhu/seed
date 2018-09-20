module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState === 1) {
    const { mysql } = require('../qcloud')
    const type = ctx.request.body.type
    var question_history = ''
    switch(type){
      case 'history_error':{
        question_history = await mysql('answer_detail').where({ openId: ctx.state.$wxInfo.userinfo.openId, answer_right: 0 }).select('*').orderByRaw('question_id')
        break
      }
      case 'history': {
        question_history = await mysql('answer_detail').column('question_id', 'datetime').where({ openId: ctx.state.$wxInfo.userinfo.openId}).select().orderByRaw('datetime')
        break
      }
      case 'chapter':{
        question_history = await mysql('answer_detail').where({ openId: ctx.state.$wxInfo.userinfo.openId, chapter_id: ctx.content.body.chapterId }).select('*').orderByRaw('question_id')
        break
      }
      case 'answer_detail_update':{
        question_history = await mysql('answer_detail_update').where({ openId: ctx.state.$wxInfo.userinfo.openId}).select('*').orderByRaw('question_id')
        break
      }
      default: question_history = ''
      }
    ctx.state.data = question_history
  } else {
    ctx.state.code = -1
  }

}
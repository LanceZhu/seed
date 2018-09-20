const { tunnel } = require('../qcloud')
const { mysql } = require('../qcloud')
const debug = require('debug')('koa-weapp-demo')
const url = require('url')

/**
 * userMap 为 tunnelId 和 用户信息的映射
 * 实际使用时使用数据库存储
 */
const userMap = {}
/**
 * question_options(name_id, chapter_id, counts)
 */
const rooms = {}

const tools = {
	//广播到指定信道
	broadcast(tunnelIdsArray, type, content){
		tunnel.broadcast(tunnelIdsArray, type, content)
			.then(result => {
				const invalidTunnelIds = result.data && result.data.invalidTunnelIds || []

	            if (invalidTunnelIds.length) {
	                console.log('检测到无效的信道 IDs =>', invalidTunnelIds)

	                // 从 userMap 中将无效的信道记录移除
	                invalidTunnelIds.forEach(tunnelId => {
	                    delete userMap[tunnelId]
	                })
	            }
			})
	},
	//关闭指定信道
	closeTunnel(tunnelId){
		tunnel.closeTunnel(tunnelId)
	},
	/**
   * 发送题目到指定信道
   * tunelId 信道名
   * options question题目信息
   */
	sendQuestion(tunnelId, room){
		try{
      if(room.library){
        // 前后端 unit chapter相反
        tools.broadcast([tunnelId], 'sendQuestion', {
          question: room.library[0]? room.library[0] : {}
        })
        room.library.shift()
        console.log('[library]', room.library)
      } else {
        console.log(room.question_options.chapterId)
        mysql('question_detail').whereIn('chapter_id', room.question_options.chapterId).select('*').orderByRaw('RAND()').limit(1).then(res => {
          tools.broadcast([tunnelId], 'sendQuestion', {
            question: res[0] ? res[0] : {}
          })
        }, error => {
          console.log(error)
        })
      }
		} catch (err){
			console.log('[sendQuestion][err]'+err)
		}
	}
}

/**
 * 实现 onConnect 方法
 * 在客户端成功连接 WebSocket 信道服务之后会调用该方法，
 * 此时通知所有其它在线的用户当前总人数以及刚加入的用户是谁
 */
function onConnect (tunnelId) {
    if (tunnelId in userMap) {
    	console.log(userMap[tunnelId].nickName,'进入专属题场')
      tools.broadcast([tunnelId],'connected','connected')
    } else {
        console.log(`Unknown tunnelId(${tunnelId}) was connectd, close it`)
        tools.closeTunnel(tunnelId)
    }
}

/**
 * 实现 onMessage 方法
 * 客户端推送消息到 WebSocket 信道服务器上后，会调用该方法，此时可以处理信道的消息。
 */
function onMessage (tunnelId, type, content) {
    /*
    * ask: 题目信息 question_options(chapterId[], unitId, counts)
    * answer: 用户答题情况 answer(id, time, right, datetime, chapter_id, unit_id)
    */
    switch (type) {
      case 'ask':
        {
          if (tunnelId in userMap) {
            rooms[tunnelId].question_options = content
            if(content.counts){
              mysql('question_detail').where({chapter_id: content.chapterId, unit_id: content.unitId}).select('*').orderByRaw('id').limit(content.counts).then(res => {
                rooms[tunnelId].library = res
                console.log('[library]', res)
                console.log('[onMessage][ask]', content.counts ,content)
                tools.sendQuestion(tunnelId, rooms[tunnelId])
              }, error => {
                console.log(error)
              }) 
            }else{
              tools.sendQuestion(tunnelId, rooms[tunnelId])
            }
          } else {
            tools.closeTunnel(tunnelId)
          }
          break
        }
      case 'answer':
        if (tunnelId in userMap) {
          //content(id, time, right)
          console.log('[onMessage][answer]', content)
          //mysql() 插入答题情况 (openId, id, time, right, datetime, chapter_id, unit_id)
          try{
            mysql('answer_detail_update').where({openId: userMap[tunnelId].openId, question_id: content.id}).select('*').then(res => {
              if(res[0]){
                console.log('[answer_detail_update][update]',userMap[tunnelId].openId,content.id,content.time,content.right)
                mysql('answer_detail_update').where({openId: userMap[tunnelId].openId, question_id: content.id}).update({answer_time: content.time, answer_right: content.right, datetime: content.datetime})
              }else{
                console.log('[answer_detail_update][insert]',userMap[tunnelId].openId,content.id,content.time,content.right)
                mysql('answer_detail_update').insert({openId: userMap[tunnelId].openId, question_id: content.id , answer_time: content.time, answer_right: content.right, datetime: content.datetime, chapter_id: content.chapterId, unit_id: content.unitId, ask: content.ask}).then(res => {
                  console.log('[insert]',res)
                }, error => {
                  console.log('[answer_detail_update][insert][err]',error)
                })
              }
            })
            console.log('[answer_detail][insert]', userMap[tunnelId].openId, content)
            mysql('answer_detail').insert({ openId: userMap[tunnelId].openId, question_id: content.id, answer_time: content.time, answer_right: content.right, datetime: content.datetime, chapter_id: content.chapterId, unit_id: content.unitId }).then(res => {
              console.log('[answer_detail][insert]', res)
            }, error => {
              console.log('[answer_detail][insert][err]', error)
            })            
          }catch(err){
            console.log('[answer_detail]',err)
          }
            tools.sendQuestion(tunnelId, rooms[tunnelId])
        } else {
          tools.closeTunnel(tunnelId)
        }
        break
      default:
            break
    }
}

/**
 * 实现 onClose 方法
 * 客户端关闭 WebSocket 信道或者被信道服务器判断为已断开后，
 * 会调用该方法，此时可以进行清理及通知操作
 */
function onClose (tunnelId) {
    console.log(`[onClose] =>`, { tunnelId })

    if (!(tunnelId in userMap)) {
        console.log(`[onClose][Invalid TunnelId]=>`, tunnelId)
        tools.closeTunnel(tunnelId)
        return
    }

    const leaveUser = userMap[tunnelId]
    delete userMap[tunnelId]
    delete rooms[tunnelId]
    tools.closeTunnel(tunnelId)
}

module.exports = {
    // 小程序请求 websocket 地址
    get: async ctx => {
        const data = await tunnel.getTunnelUrl(ctx.req)
        const tunnelInfo = data.tunnel

        userMap[tunnelInfo.tunnelId] = data.userinfo
        rooms[tunnelInfo.tunnelId] = {
          question_options: null,
          library: null
        }
        console.log('[tunnelSingle][get][tunnelInfo]',tunnelInfo)
        ctx.state.data = tunnelInfo
    },

    // 信道将信息传输过来的时候
    post: async ctx => {
        const packet = await tunnel.onTunnelMessage(ctx.request.body)

        debug('Tunnel recive a package: %o', packet)

        switch (packet.type) {
            case 'connect':
                onConnect(packet.tunnelId)
                break
            case 'message':
                onMessage(packet.tunnelId, packet.content.messageType, packet.content.messageContent)
                break
            case 'close':
                onClose(packet.tunnelId)
                break
        }
    }

}
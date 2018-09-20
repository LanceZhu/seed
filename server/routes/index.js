/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'   // 定义所有路由的前缀都已 /weapp 开头
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口 /weapp/login
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态） /weapp/user
router.get('/user', validationMiddleware, controllers.user)

// --- 信道服务接口 Game --- //
// GET  用来响应请求信道地址的 /weapp/tunnel
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 信道服务接口 Game --- //
// GET  用来响应请求信道地址的 /weapp/tunnel
router.get('/tunnelGame', controllers.tunnelGame.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnelGame', controllers.tunnelGame.post)

// --- 信道服务接口 Single --- //
// GET  用来响应请求信道地址的 /weapp/tunnel
router.get('/tunnelSingle', controllers.tunnelSingle.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnelSingle', controllers.tunnelSingle.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求 /weapp/message
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

//请求题目分类
router.get('/question_sort', validationMiddleware, controllers.question_sort)

//请求历史题目
router.get('/question_history', validationMiddleware, controllers.question_history)
router.post('/question_history', validationMiddleware, controllers.question_history)

//签到
router.get('/signin', validationMiddleware, controllers.signin)
router.post('/signin', validationMiddleware, controllers.signin)

//反馈
router.get('/feedback', validationMiddleware, controllers.feedback)
router.post('/feedback', validationMiddleware, controllers.feedback)

//请求随机题目
router.get('/questions_random', validationMiddleware, controllers.questions_random)

//信道服务接口 随机题目
router.get('/tunnel_question_random', controllers.tunnel_question_random.get)
router.post('/tunnel_question_random', controllers.tunnel_question_random.post)

//根据分类请求题目
router.get('/question_by_sort', validationMiddleware, controllers.question_by_sort)
router.post('/question_by_sort', validationMiddleware, controllers.question_by_sort)

//请求指定题目 id
router.get('/question_by_id', validationMiddleware, controllers.question_by_id)
router.post('/question_by_id', validationMiddleware, controllers.question_by_id)

//收藏错题 id
router.get('/question_mark', validationMiddleware, controllers.question_mark)
router.post('/question_mark', validationMiddleware, controllers.question_mark)

//获取好友用户关系表(排行榜)
router.get('/getRankFriendsData', validationMiddleware, controllers.getRankFriendsData)

//获取全球用户关系表(排行榜)
router.get('/getRankGlobalData', validationMiddleware, controllers.getRankGlobalData)

//获取群GId
router.get('/getGId',validationMiddleware,controllers.getGId)

//存储UserNetwork
router.get('/storeUserNetwork',validationMiddleware,controllers.storeUserNetwork)

//存储FriendsNetwork
router.get('/storeFriendsNetwork', validationMiddleware, controllers.storeFriendsNetwork)

//更新UserNetwork中的分享信息
router.get('/updateShareInfoToUserNetwork', validationMiddleware, controllers.updateShareInfoToUserNetwork)

//更新UserNetwork中的ClickId信息
router.get('/updateUserNetworkFromClickId', validationMiddleware, controllers.updateUserNetworkFromClickId)

module.exports = router
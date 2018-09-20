// 此处主机域名修改成腾讯云解决方案分配的域名
//var host = 'https://468101369.f00bar.cn';
var host = "yourdominname";

var appId = ''

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        appId,

        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 测试的信道服务地址
        tunnel: `${host}/weapp/tunnel`,

        // 双人PK的信道服务地址
        tunnelGame: `${host}/weapp/tunnelGame`,

        //Single 专属题场 信道服务
        tunnelSingle: `${host}/weapp/tunnelSingle`,

        // 上传图片接口
        uploadUrl: `${host}/weapp/upload`
    }
};

module.exports = config;
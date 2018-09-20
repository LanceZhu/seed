var qcloud = require('../../vendor/wafer2-client-sdk/index.js')
var util = require('../../utils/util.js')
var config = require('../../config.js')
var app = getApp()
var timerCountdown = ''
Page({
  data: {
    question: '', //信道服务请求
    ask: {},
    question_counts: 0,
    question_options: {},
    countdown: 0,
    answerColor: '',
    clickIndex: '',
    localClick: false,
    winWidth: 0,
    winHeight: 0,
    ratio: 0,
    chapters: [
      { chapter: "Arduino语言介绍", chapterId: 1, checked: 0 },
      { chapter: "变量", chapterId: 2, checked: 0 },
      { chapter: "运算符", chapterId: 3,checked: 0 },
      { chapter: "控制语句", chapterId: 4,checked: 0 },
      { chapter: "数组", chapterId: 5, checked: 0 },
      { chapter: "函数（一）", chapterId: 6, checked: 0 },
      { chapter: "函数（二）", chapterId: 7,checked: 0 },
      { chapter: "指针", chapterId: 8, checked: 0 },
      { chapter: "类和对象", chapterId: 9, checked: 0 },
    ],
    chapters_chosen: false,
    recommendationDone: false
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: options.title
    });
    that.setData({
      winHeight: wx.getStorageSync('winHeight'),
      winWidth: wx.getStorageSync('winWidth'),
      ratio: wx.getStorageSync('ratio')
    })
    if(options.fromBasicDetail){
      that.setData({
        chapters_chosen: true,
        question_counts: options.question_counts,
        question_options: {
          'chapterId': options.chapterId,
          'unitId': options.nameId,
          'counts': options.question_counts
        }
      })
      that.connect()
    }
  },

  onReady: function () {
  },
  onShow: function () {
    this.setData({
      countdown: 0
    })
    if(app.tunnel && app.tunnel.isActive()){
      app.tunnel.close()
    }
  },
  onHide: function () {
    clearInterval(timerCountdown)
  },
  onUnload: function () {
    this.quit()
    clearInterval(timerCountdown)
  },
  onShareAppMessage: function () {
    return {
      title: "碎片时间学编程",
      path: "/pages/main/main"
    };
  },

  connect() {
    wx.showLoading({
      title: '加载中...'
    })
    var that =this
    that.quit()

    var tunnel = that.tunnel = new qcloud.Tunnel(config.service.tunnelSingle)
    tunnel.on('connect', () => { console.log('信道连接成功')})
    tunnel.on('close', () => { console.log('信道关闭')})
    tunnel.on('reconnecting', () => console.log('信道断开连接，正在重连'))
    tunnel.on('reconnect', () => console.log('信道重连成功'))
    tunnel.on('error', () => console.log('信道连接发生错误'))
    tunnel.on('connected',(res) => {
      tunnel.emit('ask', that.data.question_options)
      wx.hideLoading()
    })
    //监听服务器端发送过来的问题
    tunnel.on('sendQuestion', (res) => {
      console.log('收到题目',res)
      let question = res.question
      if (Object.getOwnPropertyNames(question).length) {
        question.answer = JSON.parse(question.answer)//将答案转换为js对象
        var ask = app.towxml.toJson(question.ask, 'markdown', that)
        ask.theme = 'min'
        that.setData({
          ask: ask
        })
        //错题解析使用
        var right_answer = ''
        for (let i = 0; i < question.answer.length; i++) {
          if (question.answer[i].right == 1) {
            right_answer = question.answer[i].answer
          }
        }
        wx.setStorage({
          key: 'last_question',
          data: question,
        })
      }
      if (Object.getOwnPropertyNames(question).length) {
        that.setData({
          question
        })
        //错题解析
        wx.setStorage({
          key: 'ask',
          data: ask,
        })
        wx.setStorage({
          key: 'analysis',
          data: question.analysis,
        })
        wx.setStorage({
          key: 'right_answer',
          data: right_answer,
        })
        that.reset()//运行重置函数
      } else {
        util.showSuccess('已无推荐题目')
        that.setData({
          recommendationDone: true
        })
        console.log('已无推荐题目')
        that.tunnel.close()
      }

    })

    //信道连接
    tunnel.open()
  },

  //定义重置函数
  reset: function () {
    var that = this
    clearInterval(timerCountdown)
    that.setData({
      countdown: 0,
      localClick: false
    })
    timerCountdown = setInterval(function () {
      let countdown = that.data.countdown
      countdown++
      that.setData({
        countdown
      })
    }, 1000)
  },

  /**
   * 提交问题
   * e 答题情况
   */
  answer: function (e) {
    var that = this;
    if (that.tunnel.isClosed()) {
      util.showSuccess('已无推荐题目！')
    }
    if(!that.data.localClick){
      if (e.currentTarget.dataset.right) {
        that.setData({
          answerColor: 'right', 
          clickIndex: e.currentTarget.dataset.index
        });
        setTimeout(function(){
          that.sendAnswer(that,true)
        },1000)
      } else {
        that.setData({
          answerColor: 'error',
          clickIndex: e.currentTarget.dataset.index
        });
        setTimeout(function () {
          that.sendAnswer(that, false)
          wx.navigateTo({
            url: './tutorial/tutorial?id='+that.data.question.id+'&chapter_id='+that.data.chapter_id+'&unit_id='+that.data.unit_id
          })
        }, 1000)
      };
      that.setData({
        localClick: true
      });
    };
  },

  //退出专属题场
  quit() {
    if (this.tunnel && this.tunnel.isActive()) {
      this.tunnel.close();
      console.log('信道关闭')
    }
  },

//提交请求
  sendAnswer: function(that,right){
    var date = new Date()
    console.log(util.formatTime(date))
    that.tunnel.emit('answer',{
      id: that.data.question.id,
      chapterId: that.data.question.chapter_id,
      unitId: that.data.question.unit_id,
      time: that.data.countdown,
      datetime: util.formatTime(date),
      right: right,
      ask: that.data.question.ask
    })
    that.setData({
      answerColor: '',
      clickIndex: '',
      localClick: false,
    })
  },

  checkboxChange: function(e){
    var values = e.detail.value;
    var chapters = this.data.chapters;
    console.log('[选项]',values)
    for (var i = 0; i < chapters.length; i++) {
      chapters[i].checked = false;
      for (var j = 0; j < values.length; j++) {
        if (chapters[i].chapter == values[j]) {
          chapters[i].checked = true;
        }
      }
    }

    this.setData({
      chapters: chapters,
    })
  },

  chapter_submit: function(){
    var that = this
    that.setData({
      chapters_chosen: true
    })
    var chapter
    var chapter_chosen = []
    for(chapter in that.data.chapters){
      if(that.data.chapters[chapter].checked){
        chapter_chosen.push(that.data.chapters[chapter].chapterId)
      }
    }
    if(chapter_chosen.length == 0){
      chapter_chosen = [1,2,3,4,5,6,7,8,9]
    }
    console.log(chapter_chosen)
    that.setData({
      question_options: {
        'chapterId': chapter_chosen,
        'unitId': false,
        'counts': false
      }
    })
    that.connect()
  }
})
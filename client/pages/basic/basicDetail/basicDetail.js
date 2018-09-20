let qcloud = require('../../../vendor/wafer2-client-sdk/index')
let config = require('../../../config')
let util = require('../../../utils/util.js')
let app = getApp()

Page({
  data: {
    items: '',
    article: {},
    chapter: '',
    name: '',
    chapterId: '',
    nameId: '',
    isLoading: true
  },

  continue: function(){
    wx.navigateTo({
      url: '../../single/single' + '?chapterId=' + this.data.chapterId + '&nameId=' + this.data.nameId + '&title=小结'+'&question_counts=3'+'&fromBasicDetail=true',
    })
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this;
    that.setData({
      chapter: options.chapter,
      name: options.name ,
      chapterId: options.chapterId,
      nameId: options.nameId
    })
    //根据分类选取题目
    qcloud.request({
      login: true,
      url: `${app.appData.baseUrl}question_by_sort`,
      method: 'POST',
      data: { name: options.name,
              chapter: options.chapter
            },
      success: (res) => {
        if (res.data.data.length != 0){
          //服务端解析md，加快响应速度
          //var articleData = app.towxml.toJson(res.data.data[0].content, 'markdown', that);
          var articleData = res.data.data
        }else{
          var articleData = app.towxml.toJson("还没有内容哦~", 'markdown', that);
        }
        articleData.theme = 'light';

        this.setData({
          article: articleData,
          isLoading: false
        })
      },
      fail(error) {
        util.showSuccess('请求失败!');
        console.log('request fail', error);
      },
      complete: res => {
        wx.hideLoading()
      }
    });
  },
  onShareAppMessage: function () {
    return {
      title: "碎片时间学编程",
      path: "/pages/main/main"
    };
  }
})
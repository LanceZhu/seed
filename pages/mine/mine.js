// pages/main/main.js

// 引入 QCloud 小程序增强 SDK
var qcloud = require('../../utils/wafer-client-sdk/index');

// 引入配置
var config = require('../../config');

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
});

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
});

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  });
};

Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: {
      'user': {'avataUrl': '', 'name': 'f00bar', 'id': '001'}},
      
    winWidth: 0,
    winHeight: 0,
    userInfo: {},
    mine: {},
    preMonth: "<",
    nextMonth: ">",
    month: 7,
    year: 2018,
    days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    calendars: [{ 'date': 1 }, { 'date': 2 }, { 'date': 3 }, { 'date': 4 }, { 'date': 5 }, { 'date': 6},
    ],

  },

  navigateToDetail: function (e) {
    console.log(e.currentTarget.dataset.desc);
    var urlName = e.currentTarget.dataset.desc;
    wx.navigateTo({
      url: '../' + urlName + '/' + urlName,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    /** 
    * 获取系统信息 
    */
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    app.jscode2session(res => {
      var nowDate = new Date();//当前日期
      this.initCalendar(nowDate);//加载日历
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var userInfo = wx.getStorageSync('userInfo');
    console.log('[userInfo]');
    console.log(userInfo);
    if(userInfo){
      that.setData({
        userInfo: userInfo
      })
    };
    var mine = wx.getStorageSync('mine');
    if(mine){
      that.setData({
        mine: mine
      });
      console.log(mine);
    }else{
      qcloud.request({
        // 要请求的地址
        url: 'http://localhost:3000/mine',

        // 请求之前是否登陆，如果该项指定为 true，会在请求之前进行登录
        login: true,

        success(result) {
          showSuccess('请求成功完成');
          console.log('request success', result);
          that.setData({
            mine: result.data[0]
          });
          wx.setStorageSync('mine', result.data[0]);
          console.log(result.data[0]);
        },

        fail(error) {
          showModel('请求失败', error);
          console.log('request fail', error);
        },

        complete() {
          console.log('request complete');
        }
      });
    }
  },

  /**
     * 初始化日历，
     * signDates ： 已经签到的日期，一般在月份切换的时候从后台获取日期，
     * 然后在获取日历数据时，进行数据比对处理；
     * */
  initCalendar: function (paramDate, signDates) {

    //从服务器端获取signDates
    var paramMonth = paramDate.getMonth();
    if (paramMonth + 1 > 12) {//后台保存的月份数据是 1-12
      paramMonth = 1;
    } else {
      paramMonth += 1;
    }
    var paramYear = paramDate.getFullYear();
    wx.request({
      url: app.HTTP_SERVER + 'xcx/rest/getSignDates.htm',
      data: {
        openid: app.globalData.openid,
        year: paramYear,
        month: paramMonth
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        //后台返回的日期
        var signDates = res.data;

        //当前年月日
        var now = new Date();//当前时间
        var nowMonth = now.getMonth();
        var nowYear = now.getFullYear();

        var showSign = false;//是否显示签到按钮
        if (nowMonth === paramDate.getMonth()
          && nowYear === paramDate.getFullYear()) {
          showSign = true;
        }

        //未来签到日期设置为空
        if (nowMonth < paramDate.getMonth()
          && nowYear <= paramDate.getFullYear()) {
          signDates = [];
        }

        //星期
        var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        //签到日历数据的生成
        var calendars = Calendar.getSignCalendar(paramDate, signDates);

        this.setData({
          signDates: signDates,
          year: paramDate.getFullYear(),
          month: paramDate.getMonth() + 1,
          calendars: calendars,
          days: days,
          preMonth: "<",   
          nextMonth: ">",
          showSign: showSign
        });
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },

  //上个月
  preMonth: function () {
    var dataYear = this.data.year;
    var dataMonth = this.data.month - 2;//月是从0开始的
    var paramDate = Calendar.parseDate(dataYear, dataMonth);
    this.initCalendar(paramDate);
  },

  //下个月
  nextMonth: function () {
    var dataYear = this.data.year;
    var dataMonth = this.data.month;
    var paramDate = Calendar.parseDate(dataYear, dataMonth);
    this.initCalendar(paramDate);
  },

  //签到
  doSign: function () {
    // 调用服务器端，实现签到入库
    wx.request({
      url: app.HTTP_SERVER + 'xcx/rest/doSign.htm',
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        // 签到成功给出提示
        wx.showToast({
          title: '签到成功',
          icon: 'success',
          duration: 2000
        })
        //刷新日历
        var now = new Date();//当前时间
        this.initCalendar(now);
      },
      fail: function (res) {
        console.log(res);
      }
    });

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }


})
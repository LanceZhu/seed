import initCalendar, { getSelectedDay, setTodoLabels } from '../../../template/calendar/index';
let qcloud = require('../../../vendor/wafer2-client-sdk/index')
let config = require('../../../config')
let util = require('../../../utils/util.js')
let app = getApp()

Page({
 data: {
   initCalendarDone: false,
   signinDone: false,
   signinDays: []
 },

  signin: function () {
    var that = this
    let date = new Date()
    if (!that.data.signinDone) {
      qcloud.request({
        login: true,
        url: `${app.appData.baseUrl}signin`,
        method: 'POST',
        data: {
          date: util.formatDate(date)
        },
        success: res => {
          console.log('[signin][success]', res)
          that.setData({
            signinDone: true
          })
          let data = that.data.signinDays
          data.push({
            year: String(date.getFullYear()),
            month: String(date.getMonth() + 1),
            day: String(date.getDate())
          })
          setTodoLabels({
            pos: 'bottom',
            dotColor: '#40',
            days: data,
          })
          that.setData({
            signinDays: data 
          })
          util.showSuccess('签到成功！')
        },
        fail: err => {
          console.log('[signin][fail]', err)
          util.showSuccess('签到失败！')
        },
        complete: res => {
        }
      })
    }else{
      util.showSuccess('已签到~')
    }
  },

  onShow: function () {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    initCalendar({
      multi: false, // 是否开启多选,
      // disablePastDay: true, // 是否禁选过去日期
      // defaultDay: '2018-8-8', // 初始化日历时指定默认选中日期，如：'2018-3-6' 或 '2018-03-06'
      /**
       * 选择日期后执行的事件
       * @param { object } currentSelect 当前点击的日期
       * @param { array } allSelectedDays 选择的所有日期（当mulit为true时，才有allSelectedDays参数）
       */
      afterTapDay: (currentSelect, allSelectedDays) => {
        console.log('===============================');
        console.log('当前点击的日期', currentSelect);
        console.log('当前点击的日期是否有事件标记: ', currentSelect.hasTodo || false);
        allSelectedDays && console.log('选择的所有日期', allSelectedDays);
        console.log('getSelectedDay方法', getSelectedDay());
      },
      /**
       * 日期点击事件（此事件会完全接管点击事件）
       * @param { object } currentSelect 当前点击的日期
       * @param { object } event 日期点击事件对象
       */
      // onTapDay(currentSelect, event) {
      //   console.log(currentSelect);
      //   console.log(event);
      // },
      /**
       * 日历初次渲染完成后触发事件，如设置事件标记
       */
      afterCalendarRender() {
        const data = []
        qcloud.request({
          login: true,
          url: `${app.appData.baseUrl}signin`,
          method: 'POST',
          data: {
            all: true
          },
          success: res => {
            let currentDate = new Date()
            for (let i = 0; i < res.data.data.length; i++) {
              let date = new Date(res.data.data[i].date)
              data.push({
                year: String(date.getFullYear()),
                month: String(date.getMonth() + 1),
                day: String(date.getDate())
              })
              if (currentDate.getFullYear() == date.getFullYear() && currentDate.getMonth() == date.getMonth() && currentDate.getDate() == date.getDate()) {
                that.setData({
                  signinDone: true
                })
              }
            }
            setTodoLabels({
              pos: 'bottom',
              dotColor: '#40',
              days: data,
            });
            that.setData({
              signinDays: data
            })
          },
          fail: err => {
            console.log('[getAllSigninDays][fail]', err)
          },
          complete: res => {
            that.setData({
              initCalendarDone: true
            })
            wx.hideLoading()
          }
        })
      },
    });
  }
});
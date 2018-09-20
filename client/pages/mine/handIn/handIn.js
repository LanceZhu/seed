Page({
  data: {
    text: '',
  },
 
  listenerInput: function (e) {
    this.data.text = e.detail.value;
  },
  listenerLogin: function () {

  },

  onLoad: function (options) {},
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onShareAppMessage: function () {
    return {
      title: "碎片时间学编程",
      path: "/pages/main/main"
    };
  }
})
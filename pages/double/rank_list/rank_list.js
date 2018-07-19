Page({
  data: {
    currentTab: 0,
    friendsData: [{'avatarUrl':'/images/icons/naruto.jpg','nickName':'f00bar','city':'北京','score':'999'},
      { 'avatarUrl': '/images/icons/naruto.jpg', 'nickName': 'f00bar', 'city': '北京', 'score': '999' },
      { 'avatarUrl': '/images/icons/naruto.jpg', 'nickName': 'f00bar', 'city': '北京', 'score': '999' },
      { 'avatarUrl': '/images/icons/naruto.jpg', 'nickName': 'f00bar', 'city': '北京', 'score': '999' },],
    globalData: [{ 'avatarUrl': '/images/icons/favicon-64.svg', 'nickName': 'f00bar', 'city': '北京', 'score': '999' },
      { 'avatarUrl': '/images/icons/favicon-64.svg', 'nickName': 'f00bar', 'city': '北京', 'score': '999' },
      { 'avatarUrl': '/images/icons/favicon-64.svg', 'nickName': 'f00bar', 'city': '北京', 'score': '999' },
      { 'avatarUrl': '/images/icons/favicon-64.svg', 'nickName': 'f00bar', 'city': '北京', 'score': '999' },],
    loadNumber: 0//全球排名数据加载次数
  },
  onLoad: function (opt) {
    wx.showShareMenu({
      withShareTicket: true
    })
    this.getRankGlobalData();
  },
  onShow() {
    this.getRankFriendsData();
  },
  onReachBottom: function () {//下拉加载
    const that = this
    if (that.data.currentTab) {
      that.getRankGlobalData()
    }
  },

  getRankGlobalData() {//加载全球排名的数据
    const that = this;
  },

  getRankFriendsData: function () {
    const that = this;
  },
  swichNav(e) {
    var that = this;
    that.setData({
      currentTab: e.target.dataset.current,
    })
  },
})
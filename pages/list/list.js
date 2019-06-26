// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [
       '../../images/1.png',
       '../../images/next.png',
       '../../images/o.png',
       '../../images/x.png'
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onAddImage: function () {
      let _this = this;
      let imgList = this.data.imgList;
      wx.chooseImage({
        success: (res) => {
          console.log(res.tempFilePaths)
          let newImg = res.tempFilePaths;
          imgList.unshift(...newImg)
          console.log(imgList)
          _this.setData({
            imgList: imgList
          })
        }
      })
  },

  chooseImg (e) {
    let idx = e.target.dataset.index;
    let imgUrl = this.data.imgList[idx]
    // console.log(imgUrl)
    wx.navigateTo({
      url: '/pages/index/index?imgUrl=' + imgUrl,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
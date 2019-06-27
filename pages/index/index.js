import CanvasDrag from '../../components/canvas-drag/canvas-drag';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    graph: {},
    width: '',
    height: '',
    camera: '../../images/shexiang.png',
    top: 20,
    left: 240,
    cameraW: 80,
    cameraH: 200,
    addImgList: [],
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {}, //
    delIndex: '',
    leftList: ['选项1','选项2'],
    list: ['选择图层','上传图片', '选择素材','添加文字'],
    activeIndex: 0,
    activeIndex2: 0,
    text: '',
    canvasList: [],
    bgImg: '../../images/phone.png',
    fontList: [{
        text: '字体1',
        fontFamily: 'Courier'
      },
      {
        text: '字体2',
        fontFamily: 'Tahoma'
      },
      {
        text: '字体3',
        fontFamily: 'inherit'
      },
      {
        text: '字体4',
        fontFamily: 'Cambria'
      }
    ],
    colorList: [{}]
  },
  onLoad(options) {
    wx.setStorageSync('canvasList', '')
    // 页面渲染完成  
    var _this = this;
    wx.getImageInfo({
      src: '../../images/phone.png',
      success: function(res) {
        // console.log(res)
        if (options.imgUrl){
          wx.getImageInfo({
            src: options.imgUrl,
            success (res2) {
              // console.log(res2)
              let height = res2.height
              let width = res2.width
              let json = {}
              json.url = options.imgUrl;
              _this.data.addImgList.unshift(json);
              // console.log(addImgList)
              _this.setData({
                width: res.width * 2,
                height: res.height * 2,
                graph: {
                  w: width,
                  h: height,
                  type: 'image',
                  url: options.imgUrl,
                },
                addImgList: _this.data.addImgList
              })
            }
          })
        }
      }
    })
  },
  onReady() {
    CanvasDrag.changeBgImage(this.data.bgImg);
  },
  /**
   * 添加图片
   */
  onAddImage() {
    let _this = this;
    wx.chooseImage({
      success: (res) => {
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success(res2) {
            let height = res2.height
            let width = res2.width
            _this.setData({
              graph: {
                w: width,
                h: height,
                type: 'image',
                url: res.tempFilePaths[0],
              }
            });
            CanvasDrag.exportJson()
              .then((imgArr) => {
                let addImgList = []
                for (let item of imgArr) {
                  if (item.type === 'image') {
                    addImgList.unshift(item)
                  }
                }
                _this.setData({
                  addImgList: addImgList,
                })
              })
              .catch((e) => {
                console.error(e);
              });  
          }
        })
        }
    })
    _this.hideModal();
  },
  /**
   * 导出图片
   */
  onExport() {
    CanvasDrag.export()
      .then((filePath) => {
        console.log(filePath);
        wx.previewImage({
          urls: [filePath]
        })
      })
      .catch((e) => {
        console.error(e);
      })

    CanvasDrag.exportJson()
      .then((imgArr) => {
        console.log(imgArr);
      })
      .catch((e) => {
        console.error(e);
      });
  },
  getText(e) {
    let _this = this;
    _this.setData({
      text: e.detail.value
    })
  },
  onAddText() {
    let text = this.data.text;
    this.setData({
      graph: {
        type: 'text',
        text: text,
      }
    });
  },
  delImg(e) {
    var that = this;
    //获取下标
    var idx = e.target.dataset.index;
    that.data.addImgList.splice(idx, 1)
    CanvasDrag.delItem(idx)
    // console.log(that.data.addImgList)
    that.setData({
      addImgList: that.data.addImgList,
    })
  },
  changeFont(e) {
    const font = e.target.dataset.font;
    CanvasDrag.changFont(font)
  },
  tabClick(e) {
    var that = this;
    var idx = e.target.dataset.index;
    that.setData({
      activeIndex: idx
    })
  },
  tabClick2(e) {
    var that = this;
    var idx = e.target.dataset.index;
    CanvasDrag.exportJson()
      .then((imgArr) => {
      let json = {};
      json.id = that.data.activeIndex2;
      imgArr.unshift(json)
      let canvasList = that.data.canvasList
      if (canvasList != []){
        if (canvasList.findIndex((element) => (element[0].id === that.data.activeIndex2))){
          canvasList.splice(that.data.activeIndex2, 1, imgArr)
        } 
      } else {
        canvasList.push(imgArr)
      }
      console.log(canvasList);
      wx.setStorageSync('canvasList', '')

      // that.setData({
      //   activeIndex2: idx
      // })
    })
    .catch((e) => {
      console.error(e);
    });
  },
  // 显示遮罩层
  showModal: function() {
    var that = this;
    that.setData({
      hideModal: false
    })
    var animation = wx.createAnimation({
      duration: 600, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    setTimeout(function() {
      that.fadeIn(); //调用显示动画
    }, 200)
  },

  // 隐藏遮罩层
  hideModal: function() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 800, //动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown(); //调用隐藏动画   
    setTimeout(function() {
      that.setData({
        hideModal: true
      })
    }, 720) //先执行下滑动画，再隐藏模块

  },

  //动画集
  fadeIn: function() {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export() //动画实例的export方法导出动画数据传递给组件的animation属性
    })
  },
  fadeDown: function() {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },
  toList: function () {
    this.hideModal();
    wx.navigateTo({
      url: '../list/list',
    })
  },
  longTap () {
    console.log('长按')
  }
})
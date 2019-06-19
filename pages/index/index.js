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
    left: 20,
    cameraW: 80,
    cameraH: 200,
    addImgList: [],
    currentIndex: 0,
    "firstList": ["LXT", "LXT", "LXT", "LXT", "LXT", "LXT"],
    "secondList": ["GFF", "GFF", "GFF", "GFF", "GFF", "GFF", "GFF", "GFF"]
  },
  onLoad() {
    // 页面渲染完成  
    var _this = this;
    wx.getImageInfo({
      src: '../../images/phone.png',
      success: function(res) {
        console.log(res)
        _this.setData({
          width: res.width * 2,
          height: res.height * 2,
        })
      }
    })
  },
  onReady() {
    CanvasDrag.changeBgImage('../../images/phone.png');
  },
  /**
   * 添加图片
   */
  onAddImage() {
    let _this = this;
    wx.chooseImage({
      success: (res) => {
        this.setData({
          graph: {
            w: 200,
            h: 200,
            type: 'image',
            url: res.tempFilePaths[0],
          }
        });
        CanvasDrag.exportJson()
          .then((imgArr) => {
            let addImgList = imgArr.slice(1)
            _this.setData({
              addImgList: addImgList
            })
          })
          .catch((e) => {
            console.error(e);
          });
      }
    })
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
  //swiper切换时会调用
  pagechange: function(e) {
    if ("touch" === e.detail.source) {
      let currentPageIndex = this.data.currentIndex
      currentPageIndex = (currentPageIndex + 1) % 2
      this.setData({
        currentIndex: currentPageIndex
      })
    }
  },
  //用户点击tab时调用
  titleClick: function(e) {
    let currentPageIndex =
      this.setData({
        //拿到当前索引并动态改变
        currentIndex: e.currentTarget.dataset.idx
      })
  }
})
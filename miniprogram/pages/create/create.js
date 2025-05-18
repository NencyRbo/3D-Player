Page({
  data: {
    creationType: 'image', // 默认创作类型
    selectedStyle: 'realistic', // 默认风格
    description: '', // 创作描述
    referenceImage: '', // 参考图片
    creationHistory: [
      // 模拟历史创作数据
      {
        id: 1,
        thumbnail: '/images/creation1.jpg',
        date: '2023-08-15'
      },
      {
        id: 2,
        thumbnail: '/images/creation2.jpg',
        date: '2023-08-10'
      },
      {
        id: 3,
        thumbnail: '/images/creation3.jpg',
        date: '2023-08-05'
      }
    ]
  },

  onLoad: function(options) {
    // 如果有传递创作类型，设置默认类型
    if (options.type) {
      this.setData({
        creationType: options.type
      });
    }
  },

  // 切换创作类型
  switchType: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      creationType: type
    });
  },

  // 选择风格
  selectStyle: function(e) {
    const style = e.currentTarget.dataset.style;
    this.setData({
      selectedStyle: style
    });
  },

  // 更新创作描述
  onDescriptionInput: function(e) {
    this.setData({
      description: e.detail.value
    });
  },

  // 上传参考图片
  uploadReference: function() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({
          referenceImage: tempFilePath
        });
      }
    });
  },

  // 开始创作
  startCreation: function() {
    if (!this.data.description.trim()) {
      wx.showToast({
        title: '请输入创作描述',
        icon: 'none'
      });
      return;
    }

    // 显示加载
    wx.showLoading({
      title: '创作中...',
      mask: true
    });

    // 模拟创作过程
    setTimeout(() => {
      wx.hideLoading();
      
      // 根据不同创作类型处理逻辑
      if (this.data.creationType === 'image') {
        wx.navigateTo({
          url: '/pages/index/index?mode=preview&style=' + this.data.selectedStyle
        });
      } else if (this.data.creationType === 'video') {
        wx.showToast({
          title: '视频增强功能即将推出',
          icon: 'none'
        });
      } else if (this.data.creationType === '3d') {
        wx.showToast({
          title: '3D效果优化功能即将推出',
          icon: 'none'
        });
      }
    }, 2000);
  },

  // 预览历史创作
  previewCreation: function(e) {
    const id = e.currentTarget.dataset.id;
    // 跳转到预览页面
    wx.navigateTo({
      url: '/pages/preview/preview?id=' + id
    });
  },

  // 导航功能
  navigateToHome: function() {
    wx.navigateTo({
      url: '/pages/home/home'
    });
  },

  navigateToVideo: function() {
    wx.navigateTo({
      url: '/pages/video/video'
    });
  },

  navigateToProfile: function() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  }
}); 
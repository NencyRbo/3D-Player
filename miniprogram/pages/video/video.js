// video.js
Page({
  data: {
    currentCategory: 'all',
    videos: [
      {
        id: 1,
        title: '如何制作3D全息投影展示',
        thumbnail: '/images/video1.jpg',
        duration: '08:45',
        is3D: true
      },
      {
        id: 2,
        title: '电影《星际穿越》3D特效解析',
        thumbnail: '/images/video2.jpg',
        duration: '12:30',
        is3D: true
      },
      {
        id: 3,
        title: '使用AR增强现实技术的应用案例',
        thumbnail: '/images/video3.jpg',
        duration: '05:15',
        is3D: false
      },
      {
        id: 4,
        title: '体验VR世界的新方式',
        thumbnail: '/images/video4.jpg',
        duration: '07:20',
        is3D: true
      },
      {
        id: 5,
        title: 'AI生成3D模型教程',
        thumbnail: '/images/video5.jpg',
        duration: '10:50',
        is3D: true
      },
      {
        id: 6,
        title: '演示文稿的全息投影设计',
        thumbnail: '/images/video6.jpg',
        duration: '06:25',
        is3D: true
      }
    ]
  },

  onLoad: function(options) {
    // 可以根据options接收首页传递的参数
  },

  // 切换分类
  switchCategory: function(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category
    });
    // 这里可以根据分类加载不同的视频列表
  },

  // 播放视频
  playVideo: function(e) {
    const videoId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/player/player?id=${videoId}`
    });
  },

  // 搜索视频
  onSearch: function(e) {
    const keyword = e.detail.value;
    // 这里可以实现搜索逻辑
    console.log('搜索关键词:', keyword);
  },

  // 上传视频
  uploadVideo: function() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['video'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        // 处理上传逻辑
        console.log('选择的视频:', tempFilePath);
        wx.navigateTo({
          url: '/pages/upload/upload?path=' + tempFilePath
        });
      }
    });
  },
  
  // 导航功能
  navigateToHome: function() {
    wx.navigateTo({
      url: '/pages/home/home'
    });
  },

  navigateToCreate: function() {
    wx.navigateTo({
      url: '/pages/create/create'
    });
  },

  navigateToProfile: function() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  }
}); 
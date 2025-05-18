// pages/home/home.js
Page({
  data: {
    mainContentVisible: false,
    loadingComplete: false,
    currentYear: new Date().getFullYear(),
    particles: [],
    showRipple: false,  // 按钮水波纹效果
    activeCardIndex: -1, // 当前活跃卡片
    fadeInAnimation: {},
    slideUpAnimation: {},
    pulseAnimation: {},
    recommendVideos: [
      { id: 1, title: '3D效果展示视频', thumbnail: '/images/video1.png' },
      { id: 2, title: '全息投影技术演示', thumbnail: '/images/video2.png' },
      { id: 3, title: '虚拟现实体验', thumbnail: '/images/video3.png' }
    ],
    recentVideos: [
      { id: 1, title: '上次观看的视频', thumbnail: '/images/recent1.png', duration: '05:30' },
      { id: 2, title: '之前的视频', thumbnail: '/images/recent2.png', duration: '03:45' },
      { id: 3, title: '看过的视频', thumbnail: '/images/recent3.png', duration: '08:12' }
    ]
  },
  
  onLoad: function() {
    // 生成粒子
    this.generateParticles();
    
    // 设置主内容区域动画
    setTimeout(() => {
      this.setData({
        mainContentVisible: true
      });
    }, 300);
    
    // 设置加载完成状态
    setTimeout(() => {
      this.setData({
        loadingComplete: true
      });
    }, 1000);
    
    // 初始化动画
    this.initAnimations();
  },
  
  // 初始化动画
  initAnimations: function() {
    // 淡入动画
    const fadeIn = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease-out',
    });
    fadeIn.opacity(1).step();
    
    // 上滑动画
    const slideUp = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease-out',
    });
    slideUp.translateY(0).opacity(1).step();
    
    // 脉冲动画
    const pulse = wx.createAnimation({
      duration: 1500,
      timingFunction: 'ease-in-out',
    });
    pulse.scale(1.05).step(750);
    pulse.scale(1).step(750);
    
    this.setData({
      fadeInAnimation: fadeIn.export(),
      slideUpAnimation: slideUp.export(),
      pulseAnimation: pulse.export()
    });
    
    // 设置脉冲动画循环
    setInterval(() => {
      const pulse = wx.createAnimation({
        duration: 1500,
        timingFunction: 'ease-in-out',
      });
      pulse.scale(1.05).step(750);
      pulse.scale(1).step(750);
      
      this.setData({
        pulseAnimation: pulse.export()
      });
    }, 3000);
  },
  
  // 生成随机浮动粒子
  generateParticles: function() {
    const particles = [];
    const count = 15; // 粒子数量
    
    for (let i = 0; i < count; i++) {
      particles.push({
        id: i,
        class: Math.random() > 0.7 ? 'large' : Math.random() > 0.4 ? 'medium' : 'small',
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.floor(Math.random() * 20 + 10) + 'rpx'
      });
    }
    
    this.setData({
      particles: particles
    });
  },
  
  // 显示按钮水波纹效果
  showButtonRipple: function() {
    this.setData({ showRipple: true });
    
    setTimeout(() => {
      this.setData({ showRipple: false });
    }, 600);
  },
  
  // 设置活跃卡片
  setActiveCard: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeCardIndex: index
    });
  },
  
  // 重置活跃卡片
  resetActiveCard: function() {
    this.setData({
      activeCardIndex: -1
    });
  },
  
  // 导航到主功能页面，添加水波纹效果
  navigateToIndex: function() {
    this.showButtonRipple();
    
    // 短暂延迟，让水波纹效果可见
    setTimeout(() => {
      wx.navigateTo({
        url: '../index/index',
        fail: (err) => {
          console.error('导航失败:', err);
          wx.showToast({
            title: '页面导航失败',
            icon: 'none'
          });
        }
      });
    }, 200);
  },
  
  // 导航到首页
  navigateToHome: function() {
    // 已在首页，不需要跳转
    wx.showToast({
      title: '当前已在首页',
      icon: 'none',
      duration: 1500
    });
  },
  
  // 导航到帮助页面
  navigateToHelp: function() {
    wx.showModal({
      title: '使用帮助',
      content: '1. 点击"立即使用"进入图片生成页面\n2. 输入对图片的描述\n3. 点击"生成图像"按钮\n4. 等待图片生成完成后可保存或分享',
      showCancel: false
    });
  },
  
  // 导航到关于页面
  navigateToAbout: function() {
    wx.showModal({
      title: '关于我们',
      content: '图片处理工具是一款基于人工智能技术的图片处理小程序，可以根据文字描述生成精美图片。\n\n版本: 1.0.0\n© ' + this.data.currentYear + ' 图片处理工具',
      showCancel: false
    });
  },
  
  // 分享小程序
  onShareAppMessage: function() {
    return {
      title: '图片处理工具 - AI图像生成器',
      path: '/pages/home/home',
      imageUrl: '/assets/images/share.png'
    };
  },
  
  // 跳转到视频库页面
  navigateToVideo: function() {
    wx.navigateTo({
      url: '/pages/video/video'
    });
  },
  
  // 跳转到创作中心
  navigateToCreate: function() {
    wx.navigateTo({
      url: '/pages/create/create'
    });
  },
  
  // 跳转到个人中心
  navigateToProfile: function() {
    wx.navigateTo({
      url: '/pages/profile/profile'
    });
  },
  
  // 跳转到视频播放页面
  navigateToPlayer: function(e) {
    const videoId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/player/player?id=${videoId}`
    });
  },
  
  // 图片生成器导航
  navigateToImageGenerator: function(e) {
    const feature = e.currentTarget.dataset.feature;
    wx.navigateTo({
      url: '/pages/index/index?feature=' + feature
    });
  }
}) 
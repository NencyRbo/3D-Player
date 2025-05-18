// profile.js
Page({
  data: {
    favoritesCount: 5 // 收藏数量
  },

  onLoad: function(options) {
    // 页面加载时的逻辑
  },

  // 基本设置
  goToSetting: function() {
    wx.showToast({
      title: '基本设置（开发中）',
      icon: 'none'
    });
  },

  // 隐私设置
  goToPrivacy: function() {
    wx.showToast({
      title: '隐私设置（开发中）',
      icon: 'none'
    });
  },

  // 我的收藏
  goToFavorites: function() {
    wx.showToast({
      title: '我的收藏（开发中）',
      icon: 'none'
    });
  },

  // 观看历史
  goToHistory: function() {
    wx.showToast({
      title: '观看历史（开发中）',
      icon: 'none'
    });
  },

  // 我的上传
  goToUploads: function() {
    wx.showToast({
      title: '我的上传（开发中）',
      icon: 'none'
    });
  },

  // 意见反馈
  goToFeedback: function() {
    wx.showModal({
      title: '意见反馈',
      content: '感谢您的使用，您可以通过以下方式向我们反馈问题：\n1. 发送邮件至 support@example.com\n2. 添加客服微信 supportID',
      showCancel: false
    });
  },

  // 关于我们
  goToAbout: function() {
    wx.showModal({
      title: '关于我们',
      content: 'AI图像生成器是一款基于人工智能技术的多媒体创作工具，帮助用户创作和优化图片、视频和3D内容。\n\n版本: 1.0.0\n© ' + new Date().getFullYear() + ' AI图像生成器',
      showCancel: false
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

  navigateToCreate: function() {
    wx.navigateTo({
      url: '/pages/create/create'
    });
  }
}); 
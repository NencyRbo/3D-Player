Page({
  data: {
    // 页面数据
  },
  
  onLoad() {
    // 页面加载时的动画效果
    this.animateEntrance();
  },
  
  // 进入页面的动画
  animateEntrance() {
    // 此处可以添加更复杂的动画逻辑
    console.log('页面动画已启动');
  },
  
  // 跳转到图像生成页面 - 旧方法名保留兼容性
  navigateToCreate() {
    wx.navigateTo({
      url: '/pages/index/index',
      success: () => {
        console.log('跳转到图像生成页面');
      }
    });
  },
  
  // 新增方法 - 导航到图像生成页面
  navigateToIndex() {
    wx.navigateTo({
      url: '../index/index',
      success: () => {
        console.log('跳转到图像生成页面');
      },
      fail: (err) => {
        console.error('导航失败:', err);
        wx.showToast({
          title: '页面导航失败',
          icon: 'none'
        });
      }
    });
  }
}) 
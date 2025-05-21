// video.js
Page({
  data: {
    currentTab: 'all',
    videos: [],
    loading: true,
    page: 1,
    pageSize: 10,
    hasMore: true,
    searchKeyword: ''
  },

  onLoad: function() {
    this.loadVideos();
  },

  onShow: function() {
    // Refresh videos list if coming back to this page
    if (this.data.videos.length > 0) {
      wx.startPullDownRefresh();
    }
  },

  onPullDownRefresh: function() {
    this.setData({
      videos: [],
      page: 1,
      hasMore: true
    });
    this.loadVideos();
    wx.stopPullDownRefresh();
  },

  loadVideos: function() {
    if (!this.data.hasMore || this.data.loading) return;

    this.setData({ loading: true });

    // 模拟API请求，获取视频列表
    // 实际应用中应替换为真实的API调用
    setTimeout(() => {
      // 模拟数据
      const newVideos = this.getMockVideos(this.data.page, this.data.pageSize, this.data.currentTab, this.data.searchKeyword);

      this.setData({
        videos: [...this.data.videos, ...newVideos],
        loading: false,
        page: this.data.page + 1,
        hasMore: newVideos.length === this.data.pageSize
      });
    }, 800);
  },

  getMockVideos: function(page, pageSize, tab, keyword) {
    // 生成模拟视频数据
    const mockVideos = [];
    const startIndex = (page - 1) * pageSize;

    // 视频类型标题前缀
    const typePrefixes = {
      'movie': '电影',
      'short': '短视频',
      'upload': '我的视频',
      'ai': 'AI生成'
    };

    // 视频标题
    const videoTitles = [
      '探索未知的宇宙奥秘',
      '海底世界的神秘生物',
      '城市夜景的绚丽灯光',
      '大自然的壮丽景观',
      '科技创新改变生活',
      '音乐会现场震撼瞬间',
      '美食之旅的味蕾体验',
      '极限运动的刺激挑战',
      '历史遗迹的文明印记',
      '艺术创作的无限想象'
    ];

    for (let i = 0; i < pageSize; i++) {
      const index = startIndex + i;
      // 当模拟数据超过40条时，停止生成
      if (index >= 40) break;

      // 根据tab筛选视频类型
      let videoType = 'normal';
      if (tab !== 'all') {
        videoType = tab;
      } else {
        // 随机分配视频类型
        const types = ['movie', 'short', 'upload', 'ai'];
        videoType = types[Math.floor(Math.random() * types.length)];
      }

      // 生成视频标题
      const titleIndex = index % videoTitles.length;
      const prefix = videoType !== 'normal' ? typePrefixes[videoType] + '：' : '';
      const title = prefix + videoTitles[titleIndex];

      // 模拟关键词搜索
      if (keyword && !title.toLowerCase().includes(keyword.toLowerCase())) continue;

      // 视频时长，电影类型较长，短视频较短
      let duration;
      if (videoType === 'movie') {
        const hours = Math.floor(Math.random() * 2) + 1;
        const minutes = Math.floor(Math.random() * 60);
        duration = `${hours}:${minutes.toString().padStart(2, '0')}`;
      } else {
        const minutes = videoType === 'short' ? 0 : Math.floor(Math.random() * 5);
        const seconds = Math.floor(Math.random() * 60);
        duration = minutes > 0 ?
            `${minutes}:${seconds.toString().padStart(2, '0')}` :
            `0:${seconds.toString().padStart(2, '0')}`;
      }

      mockVideos.push({
        id: `video-${index}`,
        title: title,
        thumbnail: `https://picsum.photos/seed/video${index}/300/200`,
        duration: duration,
        is3D: videoType === 'movie' ? true : Math.random() > 0.7, // 电影类型全是3D，其他70%概率不是3D
        type: videoType
      });
    }

    return mockVideos;
  },

  switchTab: function(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === this.data.currentTab) return;

    this.setData({
      currentTab: tab,
      videos: [],
      page: 1,
      hasMore: true
    });

    this.loadVideos();
  },

  onSearchInput: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  onSearch: function(e) {
    this.setData({
      videos: [],
      page: 1,
      hasMore: true
    });

    this.loadVideos();
  },

  loadMoreVideos: function() {
    if (this.data.hasMore) {
      this.loadVideos();
    }
  },

  playVideo: function(e) {
    const videoId = e.currentTarget.dataset.id;
    // 跳转到视频播放页
    wx.navigateTo({
      url: '/miniprogram/pages/player/player?id=' + videoId
    });
  },

  onUpload: function() {
    // 跳转到上传页面
    wx.navigateTo({
      url: '/miniprogram/pages/create/create'
    });
  }
});
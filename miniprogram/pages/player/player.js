Page({
  data: {
    videoSrc: '',
    videoCover: '/images/video-cover.jpg',
    videoTitle: '3D全息视频演示',
    isPlaying: false,
    isBuffering: false,
    isFullscreen: false,
    is3DEnabled: false,
    depth3D: 50,
    angle3D: 0,
    objectFit: 'contain',
    duration: 0,
    currentTime: 0,
    loadedPercent: 0,
    currentPercent: 0,
    playbackRate: 1.0,
    volume: 0.5,
    speedPanelVisible: false,
    volumeSliderVisible: false,
    gyroEnabled: false,
    gyroGuideVisible: false,
    helpDialogVisible: false,
    dontShowGyroGuide: false,
    controls: {
      visible: false,
      hideTimeout: null
    }
  },
  
  onLoad: function(options) {
    // 根据传入的视频ID加载对应视频
    const videoId = options.id;
    console.log('加载视频ID:', videoId);
    
    // 示例视频数据，实际应用中可以从服务器获取
    const videoData = {
      1: {
        src: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        title: '3D效果展示视频'
      },
      2: {
        src: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        title: '全息投影技术演示'
      },
      3: {
        src: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        title: '虚拟现实体验'
      }
    };
    
    // 设置视频数据
    if (videoData[videoId]) {
      this.setData({
        videoSrc: videoData[videoId].src,
        videoTitle: videoData[videoId].title
      });
    }
    
    // 获取视频上下文
    this.videoContext = wx.createVideoContext('mainVideo');
  },
  
  onShow: function() {
    // 初始化陀螺仪
    if (this.data.gyroEnabled) {
      this.startGyroscope();
    }
  },
  
  onHide: function() {
    // 停止陀螺仪
    if (this.data.gyroEnabled) {
      this.stopGyroscope();
    }
  },
  
  // 播放/暂停切换
  togglePlay: function() {
    if (this.data.isPlaying) {
      this.videoContext.pause();
    } else {
      this.videoContext.play();
    }
    
    this.setData({
      isPlaying: !this.data.isPlaying
    });
    
    this.showControls();
  },
  
  // 全屏切换
  toggleFullscreen: function() {
    if (this.data.isFullscreen) {
      this.videoContext.exitFullScreen();
    } else {
      this.videoContext.requestFullScreen();
    }
    
    this.setData({
      isFullscreen: !this.data.isFullscreen
    });
    
    this.showControls();
  },
  
  // 3D效果切换
  toggle3DEffect: function() {
    this.setData({
      is3DEnabled: !this.data.is3DEnabled
    });
    
    this.showControls();
  },
  
  // 设置3D深度
  setDepth3D: function(e) {
    this.setData({
      depth3D: e.detail.value
    });
    
    this.showControls();
  },
  
  // 设置3D视角
  setAngle3D: function(e) {
    this.setData({
      angle3D: e.detail.value
    });
    
    this.showControls();
  },
  
  // 视频进度更新
  onTimeUpdate: function(e) {
    const currentTime = e.detail.currentTime;
    const duration = e.detail.duration;
    
    this.setData({
      currentTime: currentTime,
      duration: duration,
      currentPercent: (currentTime / duration) * 100,
      // 模拟加载进度
      loadedPercent: Math.min(100, this.data.loadedPercent + 5)
    });
  },
  
  // 视频开始播放
  onPlay: function() {
    this.setData({
      isPlaying: true
    });
    
    // 自动隐藏控制面板
    this.autoHideControls();
  },
  
  // 视频暂停
  onPause: function() {
    this.setData({
      isPlaying: false
    });
    
    this.showControls();
  },
  
  // 视频缓冲
  onVideoWaiting: function() {
    this.setData({
      isBuffering: true
    });
  },
  
  // 视频结束
  onVideoEnd: function() {
    this.setData({
      isPlaying: false,
      currentTime: 0,
      currentPercent: 0
    });
    
    this.showControls();
  },
  
  // 视频错误
  onVideoError: function(e) {
    console.error('视频错误:', e.detail.errMsg);
    wx.showToast({
      title: '视频加载失败',
      icon: 'none'
    });
  },
  
  // 跳转进度
  seekVideo: function(e) {
    const position = e.detail.value;
    this.videoContext.seek(position);
    
    this.setData({
      currentTime: position,
      currentPercent: (position / this.data.duration) * 100
    });
    
    this.showControls();
  },
  
  // 设置播放速度
  setPlaybackRate: function(e) {
    const rate = parseFloat(e.currentTarget.dataset.rate);
    this.videoContext.playbackRate(rate);
    
    this.setData({
      playbackRate: rate,
      speedPanelVisible: false
    });
  },
  
  // 切换播放速度面板
  toggleSpeedPanel: function() {
    this.setData({
      speedPanelVisible: !this.data.speedPanelVisible,
      volumeSliderVisible: false
    });
    
    this.showControls();
  },
  
  // 设置音量
  setVolume: function(e) {
    const volume = e.detail.value;
    this.setData({
      volume: volume
    });
    
    // 使用video context设置音量
    // 注意：微信小程序的video组件暂不支持直接设置音量API
    // 这里仅作为UI展示
    
    this.showControls();
  },
  
  // 切换音量滑块
  toggleVolumeSlider: function() {
    this.setData({
      volumeSliderVisible: !this.data.volumeSliderVisible,
      speedPanelVisible: false
    });
    
    this.showControls();
  },
  
  // 切换陀螺仪控制
  toggleGyro: function() {
    const newState = !this.data.gyroEnabled;
    
    this.setData({
      gyroEnabled: newState
    });
    
    if (newState) {
      this.startGyroscope();
      
      // 显示陀螺仪指南（如果用户没有选择不再显示）
      if (!this.data.dontShowGyroGuide) {
        this.setData({
          gyroGuideVisible: true
        });
      }
    } else {
      this.stopGyroscope();
    }
    
    this.showControls();
  },
  
  // 启动陀螺仪
  startGyroscope: function() {
    if (wx.startGyroscope) {
      wx.startGyroscope({
        success: () => {
          console.log('陀螺仪启动成功');
          
          // 监听陀螺仪数据
          wx.onGyroscopeChange(this.handleGyroscopeData);
        },
        fail: (err) => {
          console.error('陀螺仪启动失败:', err);
          wx.showToast({
            title: '陀螺仪不可用',
            icon: 'none'
          });
          
          // 重置状态
          this.setData({
            gyroEnabled: false
          });
        }
      });
    } else {
      wx.showToast({
        title: '设备不支持陀螺仪',
        icon: 'none'
      });
      
      this.setData({
        gyroEnabled: false
      });
    }
  },
  
  // 停止陀螺仪
  stopGyroscope: function() {
    if (wx.stopGyroscope) {
      wx.stopGyroscope();
      wx.offGyroscopeChange(this.handleGyroscopeData);
      console.log('陀螺仪已停止');
    }
  },
  
  // 处理陀螺仪数据
  handleGyroscopeData: function(res) {
    // 简单示例：检测明显的摇动
    const threshold = 5.0;
    
    if (Math.abs(res.x) > threshold) {
      // 左右摇动：调整进度
      const seekStep = 15; // 15秒
      if (res.x > threshold) {
        // 向右摇动：前进
        this.seekRelative(seekStep);
      } else if (res.x < -threshold) {
        // 向左摇动：后退
        this.seekRelative(-seekStep);
      }
    }
    
    if (Math.abs(res.y) > threshold) {
      // 上下摇动：调整音量
      const volumeStep = 0.1;
      if (res.y > threshold) {
        // 向上摇动：增加音量
        this.adjustVolume(volumeStep);
      } else if (res.y < -threshold) {
        // 向下摇动：减小音量
        this.adjustVolume(-volumeStep);
      }
    }
    
    // 检测强烈的摇晃（所有轴）
    if (Math.abs(res.x) > threshold * 1.5 && 
        Math.abs(res.y) > threshold * 1.5 && 
        Math.abs(res.z) > threshold * 1.5) {
      // 播放/暂停切换
      this.togglePlay();
    }
  },
  
  // 相对当前位置调整进度
  seekRelative: function(seconds) {
    const newTime = Math.max(0, Math.min(this.data.duration, this.data.currentTime + seconds));
    this.videoContext.seek(newTime);
    
    this.setData({
      currentTime: newTime,
      currentPercent: (newTime / this.data.duration) * 100
    });
    
    // 显示提示
    wx.showToast({
      title: seconds > 0 ? `前进${seconds}秒` : `后退${Math.abs(seconds)}秒`,
      icon: 'none'
    });
    
    this.showControls();
  },
  
  // 调整音量
  adjustVolume: function(delta) {
    const newVolume = Math.max(0, Math.min(1, this.data.volume + delta));
    
    this.setData({
      volume: newVolume
    });
    
    // 显示提示
    wx.showToast({
      title: delta > 0 ? '增大音量' : '减小音量',
      icon: 'none'
    });
  },
  
  // 隐藏陀螺仪指南
  hideGyroGuide: function() {
    this.setData({
      gyroGuideVisible: false
    });
  },
  
  // 切换"不再提示"选项
  toggleDontShowAgain: function(e) {
    this.setData({
      dontShowGyroGuide: e.detail.value
    });
  },
  
  // 显示帮助对话框
  showHelpDialog: function() {
    this.setData({
      helpDialogVisible: true
    });
    
    this.showControls();
  },
  
  // 隐藏帮助对话框
  hideHelpDialog: function() {
    this.setData({
      helpDialogVisible: false
    });
  },
  
  // 返回上一页
  navigateBack: function() {
    wx.navigateBack();
  },
  
  // 显示控制面板
  showControls: function() {
    // 清除现有的隐藏定时器
    if (this.data.controls.hideTimeout) {
      clearTimeout(this.data.controls.hideTimeout);
    }
    
    this.setData({
      'controls.visible': true
    });
    
    // 自动隐藏控制面板
    this.autoHideControls();
  },
  
  // 自动隐藏控制面板
  autoHideControls: function() {
    // 如果视频正在播放，设置定时器自动隐藏控制面板
    if (this.data.isPlaying) {
      const timeout = setTimeout(() => {
        this.setData({
          'controls.visible': false,
          speedPanelVisible: false,
          volumeSliderVisible: false
        });
      }, 5000);
      
      this.setData({
        'controls.hideTimeout': timeout
      });
    }
  },
  
  // 格式化时间（秒 -> 分:秒）
  formatTime: function(seconds) {
    if (isNaN(seconds)) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}) 
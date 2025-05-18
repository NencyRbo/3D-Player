App({
  onLaunch() {
    // 检查版本更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              }
            });
          });
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '提示',
              content: '新版本下载失败，请检查网络后重试'
            });
          });
        }
      });
    }

    // 获取系统信息
    wx.getSystemInfo({
      success: res => {
        this.globalData.systemInfo = res;
      }
    });
  },
  globalData: {
    userInfo: null,
    systemInfo: null
  }
}) 
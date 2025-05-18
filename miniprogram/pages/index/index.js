// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    prompt: '',
    generatedImage: '',
    error: '',
    isLoading: false,
    generationCount: 0,
    isPreviewActive: false  // 控制全屏预览的显示状态
  },
  
  onLoad: function() {
    console.log('图片生成页面加载成功');
  },
  
  // 输入框获取焦点
  handleInputFocus: function() {
    console.log('输入框获取焦点');
  },
  
  // 输入框失去焦点
  handleInputBlur: function() {
    console.log('输入框失去焦点');
  },
  
  // 图片加载完成
  handleImageLoad: function() {
    console.log('图片加载完成');
    wx.hideLoading();
  },
  
  // 全屏预览图片 - 改进版本
  previewImage: function() {
    console.log('点击图片，打开全屏预览');
    if (this.data.generatedImage) {
      const imageUrl = this.data.generatedImage;
      
      // 检查是否为base64图片
      if (imageUrl.startsWith('data:image')) {
        console.log('检测到base64图片，使用自定义预览');
        // 对于base64图片，使用自定义预览
        this.setData({
          isPreviewActive: true
        });
      } else {
        // 对于网络图片，使用微信内置预览
        console.log('使用微信内置预览功能');
        wx.previewImage({
          current: imageUrl,
          urls: [imageUrl]
        });
      }
    }
  },
  
  // 关闭全屏预览
  closePreview: function() {
    console.log('关闭全屏预览');
    this.setData({
      isPreviewActive: false
    });
  },
  
  // 阻止事件冒泡
  stopPropagation: function(e) {
    // 阻止点击图片时触发关闭预览
    console.log('阻止事件冒泡');
    return;
  },
  
  // 生成图片
  generateImage: function() {
    try {
      const { prompt } = this.data
      
      if (!prompt.trim()) {
        this.setData({
          error: '请输入图片描述'
        });
        return;
      }
      
      this.setData({
        isLoading: true,
        error: ''
      });

      wx.showLoading({
        title: '正在生成图片...',
        mask: true
      });
      
      // 记录生成次数
      this.setData({
        generationCount: this.data.generationCount + 1
      });
      
      // 调用 API 生成图片
      wx.request({
        url: 'https://api.siliconflow.cn/v1/images/generations',
        method: 'POST',
        header: {
          'Authorization': 'Bearer sk-xtwzrmfgdzmkvhubnkfifkyjwourvatflphcrjocrescswwp',
          'Content-Type': 'application/json'
        },
        data: {
          model: 'Kwai-Kolors/Kolors',
          prompt: prompt,
          negative_prompt: "",
          image_size: '1024x1024',
          batch_size: 1,
          seed: Math.floor(Math.random() * 1000000000),  // 随机种子以获取不同结果
          num_inference_steps: 20,
          guidance_scale: 7.5
        },
        success: (res) => {
          console.log('API 响应:', res.data)
          
          if (res.statusCode === 200 && res.data) {
            // 解析响应数据
            const responseData = res.data;
            let imageUrl = '';
            
            // 尝试获取图片URL
            if (responseData.images && responseData.images.length > 0 && responseData.images[0].url) {
              imageUrl = responseData.images[0].url;
            } else if (responseData.data && responseData.data.length > 0 && responseData.data[0].url) {
              imageUrl = responseData.data[0].url;
            } else if (responseData.data && responseData.data.length > 0 && responseData.data[0].b64_json) {
              // 如果返回的是Base64图片，构建Data URL
              imageUrl = 'data:image/png;base64,' + responseData.data[0].b64_json;
            }
            
            if (imageUrl) {
              console.log('获取到图片URL:', imageUrl);
              this.setData({
                generatedImage: imageUrl,
                error: ''
              });
              
              wx.showToast({
                title: '图片生成成功',
                icon: 'success'
              });
            } else {
              console.error('未找到图片URL', responseData);
              this.setData({
                error: '未找到生成的图片，请重试'
              });
              
              wx.showToast({
                title: '图片生成失败',
                icon: 'error'
              });
            }
          } else {
            console.error('API请求失败', res);
            let errorMsg = '生成图片失败，请重试';
            
            if (res.data && res.data.error && res.data.error.message) {
              errorMsg = res.data.error.message;
            }
            
            this.setData({
              error: errorMsg
            });
            
            wx.showToast({
              title: '请求失败',
              icon: 'error'
            });
          }
        },
        fail: (err) => {
          console.error('API 请求失败:', err)
          this.setData({
            error: '网络请求失败，请检查网络连接'
          });
          
          wx.showToast({
            title: '网络错误',
            icon: 'error'
          });
        },
        complete: () => {
          this.setData({
            isLoading: false
          });
          wx.hideLoading();
        }
      });
    } catch (error) {
      console.error('生成图片过程出错:', error);
      this.setData({
        error: '程序出错，请重试: ' + error.message,
        isLoading: false
      });
      wx.hideLoading();
    }
  },
  
  // 清空输入和结果
  resetForm: function() {
    this.setData({
      prompt: '',
      generatedImage: '',
      error: ''
    });
  },
  
  // 保存图片到相册
  saveImage: function() {
    const { generatedImage } = this.data;
    
    if (!generatedImage) {
      wx.showToast({
        title: '没有可保存的图片',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({
      title: '保存中...',
      mask: true
    });
    
    // 检查是否是 base64 图片
    if (generatedImage.startsWith('data:image')) {
      // 把base64转成临时文件再保存
      const fs = wx.getFileSystemManager();
      const base64Data = generatedImage.split(',')[1];
      const filePath = `${wx.env.USER_DATA_PATH}/temp_image_${Date.now()}.png`;
      
      fs.writeFile({
        filePath: filePath,
        data: base64Data,
        encoding: 'base64',
        success: () => {
          wx.saveImageToPhotosAlbum({
            filePath: filePath,
            success: () => {
              wx.hideLoading();
              wx.showToast({
                title: '保存成功',
                icon: 'success'
              });
            },
            fail: (err) => {
              wx.hideLoading();
              console.error('保存失败:', err);
              wx.showToast({
                title: '保存失败',
                icon: 'error'
              });
            }
          });
        },
        fail: (err) => {
          wx.hideLoading();
          console.error('文件写入失败:', err);
          wx.showToast({
            title: '保存失败',
            icon: 'error'
          });
        }
      });
    } else {
      // 下载网络图片
      wx.downloadFile({
        url: generatedImage,
        success: (res) => {
          if (res.statusCode === 200) {
            // 保存图片到相册
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: () => {
                wx.hideLoading();
                wx.showToast({
                  title: '保存成功',
                  icon: 'success'
                });
              },
              fail: (err) => {
                wx.hideLoading();
                console.error('保存失败:', err);
                wx.showToast({
                  title: '保存失败',
                  icon: 'error'
                });
              }
            });
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '下载失败',
              icon: 'error'
            });
          }
        },
        fail: (err) => {
          wx.hideLoading();
          console.error('下载失败:', err);
          wx.showToast({
            title: '下载失败',
            icon: 'error'
          });
        }
      });
    }
  },
  
  // 分享图片
  shareImage: function() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    
    wx.showToast({
      title: '请长按图片分享',
      icon: 'none',
      duration: 2000
    });
  },
  
  // 返回主页
  navigateBack: function() {
    wx.navigateBack({
      fail: () => {
        // 如果返回失败，则跳转到首页
        wx.redirectTo({
          url: '/pages/home/home'
        });
      }
    });
  },
  
  // 页面分享设置
  onShareAppMessage: function() {
    return {
      title: '我用AI生成了一张精美图片',
      path: '/pages/home/home',
      imageUrl: this.data.generatedImage || '/assets/images/share_default.png'
    };
  }
}); 
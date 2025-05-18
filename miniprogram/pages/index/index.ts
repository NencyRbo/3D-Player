// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

// 定义API响应的接口
interface ApiResponseData {
  images?: Array<{url: string}>;
  data?: Array<{url: string}>;
  [key: string]: any;
}

Page({
  data: {
    prompt: '',
    generatedImage: '',
    error: '',
    isLoading: false,
    isGenerating: false,
    showRipple: false,
    isPreviewActive: false,  // 添加全屏预览状态
    fadeInAnimation: {}, // 页面淡入动画
    slideUpAnimation1: {}, // 输入卡片上滑动画
    slideUpAnimation2: {}, // 图片卡片上滑动画
    shakeAnimation: {}  // 错误提示抖动动画
  },
  
  onLoad() {
    // 页面加载时的动画效果
    this.initAnimation();
  },
  
  // 初始化动画
  initAnimation() {
    // 创建动画实例
    const fadeIn = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease-out',
    });
    
    const slideUp1 = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease-out',
      delay: 200
    });
    
    const slideUp2 = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease-out',
      delay: 400
    });
    
    // 设置动画效果
    fadeIn.opacity(0).step({ duration: 0 });
    fadeIn.opacity(1).translateY(0).step();
    
    slideUp1.opacity(0).translateY(40).step({ duration: 0 });
    slideUp1.opacity(1).translateY(0).step();
    
    slideUp2.opacity(0).translateY(40).step({ duration: 0 });
    slideUp2.opacity(1).translateY(0).step();
    
    this.setData({
      fadeInAnimation: fadeIn.export(),
      slideUpAnimation1: slideUp1.export(),
      slideUpAnimation2: slideUp2.export()
    });
  },
  
  // 按钮点击水波纹效果
  showButtonRipple() {
    this.setData({ showRipple: true });
    
    setTimeout(() => {
      this.setData({ showRipple: false });
    }, 800);
  },
  
  // 错误提示抖动动画
  showErrorShake() {
    const shake = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in-out'
    });
    
    shake.translateX(-10).step({ duration: 100 });
    shake.translateX(10).step({ duration: 100 });
    shake.translateX(-10).step({ duration: 100 });
    shake.translateX(10).step({ duration: 100 });
    shake.translateX(0).step({ duration: 100 });
    
    this.setData({
      shakeAnimation: shake.export()
    });
  },
  
  // 输入框获取焦点
  handleInputFocus() {
    console.log('输入框获取焦点');
  },
  
  // 输入框失去焦点
  handleInputBlur() {
    console.log('输入框失去焦点');
  },
  
  // 图片加载完成
  handleImageLoad() {
    console.log('图片加载完成');
    // 可以添加图片加载完成的动画效果
  },
  
  // 全屏预览图片
  previewImage() {
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
  closePreview() {
    console.log('关闭全屏预览');
    this.setData({
      isPreviewActive: false
    });
  },
  
  // 阻止事件冒泡
  stopPropagation() {
    console.log('阻止事件冒泡');
    // 阻止点击图片时触发关闭预览
    return;
  },
  
  // 生成图片
  generateImage() {
    const { prompt } = this.data
    
    if (!prompt.trim()) {
      this.setData({
        error: '请输入图片描述'
      });
      this.showErrorShake();
      return;
    }
    
    this.showButtonRipple();
    
    this.setData({
      isLoading: true,
      isGenerating: true,
      error: ''
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
        seed: 4999999999,
        num_inference_steps: 20,
        guidance_scale: 7.5
      },
      success: (res: any) => {
        console.log('API 响应:', res.data)
        
        if (res.statusCode === 200 && res.data) {
          // 解析响应数据
          const responseData = res.data as ApiResponseData;
          let imageUrl = '';
          
          // 尝试获取图片URL
          if (responseData.images && responseData.images.length > 0 && responseData.images[0].url) {
            // 从 images 数组中提取 url
            imageUrl = responseData.images[0].url;
          } else if (responseData.data && responseData.data.length > 0 && responseData.data[0].url) {
            // 从 data 数组中提取 url
            imageUrl = responseData.data[0].url;
          }
          
          if (imageUrl) {
            console.log('获取到图片URL:', imageUrl);
            this.setData({
              generatedImage: imageUrl,
              error: ''
            });
          } else {
            console.error('未找到图片URL', responseData);
            this.setData({
              error: '未找到生成的图片'
            });
            this.showErrorShake();
          }
        } else {
          console.error('API请求失败', res);
          this.setData({
            error: '生成图片失败，请重试'
          });
          this.showErrorShake();
        }
      },
      fail: (err) => {
        console.error('API 请求失败:', err)
        this.setData({
          error: '请求失败，请检查网络连接'
        });
        this.showErrorShake();
      },
      complete: () => {
        this.setData({
          isLoading: false,
          isGenerating: false
        });
      }
    });
  },
  
  // 保存图片到相册
  saveImage() {
    const { generatedImage } = this.data;
    
    if (!generatedImage) return;
    
    wx.showLoading({
      title: '保存中...',
    });
    
    // 下载图片
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
      fail: () => {
        wx.hideLoading();
        wx.showToast({
          title: '下载失败',
          icon: 'error'
        });
      }
    });
  },
  
  // 分享图片
  shareImage() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },
  
  // 返回主页
  navigateBack() {
    wx.navigateBack({
      success: () => {
        console.log('返回主页');
      }
    });
  }
});

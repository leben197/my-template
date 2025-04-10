<template>
  <div class="animation-container">
    <slot name="audio"></slot>
    <img ref="animationImg" :src="currentFrameSrc" alt="动画帧" class="animation-img">
    <canvas ref="canvas" class="canvas"></canvas>
  </div>
</template>
<script lang="ts" setup>
import { getAssetsImages } from '@/utils/image';
import { defineEmits, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

// 定义props
const props = defineProps({
  imgUrl: {
    type: String,
    required: true
  },
  start: {
    type: Boolean,
    default: true
  },
  animationSpeed: {
    type: Number,
    default: 1
  }
})
const configUrl = 'https://yjcmndzb.sanguosha.com/';

// 存储当前帧图片的路径，响应式数据
const currentFrameSrc = ref<string>('');
// 存储序列帧图片路径的数组
const frameImagePaths = ref<string[]>([]);
let frameIndex = 0;
const totalFrames = 43;

// 图片缓存相关
interface CachedImage {
  image: HTMLImageElement;
  timestamp: number;
}
const imageCache: CachedImage[] = [];
const MAX_CACHE_SIZE = 50;

// 添加图片到缓存
const addToCache = (img: HTMLImageElement) => {
  const currentTime = Date.now();
  const cachedImage: CachedImage = { image: img, timestamp: currentTime };
  imageCache.push(cachedImage);
  if (imageCache.length > MAX_CACHE_SIZE) {
    // 移除最早加入缓存的图片（简单模拟LRU）
    imageCache.shift();
  }
}

// 从缓存中获取图片
const getFromCache = (imgPath: string): HTMLImageElement | undefined => {
  const index = imageCache.findIndex((cached) => cached.image.src === imgPath);
  if (index !== -1) {
    const cachedImage = imageCache.splice(index, 1)[0];
    const currentTime = Date.now();
    cachedImage.timestamp = currentTime;
    imageCache.push(cachedImage);
    return cachedImage.image;
  }
  return undefined;
}

// 预加载图片，使用Promise.all确保全部加载完成，并优化缓存
const loadImagePaths = (): Promise<void> => {
  const imagePromises: Promise<void>[] = [];
  for (let i = 0; i < totalFrames; i++) {
    let imgPath;
    if (props.start) {
      imgPath = getAssetsImages(`${props.imgUrl}/${props.imgUrl}${i}.png`);
    } else {
      imgPath = `${configUrl}${props.imgUrl}/${props.imgUrl}${i}.webp`;
    }

    const cachedImage = getFromCache(imgPath);
    if (cachedImage) {
      frameImagePaths.value.push(cachedImage);
      continue;
    }

    const img = new Image();
    img.src = imgPath;
    const imageLoadPromise = (): Promise<void> => {
      return new Promise<void>((resolve, reject) => {
        img.onload = () => {
          addToCache(imgPath);
          resolve();
        };
        img.onerror = (error) => {
          console.error(`图片加载失败: ${imgPath}`, error);
          reject(error);
        };
      });
    };
    imagePromises.push(imageLoadPromise);
  }
  console.log('imagePromises', imagePromises);

  return Promise.all(imagePromises).then(() => {
    frameImagePaths.value = frameImagePaths.value.concat(imagePromises.map((_, i) => {
      if (props.start) {
        return getAssetsImages(`${props.imgUrl}/${props.imgUrl}${i}.png`);
      } else {
        console.log('configUrl', configUrl);

        return `${configUrl}${props.imgUrl}/${props.imgUrl}${i}.webp`;
      }
    }));
  });
}

// 切换动画帧，更新当前帧图片路径
let startY = 0;
const switchFrame = (): void => {
  currentFrameSrc.value = frameImagePaths.value[frameIndex];
  // console.log('currentFrameSrc', currentFrameSrc.value);

  frameIndex = (frameIndex + 1) % totalFrames; // 每次切换一帧
};

// const switchFrame = (): void => {
//   currentFrameSrc.value = frameImagePaths.value[frameIndex];
//   frameIndex = (frameIndex + props.animationSpeed * props.slowDownFactor) % totalFrames;
//   if (frameIndex < 0) {
//     frameIndex += totalFrames;
//   }
// }
// 使用 requestAnimationFrame 播放动画
let animationFrameId = 0;
let lastFrameTime = 0;
const maxFPS = 60; // 设置最大帧率
let lastTime = 0;
const playAnimation = () => {
  const now = performance.now();
  const frameInterval = 1000 / (60 * props.animationSpeed); // 控制每秒钟的帧数

  if (now - lastTime >= frameInterval) {
    switchFrame(); // 切换当前帧
    lastTime = now; // 更新最后一次切换的时间
  }

  animationFrameId = requestAnimationFrame(playAnimation); // 继续下次动画帧
}

// 根据props变化决定是否重新加载图片
watch(() => [props.imgUrl, props.start], (newValues, oldValues) => {
  if (newValues[0] !== oldValues[0] || newValues[1] !== oldValues[1]) {
    // 如果imgUrl或者start属性变化了，重新加载图片
    loadImagePaths().then(() => {
      switchFrame();
      playAnimation();
    });
  }
})

// canvas及视频相关
const canvas = ref<HTMLCanvasElement | null>(null);
let video: HTMLVideoElement | null = null;
let isVideoPlaying = false; // 标记视频是否正在播放
const showComponent = ref(true); // 用于控制组件是否显示，初始为显示
let drawAnimationFrameId = 0; // 用于记录画布绘制的动画帧请求ID
const loadingProgress = ref(0); // 加载进度百分比

const handleTouchStart = (e: TouchEvent) => {
  startY = e.touches[0].clientY;
  console.log('startY', startY);

}

const handleTouchEnd = (e: TouchEvent) => {
  const endY = e.changedTouches[0].clientY;
  if (endY < startY) {
    // 手指上滑
    if (!isVideoPlaying) {
      startCanvasVideo();
    }
  }
}

const startCanvasVideo = () => {
  if (!canvas.value) return;
  video = document.createElement('video');
  video.src = 'https://yjcmndzb.sanguosha.com/transition.mp4'; // 替换为实际的视频地址
  video.crossOrigin = "anonymous"; // 如果有跨域情况需正确配置
  video.muted = true;
  video.autoplay = true;
  // video.loop = true;

  video.addEventListener('loadedmetadata', () => {
    if (!video) return;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    const dpr = window.devicePixelRatio || 1;
    if (canvas.value) {
      if (canvas.value) {
        canvas.value.width = videoWidth * dpr;
        canvas.value.height = videoHeight * dpr;
      }
    }
    // canvas.value.style.width = `${videoWidth}px`;
    // canvas.value.style.height = `${videoHeight}px`;

    if (!canvas.value) return;
    const ctx = canvas.value.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!video || video.paused || video.ended) {
        // 视频停止播放时，取消绘制动画帧请求，停止绘制
        if (drawAnimationFrameId) {
          cancelAnimationFrame(drawAnimationFrameId);
        }
        return;
      }
      if (canvas.value) {
        if (video) {
          ctx.drawImage(video, 0, 0, canvas.value.width, canvas.value.height);
        }
      }
      drawAnimationFrameId = requestAnimationFrame(draw);
    };

    video.addEventListener('canplay', () => {
      draw();
    });

    video.addEventListener('ended', () => {
      // 视频播放结束，向父组件传值
      emit('video-ended', true);
      // 隐藏组件
      showComponent.value = false;
    });

    video.play();
    isVideoPlaying = true;
    canvas.value.style.display = 'block';
  });
}

const preloadAll = async () => {
  console.log('preloadAll开始加载');
  // 先加载图片序列帧
  await loadImagePaths();
  // 再加载视频
  await loadVideo();
  console.log('video ended加载完成');

  // 发射自定义事件告知父组件本组件加载完成
  emit('component-loaded');
};

const loadVideo = () => {
  return new Promise<void>((resolve, reject) => {
    if (!canvas.value) return reject(new Error('Canvas element not found,000000000000'));
    video = document.createElement('video');
    video.src = 'https://yjcmndzb.sanguosha.com/transition.mp4';
    video.crossOrigin = "anonymous";
    video.preload = 'auto';
    video.autoplay = false; // 预加载时不自动播放
    video.muted = true;


    video.addEventListener('loadedmetadata', () => {
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.value.width = videoWidth * dpr;
      canvas.value.height = videoHeight * dpr;
      // canvas.value.style.width = `${videoWidth}px`;
      // canvas.value.style.height = `${videoHeight}px`;
      if (!canvas.value) return reject(new Error('Canvas element not found,1111111111111111'));
      console.log('canvas.value', canvas.value);

      const ctx = canvas.value.getContext('2d');
      console.log('ctx', ctx);

      if (!ctx) return reject(new Error('Could not get 2D context for canvas'));
      if (!!video) {
        console.log(1212122);

        // 绘制视频第一帧到canvas上，模拟预加载绘制
        ctx.drawImage(video, 0, 0, canvas.value.width, canvas.value.height);
        console.log(9999999999999999);

        video.addEventListener('canplaythrough', () => {
          console.log('video canplay');

          resolve();
        });
      }

    });
    video.addEventListener('error', (error) => {
      console.log('video error', error);

      reject(error);
    });
  });
}

const emit = defineEmits(['video-ended', 'component-loaded']);

onMounted(() => {
  const imgElement = document.querySelector('.animation-container');
  console.log('imgElement', imgElement);

  if (imgElement) {
    imgElement.addEventListener('touchstart', handleTouchStart as EventListener);
    imgElement.addEventListener('touchend', handleTouchEnd as EventListener);
  }
  canvas.value = document.querySelector('.canvas');
  nextTick(() => {

    preloadAll().then(() => {
      console.log('preloadAll加载完成');

      // 预加载完成后可以开始播放动画帧等操作
      switchFrame();
      playAnimation();
    });

  });





  onBeforeUnmount(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (imgElement) {
      imgElement.removeEventListener('touchstart', handleTouchStart as EventListener);
      imgElement.removeEventListener('touchend', handleTouchEnd as EventListener);
    }
    if (video && video.readyState > 0) {
      video.pause();
      video.removeEventListener('canplay', () => { });
      video.removeEventListener('ended', () => { });
    }
    // 在组件销毁时，也取消画布绘制的动画帧请求
    if (drawAnimationFrameId) {
      cancelAnimationFrame(drawAnimationFrameId);
    }
  });
})
</script>
<style scoped lang="scss">
.animation-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.animation-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.video-player {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
}

.canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;

}
</style>

<template>
  <div class="animation-container">
    <slot v-if="isPlayer" name="icon"></slot>
    <!-- <slot name="audio"></slot> -->
    <canvas ref="firstCanvas" id="firstCanvas"
      style="position:absolute; top:0; left:0; width:100%; height:100%;"></canvas>
    <canvas ref="secondCanvas" id="secondCanvas"
      style="position:absolute; top:0; left:0; width:100%; height:100%; display:none;"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { debounce, getAssetsImages } from '@/utils/image';
import { onBeforeUnmount, onMounted, ref } from 'vue';

// 定义两个 canvas 的引用
const firstCanvas = ref<HTMLCanvasElement | null>(null);
const secondCanvas = ref<HTMLCanvasElement | null>(null);

const firstFrameImages = ref<HTMLImageElement[]>([]);
const secondFrameImages = ref<HTMLImageElement[]>([]);

let isPlayer = ref(true);

const firstTotalFrames = 43;
const secondTotalFrames = 95;

let playAnimationed = false;

// 新增变量用于控制动画速度
const animationSpeed = ref(1);

// 加载第一个序列帧图像
const loadFirstImages = (): Promise<HTMLImageElement[]> => {
  const imagePromises = [];
  for (let i = 0; i < firstTotalFrames; i++) {
    const img = new Image();
    img.src = getAssetsImages(`start/back${i}.webp`);
    const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Image failed to load: start/back${i}.webp`));
    });
    imagePromises.push(imageLoadPromise);
  }
  return Promise.all(imagePromises);
}

// 加载第二个序列帧图像
const loadSecondImages = (): Promise<HTMLImageElement[]> => {
  const imagePromises = [];
  for (let i = 0; i < secondTotalFrames; i++) {
    const img = new Image();
    img.src = getAssetsImages(`transition/transition${i + 1}.webp`);
    const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Image failed to load: transition/transition${i + 1}.webp`));
    });
    imagePromises.push(imageLoadPromise);
  }
  return Promise.all(imagePromises);
}

// 渲染动画帧
const drawFrame = (ctx: CanvasRenderingContext2D, images: HTMLImageElement[], index: number) => {
  if (!ctx) return index;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const img = images[index];
  const scaleX = ctx.canvas.width / img.width;
  const scaleY = ctx.canvas.height / img.height;
  const scale = Math.max(scaleX, scaleY);
  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;
  const offsetX = (ctx.canvas.width - drawWidth) / 2;
  const offsetY = (ctx.canvas.height - drawHeight) / 2;
  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  return (index + 1) % images.length;
}

// 重新调整 canvas 的大小
const resizeCanvas = () => {
  const dpr = window.devicePixelRatio || 1;
  if (firstCanvas.value) {
    firstCanvas.value.width = window.innerWidth * dpr;
    firstCanvas.value.height = window.innerHeight * dpr;
  }
  if (secondCanvas.value) {
    secondCanvas.value.width = window.innerWidth * dpr;
    secondCanvas.value.height = window.innerHeight * dpr;
  }
}

const debouncedResizeCanvas = debounce(() => {
  resizeCanvas();
}, 200);

// 播放动画
const playAnimation = (canvasElement: HTMLCanvasElement | null, images: HTMLImageElement[], speed: number) => {
  const ctx = canvasElement?.getContext('2d');
  if (!ctx) return;

  const baseFps = 30;
  const frameInterval = Math.round(1000 / (baseFps * speed));
  let lastTime = 0;
  let currentIndex = 0;

  return new Promise<void>((resolve) => {
    const draw = () => {
      const now = performance.now();
      if (now - lastTime >= frameInterval) {
        currentIndex = drawFrame(ctx, images, currentIndex);
        lastTime = now;
      }
      if (currentIndex === 0) {
        resolve();
      }
      requestAnimationFrame(draw);
    };
    draw();
  });
}

// 控制加载动画
const loadAnimations = async () => {
  try {
    const firstLoaded = await loadFirstImages();
    firstFrameImages.value = firstLoaded;

    const secondLoaded = await loadSecondImages();
    secondFrameImages.value = secondLoaded;

    // 两个动画都加载完成，通知父组件
    emits('component-loaded', true);
  } catch (error) {
    console.error('加载动画出错:', error);
  }
}

// 控制播放第一个动画
const playFirstAnimation = async () => {
  if (firstFrameImages.value.length > 0 && firstCanvas.value) {
    await resizeCanvas();
    await playAnimation(firstCanvas.value, firstFrameImages.value, animationSpeed.value);
  }
}

// 控制播放第二个动画
const playSecondAnimation = async () => {
  if (playAnimationed) return;
  if (secondFrameImages.value.length > 0 && secondCanvas.value && firstCanvas.value) {
    isPlayer.value = false;
    playAnimationed = true;
    emits('audio-satrt', false);
    secondCanvas.value.style.display = 'block';
    firstCanvas.value.style.display = 'none';
    await resizeCanvas();
    await playAnimation(secondCanvas.value, secondFrameImages.value, animationSpeed.value);
    // 动画播放完发送事件给父组件
    emits('video-ended', true);
  }
}

onMounted(() => {
  firstCanvas.value = document.getElementById('firstCanvas') as HTMLCanvasElement;
  secondCanvas.value = document.getElementById('secondCanvas') as HTMLCanvasElement;
  const initAnimation = async () => {
    await playFirstAnimation();
  };
  // 提前加载动画
  loadAnimations().then(() => {
    initAnimation();
  });

  window.addEventListener('resize', debouncedResizeCanvas);
  // 添加触摸事件监听，滑动后切换到第二个动画
  window.addEventListener('touchstart', (e) => {
    const startY = e.touches[0].clientY;
    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      if (currentY < startY) {
        playSecondAnimation();
        window.removeEventListener('touchmove', handleTouchMove);
      }
    };
    window.addEventListener('touchmove', handleTouchMove);
  });

  let startY: number;
  // 添加鼠标按下事件监听
  window.addEventListener('mousedown', (e) => {
    startY = e.clientY;
  });
  // 添加鼠标移动事件监听
  window.addEventListener('mousemove', (e) => {
    if (startY !== undefined) {
      const currentY = e.clientY;
      if (currentY < startY) {
        playSecondAnimation();
        window.removeEventListener('mousedown', () => { });
        window.removeEventListener('mousemove', () => { });
      }
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedResizeCanvas);
  window.removeEventListener('touchstart', () => { });
  window.removeEventListener('mousedown', () => { });
  window.removeEventListener('mousemove', () => { });
});

// 声明 emits
const emits = defineEmits<{
  (e: 'component-loaded', value: boolean): void;
  (e: 'video-ended', value: boolean): void;
  (e: 'audio-satrt', value: boolean): void;
}>();
</script>

<style scoped lang="scss">
.animation-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: transparent;
  margin: 0;
}
</style>

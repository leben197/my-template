<template>
  <div class="scratch-card">
    <div class="sourceImg" :style="{ backgroundImage: `url(${props.imageUrl})` }">
      <img class="sourceImg" src="@/assets/general-name.webp" alt="revealed">
      <div class="name">{{ name }}</div>
    </div>
    <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight" :style="{ opacity: canvasOpacity }"></canvas>
  </div>
</template>

<script setup lang="ts">
// import coverImage from '@/assets/un.webp';
import { onBeforeUnmount, onMounted, ref } from 'vue';
const coverImage = '/un.webp';
// 接收父组件传入的图片路径
const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  },
  // 自定义未刮开时显示的内容，不传则无额外绘制
  coverContent: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    default: ''
  }
});

const canvasWidth = ref(400);
const canvasHeight = ref(300);
const maskColor = ref('grey');
const cursorRadius = ref(10);
const maxEraseArea = ref(50);
const done = ref(false);
let posX: number | null = null;
let posY: number | null = null;
const canvas = ref<HTMLCanvasElement | null>(null);
const currPerct = ref(0);
const canvasOpacity = ref(1);

// 从本地存储读取刮开状态
const checkScratched = () => {
  const scratched = localStorage.getItem('scratchCardScratched');
  if (scratched === 'true') {
    canvasOpacity.value = 0;
    done.value = true;
  }
};

// 提前获取绘图上下文
let ctx: CanvasRenderingContext2D | null = null;

const initContext = () => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d', { willReadFrequently: true });
  }
};

let isCoated = false;

// 添加遮罩层（刮刮乐未刮开部分）
let isImageLoaded = false;

const addCoat = () => {
  if (ctx && !isCoated) {
    const width = canvasWidth.value;
    const height = canvasHeight.value;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = maskColor.value;
    ctx.fillRect(0, 0, width, height);

    if (!isImageLoaded) {
      const img = new Image();
      img.src = coverImage;
      img.onload = () => {
        let imgWidth = img.width;
        let imgHeight = img.height;

        if (imgWidth > width || imgHeight > height) {
          const ratio = Math.min(width / imgWidth, height / imgHeight);
          imgWidth *= ratio;
          imgHeight *= ratio;
        }

        const x = (width - imgWidth) / 2;
        const y = (height - imgHeight) / 2;
        ctx.drawImage(img, x, y, imgWidth, imgHeight);

        isImageLoaded = true; // 标记图片已加载
        isCoated = true; // 标记涂层已完成
      };
    } else {
      isCoated = true; // 如果图片已加载，直接标记涂层完成
    }
  }
};

// 擦除操作
const erase = (e: MouseEvent | TouchEvent) => {
  if (!canvas.value || !ctx) return;

  const rect = canvas.value.getBoundingClientRect();
  let x = 0;
  let y = 0;

  if ('touches' in e && e.touches.length > 0) {
    x = e.touches[0].clientX - rect.left;
    y = e.touches[0].clientY - rect.top;
  } else if ('clientX' in e && 'clientY' in e) {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }

  if (x >= 0 && y >= 0) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, cursorRadius.value, 0, 2 * Math.PI);
    ctx.fill();

    getScratchedPercentage();
    if (currPerct.value >= maxEraseArea.value) {
      canvasOpacity.value = 0;
      done.value = true;
      localStorage.setItem('scratchCardScratched', 'true');
    }
  }
};

// 获取刮开百分比
const getScratchedPercentage = () => {
  if (ctx) {
    const pixels = ctx.getImageData(0, 0, canvasWidth.value, canvasHeight.value).data;
    let transparentPixels = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] < 128) {
        transparentPixels++;
      }
    }
    currPerct.value = ((transparentPixels / (pixels.length / 4)) * 100).toFixed(2);
  }
};

// 鼠标事件处理
const startMouseScratch = (e: MouseEvent) => {
  posX = e.clientX;
  posY = e.clientY;
  if (e.button === 0) {
    canvas.value?.addEventListener('mousemove', eraseMouseMove, { passive: true });
  }
};

const eraseMouseMove = (e: MouseEvent) => {
  erase(e);
};

const endMouseScratch = (e: MouseEvent) => {
  if (e.target === canvas.value) {
    if (posX === e.clientX && posY === e.clientY) {
      erase(e);
    }
    canvas.value?.removeEventListener('mousemove', eraseMouseMove);
    getScratchedPercentage();
    if (currPerct.value >= maxEraseArea.value) {
      canvasOpacity.value = 0;
      done.value = true;
      localStorage.setItem('scratchCardScratched', 'true');
    }
  }
};

// 触摸事件处理
const startTouchScratch = (e: TouchEvent) => {
  if (e.touches.length > 0) {
    posX = e.touches[0].clientX;
    posY = e.touches[0].clientY;
    canvas.value?.addEventListener('touchmove', eraseTouchMove, { passive: true });
  }
};

const eraseTouchMove = (e: TouchEvent) => {
  erase(e);
};

const endTouchScratch = (e: TouchEvent) => {
  if (e.target === canvas.value) {
    if (posX === e.changedTouches[0].clientX && posY === e.changedTouches[0].clientY) {
      erase(e);
    }
    canvas.value?.removeEventListener('touchmove', eraseTouchMove);
    getScratchedPercentage();
    if (currPerct.value >= maxEraseArea.value) {
      canvasOpacity.value = 0;
      done.value = true;
      localStorage.setItem('scratchCardScratched', 'true');
    }
  }
};

// 初始化和添加事件监听
const onMountedCb = () => {
  checkScratched();
  initContext();
  // addCoat();
  if (canvas.value) {
    canvas.value.addEventListener('mousedown', startMouseScratch);
    canvas.value.addEventListener('touchstart', startTouchScratch);
    document.addEventListener('mouseup', endMouseScratch);
    document.addEventListener('touchend', endTouchScratch);
  }
};

onMounted(onMountedCb);

// 清理事件监听
const cleanupListeners = () => {
  if (canvas.value) {
    canvas.value.removeEventListener('mousedown', startMouseScratch);
    canvas.value.removeEventListener('touchstart', startTouchScratch);
  }
  document.removeEventListener('mouseup', endMouseScratch);
  document.removeEventListener('touchend', endTouchScratch);
};

onBeforeUnmount(() => {
  cleanupListeners();
});

// 画布尺寸动态调整
const updateCanvasSize = () => {
  if (canvas.value) {
    const newWidth = canvas.value.offsetWidth;
    const newHeight = canvas.value.offsetHeight;

    if (newWidth !== canvasWidth.value || newHeight !== canvasHeight.value) {
      canvasWidth.value = newWidth;
      canvasHeight.value = newHeight;

      // 需要重新绘制涂层
      isCoated = false;
      addCoat();
    } else {
      // 画布尺寸未变化，但需要重新绘制涂层
      addCoat();
    }
  }
};


// watch([canvasWidth, canvasHeight], ([newWidth, newHeight], [oldWidth, oldHeight]) => {
//   if (newWidth!== oldWidth || newHeight!== oldHeight) {
//     isCoated = false; // 标记需要重新绘制
//     addCoat();
//   }
// });


onMounted(() => {
  updateCanvasSize();
  window.addEventListener('resize', updateCanvasSize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateCanvasSize);
});
</script>

<style lang="scss" scoped>
.scratch-card {
  position: relative;
  width: 100%;
  height: 100%;
}

.sourceImg {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 99% 99%;
  position: absolute;
  z-index: 1;
  border: none;
  // position: relative;

  .name {
    display: flex;
    align-items: center;
    text-align: center;
    color: #F1EFED;
    justify-content: center;
    position: absolute;
    bottom: 0;
    font-size: 26px;
    height: 47px;
    z-index: 3;
    width: 100%;
  }
}

.scratch-card canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
}
</style>

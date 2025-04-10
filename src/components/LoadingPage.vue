<template>
  <div class="door-content">
    <div class="door-container">
      <div class="door left-door"></div>
      <div class="door right-door"></div>
      <div class="circle-wrapper " :class="{ 'stop-rotate': isOpen }">
        <div class="left-semicircle"></div>
        <div class="right-semicircle"></div>
      </div>
      <div class="loading-text" :class="{ 'loading-text-fade-out': isOpen }">{{ loadingTextContent }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

// 用于接收父组件传递过来的控制开门的变量
const props = defineProps({
  openTrigger: {
    type: Boolean,
    default: false
  }
});

const isOpen = ref(false);
const leftDoorTransform = ref('');
const rightDoorTransform = ref('');
const leftSemicircleTransform = ref('');
const rightSemicircleTransform = ref('');
const loadingTextContent = ref('');

// 使用ref获取半圆元素实例
const leftSemicircle = ref<HTMLElement | null>(null);
const rightSemicircle = ref<HTMLElement | null>(null);

const updateLoadingText = () => {
  const texts = ['.', '..', '...'];
  const currentIndex = Math.floor(Date.now() / 500 % texts.length);
  loadingTextContent.value = `加载中${texts[currentIndex]}`;
};

// 监听父组件传递的openTrigger变量，当其变为true时触发开门动画
watch(() => props.openTrigger, async (newValue) => {
  if (newValue) {
    isOpen.value = true;
    leftDoorTransform.value = 'translateX(-100%)';
    rightDoorTransform.value = 'translateX(100%)';
    leftSemicircleTransform.value = 'translateX(-300%)';
    rightSemicircleTransform.value = 'translateX(300%)';

    await nextTick();
    leftSemicircle.value?.classList.add('open');
    rightSemicircle.value?.classList.add('open');
    await new Promise(resolve => setTimeout(resolve, 500));
    leftSemicircle.value?.classList.add('open-moving');
    rightSemicircle.value?.classList.add('open-moving');

    // 等待过渡动画完成，这里假设过渡动画时间是0.5s，可以根据实际情况调整等待时间
    await new Promise(resolve => setTimeout(resolve, 300));
    // 触发组件销毁
    emit('componentDestroy');
  }
});

// 定义一个事件，用于通知父组件销毁当前组件
const emit = defineEmits(['componentDestroy']);

const intervalId = ref<number | undefined>(undefined);

onMounted(() => {
  intervalId.value = setInterval(updateLoadingText, 100) as unknown as number;
});

// 在组件销毁前清除定时器，避免内存泄漏
onBeforeUnmount(() => {
  if (intervalId.value !== undefined) {
    clearInterval(intervalId.value);
  }
});
</script>

<style lang="scss" scoped>
.door-content {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
}

.door-container {
  width: 750px;
  height: 1624px;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  z-index: 99;

  .door {
    position: absolute;
    width: 50%;
    height: 100%;
    top: 0;
    background-color: #333;
    transition: transform 0.5s ease;
  }

  .left-door {
    background: url(../assets/load-left.webp) no-repeat;
    background-size: 100% 100%;
    left: 0;
    transform-origin: left;
    transform: v-bind(leftDoorTransform);
  }

  .right-door {
    background: url(../assets/load-right.webp) no-repeat;
    background-size: 100% 100%;
    right: 0;
    transform-origin: right;
    transform: v-bind(rightDoorTransform);
  }

  .circle-wrapper {
    display: flex;
    width: 266px;
    height: 268px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    animation: rotateCircle 2s linear infinite;
  }

  .stop-rotate {
    animation: none;
  }

  .left-semicircle {
    width: 133px;
    height: 268px;
    background: url(../assets/cicrle-left.webp) no-repeat;
    background-size: 100% 100%;
    left: 0;
    transform-origin: right center;
    transform: v-bind(leftSemicircleTransform);
    transition: transform 0.5s ease;

    &.open {
      transform: translateX(0) rotateY(0deg);
    }

    &.open-moving {
      transform: translateX(-100%) rotateY(180deg);
    }
  }

  .right-semicircle {
    width: 133px;
    height: 268px;
    background: url(../assets/cicrle-right.webp) no-repeat;
    background-size: 100% 100%;
    right: 0;
    transform-origin: left center;
    transform: v-bind(rightSemicircleTransform);
    transition: transform 0.5s ease;

    &.open {
      transform: translateX(0) rotateY(0deg);
    }

    &.open-moving {
      transform: translateX(100%) rotateY(180deg);
    }
  }

  &.open {
    .left-door {
      transform: translateX(-100%);
    }

    .right-door {
      transform: translateX(100%);
    }
  }

  .loading-text {
    position: absolute;
    top: 60%;
    left: 50%;
    width: 289px;
    height: 59px;
    background: url(@/assets/load-text.webp) no-repeat;
    background-size: 100% 100%;
    line-height: 59px;
    text-align: center;
    font-size: 38px;
    transform: translateX(-50%);
    font-size: 18px;
    color: #FAE9BF;
    z-index: 2;
    transition: opacity 0.5s ease;
  }

  .loading-text-fade-out {
    opacity: 0;
  }

  @keyframes loadingTextFadeOut {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }

  @keyframes rotateCircle {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }

    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
}
</style>

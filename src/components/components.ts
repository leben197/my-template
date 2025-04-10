import { defineAsyncComponent } from 'vue';

export const SequenceFrameAnimationVideoAsync = defineAsyncComponent({
  loader: () => import('@/components/SequenceFrameAnimationVideo.vue'), // 根据实际路径调整组件文件的相对路径
  loadingComponent: () => import('@/components/LoadingPage.vue'), // 这里定义加载中的占位组件，需自行创建，比如一个简单的旋转加载动画组件
  errorComponent: () => import('@/components/LoadingPage.vue'), // 定义加载出错时显示的组件，同样需自行创建，展示错误提示等内容
  delay: 0, // 延迟显示加载组件的时间（毫秒），避免瞬间加载完成也显示加载组件，可根据实际情况调整
  timeout: 3000, // 超时时间（毫秒），如果超过这个时间组件还没加载完成就显示错误组件，可按需设置
});

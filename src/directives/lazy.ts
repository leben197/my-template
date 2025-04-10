import type { App, DirectiveBinding } from "vue";

interface LazyOptions {
  loading?: string; // 加载中显示的图片
  error?: string; // 加载失败显示的图片
  threshold?: number; // 交叉比例阈值
  rootMargin?: string; // 根元素边距
}

// 默认配置
const defaultOptions: LazyOptions = {
  loading:
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", // 透明占位图
  error:
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  threshold: 0.1,
  rootMargin: "0px",
};

// 存储元素与观察者的映射
const observerMap = new WeakMap<HTMLElement, IntersectionObserver>();

// 设置src或背景图片
const setImage = (
  el: HTMLElement,
  src: string,
  isBackground: boolean = false
) => {
  if (isBackground) {
    el.style.backgroundImage = `url(${src})`;
  } else if (el.tagName.toLowerCase() === "img") {
    (el as HTMLImageElement).src = src;
  }
};

// 处理图片加载
const loadImage = (
  el: HTMLElement,
  binding: DirectiveBinding,
  options: LazyOptions
) => {
  const imgSrc = binding.value;
  const isBackground = binding.modifiers.background || false;

  // 设置加载中的占位图
  if (options.loading) {
    setImage(el, options.loading, isBackground);
  }

  // 创建图片对象进行预加载
  const img = new Image();
  img.src = imgSrc;

  img.onload = () => {
    setImage(el, imgSrc, isBackground);
    el.dataset.loaded = "true";
  };

  img.onerror = () => {
    if (options.error) {
      setImage(el, options.error, isBackground);
    }
    el.dataset.failed = "true";
  };
};

// 自定义指令定义
const LazyLoad = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const options: LazyOptions = {
      ...defaultOptions,
      ...(binding.arg ? JSON.parse(binding.arg) : {}),
    };
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage(el, binding, options);
              // 加载后取消观察
              observer.unobserve(el);
              observerMap.delete(el);
            }
          });
        },
        {
          rootMargin: options.rootMargin,
          threshold: options.threshold,
        }
      );

      observer.observe(el);
      observerMap.set(el, observer);
    } else {
      // 降级处理 - 直接加载图片
      loadImage(el, binding, options);
    }
  },

  beforeUnmount(el: HTMLElement) {
    // 清理观察者
    const observer = observerMap.get(el);
    if (observer) {
      observer.unobserve(el);
      observerMap.delete(el);
    }
  },

  updated(el: HTMLElement, binding: DirectiveBinding) {
    // 如果值改变，重新加载
    if (binding.oldValue !== binding.value) {
      const observer = observerMap.get(el);
      if (observer) {
        observer.unobserve(el);
        observerMap.delete(el);
      }

      // 重新挂载指令
      LazyLoad.mounted(el, binding);
    }
  },
};

// 导出插件安装函数
export default {
  install(app: App) {
    app.directive("lazy", LazyLoad);
  },
};

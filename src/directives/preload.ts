import type { App, Directive, DirectiveBinding } from 'vue';

// 定义预加载配置接口
interface PreloadOptions {
  onLoaded?: () => void;       // 加载完成回调
  onError?: (error: any) => void;  // 加载错误回调
  methods?: string[];          // 要调用的方法名列表
}

const vPreload: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 获取配置选项
    const options: PreloadOptions = binding.value || {};
    const methodNames = options.methods || ['preload', 'loadResources'];

<<<<<<< HEAD
    // 使用自定义数据属性存储加载状态
    el.dataset.preloading = 'true';
=======
        if (component) {
            const componentWithPreload = component as ComponentWithPreload;
            let loadPromises: Promise<void>[] = [];
            if (componentWithPreload.preload) {
                loadPromises.push(componentWithPreload.preload());
            }
            if (componentWithPreload.loadResources) {
                loadPromises.push(componentWithPreload.loadResources());
            }
            // 可以根据实际更多组件的加载方法情况继续添加判断和调用逻辑
>>>>>>> 77b736a (普通模板)

    // 在元素上添加加载状态的CSS类
    el.classList.add('preloading');

    // 使用 Attribute 存储组件上下文（通过父组件传递）
    const preloadContext = el.getAttribute('data-preload-context');
    let component;

    try {
      component = preloadContext ? JSON.parse(preloadContext) : null;
    } catch (e) {
      console.error('无法解析预加载上下文', e);
    }

    if (!component) {
      console.warn('预加载指令无法获取组件实例，请确保设置了data-preload-context属性');
      return;
    }

    // 收集所有可用的预加载方法
    const loadPromises: Promise<void>[] = [];

    methodNames.forEach(methodName => {
      if (typeof component[methodName] === 'function') {
        try {
          const result = component[methodName]();
          if (result instanceof Promise) {
            loadPromises.push(result);
          }
        } catch (err) {
          console.error(`调用 ${methodName} 方法出错:`, err);
        }
      }
    });

    // 等待所有资源加载完成
    if (loadPromises.length > 0) {
      Promise.all(loadPromises)
        .then(() => {
          // 更新元素状态
          el.dataset.preloading = 'false';
          el.dataset.preloaded = 'true';
          el.classList.remove('preloading');
          el.classList.add('preloaded');

          // 触发回调
          if (typeof options.onLoaded === 'function') {
            options.onLoaded();
          }

          // 分发自定义DOM事件
          el.dispatchEvent(new CustomEvent('preload-complete'));
        })
        .catch((error) => {
          el.dataset.preloading = 'false';
          el.dataset.preloadError = 'true';
          el.classList.remove('preloading');
          el.classList.add('preload-error');

          if (typeof options.onError === 'function') {
            options.onError(error);
          }

          console.error('资源预加载出错:', error);
          el.dispatchEvent(new CustomEvent('preload-error', { detail: error }));
        });
    } else {
      // 没有找到可执行的预加载方法
      el.dataset.preloading = 'false';
      el.dataset.preloaded = 'true';
      el.classList.remove('preloading');
      el.classList.add('preloaded');

      if (typeof options.onLoaded === 'function') {
        options.onLoaded();
      }
    }
  }
};

// 注册插件
export default {
  install(app: App) {
    app.directive('preload', vPreload);
  }
};

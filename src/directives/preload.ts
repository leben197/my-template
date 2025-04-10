import { Directive, DirectiveBinding } from 'vue';

interface ComponentWithPreload {
    // 定义一个接口，包含不同组件可能有的加载方法名称
    preload?: () => Promise<void>;
    loadResources?: () => Promise<void>;
    // 可以根据实际更多组件的需求，在这里添加更多可能的加载方法名称
}

const preloadDirective: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const component = binding.instance;

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

            Promise.all(loadPromises).then(() => {
                // 资源加载完成后，触发组件实例上的自定义事件（假设组件有对应的处理函数来响应这个事件）
                component.$emit('component-loaded');
            }).catch((error) => {
                console.error('资源加载出错:', error);
            });
        }
    }
};

export default preloadDirective;


import preloadDirective from '@/directives/preload';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import './style.css';
// const vConsole = new VConsole();
import router from './router';
const pinia = createPinia()
const app = createApp(App)
app.use(router).use(pinia).directive('preload', preloadDirective).mount("#app");

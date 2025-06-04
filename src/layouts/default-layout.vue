<template>
  <div class="default-layout" :class="{ 'mobile': isMobile }">
    <!-- 移动端显示顶部导航栏 -->
    <header class="layout-header">
      <div class="flex items-center">
        <!-- 移动端显示菜单按钮 -->
        <div v-if="isMobile" class="menu-toggle mr-4" @click="toggleMobileMenu">
          <div class="i-carbon-menu text-xl"></div>
        </div>
        <div class="logo">{{ appConfig?.app?.name || '后台管理系统' }}</div>
      </div>
      <div class="header-right">
        <ThemeSwitcher />
        <div class="user-info ml-4">
          <img class="avatar" :src="userStore?.avatar || '/avatar-default.png'" alt="用户头像">
          <span v-if="!isMobile" class="username">{{ userStore?.name || '未登录' }}</span>
        </div>
      </div>
    </header>
    
    <div class="layout-body">
      <!-- 桌面端侧边栏 -->
      <aside v-if="!isMobile" class="layout-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-toggle" @click="toggleSidebar">
          <i class="icon">{{ sidebarCollapsed ? '>' : '<' }}</i>
        </div>
        
        <nav class="sidebar-menu">
          <ul>
            <li v-for="route in mainRoutes" :key="route.path">
              <router-link :to="route.path">
                <i v-if="route.meta?.icon" :class="route.meta.icon"></i>
                <span v-if="!sidebarCollapsed" class="menu-title">{{ route.meta?.title || '未命名' }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>
      
      <!-- 移动端抽屉式菜单 -->
      <div
v-if="isMobile" class="mobile-sidebar-overlay" 
           :class="{ active: mobileMenuActive }" 
           @click="mobileMenuActive = false"></div>
      
      <aside v-if="isMobile" class="mobile-sidebar" :class="{ active: mobileMenuActive }">
        <div class="p-4 border-b border-border-color">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">菜单导航</h3>
            <div class="close-menu" @click="mobileMenuActive = false">
              <div class="i-carbon-close text-lg"></div>
            </div>
          </div>
        </div>
        <nav class="mobile-menu p-2">
          <ul>
            <li v-for="route in mainRoutes" :key="route.path">
              <router-link :to="route.path" @click="mobileMenuActive = false">
                <i v-if="route.meta?.icon" :class="route.meta.icon"></i>
                <span class="menu-title">{{ route.meta?.title || '未命名' }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>
      
      <main class="layout-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
import { useTheme } from '@/composables/useTheme';
import { useDevice } from '@/composables/useDevice';

// 初始化主题
const { initTheme } = useTheme();
onMounted(() => {
  initTheme();
});

// 检测设备类型
const { isMobile } = useDevice();

// 临时配置
const appConfig = {
  app: {
    name: '后台管理系统'
  }
};

// 如果有用户状态管理，可以取消此注释
// import { useUserStore } from '@/stores/modules/user';
// const userStore = useUserStore();

// 临时用户状态
const userStore = ref({
  name: '测试用户',
  avatar: ''
});

const router = useRouter();
const sidebarCollapsed = ref(false);

// 移动端菜单状态
const mobileMenuActive = ref(false);

// 主要路由，用于侧边栏渲染
const mainRoutes = computed(() => {
  const routes = router.getRoutes();
  return routes.filter(route => {
    return route.meta?.showInMenu !== false && route.path !== '/login' && !route.path.includes(':') && route.path !== '/:pathMatch(.*)';
  });
});

// 缓存的页面组件
const cachedViews = computed(() => {
  return mainRoutes.value
    .filter(route => route.meta?.keepAlive)
    .map(route => route.name)
    .filter(Boolean);
});

// 切换侧边栏折叠状态
function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
}

// 切换移动端菜单
function toggleMobileMenu() {
  mobileMenuActive.value = !mobileMenuActive.value;
}
</script>

<style lang="scss" scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  
  .layout-header {
    height: 60px;
    background-color: var(--bg-base);
    box-shadow: 0 1px 4px rgb(0 0 0 / 10%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 10;
    
    .logo {
      font-size: 18px;
      font-weight: bold;
      color: var(--primary-color);
    }
    
    .header-right {
      display: flex;
      align-items: center;
      
      .user-info {
        display: flex;
        align-items: center;
        cursor: pointer;
        
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin-right: 8px;
        }
      }
    }
  }
  
  .layout-body {
    display: flex;
    flex: 1;
    overflow: hidden;
    
    .layout-sidebar {
      width: 220px;
      height: 100%;
      background-color: var(--bg-soft);
      transition: width 0.3s;
      position: relative;
      
      &.collapsed {
        width: 64px;
      }
      
      .sidebar-toggle {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-primary);
      }
      
      .sidebar-menu {
        ul {
          padding: 0;
          margin: 0;
          list-style: none;
          
          li {
            a {
              display: flex;
              align-items: center;
              padding: 12px 16px;
              color: var(--text-primary);
              text-decoration: none;
              transition: all 0.3s;
              
              &:hover, &.router-link-active {
                color: var(--primary-color);
                background-color: var(--bg-muted);
              }
              
              i {
                margin-right: 8px;
                font-size: 16px;
              }
              
              .menu-title {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
          }
        }
      }
    }
    
    // 移动端侧边栏
    .mobile-sidebar-overlay {
      position: fixed;
      inset: 0;
      background-color: rgb(0 0 0 / 50%);
      z-index: 20;
      display: none;
      
      &.active {
        display: block;
      }
    }
    
    .mobile-sidebar {
      position: fixed;
      top: 0;
      left: -250px;
      width: 250px;
      height: 100%;
      background-color: var(--bg-base);
      z-index: 30;
      transition: left 0.3s ease;
      box-shadow: 0 0 10px rgb(0 0 0 / 10%);
      
      &.active {
        left: 0;
      }
      
      .mobile-menu {
        ul {
          padding: 0;
          margin: 0;
          list-style: none;
          
          li {
            a {
              display: flex;
              align-items: center;
              padding: 12px 16px;
              color: var(--text-primary);
              text-decoration: none;
              border-radius: 6px;
              margin-bottom: 4px;
              
              &:hover, &.router-link-active {
                color: var(--primary-color);
                background-color: var(--bg-muted);
              }
              
              i {
                margin-right: 12px;
                font-size: 16px;
              }
            }
          }
        }
      }
    }
    
    .layout-content {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      background-color: var(--bg-muted);
      
      // 移动端内容区域样式调整
      .default-layout.mobile & {
        padding: 12px;
      }
    }
  }
}

// 页面过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 响应式样式调整
.default-layout.mobile {
  .layout-content {
    padding: 12px;
  }
}

.menu-toggle {
  cursor: pointer;
  padding: 4px;
}

.close-menu {
  cursor: pointer;
  padding: 4px;
}
</style>

import { createMemoryHistory, createRouter } from 'vue-router'

import Index from '@/pages/index.vue'
const routes = [
  { path: '/', component: Index }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
export default router

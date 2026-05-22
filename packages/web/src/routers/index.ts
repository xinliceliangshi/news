import { createRouter, createWebHistory } from 'vue-router'

import { errorRouter, staticRouter } from './staticRouter'

const router = createRouter({
  history: createWebHistory(),
  routes: [...staticRouter, ...errorRouter],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router

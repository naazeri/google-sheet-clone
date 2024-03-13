import { createRouter, createWebHistory } from 'vue-router'
import SheetsView from '@/views/SheetsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SheetsView
    },
    {
      path: '/:catchall(.*)*',
      name: 'not found',
      component: () => import('@/views/error/NotFoundView.vue')
    }
  ]
})

export default router

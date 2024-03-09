import { createRouter, createWebHistory } from 'vue-router'
import MenuView from '@/views/MenuView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'menu',
      component: MenuView
    },
    {
      path: '/wheel',
      name: 'wheelView',
      component: () => import('@/views/wheel/WheelView.vue')
    },
    {
      path: '/wheel/manage',
      name: 'wheelManage',
      component: () => import('@/views/wheel/ManageItems.vue')
    },
    {
      path: '/sheets',
      name: 'sheets',
      component: () => import('@/views/sheet/SheetsView.vue')
    },
    {
      path: '/:catchall(.*)*',
      name: 'not found',
      component: () => import('@/views/error/NotFoundView.vue')
    }
  ]
})

export default router

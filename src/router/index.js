import { createRouter, createWebHistory } from 'vue-router'
import MenuView from '../views/MenuView.vue'

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
      name: 'wheel',
      component: () => import('../views/WheelView.vue')
    },
    {
      path: '/sheets',
      name: 'sheets',
      // component: () => import('../views/Sheet.vue')
      component: () => import('../views/SheetsView.vue')
    }
  ]
})

export default router

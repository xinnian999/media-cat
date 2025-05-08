import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: '首页',
      icon: 'icon-home',
    },
  },
  {
    path: '/publish',
    name: 'publish',
    component: () => import('../views/Publish.vue'),
    meta: {
      title: '发布',
      icon: 'icon-arrow-rise',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export { routes, router }

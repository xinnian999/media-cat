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
    component: () => import('../views/Publish/index.vue'),
    meta: {
      title: '发布',
      icon: 'icon-arrow-rise',
    },
  },
  {
    path: '/publish-play',
    name: 'publish-play',
    component: () => import('../views/Publish/Play.vue'),
  },
  {
    path: '/publish-result',
    name: 'publish-result',
    component: () => import('../views/Publish/Result.vue'),
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../views/Account.vue'),
    meta: {
      title: '账号管理',
      icon: 'icon-user-group',
    },
  },
  {
    path: '/data',
    name: 'data',
    component: () => import('../views/Data.vue'),
    meta: {
      title: '数据',
      icon: 'icon-bar-chart',
    },
  },
  {
    path: '/tool',
    name: 'tool',
    component: () => import('../views/Tool/index.vue'),
    meta: {
      title: '小工具',
      icon: 'icon-tool',
    },
  },
  {
    path: '/tool/videoDownlad',
    name: 'videoDownlad',
    component: () => import('../views/Tool/VideoDownlad.vue'),
  },
  {
    path: '/tool/dyAutherBatchDownload',
    name: 'dyAutherBatchDownload',
    component: () => import('../views/Tool/DyAutherBatchDownload/index.vue'),
  },
  {
    path: '/tool/dyAutherBatchDownload/detail',
    name: 'dyAutherBatchDownloadDetail',
    component: () => import('../views/Tool/DyAutherBatchDownload/Detail.vue'),
  },
  {
    path: '/tool/findHttp',
    name: 'findHttp',
    component: () => import('../views/Tool/FindHttp.vue'),
  },
  {
    path: '/tool/scriptScene',
    name: 'scriptScene',
    component: () => import('../views/Tool/ScriptScene.vue'),
  },  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export { routes, router }

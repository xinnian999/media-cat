<template>
  <a-layout class="layout-demo">
    <a-layout-sider collapsible breakpoint="xl" @collapse="onCollapse">
      <div class="logo">{{ isCollapsed ? '琳' : '小琳自媒矩阵' }}</div>
      <a-menu
        :default-open-keys="['1']"
        :default-selected-keys="['0_3']"
        :style="{ width: '100%' }"
        @menu-item-click="onClickMenuItem"
      >
        <a-menu-item v-for="item in routes" :key="item.path">
          <component :is="item.meta.icon"></component>
          {{ item.meta.title }}
        </a-menu-item>
      </a-menu>
      <!-- trigger -->
      <template #trigger="{ collapsed }">
        <IconCaretRight v-if="collapsed"></IconCaretRight>
        <IconCaretLeft v-else></IconCaretLeft>
      </template>
    </a-layout-sider>

    <a-layout>
      <a-layout style="padding-left: 12px">
        <a-layout-content>
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { routes } from './router'
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

const isCollapsed = ref(false)
const router = useRouter()

const onCollapse = (collapsed) => {
  isCollapsed.value = collapsed
}

const onClickMenuItem = (key) => {
  router.push(key)
}

watchEffect(() => {
  console.log(isCollapsed.value)
})
</script>
<style scoped>
.layout-demo {
  height: 100%;
  background: var(--color-fill-2);
  border: 1px solid var(--color-border);
}
.layout-demo :deep(.arco-layout-sider) .logo {
  height: 32px;
  margin: 12px 8px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: #511fe8;
}
.layout-demo :deep(.arco-layout-sider-light) .logo {
  background: var(--color-fill-2);
}

.layout-demo :deep(.arco-layout-content) {
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  background: var(--color-bg-3);
  padding: 12px;
}

</style>

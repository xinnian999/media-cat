<template>
  <a-layout class="layout">
    <div class="drag-bar"></div>

    <a-layout-sider class="layout-left" style="width: 180px;">
      <div class="logo">​​媒力猫</div>
      <a-menu
        class="menus"
        :default-selected-keys="['/']"
        :style="{ width: '100%' }"
        @menu-item-click="onClickMenuItem"
      >
        <a-menu-item v-for="item in menus" :key="item.path">
          <component :is="item.meta.icon"></component>
          {{ item.meta.title }}
        </a-menu-item>
      </a-menu>

    </a-layout-sider>

    <a-layout class="layout-right">
      <a-layout-content class="layout-right-content">
        <router-view />
        <a-back-top target-container=".layout-right-content" :style="{position:'fixed'}" />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script setup>
import { routes } from './router'
import { useRouter } from 'vue-router'

const menus = routes.filter(item => item.meta)

const router = useRouter()

const onClickMenuItem = (key) => {
  router.push(key)
}
</script>
<style scoped lang="scss">
.layout {
  height: 100%;
  background: #eceefe;
  position: relative;

  .drag-bar{
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    height: 30px;
    width: 100vw;
    -webkit-app-region: drag;
  }

  .layout-left {
    background: #eceefe;
    box-shadow: none;
    padding-top: 20px;

    .logo {
      height: 32px;
      margin: 12px 8px;
      background: rgba(255, 255, 255, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      color: #511fe8;
      border-radius: 10px;
    }

    .menus {
      background: transparent;

      .arco-menu-item {
        background: transparent;
        border-radius: 10px;

        &:hover {
          background: rgba(255, 255, 255, 0.6);
        }
      }

      .arco-menu-item.arco-menu-selected {
        background: #fff;
      }
    }
  }

  .layout-right {
    background: #eceefe;
    padding: 5px;
    .layout-right-content{
      border-radius: 10px;
      background: #fff;
      padding: 10px;
      overflow: auto;
      position: relative;
    }
  }
}

</style>

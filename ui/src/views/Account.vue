<template>
  <div class="account-list">
    <a-card v-for="item in items" :key="item.label" class="account-item">
      <template #title>
        <div class="title">
          <img :src="item.icon" alt="icon" />
          <span>{{ item.label }}</span>
        </div>
      </template>

      <template #extra>
        <a-button  size="small" @click="bind(item.url)">绑定账号</a-button>
      </template>

      <div class="content">
        <div class="empty">未绑定账号</div>
      </div>
    </a-card>
  </div>
</template>

<script setup>
const items = [
  {
    label: '抖音',
    icon: '/douyin.ico',
    url: 'https://creator.douyin.com/'
  },
  {
    label: '快手',
    icon: '/kuaishou.ico',
    url: 'https://creator.kuaishou.com/'
  },
]

const bind = (url) => {
  window.electron.invoke('bindAccount', url)
}
</script>

<style lang="scss">
.account-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  .title {
    display: flex;
    align-items: center;
    gap: 10px;
    img {
      width: 20px;
      height: 20px;
    }
  }

  .account-item {
    .content {
      height: 150px;

      .empty {
        font-size: 16px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>

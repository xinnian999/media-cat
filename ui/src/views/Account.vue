<template>
  <div class="account-page">
    <a-divider orientation="center" style="margin-bottom: 35px">账号管理</a-divider>

    <div class="account-list">
      <a-card v-for="item in platforms.list" :key="item.label" class="account-item">
        <template #title>
          <div class="title">
            <img :src="item.icon" alt="icon" />
            <span>{{ item.label }}</span>
          </div>
        </template>

        <template #extra>
          <a-button size="small" @click="bind(item.platform)"
            >{{ platforms.accountMap[item.platform] ? '切换' : '绑定' }}账号</a-button
          >
        </template>

        <div class="content">
          <div v-if="platforms.accountMap[item.platform]" class="account-info">
            <div class="avatar">
              <img :src="platforms.accountMap[item.platform].avatar" alt="avatar" />
            </div>
            <div class="info">
              <div class="username">{{ platforms.accountMap[item.platform].nickname }}</div>
            </div>
          </div>
          <div class="empty" v-else>未绑定账号</div>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script setup>
import { Message } from '@arco-design/web-vue'
import usePlatforms from '@/hooks/usePlatforms'

const platforms = usePlatforms()

const bind = async (platform) => {
  await window.electron.invoke('bindAccount', platform)
  Message.success('绑定成功')
  platforms.refresh()
}
</script>

<style lang="scss">
.account-page {
  padding: 15px;
}
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
      display: flex;
      align-items: center;
      justify-content: center;
      .account-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .username {
          font-size: 16px;
          font-weight: 600;
          text-align: center;
        }
      }

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

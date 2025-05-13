<template>
  <div>
    <a-divider orientation="center" style="margin-bottom: 35px">账号管理</a-divider>

    <div class="account-list">
      <a-card v-for="item in allPlatforms" :key="item.label" class="account-item">
        <template #title>
          <div class="title">
            <img :src="item.icon" alt="icon" />
            <span>{{ item.label }}</span>
          </div>
        </template>

        <template #extra>
          <a-button size="small" @click="bind(item.platform)"
            >{{ profile[item.platform] ? '切换' : '绑定' }}账号</a-button
          >
        </template>

        <div class="content">
          <div v-if="profile[item.platform]" class="account-info">
            <div class="avatar">
              <img :src="profile[item.platform].avatar" alt="avatar" />
            </div>
            <div class="info">
              <div class="username">{{ profile[item.platform].username }}</div>
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
import { ref, onMounted } from 'vue'
import allPlatforms from '@/assets/allPlatforms'

const profile = ref({})

const refreshProfile = async () => {
  const res = await window.electron.invoke('profile')
  profile.value = res
}

const bind = async (platform) => {
  await window.electron.invoke('bindAccount', platform)
  Message.success('绑定成功')
  refreshProfile()
}

onMounted(refreshProfile)
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

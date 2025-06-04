<template>
  <div class="data-page">
    <a-tabs v-if="platforms.accountList.length > 0" v-model:activeKey="activeKey" @change="platforms.update">
      <a-tab-pane v-for="plat in platforms.accountList" :title="plat.label" :key="plat.platform">
        <template #title>
          <div class="tab-item">
            <img class="icon" :src="plat.icon" alt="avatar" />
            <span>{{ plat.label }}</span>
          </div>
        </template>
        <div class="data-content">
          <div class="data-item" v-for="item in items" :key="item.value">
            <div class="data-item-label">{{ item.label }}</div>
            <div class="data-item-value">
              <component :is="item.render(plat)" />
            </div>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
    <div v-else class="empty">
      <a-empty description="请先绑定账号" />
    </div>
  </div>
</template>

<script setup lang="jsx">
import usePlatforms from '@/hooks/usePlatforms'
import { onMounted, ref } from 'vue'

const platforms = usePlatforms()

const activeKey = ref('douyin')

const items = [
  {
    label: '创作中心',
    render: (record) => (
      <a-button
        type="primary"
        onClick={() =>
          window.electron.invoke('goCreateCenter', { platform: record.platform, url: record.url })
        }
      >
        打开
      </a-button>
    ),
  },
  {
    label: '用户名',
    render: (record) => <span>{record.nickname}</span>,
  },
  {
    label: '头像',
    render: (record) => <img class="icon" src={record.avatar} alt="avatar" />,
  },
  {
    label: '粉丝量',
    render: (record) => <span>{record.follower_count}</span>,
  },
  {
    label: '获赞数',
    render: (record) => <span>{record.total_favorited}</span>,
  },
  {
    label: '可提现余额',
    render: (record) => <span>0</span>,
  },
]

onMounted(() => {
  platforms.update()

  setTimeout(() => {
    if (platforms.accountList.length > 0) {
      activeKey.value = platforms.accountList[0].platform
    }
  })
})
</script>

<style lang="scss">
.data-page {
  padding: 15px;

  .tab-item {
    display: flex;
    align-items: center;
    gap: 10px;

    .icon {
      width: 20px;
      height: 20px;
    }
  }

  .empty {
    height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.updateing {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-bottom: 15px;
}
.data-content {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;

  .data-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 10px;
    border-radius: 10px;
    background-color: #f0f0f0;
    height: 100px;
    font-size: 12px;

    .data-item-value {
      font-size: 20px;
      font-weight: bold;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>

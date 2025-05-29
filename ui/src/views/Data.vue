<template>
  <div class="data-page">
    <a-tabs default-active-key="douyin" @change="refreshPlatforms">
      <a-tab-pane v-for="plat in platforms" :title="plat.label" :key="plat.platform">
        <!-- <div v-if="updateing" class="updateing"><a-spin /> 数据更新中</div> -->
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
  </div>
</template>

<script setup lang="jsx">
import usePlatforms from '@/hooks/usePlatforms'
import { onMounted, onUnmounted } from 'vue'

const { platforms, update, refreshPlatforms } = usePlatforms()

const items = [
  {
    label: '平台',
    render: (record) => <img class="icon" src={record.icon} alt="avatar" />,
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
    label: '总收入',
    render: (record) => <span>0</span>,
  },
  {
    label: '可提现余额',
    render: (record) => <span>0</span>,
  },
]

onMounted(update)

onUnmounted(() => {
  window.electron.invoke('stop', 'updateProfile')
})
</script>

<style lang="scss">
.data-page {
  padding: 15px;
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

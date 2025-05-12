<template>
  <div>
    <a-tabs default-active-key="douyin">
      <a-tab-pane v-for="plat in platforms" :title="plat.label" :key="plat.platform">
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

const platforms = usePlatforms()

const items = [
  {
    label: '平台',
    render: (record) => <img class="icon" src={record.icon} alt="avatar" />,
  },
  {
    label: '用户名',
    render: (record) => <span>{record.username}</span>,
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
    label: '关注数',
    render: (record) => <span>{record.following_count}</span>,
  },
  {
    label: '获赞数',
    render: (record) => <span>{record.total_favorited}</span>,
  },
]
</script>

<style lang="scss">
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

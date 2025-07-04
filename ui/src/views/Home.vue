<template>
  <div class="home-page">
    <!-- <h1>首页</h1> -->
    <div class="bar">
      <div class="welcome-box">
        <div class="welcome">🎉 {{ period }}好！</div>
        <div class="day">
          今天是你使用媒力猫的第<span class="day-count">{{ day }}</span
          >天
        </div>
      </div>
    </div>

    <div class="bar">
      <div class="bar-title">数据概览</div>
      <div class="summary">
        <div class="summary-item" v-for="item in summary" :key="item.title">
          <div class="summary-item-title">{{ item.title }}</div>
          <div class="summary-item-value">{{ item.value }}</div>
        </div>
      </div>
    </div>

    <div class="bar">
      <div class="bar-title">快速入口</div>
      <div class="summary">
        <a-button
          v-for="item in quickEntry"
          :style="{ backgroundColor: item.color }"
          type="primary"
          :key="item.title"
          @click="router.push(item.path)"
        >
          <template #icon>
            <component :is="item.icon"></component>
          </template>
          {{ item.title }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import usePlatforms from '@/hooks/usePlatforms'
import { useRouter } from 'vue-router'
import useFetchList from '@/hooks/useFetchList'

const day = ref(1)

const router = useRouter()

const platforms = usePlatforms()

const publishList = useFetchList('publishLog')

const period = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '凌晨'
  if (hour < 12) return '上午'
  if (hour < 18) return '下午'
  return '晚上'
})

const summary = computed(() => {
  const accountList = platforms.accountList

  console.log(accountList);

  return [
    {
      title: '已绑定平台数',
      value: accountList.length,
    },
    {
      title: '总发布量',
      value: publishList.value.length,
    },
    {
      title: '总粉丝数',
      value: accountList.reduce((acc, item) => acc + item.follower_count, 0),
    },
    {
      title: '总获赞量',
      value: accountList.reduce((acc, item) => acc + item.total_favorited, 0),
    }
  ]
})

const quickEntry = [
  {
    title: '发布视频',
    icon: 'icon-arrow-rise',
    path: '/publish-play',
  },
  {
    title: '绑定账号',
    icon: 'icon-user-group',
    path: '/account',
    color: '#511fe8',
  },
  {
    title: '提取视频',
    icon: 'icon-plus',
    path: '/tool/videoDownlad',
    color: '#11a0d9',
  },
]

onMounted(() => {
  platforms.update()

  if (!localStorage.getItem('initTime')) {
    localStorage.setItem('initTime', Date.now())
  } else {
    const initTime = localStorage.getItem('initTime')
    const now = Date.now()
    const diff = now - initTime
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    day.value = days + 1
  }
})
</script>

<style lang="scss" scoped>
.home-page {
  height: 100%;
  width: 100%;
  background-color: #f8f8f9;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .bar {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    .bar-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 10px;
    }
  }

  .welcome-box {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .welcome {
      font-size: 20px;
      font-weight: 700;
    }

    .day {
      font-size: 14px;
      color: #666;

      .day-count {
        color: #511fe8;
        font-weight: 700;
        padding: 0 5px;
      }
    }
  }

  .summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 15px;

    .summary-item {
      background-color: #f8f8f9;
      border-radius: 10px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      justify-content: center;
      align-items: center;

      .summary-item-title {
        font-size: 14px;
        color: #666;
      }

      .summary-item-value {
        font-size: 20px;
        font-weight: 700;
      }
    }
  }
}
</style>

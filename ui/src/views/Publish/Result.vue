<template>
  <div class="publish-result">
    <a-page-header title="发布详情" @back="onBack">
      <template #extra>
        <a-button type="primary" @click="onStop" :disabled="stoped">{{
          stoped ? '已停止' : '停止发布'
        }}</a-button>
      </template>
    </a-page-header>

    <a-list class="publish-result-list">
      <a-list-item v-for="{ platform, percent, status, statusText, logs } in list" :key="platform">
        <a-list-item-meta :title="accountMap[platform]?.label">
          <template #avatar>
            <a-avatar shape="square">
              <img alt="avatar" :src="accountMap[platform]?.icon" />
            </a-avatar>
          </template>

          <template #description>
            <div class="description">
              <a-progress :percent="percent" :status="status" class="progress">
                <template v-slot:text="scope">
                  {{ scope.percent * 100 }}% - {{ statusText }}
                </template>
              </a-progress>

              <div v-if="status === 'danger'" style="display: flex; gap: 20px">
                <a-button @click="handleRestart(platform)">重新发布</a-button>
                <a-button @click="handleRestart(platform, true)">可视化重新发布</a-button>
              </div>

              <div style="flex: 1">
                <a-collapse>
                  <a-collapse-item header="执行日志" key="1">
                    <div v-for="log in logs" :key="log">
                      <div>{{ log }}</div>
                    </div>
                  </a-collapse-item>
                </a-collapse>
              </div>
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, toRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import usePlatforms from '@/hooks/usePlatforms'

const route = useRoute()
const router = useRouter()

const list = ref([])

const platforms = usePlatforms()

const accountMap = toRef(platforms, 'accountMap')

const stoped = ref(false)

const onBack = () => {
  router.back()
}

const onStop = async () => {
  list.value.forEach((platform) => {
    window.electron.invoke('stop', platform)
  })
  stoped.value = true
}

const statusMap = {
  ing: '执行中',
  danger: '发布失败',
  success: '发布成功',
}

const handleRestart = (platform, observe = false) => {
  const item = list.value.find((item) => item.platform === platform)

  item.percent = 0
  item.status = 'ing'
  item.statusText = statusMap.ing
  item.logs = []

  window.electron.invoke('publish', {
    ...JSON.parse(route.query.data),
    platform,
    observe,
  })
}

onMounted(async () => {
  // 监听发布进度
  window.electron.on('publish-progress', (event, data) => {
    const item = list.value.find((item) => item.platform === data.platform)

    if (!item) return

    // 更新进度和消息
    item.percent = data.percent
    item.logs.push(data.msg)

    // 如果状态存在，更新状态
    if (data.status) {
      item.status = data.status
      item.statusText = statusMap[data.status]
    }
  })

  const data = JSON.parse(route.query.data)

  list.value = data.platforms.map((plat) => {
    return {
      platform: plat,
      percent: 0,
      status: 'ing',
      statusText: statusMap.ing,
      logs: [],
    }
  })

  const publishs = data.platforms.map(async (platform) => {
    await window.electron.invoke('publish', {
      ...data,
      platform,
    })
  })

  await Promise.all(publishs)

  Message.success('所有平台发布完成')

  stoped.value = true
})

onUnmounted(() => {
  list.value.forEach(({ platform }) => {
    window.electron.invoke('stop', platform)
  })
})
</script>

<style lang="scss">
.publish-result {
  .publish-result-list {
    padding: 0 20px;

    .description {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .progress {
      width: 50%;
    }

    .arco-list-item-meta {
      align-items: start;
    }
    .arco-list-item-meta-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>

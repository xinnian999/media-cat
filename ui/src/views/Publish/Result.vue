<template>
  <div class="publish-result">
    <a-page-header title="发布详情" @back="onBack">
      <template #extra>
        <a-button type="primary" @click="onStop" :disabled="stoped">{{
          stoped ? '已停止' : '停止发布'
        }}</a-button>
      </template>
    </a-page-header>

    <a-list style="padding: 0 20px">
      <a-list-item v-for="plat in list" :key="plat">
        <a-list-item-meta :title="accountMap[plat]?.label">
          <template #avatar>
            <a-avatar shape="square">
              <img alt="avatar" :src="accountMap[plat]?.icon" />
            </a-avatar>
          </template>

          <template #description>
            <a-progress
              :percent="progressMap[plat]?.[progressMap[plat].length - 1]?.percent || 0"
              :status="progressMap[plat]?.[progressMap[plat].length - 1]?.status"
              :style="{ width: '50%', marginBottom: '10px' }"
            >
              <template v-slot:text="scope">
                {{ scope.percent === 1 ? statusMap[progressMap[plat]?.[progressMap[plat].length - 1]?.status] : `${scope.percent * 100}%` }}
              </template>
            </a-progress>

            <div style="flex: 1">
              <a-collapse>
                <a-collapse-item header="执行日志" key="1">
                  <div v-for="log in progressMap[plat]" :key="log.msg">
                    <div>{{ log.msg }}</div>
                  </div>
                </a-collapse-item>
              </a-collapse>
            </div>
          </template>
        </a-list-item-meta>

        <!-- <template #actions>
          <icon-delete />
        </template> -->
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

const progressMap = ref({})

const stoped = ref(false)

const onBack = () => {
  router.back()
}

const statusMap = {
  danger: '发布失败',
  success: '发布成功',
}

onMounted(async () => {
  window.electron.on('upload-progress', (event, data) => {
    // console.log(progressMap.value)

    const platformProgress = progressMap.value[data.platform]

    if (!platformProgress) {
      progressMap.value[data.platform] = []
    }
    progressMap.value[data.platform].push(data)
  })

  const data = JSON.parse(route.query.data)

  list.value = data.platforms

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

const onStop = async () => {
  list.value.forEach((platform) => {
    window.electron.invoke('stop', platform)
  })
  stoped.value = true
}

onUnmounted(() => {
  window.electron.invoke('stop')
})
</script>

<style lang="scss">
.publish-result {
  .arco-list-item-meta {
    align-items: start;
  }
  .arco-list-item-meta-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .footer {
    text-align: center;
  }
}
</style>

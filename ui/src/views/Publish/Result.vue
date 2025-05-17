<template>
  <div class="publish-result">
    <a-page-header title="发布详情" @back="onBack">
      <template #extra>
        <a-button type="primary" @click="onStop" :disabled="stoped">{{
          stoped ? '已停止' : '停止发布'
        }}</a-button>
      </template>
    </a-page-header>
    <a-list>
      <a-list-item v-for="plat in list" :key="plat">
        <a-list-item-meta :title="platformMap[plat].label">
          <template #avatar>
            <a-avatar shape="square">
              <img alt="avatar" :src="platformMap[plat].icon" />
            </a-avatar>
          </template>

          <template #description>
            <a-progress
              :percent="progressMap[plat]?.[progressMap[plat].length - 1]?.percent || 0"
              :style="{ width: '50%', marginBottom: '10px' }"
            >
              <template v-slot:text="scope">
                {{ scope.percent === 1 ? '发布完成' : `${scope.percent * 100}%` }}
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
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import platforms from '@/assets/allPlatforms'

const route = useRoute()
const router = useRouter()

const list = ref([])

const stoped = ref(false)

const platformMap = platforms.reduce((acc, cur) => {
  acc[cur.platform] = cur
  return acc
}, {})

const progressMap = ref({})

const onBack = () => {
  router.back()
}

onMounted(async () => {
  window.electron.on('upload-progress', (event, data) => {
    if (!progressMap.value[data.platform]) {
      progressMap.value[data.platform] = []
    }
    progressMap.value[data.platform].push(data)
  })

  const data = JSON.parse(route.query.data)

  list.value = data.platforms

  await window.electron.invoke('play', data)

  Message.success('所有平台发布完成')
})

const onStop = async () => {
  await window.electron.invoke('stop')
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

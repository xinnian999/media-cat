<template>
  <div class="publish-result">
    <a-divider orientation="center" style="margin-bottom: 35px">发布详情</a-divider>
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

    <div class="footer">
      <a-button style="margin-top: 20px" :disabled="!done" @click="handleBack">{{
        done ? '重新发布' : '发布中'
      }}</a-button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import platforms from '@/assets/allPlatforms'

const route = useRoute()

const done = ref(false)

const list = ref([])

const platformMap = platforms.reduce((acc, cur) => {
  acc[cur.platform] = cur
  return acc
}, {})

const progressMap = ref({})

const handleBack = () => {
  // progressMap.value = {}
  // props.back()
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

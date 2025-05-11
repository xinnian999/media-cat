<template>
  <div>
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
              <template v-slot:text="scope">  {{ scope.percent === 1 ? '发布完成' : `${scope.percent * 100}%` }} </template>
            </a-progress>

            <div style="flex: 1">
              <a-collapse :default-active-key="['1']">
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
import { onMounted, ref } from 'vue'
import platforms from '@/assets/platforms'

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})

const platformMap = platforms.reduce((acc, cur) => {
  acc[cur.platform] = cur
  return acc
}, {})

const progressMap = ref({})

onMounted(async () => {
  window.electron.on('upload-progress', (event, data) => {
    if (!progressMap.value[data.platform]) {
      progressMap.value[data.platform] = []
    }
    progressMap.value[data.platform].push(data)
  })
})
</script>

<style>
.arco-list-item-meta{
    align-items: start;
}
.arco-list-item-meta-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>

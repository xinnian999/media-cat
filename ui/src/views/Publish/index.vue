<template>
  <div class="publish-index">
    <a-page-header title="发布记录" :show-back="false">
      <template #extra>
        <a-button type="primary" @click="goPublish">
          <template #icon>
            <icon-plus />
          </template>
          发布新视频
        </a-button>
      </template>
    </a-page-header>

    <a-list>
      <a-list-item v-for="item in list" :key="item.id">
        <a-list-item-meta :title="item.title">
          <template #avatar>
            <video class="item-video" :src="`file://${item.url}`"></video>
          </template>

          <template #description>
            <div class="description">
              <div>
                {{ `${item.desc} #${item.tags.join(' #')}` }}
              </div>
              <div class="plats">
                <img
                  v-for="src in allPlatforms
                    .filter((v) => item.platforms.includes(v.platform))
                    .map((item) => item.icon)"
                  :src="src"
                  alt=""
                  :key="src"
                />
              </div>

              <div>
                {{ item.createTime }}
              </div>
            </div>
          </template>
        </a-list-item-meta>

        <template #actions>
          <a-space direction="vertical" align="center" size="medium">
            <a-button size="mini" @click="handlePlay(item)">
              <template #icon>
                <icon-refresh />
              </template>
              重新执行
            </a-button>
            <a-button status="danger" size="mini" @click="() => {}">
              <template #icon>
                <icon-delete />
              </template>
              删除
            </a-button>
          </a-space>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import allPlatforms from '@/assets/allPlatforms'

const router = useRouter()

const list = ref([])

const goPublish = () => {
  router.push('/publish-play')
}

const handlePlay = async (data) => {
  router.push(`/publish-result?data=${JSON.stringify(data)}`)
}

onMounted(async () => {
  const publishLog = await window.electron.invoke('publishLog')

  list.value = publishLog.list
})
</script>

<style lang="scss">
.publish-index {
  padding: 0 10px;

  .item-video {
    width: 120px;
    height: 80px;
  }

  .description {
    display: flex;
    flex-direction: column;
    gap: 10px;
    .plats {
      display: flex;
      gap: 10px;

      img {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>

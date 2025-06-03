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

    <div class="publish-main">
      <ul class="list">
        <li v-for="item in list" :key="item.id" class="list-item">
          <div class="image">
            <video class="item-video" :src="`file://${item.url}`"></video>
          </div>

          <div class="content">
            <div class="title">
              {{ item.title }}
            </div>

            <div class="desc">
              {{ `${item.desc} #${item.tags.join(' #')}` }}
            </div>

            <div class="plats">
              <img
                v-for="src in platforms.list
                  .filter((v) => item.platforms.includes(v.platform))
                  .map((item) => item.icon)"
                :src="src"
                alt=""
                :key="src"
              />
            </div>

            <div class="footer">
              {{ item.createTime }} <a-tag color="green" v-if="item.observe">可视化</a-tag>
              <a-tag color="blue" v-if="item.imitate">模拟发布</a-tag>
            </div>
          </div>

          <div class="actions">
            <a-space direction="vertical" align="center" size="medium">
              <a-button size="mini" status="warning" @click="handlePlay(item)">
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
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import usePlatforms from '@/hooks/usePlatforms'

const router = useRouter()

const platforms = usePlatforms()

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
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  .publish-main {
    flex: 1;
    overflow: auto;

    .list {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 40px;
      padding: 20px;
      background-color: #f5f5f5;
      border-radius: 10px;

      .list-item {
        display: flex;
        gap: 10px;
        align-items: center;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: -20px;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: #e5e5e5;
        }

        &:last-child {
          &::after {
            display: none;
          }
        }

        .item-video {
          width: 120px;
          height: 80px;
          margin-right: 10px;
        }

        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;

          .desc {
            color: #666;
          }

          .plats {
            display: flex;
            gap: 10px;

            img {
              width: 20px;
              height: 20px;
            }
          }

          .footer {
            color: #999;
            display: flex;
            align-items: center;
            gap: 5px;
          }
        }

        .actions {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>

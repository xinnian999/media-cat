<template>
  <a-divider orientation="center" style="margin-bottom: 35px">小工具</a-divider>

  <div class="tool-list">
    <div class="tool-item" v-for="tool in tools" :key="tool.name" @click="handleClick(tool.path)">
      <div class="icon">
        <img :src="tool.icon" alt="icon" />
      </div>
      <div>{{ tool.title }}</div>
    </div>
  </div>
</template>

<script setup>
import videoDownload from '@/assets/tools/video-download.jpeg'
import dyUserDownload from '@/assets/tools/dy-user-download.jpeg'
import { useRouter } from 'vue-router'

const tools = [
  {
    title: '视频提取',
    path: '/tool/videoDownlad',
    icon: videoDownload,
  },
  {
    title: '抖音博主全视频提取',
    path: '/tool/video',
    icon: dyUserDownload,
  },
]

const router = useRouter()

const handleClick = (path) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.tool-list {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;

  .tool-item {
    width: 150px;
    // height: 100px;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px;
    gap: 5px;

    .icon {
      img {
        width: 100%;
      }
    }

    &:hover {
      background-color: #f0f0f0;
      cursor: pointer;
    }
  }
}
</style>

<template>
  <div class="tool-page">
    <a-divider orientation="center" style="margin-bottom: 35px">小工具</a-divider>

    <a-list>
      <a-list-item v-for="tool in tools" :key="tool.title">
        <a-list-item-meta :description="tool.description">
          <template #avatar>
            <icon-font :type="tool.icon" :size="32" />
          </template>
          <template #title>
            <div class="tool-title" @click="handleClick(tool.path)">{{ tool.title }}</div>
          </template>
        </a-list-item-meta>

        <template #actions>
          <a-button type="primary" size="mini" @click="handleClick(tool.path)"> 使用 </a-button>
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const tools = [
  {
    title: '视频提取',
    path: '/tool/videoDownlad',
    icon: 'icon-shipintiqu',
    description: '根据视频链接，提取出最高画质的视频文件，支持绝大多数平台',
  },
  {
    title: '抖音博主全视频提取',
    path: '/tool/dyAutherBatchDownload',
    icon: 'icon-douyin',
    description: '根据抖音博主主页链接，提取出所有作品，并批量下载到本地',
  },
  {
    title: '查找http',
    path: '/tool/findHttp',
    icon: 'icon-http',
    description: '输入网站链接和关键词。查找该网站中包含该关键词的http响应，便于开发',
  },
  {
    title: '剧本分镜生图',
    path: '/tool/scriptScene',
    icon: 'icon-tupianshengcheng',
    description: '输入剧本，将调用豆包【图片生成】功能，批量生成分镜图',
  },
]

const router = useRouter()

const handleClick = (path) => {
  router.push(path)
}
</script>

<style lang="scss" scoped>
.tool-page {
  padding: 15px;
}
.tool-title {
  cursor: pointer;

  &:hover {
    color: #647ef0;
  }
}
</style>

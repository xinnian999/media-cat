<template>
  <a-page-header title="抖音博主全视频提取" @back="onBack"> </a-page-header>

  <div class="main">
    <div class="add">
      <a-textarea v-model="url" placeholder="请输入抖音博主主页链接" auto-size rows="5" />

      <div class="submit">
        <a-button type="primary" @click="onAdd" :disabled="!url" :loading="loading">
          <template #icon>
            <icon-plus />
          </template>
          新增博主
        </a-button>
      </div>
    </div>

    <a-list class="list">
      <a-list-item v-for="item in dyAutherPosts" :key="item.id" class="list-item" @click="onItemClick(item)">
        <a-list-item-meta
          :title="item.nickname"
        >
          <template #avatar>
            <a-avatar shape="square">
              <img alt="avatar" :src="item.avatar" />
            </a-avatar>
          </template>

          <template #description>
            <a-space>
              <a-tag color="blue">
                {{ item.aweme_count }}个视频
              </a-tag>
              <a-tag color="green">
                {{
                  item.follower_count < 10000
                    ? item.follower_count
                    : (item.follower_count / 10000).toFixed(1)
                }}万粉丝
              </a-tag>
            </a-space>
          </template>
        </a-list-item-meta>
        <template #actions>
          <icon-delete />
        </template>
      </a-list-item>
    </a-list>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

const url = ref('')

const loading = ref(false)

const dyAutherPosts = ref([])

const refreshList = async () => {
  const { list } = await window.electron.invoke('dyAuthers')
  dyAutherPosts.value = list
}

const onBack = () => {
  router.back()
}

const onAdd = async () => {
  loading.value = true
  await window.electron.invoke('addDyAuther', url.value)
  url.value = ''
  loading.value = false
  refreshList()
}

const onItemClick = (item) => {
  router.push(`/tool/dyAutherBatchDownload/detail?id=${item.id}`)
}

onMounted(refreshList)
</script>

<style lang="scss" scoped>
.main {
  padding: 0 20px;

  .add {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .submit {
      display: flex;
      justify-content: right;
    }
  }

  .list {
    margin-top: 20px;

    .list-item {
      cursor: pointer;
      &:hover {
        background-color: #f0f0f0;
      } 
    }
  }
}
</style>

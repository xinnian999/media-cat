<template>
  <div>
    <a-page-header title="抖音博主全视频提取" @back="onBack"> </a-page-header>

    <div class="content">
      <a-button type="primary" @click="onAdd">
        <template #icon>
          <icon-plus />
        </template>
        新增博主
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

const onBack = () => {
  router.back()
}

const onAdd = () => {
  router.push('/tool/dyAutherBatchDownload/add')
}

const dyAutherPosts = ref([])

onMounted(async () => {
  dyAutherPosts.value = await window.electron.invoke('dyAutherPosts')
  console.log(dyAutherPosts.value)
})
</script>

<style lang="scss" scoped>
.content {
  padding: 0 20px;
}
</style>

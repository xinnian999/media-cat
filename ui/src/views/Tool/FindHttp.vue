<template>
  <div class="find-http">
    <a-page-header title="查找HTTP" @back="onBack"> </a-page-header>
    <div class="content">
      <a-form :model="values" layout="vertical" ref="form" :disabled="loading">
        <a-form-item
          field="url"
          label="被查找的网址"
          :rules="[{ required: true, message: '请输入被查找的网址' }]"
        >
          <a-textarea v-model="values.url" placeholder="请输入被查找的网址" auto-size />
        </a-form-item>
        <a-form-item
          field="keyword"
          label="查找关键词"
          :rules="[{ required: true, message: '请输入查找关键词' }]"
        >
          <a-input v-model="values.keyword" placeholder="请输入查找关键词" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" :loading="loading" @click="onSearch">搜索</a-button>
        </a-form-item>
      </a-form>

      <div class="http-list">
        <a-card v-for="item in httpList" :key="item.url" :title="item.origin">
          <!-- <template #extra>
            <a-link>前往</a-link>
          </template> -->
          <json-viewer :value="item.data" />
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { deepClone } from '@/utils'

const router = useRouter()

const values = reactive({
  url: 'https://www.douyin.com/user/MS4wLjABAAAAiqnXRxOQFREO3_N3JTofTfF_b1cJNrAxLi8iDGsTVScfpC9g-uLdn68NJtL4EUHR?from_tab_name=main',
  keyword: '电影总裁',
})

const loading = ref(false)

const httpList = ref([])

const onBack = () => {
  router.back()
}

const onSearch = async () => {
  loading.value = true
  const list = await window.electron.invoke('findHttp', deepClone(values))
  console.log(list)

  httpList.value = list

  loading.value = false
}
</script>

<style lang="scss" scoped>
.find-http {
  .content {
    padding: 20px;
    .http-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }
}
</style>

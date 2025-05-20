<template>
  <div>
    <a-page-header title="视频提取" @back="onBack"> </a-page-header>
    <div class="download-form">
      <a-form :model="values" layout="vertical" ref="form" @submit="handleSubmit">
        <a-form-item
          field="url"
          label="链接"
          :rules="[{ required: true, message: '请输入抖音博主主页链接' }]"
        >
          <a-input v-model="values.url" placeholder="请输入抖音博主主页链接" />
        </a-form-item>
        <a-form-item
          field="savePath"
          label="保存至"
          :rules="[{ required: true, message: '请输入保存路径' }]"
        >
          <div class="save-path">
            <a-input v-model="values.savePath" placeholder="请输入保存路径" />
            <a-button type="primary" @click="handleOpenFolder">选择路径</a-button>
          </div>
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit">开始提取</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { deepClone } from '@/utils'
import { reactive, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

const form = useTemplateRef('form')

const router = useRouter()

const values = reactive({
  url: 'https://www.douyin.com/video/7492014665493499193',
  savePath: '',
})

const handleSubmit = async () => {
  await form.value.validate()
  await window.electron.invoke('download', deepClone(values))
}

const handleOpenFolder = async () => {
  const path = await window.electron.invoke('dialog:openFolder')
  values.savePath = path
}

const onBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.download-form {
  padding: 15px 30px;

  .save-path {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
</style>

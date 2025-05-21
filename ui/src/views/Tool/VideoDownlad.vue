<template>
  <div class="video-downloa-page">
    <a-page-header title="视频提取" @back="onBack"> </a-page-header>
    <div class="download-form">
      <a-form :model="values" layout="vertical" ref="form" :disabled="loading">
        <a-form-item
          field="url"
          label="链接"
          :rules="[{ required: true, message: '请输入抖音博主主页链接' }]"
        >
          <a-textarea v-model="values.url" placeholder="请输入抖音博主主页链接" auto-size />
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
      </a-form>

      <div class="button-group">
        <a-button type="primary" :loading="loading" @click="handleSubmit">{{
          loading ? '提取中' : '开始提取'
        }}</a-button>
        <a-button v-if="loading" @click="handleCancel">取消</a-button>
      </div>

      <div class="progress-bar" v-if="loading">
        <div>{{ progressData.msg }}</div>
        <a-progress :percent="progressData.percent">
          <template v-slot:text="scope"> {{ scope.percent * 100 }}% </template>
        </a-progress>
      </div>
    </div>
  </div>
</template>

<script setup>
import { deepClone } from '@/utils'
import { reactive, useTemplateRef, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'

const form = useTemplateRef('form')

const router = useRouter()

const loading = ref(false)

const values = reactive({
  url: '',
  savePath: '',
})

const progressData = reactive({
  msg: '',
  percent: 0,
})

const handleSubmit = async () => {
  await form.value.validate()

  progressData.msg = '准备中...'

  progressData.percent = 0.01

  loading.value = true

  await window.electron.invoke('download', deepClone(values))

  loading.value = false

  Message.success('提取完成')
}

const handleCancel = () => {
  window.electron.invoke('stop')
  loading.value = false
  Message.warning('取消提取')
}

const handleOpenFolder = async () => {
  const path = await window.electron.invoke('dialog:openFolder')
  values.savePath = path
}

const onBack = () => {
  router.back()
}

onMounted(async () => {
  window.electron.on('download-progress', (event, data) => {
    progressData.msg = data.msg
    progressData.percent = data.percent
  })
})
</script>

<style lang="scss" scoped>
.video-downloa-page {
  .download-form {
    padding: 15px 30px;

    .save-path {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }

  .button-group {
    display: flex;
    gap: 10px;
  }

  .progress-bar {
    padding: 15px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
  }
}
</style>

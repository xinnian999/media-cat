<template>
    <div class="video-downloa-page">
      <a-page-header title="新增博主" @back="onBack"> </a-page-header>
      <div class="download-form">
        <a-form :model="values" layout="vertical" ref="form" :disabled="loading">
          <a-form-item
            field="url"
            label="抖音博主主页链接"
            :rules="[{ required: true, message: '请输入抖音博主主页链接' }]"
          >
            <a-textarea v-model="values.url" placeholder="请输入抖音博主主页链接" auto-size />
          </a-form-item>
        </a-form>
  
        <div class="button-group">
          <a-button type="primary" :loading="loading" @click="handleSubmit">{{
            loading ? '获取中' : '获取全部作品'
          }}</a-button>
          <a-button v-if="loading" @click="handleCancel">取消</a-button>
        </div>
  
        <div class="result">
          <a-table :columns="columns" :data="data" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="jsx">
  import { deepClone } from '@/utils'
  import { reactive, useTemplateRef, ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { Message } from '@arco-design/web-vue'
  import dayjs from 'dayjs'
  const form = useTemplateRef('form')
  
  const router = useRouter()
  
  const loading = ref(false)
  
  const values = reactive({
    url: 'https://www.douyin.com/user/MS4wLjABAAAAdWO3vnAe7PchdNcPcvBKw1JUZh18LlOMQJSI1HcCqas?from_tab_name=main',
    savePath: '/Users/v_huyilin/Documents/dy/影视剪辑素材',
  })
  
  const progressData = reactive({
    msg: '',
    percent: 0,
  })
  
  const handleCancel = () => {
    window.electron.invoke('stop')
    loading.value = false
    Message.warning('取消提取')
  }
  
  const onBack = () => {
    router.back()
  }
  
  const data = ref([])
  
  const columns = [
    {
      title: '作品描述',
      dataIndex: 'desc',
    },
    {
      title: '点赞量',
      dataIndex: 'digg_count',
      width: 120,
      render: ({ record }) => {
        const count = record.statistics.digg_count
        return count > 10000 ? `${(count / 10000).toFixed(1)}w` : count
      },
    },
    {
      title: '时长',
      dataIndex: 'duration',
      width: 120,
      render: ({ record }) => {
        const duration = record.duration
        return dayjs(duration).format('mm:ss')
      },
    },
  ]
  
  const handleSubmit = async () => {
    await form.value.validate()
  
    progressData.msg = '准备中...'
  
    progressData.percent = 0.01
  
    loading.value = true
  
    const res = await window.electron.invoke('fetchDyAutherPosts', deepClone(values))
    console.log(res)
    data.value = res
  
    loading.value = false
  
    Message.success('提取完成')
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
  
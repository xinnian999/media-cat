<template>
    <div class="container">
      <a-page-header title="剧本分镜生图" @back="onBack"> </a-page-header>
      <div class="content">
        <a-form :model="values" layout="vertical" ref="form" :disabled="loading">
          <a-form-item
            field="script"
            label="剧本"
            :rules="[{ required: true, message: '请输入剧本' }]"
          >
            <a-textarea v-model="values.script" placeholder="请输入剧本" auto-size  />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" :loading="loading" @click="onSearch">开始生成</a-button>
          </a-form-item>
        </a-form>
  
        <div class="http-list">
          <a-card v-for="(item,index) in imgList" :key="item" :title="`分镜${index+1}`">
            <!-- <template #extra>
              <a-link>前往</a-link>
            </template> -->
            <img :src="item" style="width: 200px;" />
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
    script: '',
  })
  
  const loading = ref(false)
  
  const imgList = ref([])
  
  const onBack = () => {
    router.back()
  }
  
  const onSearch = async () => {
    loading.value = true
    imgList.value = await window.electron.invoke('scriptScene', deepClone(values))
    loading.value = false
  }
  </script>
  
  <style lang="scss" scoped>
  .container {
    .content {
      padding: 20px;
      
    }
  }
  </style>
  
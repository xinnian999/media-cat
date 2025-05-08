<template>
  <div class="publish-container">
    <a-form :model="form" :style="{ width: '70%' }" @submit="handleSubmit">
      <a-form-item field="url" label="选择视频">
        <div class="video-upload" @click="openFileDialog" v-if="!form.url">点击选择视频</div>
        <video class="video-upload" :src="`file://${form.url}`" controls v-else></video>
      </a-form-item>

      <a-form-item field="name" label="视频描述">
        <a-textarea v-model="form.desc" />
      </a-form-item>

      <a-form-item field="post" label="标签"> </a-form-item>

      <a-form-item>
        <a-button html-type="submit">开始分发</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  url: '',
  desc: '',
})

const handleSubmit = (data) => {
  console.log(data)
}

const openFileDialog = async () => {
  const filePath = await window.electron.invoke('dialog:openFile')
  console.log(filePath);
  form.url = filePath
}
</script>

<style>
.publish-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .video-upload {
    width: 100%;
    height: 150px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    background-color: rgb(242, 243, 245);
    justify-content: center;
    align-items: center;
  }
}
</style>

<template>
  <div class="publish-container">
    <a-form :model="form" :style="{ width: '70%' }" @submit="handleSubmit">
      <a-form-item field="name" label="选择视频">
        <a-upload draggable action="/" />
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
  desc: '',
  post: '',
  isRead: false,
})

const handleSubmit = (data) => {
  console.log(data)
}
</script>

<style>
.publish-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>

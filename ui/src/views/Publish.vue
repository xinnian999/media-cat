<template>
  <div class="publish-container">
    <a-form :model="form" :style="{ width: '90%' }" @submit-success="handleSubmit">
      <a-form-item
        field="url"
        label="选择视频"
        :rules="[{ required: true, message: '请选择一个视频' }]"
      >
        <div class="video-upload" @click="openFileDialog" v-if="!form.url">点击选择视频</div>
        <video class="video-upload" :src="`file://${form.url}`" controls v-else></video>
      </a-form-item>

      <a-form-item
        field="desc"
        label="视频描述"
        :rules="[{ required: true, message: '请输入视频描述' }]"
      >
        <a-textarea v-model="form.desc" />
      </a-form-item>

      <a-form-item field="post" label="标签">
        <div>
          <a-form-item
            v-for="(tag, index) of form.tags"
            :field="`tags[${index}].value`"
            :key="index"
            hide-label
            :rules="[{ required: true, message: '请输入标签' }]"
          >
            <a-input v-model="tag.value" :placeholder="`标签${index + 1}`" />
            <a-button @click="handleDelete(index)" :style="{ marginLeft: '10px' }"
              ><icon-delete
            /></a-button>
          </a-form-item>
          <div v-if="form.tags.length < 4">
            <a-button @click="handleAdd">增加标签</a-button>
          </div>
        </div>
      </a-form-item>

      <a-form-item>
        <a-button html-type="submit" long type="primary">开始分发</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  url: '',
  desc: '',
  tags: [
    {
      value: '',
    },
  ],
})

const handleSubmit = async (data) => {
  const safeData = JSON.parse(JSON.stringify(data))
  await window.electron.invoke('play', safeData)
}

const openFileDialog = async () => {
  const filePath = await window.electron.invoke('dialog:openFile')
  console.log(filePath)
  form.url = filePath
}

const handleAdd = () => {
  form.tags.push({
    value: '',
  })
}

const handleDelete = (index) => {
  form.tags.splice(index, 1)
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

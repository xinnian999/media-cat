<template>
  <div>
    <a-page-header title="发布视频" @back="onBack"> </a-page-header>
    <a-form
      :model="form"
      class="play-form"
      layout="vertical"
      @submit-success="handleSubmit"
    >
      <a-form-item
        field="url"
        label="选择视频"
        :rules="[{ required: true, message: '请选择一个视频' }]"
      >
        <div class="video-upload" @click="openFileDialog" v-if="!form.url">
          <div class="video-upload-tip">
            <icon-plus />
            <div>点击选择视频</div>
          </div>
        </div>
        <video class="video-upload" :src="`file://${form.url}`" controls v-else></video>
      </a-form-item>

      <!-- <a-form-item field="title" label="视频标题">
        <a-input v-model="form.title" placeholder="请输入视频标题" />
      </a-form-item> -->

      <a-form-item
        field="desc"
        label="视频描述"
        :rules="[{ required: true, message: '请输入视频描述' }]"
      >
        <a-textarea v-model="form.desc" placeholder="请输入视频描述" />
      </a-form-item>

      <a-form-item field="tags" label="标签">
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
            <a-button @click="handleAdd" size="mini">
              <icon-plus />
              增加标签
            </a-button>
          </div>
        </div>
      </a-form-item>

      <a-form-item
        field="platforms"
        label="平台"
        :rules="[{ required: true, message: '请选择平台' }]"
      >
        <a-checkbox-group v-model="form.platforms" v-if="platforms.length > 0">
          <template v-for="item in platforms.accountList" :key="item.platform">
            <a-checkbox :value="item.platform">
              <template #checkbox="{ checked }">
                <a-space
                  align="start"
                  class="custom-checkbox-card"
                  :class="{ 'custom-checkbox-card-checked': checked }"
                >
                  <div class="custom-checkbox-card-content">
                    <img :src="item.icon" alt="icon" />
                    <div className="custom-checkbox-card-title">{{ item.label }}</div>
                  </div>
                </a-space>
              </template>
            </a-checkbox>
          </template>
        </a-checkbox-group>
        <a-button v-else @click="handleBindPlatform">去绑定平台</a-button>
      </a-form-item>

      <a-form-item field="observe" label="可视化发布过程">
        <a-switch v-model="form.observe" />
      </a-form-item>

      <a-form-item field="imitate" label="模拟发布">
        <a-switch v-model="form.imitate" />
      </a-form-item>

      <a-form-item>
        <a-button html-type="submit" long type="primary">开始分发</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { deepClone } from '@/utils'
import { useRouter } from 'vue-router'
import usePlatforms from '@/hooks/usePlatforms'

const form = reactive({
  url: '',
  desc: '搞笑视频',
  tags: [{ value: '搞笑' }, { value: '娱乐' }, { value: '看完不笑算我输' }],
  platforms: [],
  imitate: true,
  observe: true,
})

const platforms = usePlatforms()

const router = useRouter()

const onBack = () => {
  router.push('/publish')
}

const openFileDialog = async () => {
  const filePath = await window.electron.invoke('dialog:openFile')
  // console.log(filePath)
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

const handleBindPlatform = () => {
  router.push('/account')
}

const handleSubmit = async () => {
  const values = deepClone({
    ...form,
    tags: form.tags.map((tag) => tag.value),
  })

  router.push(`/publish-result?data=${JSON.stringify(values)}`)
}
</script>

<style lang="scss">
.video-upload {
  width: 100%;
  height: 150px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  background-color: rgb(242, 243, 245);
  justify-content: center;
  align-items: center;

  .video-upload-tip {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    color: #555;
  }
}

.platform-item {
  display: flex;
  align-items: center;
}

.custom-checkbox-card {
  border: 1px solid var(--color-border-2);
  border-radius: 4px;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  img {
    width: 40px;
    height: 40px;
  }
}

.custom-checkbox-card-mask {
  height: 14px;
  width: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  border: 1px solid var(--color-border-2);
  box-sizing: border-box;
}

.custom-checkbox-card-mask-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.custom-checkbox-card-title {
  color: var(--color-text-1);
  font-size: 14px;
  font-weight: bold;
}

.custom-checkbox-card:hover,
.custom-checkbox-card-checked,
.custom-checkbox-card:hover .custom-checkbox-card-mask,
.custom-checkbox-card-checked .custom-checkbox-card-mask {
  border-color: rgb(var(--primary-6));
}

.custom-checkbox-card-checked {
  background-color: var(--color-primary-light-1);
}

.custom-checkbox-card:hover .custom-checkbox-card-title,
.custom-checkbox-card-checked .custom-checkbox-card-title {
  color: rgb(var(--primary-6));
}

.custom-checkbox-card-checked .custom-checkbox-card-mask-dot {
  background-color: rgb(var(--primary-6));
}

.custom-checkbox-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 50px;
}

.play-form {
  // width: 90%;
  margin-top: 10px;
  padding: 0 40px;
  box-sizing: border-box;
}
</style>

<template>
  <div class="dy-auther-detail">
    <a-page-header title="博主详情" @back="onBack"> </a-page-header>
    <div class="main">
      <a-card class="info">
        <template #title>
          <div class="title">
            <img :src="dyAuther.avatar" alt="icon" class="avatar" />
            <span>{{ dyAuther.nickname }}</span>
          </div>
        </template>

        <template #extra>
          <a-button type="primary" size="mini" :loading="loading" @click="onUpdate">{{
            loading ? '更新中...' : '更新'
          }}</a-button>
        </template>

        <a-descriptions layout="inline-horizontal">
          <a-descriptions-item
            v-for="item of dyAutherData"
            :key="item.label"
            :label="item.label"
            :span="item.span"
          >
            <component :is="item.value" />
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
      <a-table :columns="columns" :data="dyAuther.awemeList" />
    </div>
  </div>
</template>

<script setup lang="jsx">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'

const router = useRouter()

const route = useRoute()

const id = route.query.id

const dyAuther = ref({})

const loading = ref(false)

const refreshDyAuther = async () => {
  dyAuther.value = await window.electron.invoke('getDyAuther', id)

  console.log(dyAuther.value)
}

const onUpdate = async () => {
  loading.value = true
  await window.electron.invoke('updateDyAuther', dyAuther.value.autherUrl)
  loading.value = false
  refreshDyAuther()
}

const dyAutherData = computed(() => {
  const { follower_count, aweme_count, autherUrl } = dyAuther.value
  return [
    {
      label: '粉丝量',
      value: (
        <a-tag color="green">
          {follower_count < 10000 ? follower_count : (follower_count / 10000).toFixed(1)}w
        </a-tag>
      ),
    },
    {
      label: '作品数',
      value: <a-tag>{aweme_count}</a-tag>,
    },
    {
      label: '主页链接',
      value: (
        <a-link href={autherUrl} target="_blank">
          点击访问
        </a-link>
      ),
      span: 3,
    },
  ]
})

const progressData = reactive({
  msg: '',
  percent: 0,
})

const onBack = () => {
  router.back()
}

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

onMounted(async () => {
  window.electron.on('download-progress', (event, data) => {
    progressData.msg = data.msg
    progressData.percent = data.percent
  })

  refreshDyAuther()
})
</script>

<style lang="scss">
.dy-auther-detail {
  .main {
    padding: 0 20px;

    .info {
      margin-bottom: 20px;
      .title {
        display: flex;
        align-items: center;
        gap: 10px;

        .avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .username {
          font-size: 16px;
          font-weight: 600;
          text-align: center;
        }
      }

      .arco-descriptions-table {
        border-spacing: 10px;
        border-collapse: separate;
      }
    }
  }
}
</style>

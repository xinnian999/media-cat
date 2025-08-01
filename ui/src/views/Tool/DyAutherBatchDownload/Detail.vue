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

      <div class="save-path">
        <a-input v-model="dyAuther.savePath" readonly />
        <a-button class="change-btn" type="text" size="mini" @click="handleOpenFolder"
          >更换保存位置</a-button
        >
      </div>

      <div class="post-table-header">
        <b>共{{ dyAuther.awemeList?.length || 0 }}个作品</b>

        <a-space>
          <a-button
            type="primary"
            size="mini"
            :loading="downloadAllLoading"
            @click="handleDownloadAll"
            ><template #icon>
              <icon-download />
            </template>
            全部下载</a-button
          >
          <a-button v-if="downloadAllLoading" size="mini" @click="handleStopDownloadAll"
            ><template #icon>
              <icon-stop />
            </template>
            停止</a-button
          >
        </a-space>
      </div>
      <a-table
        :columns="columns"
        :data="dyAuther.awemeList"
        :pagination="{ 'show-page-size': true, 'page-size-options': [10, 100, 500, 1000, 10000] }"
      />
    </div>
  </div>
</template>

<script setup lang="jsx">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { useStore } from '@/store'
import pLimit from 'p-limit'

const store = useStore()

const router = useRouter()

const route = useRoute()

const id = route.query.id

const dyAuther = ref({})

const loading = ref(false)

const downloadAllLoading = ref(false)

const dirNames = ref([])

const refreshDyAuther = async () => {
  dyAuther.value = await window.electron.invoke('getDyAuther', id)
  dirNames.value = await window.electron.invoke('readDirNames', dyAuther.value.savePath)
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

const onBack = () => {
  router.back()
}

const getFilename = (record) => {
  const { aweme_id, desc, statistics } = record

  const digg_count =
    statistics.digg_count > 10000
      ? `${(statistics.digg_count / 10000).toFixed(1).replace('.0', '')}w`
      : statistics.digg_count

  const filename = `${desc.split('#')[0].slice(0, 15)}_${aweme_id}_${digg_count}`
  return filename
}

const downloadPost = async (record) => {
  const { aweme_id } = record

  store.addDownloading(aweme_id)

  try {
    await window.electron.invoke('downloadVideo', {
      url: `https://www.douyin.com/video/${aweme_id}`,
      savePath: dyAuther.value.savePath,
      filename: getFilename(record),
    })
  } finally {
    store.removeDownloading(aweme_id)
    refreshDyAuther()
  }
}

const handleDownloadAll = async () => {
  const awemeList = dyAuther.value.awemeList

  const prepareList = awemeList.filter(
    (item) => !dirNames.value.some((name) => name.includes(item.aweme_id)),
  )

  const limit = pLimit(1) // 最多并发 3 个任务

  downloadAllLoading.value = true

  await Promise.all(
    prepareList.map((item) =>
      limit(() => {
        if (!downloadAllLoading.value) {
          return
        }
        return downloadPost(item)
      }),
    ),
  )

  downloadAllLoading.value = false
}

const handleStopDownloadAll = () => {
  downloadAllLoading.value = false
}

const columns = computed(() => [
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
  {
    title: '操作',
    dataIndex: 'action',
    width: 120,
    render: ({ record }) => {
      // console.log(record)

      const isDownloading = store.downloading.includes(record.aweme_id)

      if (dirNames.value.some((names) => names.includes(record.aweme_id))) {
        return (
          <a-button
            type="primary"
            size="mini"
            status="success"
            onClick={() => {
              window.electron.invoke(
                'openFile',
                `${dyAuther.value.savePath}/${getFilename(record)}.mp4`,
              )
            }}
          >
            打开文件位置
          </a-button>
        )
      }

      return (
        <a-button
          type="primary"
          size="mini"
          loading={isDownloading}
          onClick={async () => {
            await downloadPost(record)
          }}
        >
          {isDownloading ? '下载中' : '下载'}
        </a-button>
      )
    },
  },
])

const handleOpenFolder = async () => {
  const path = await window.electron.invoke('dialog:openFolder')

  if (path) {
    savePath.value = path
  }
}

onMounted(async () => {
  await refreshDyAuther()
  if (!dyAuther.value.awemeList) {
    onUpdate()
  }
})

onUnmounted(() => {
  handleStopDownloadAll()
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

  .save-path {
    margin-bottom: 20px;
    position: relative;

    .change-btn {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .post-table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>

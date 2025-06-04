import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('globals', () => {
  const downloading = ref([])

  const updateProfileing = ref(false)

  function setDownloading(ids) {
    downloading.value = ids
  }

  function addDownloading(id) {
    downloading.value.push(id)
  }

  function removeDownloading(id) {
    downloading.value = downloading.value.filter((item) => item !== id)
  }

  function setUpdateProfileing(value) {
    updateProfileing.value = value
  }

  return { downloading, addDownloading, removeDownloading, setDownloading, updateProfileing, setUpdateProfileing }
})

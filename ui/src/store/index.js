import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('globals', () => {
  const downloading = ref([])

  function setDownloading(ids) {
    downloading.value = ids
  }

  function addDownloading(id) {
    downloading.value.push(id)
  }

  function removeDownloading(id) {
    downloading.value = downloading.value.filter((item) => item !== id)
  }

  return { downloading, addDownloading, removeDownloading, setDownloading }
})

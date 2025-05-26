import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('globals', () => {
  const downloading = ref([])

  function addDownloading(id) {
    downloading.value.push(id)
  }

  function removeDownloading(id) {
    downloading.value = downloading.value.filter((item) => item !== id)
  }

  return { downloading, addDownloading, removeDownloading }
})

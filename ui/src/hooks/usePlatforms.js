import { ref, onMounted } from 'vue'
import allPlatforms from '@/assets/allPlatforms'

const usePlatforms = () => {
  const platformData = ref(allPlatforms)

  onMounted(async () => {
    const profile = await window.electron.invoke('profile')

    platformData.value = allPlatforms
      .filter((item) => {
        return profile[item.platform]
      })
      .map((item) => {
        return {
          ...item,
          ...profile[item.platform],
        }
      })
  })

  return platformData
}

export default usePlatforms

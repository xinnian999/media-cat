import { ref, onMounted } from 'vue'
import allPlatforms from '@/assets/allPlatforms'

// 自动读取后台的 profile 数据，返回已绑定的平台数据
const usePlatforms = () => {
  const platforms = ref(allPlatforms)

  const updateing = ref(false)

  const parseByProfile = (profile) => {
    return allPlatforms
      .filter((item) => {
        return profile[item.platform]
      })
      .map((item) => {
        return {
          ...item,
          ...profile[item.platform],
        }
      })
  }

  const updatePlatforms = async () => {
    updateing.value = true
    
    const lastestProfile = await window.electron.invoke('updateProfile')

    platforms.value = parseByProfile(lastestProfile)

    updateing.value = false
  }

  onMounted(async () => {
    const profile = await window.electron.invoke('profile')

    platforms.value = parseByProfile(profile)
  })

  return { platforms, updateing, update: updatePlatforms }
}

export default usePlatforms

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

  const refreshPlatforms = async () => {
    const profile = await window.electron.invoke('profile')

    platforms.value = parseByProfile(profile)
  }

  const updatePlatforms = async () => {
    updateing.value = true

    await window.electron.invoke('updateProfile')

    refreshPlatforms()

    updateing.value = false
  }

  onMounted(refreshPlatforms)

  return { platforms, updateing, update: updatePlatforms, refreshPlatforms }
}

export default usePlatforms

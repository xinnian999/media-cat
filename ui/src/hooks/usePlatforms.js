import { onBeforeMount, reactive } from 'vue'

// 自动管理平台数据的hooks
const usePlatforms = () => {
  const platforms = reactive({
    list: [],
    accountList: [],
    accountMap: {},
  })

  // 根据profile数据，解析出已绑定的平台数据
  const parseByProfile = (profile) => {
    return platforms.list
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

  const refresh = async () => {
    const profile = await window.electron.invoke('profile')

    platforms.accountList = parseByProfile(profile)
    platforms.accountMap = platforms.accountList.reduce((acc, item) => {
      acc[item.platform] = item
      return acc
    }, {})
  }

  const update = async () => {
    await window.electron.invoke('updateProfile')

    refresh()
  }

  onBeforeMount(async () => {
    platforms.list = await window.electron.invoke('platformList')

    refresh()
  })

  Object.assign(platforms, {
    refresh,
    update,
  })

  return platforms
}

export default usePlatforms

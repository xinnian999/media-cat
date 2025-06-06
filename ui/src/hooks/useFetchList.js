import { onMounted, ref } from 'vue'

const useFetchList = (name) => {
  const list = ref([])

  onMounted(async () => {
    const res = await window.electron.invoke(name)
    list.value = res.list || res
  })

  return list
}

export default useFetchList

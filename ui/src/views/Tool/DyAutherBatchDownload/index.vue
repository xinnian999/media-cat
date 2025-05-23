<template>
  <div>
    <a-page-header title="抖音博主全视频提取" @back="onBack"> </a-page-header>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const onBack = () => {
  router.back()
}
</script>

<style></style>

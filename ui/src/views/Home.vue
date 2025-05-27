<template>
  <div class="home-page">
    <!-- <h1>首页</h1> -->
    <div class="bar">
      <div class="welcome-box">
        <div class="welcome">🎉 {{ period }}好！</div>
        <div class="day">今天是你使用媒力猫的第<span class="day-count">{{ day }}</span>天</div>
      </div>
    </div>

    <div class="bar">
        <div class="bar-title">
            数据概览
        </div>
        <div class="bar-content">
            
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const day = ref(1)

const period = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '凌晨'
  if (hour < 12) return '上午'
  if (hour < 18) return '下午'
  return '晚上'
})

</script>

<style lang="scss" scoped>
.home-page {
  height: 100%;
  width: 100%;
  background-color: #f8f8f9;
  padding: 15px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 15px;

  .bar {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    .bar-title {
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 10px;
    }
  }

  .welcome-box {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .welcome {
      font-size: 20px;
      font-weight: 700;
    }

    .day {
      font-size: 14px;
      color: #666;

      .day-count {
        color: #511fe8;
        font-weight: 700;
        padding: 0 5px;
      }
    }
  }
}
</style>

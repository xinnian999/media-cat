<template>
  <icon-font type="icon-douyin" :size="32" />
</template>

<script>
import { Icon } from '@arco-design/web-vue'

const IconFont = Icon.addFromIconFontCn({
  src: '//at.alicdn.com/t/c/font_4933477_7b2vt5a4zd4.js',
})

export default {
  components: {
    IconFont,
  },
}
</script>

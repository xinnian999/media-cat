<template>
  <icon-font type="icon-douyin" :size="32" />
</template>

<script>
import { Icon } from '@arco-design/web-vue'

const IconFont = Icon.addFromIconFontCn({
  src: '//at.alicdn.com/t/c/font_4933477_dxtqivd2sp4.js',
})

export default {
  components: {
    IconFont,
  },
}
</script>

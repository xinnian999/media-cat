import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import VueJsonViewer from 'vue-json-viewer'
import App from './App.vue'
import { router } from './router'
import components from './components'
import '@arco-design/web-vue/dist/arco.css';
import './assets/main.css'

const app = createApp(App)

app.use(ArcoVue);
app.use(createPinia())
app.use(router)
app.use(ArcoVueIcon)
app.use(VueJsonViewer)
app.use(components)
app.mount('#app')

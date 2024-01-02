import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { ElMessage } from 'element-plus'
import App from './App.vue'
import router from './router'
import { initializeApp } from 'firebase/app'
import firebaseConfig from '../firebaseConfig'
import { loadingStore } from './stores/loading'

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component(ElMessage)
app.use(router)
app.use(loadingStore)

app.mount('#app')

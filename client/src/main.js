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

const firebaseConfig = {
  apiKey: 'AIzaSyC6EbMeDB4txzyYg503hqRmyZnKak2o2Us',
  authDomain: 'tic-web-crud-9d48e.firebaseapp.com',
  projectId: 'tic-web-crud-9d48e',
  storageBucket: 'tic-web-crud-9d48e.appspot.com',
  messagingSenderId: '950320698987',
  appId: '1:950320698987:web:7714829e7ac9efda76832e'
}

initializeApp(firebaseConfig)

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component(ElMessage)
app.use(router)

app.mount('#app')

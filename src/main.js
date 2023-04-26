import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'
import './assets/main.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn,
})
// 将 router 实例作为插件安装
app.use(router)
// 将 store 实例作为插件安装
app.use(store)


app.mount('#app')

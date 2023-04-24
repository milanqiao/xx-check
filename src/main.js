import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-plus/dist/index.css'
import './assets/main.css'


const app = createApp(App)

// 将 router 实例作为插件安装
app.use(router)
// 将 store 实例作为插件安装
app.use(store)


app.mount('#app')

import { createApp } from 'vue'
import router from '@/router/index.js' //路由
import App from './App.vue'
import 'normalize.css' //抹平浏览器差异化
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import i18n from '@/i18n/index.js' //国际化
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import '@/styles/index.css' //自定义样式
import 'virtual:svg-icons-register' // 配置使用svg
import SvgIcon from '@/components/SvgIcon.vue' // 引入SvgIcon.vue组件
import countTo from 'vue3-count-to' //金额滚动插件

import { createPinia } from 'pinia' // ① 引入createPinia方法从pinia
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // 引入持久化插件
const pinia = createPinia() // ② 拿到pinia实例
pinia.use(piniaPluginPersistedstate)

// 路由回退
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

const app = createApp(App)
app.config.productionTip = false

app
  .use(pinia)
  .use(router)
  .component('SvgIcon', SvgIcon)
  .use(ElementPlus)
  .use(i18n)
  .use(countTo)
  .mount('#app')

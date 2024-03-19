import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 引入svg插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// 配置使用svg
const pathResolve = pathStr => {
  return path.resolve(__dirname, pathStr)
}
// 插件
import legacy from '@vitejs/plugin-legacy' //用于打包之后页面查看
import wasm from 'vite-plugin-wasm'
import topLevelAwait from 'vite-plugin-top-level-await'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // index.html文件所在位置
  outDir: 'dist', //打包文件包

  define: {
    'process.env': {}
  },

  //本地运行配置，以及反向代理配置
  server: {
    port: '8888', //端口
    // host: "localhost",//ip地址例如192.168.1.177
    host: true,
    open: true, //服务启动时自动在浏览器中打开应用
    // 反向代理配置
    proxy: {
      //配置多个代理
      '/dev-api': {
        target: 'http://103.44.239.241:50072', //例子:http://192.168.1.177:8080 或测试服务器https://xxxx.com
        // target: 'https://api.calibration.node.glif.io/rpc/v1', //例子:http://192.168.1.177:8080 或测试服务器https://xxxx.com
        changeOrigin: true, ///设置访问目标地址允许跨域
        rewrite: p => p.replace(/^\/dev-api/, '')
      }
    }
  },

  plugins: [
    vue(),
    wasm(),
    createSvgIconsPlugin({
      iconDirs: [pathResolve('./src/assets/svgs')],
      symbolId: 'icon-[dir]-[name]'
    }),
    legacy({ targets: ['defaults', 'not IE 11'] }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    })
  ],

  resolve: {
    // 设置路径别名
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, './src'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
    },

    //共享配置 https://cn.vitejs.dev/config/shared-options.html#resolve-extensions
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/mixins.scss";`
      }
    }
  }
})

// vite.config.js
import { defineConfig, loadEnv } from "file:///D:/workCode/%E6%99%BA%E8%83%BD%E5%90%88%E7%BA%A6/web3smartcontract/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/workCode/%E6%99%BA%E8%83%BD%E5%90%88%E7%BA%A6/web3smartcontract/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import path from "path";
import { createSvgIconsPlugin } from "file:///D:/workCode/%E6%99%BA%E8%83%BD%E5%90%88%E7%BA%A6/web3smartcontract/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import legacy from "file:///D:/workCode/%E6%99%BA%E8%83%BD%E5%90%88%E7%BA%A6/web3smartcontract/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import wasm from "file:///D:/workCode/%E6%99%BA%E8%83%BD%E5%90%88%E7%BA%A6/web3smartcontract/node_modules/vite-plugin-wasm/exports/import.mjs";
import topLevelAwait from "file:///D:/workCode/%E6%99%BA%E8%83%BD%E5%90%88%E7%BA%A6/web3smartcontract/node_modules/vite-plugin-top-level-await/exports/import.mjs";
var __vite_injected_original_dirname = "D:\\workCode\\\u667A\u80FD\u5408\u7EA6\\web3smartcontract";
var pathResolve = (pathStr) => {
  return path.resolve(__vite_injected_original_dirname, pathStr);
};
var vite_config_default = defineConfig({
  base: "./",
  // index.html文件所在位置
  outDir: "dist",
  //打包文件包
  define: {
    "process.env": {}
  },
  //本地运行配置，以及反向代理配置
  server: {
    port: "8888",
    //端口
    // host: "localhost",//ip地址例如192.168.1.177
    host: true,
    open: true,
    //服务启动时自动在浏览器中打开应用
    // 反向代理配置
    proxy: {
      //配置多个代理
      "/dev-api": {
        target: "http://103.44.239.241:50072",
        //例子:http://192.168.1.177:8080 或测试服务器https://xxxx.com
        // target: 'https://api.calibration.node.glif.io/rpc/v1', //例子:http://192.168.1.177:8080 或测试服务器https://xxxx.com
        changeOrigin: true,
        ///设置访问目标地址允许跨域
        rewrite: (p) => p.replace(/^\/dev-api/, "")
      }
    }
  },
  plugins: [
    vue(),
    wasm(),
    createSvgIconsPlugin({
      iconDirs: [pathResolve("./src/assets/svgs")],
      symbolId: "icon-[dir]-[name]"
    }),
    legacy({ targets: ["defaults", "not IE 11"] }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: "__tla",
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: (i) => `__tla_${i}`
    })
  ],
  resolve: {
    // 设置路径别名
    alias: {
      "~": path.resolve(__vite_injected_original_dirname, "./"),
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
    },
    //共享配置 https://cn.vitejs.dev/config/shared-options.html#resolve-extensions
    extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json", ".vue"]
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/mixins.scss";`
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3b3JrQ29kZVxcXFxcdTY2N0FcdTgwRkRcdTU0MDhcdTdFQTZcXFxcd2ViM3NtYXJ0Y29udHJhY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHdvcmtDb2RlXFxcXFx1NjY3QVx1ODBGRFx1NTQwOFx1N0VBNlxcXFx3ZWIzc21hcnRjb250cmFjdFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovd29ya0NvZGUvJUU2JTk5JUJBJUU4JTgzJUJEJUU1JTkwJTg4JUU3JUJBJUE2L3dlYjNzbWFydGNvbnRyYWN0L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXHJcbi8vIFx1NUYxNVx1NTE2NXN2Z1x1NjNEMlx1NEVGNlxyXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucydcclxuLy8gXHU5MTREXHU3RjZFXHU0RjdGXHU3NTI4c3ZnXHJcbmNvbnN0IHBhdGhSZXNvbHZlID0gcGF0aFN0ciA9PiB7XHJcbiAgcmV0dXJuIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHBhdGhTdHIpXHJcbn1cclxuLy8gXHU2M0QyXHU0RUY2XHJcbmltcG9ydCBsZWdhY3kgZnJvbSAnQHZpdGVqcy9wbHVnaW4tbGVnYWN5JyAvL1x1NzUyOFx1NEU4RVx1NjI1M1x1NTMwNVx1NEU0Qlx1NTQwRVx1OTg3NVx1OTc2Mlx1NjdFNVx1NzcwQlxyXG5pbXBvcnQgd2FzbSBmcm9tICd2aXRlLXBsdWdpbi13YXNtJ1xyXG5pbXBvcnQgdG9wTGV2ZWxBd2FpdCBmcm9tICd2aXRlLXBsdWdpbi10b3AtbGV2ZWwtYXdhaXQnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIGJhc2U6ICcuLycsIC8vIGluZGV4Lmh0bWxcdTY1ODdcdTRFRjZcdTYyNDBcdTU3MjhcdTRGNERcdTdGNkVcclxuICBvdXREaXI6ICdkaXN0JywgLy9cdTYyNTNcdTUzMDVcdTY1ODdcdTRFRjZcdTUzMDVcclxuXHJcbiAgZGVmaW5lOiB7XHJcbiAgICAncHJvY2Vzcy5lbnYnOiB7fVxyXG4gIH0sXHJcblxyXG4gIC8vXHU2NzJDXHU1NzMwXHU4RkQwXHU4ODRDXHU5MTREXHU3RjZFXHVGRjBDXHU0RUU1XHU1M0NBXHU1M0NEXHU1NDExXHU0RUUzXHU3NDA2XHU5MTREXHU3RjZFXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiAnODg4OCcsIC8vXHU3QUVGXHU1M0UzXHJcbiAgICAvLyBob3N0OiBcImxvY2FsaG9zdFwiLC8vaXBcdTU3MzBcdTU3NDBcdTRGOEJcdTU5ODIxOTIuMTY4LjEuMTc3XHJcbiAgICBob3N0OiB0cnVlLFxyXG4gICAgb3BlbjogdHJ1ZSwgLy9cdTY3MERcdTUyQTFcdTU0MkZcdTUyQThcdTY1RjZcdTgxRUFcdTUyQThcdTU3MjhcdTZENEZcdTg5QzhcdTU2NjhcdTRFMkRcdTYyNTNcdTVGMDBcdTVFOTRcdTc1MjhcclxuICAgIC8vIFx1NTNDRFx1NTQxMVx1NEVFM1x1NzQwNlx1OTE0RFx1N0Y2RVxyXG4gICAgcHJveHk6IHtcclxuICAgICAgLy9cdTkxNERcdTdGNkVcdTU5MUFcdTRFMkFcdTRFRTNcdTc0MDZcclxuICAgICAgJy9kZXYtYXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly8xMDMuNDQuMjM5LjI0MTo1MDA3MicsIC8vXHU0RjhCXHU1QjUwOmh0dHA6Ly8xOTIuMTY4LjEuMTc3OjgwODAgXHU2MjE2XHU2RDRCXHU4QkQ1XHU2NzBEXHU1MkExXHU1NjY4aHR0cHM6Ly94eHh4LmNvbVxyXG4gICAgICAgIC8vIHRhcmdldDogJ2h0dHBzOi8vYXBpLmNhbGlicmF0aW9uLm5vZGUuZ2xpZi5pby9ycGMvdjEnLCAvL1x1NEY4Qlx1NUI1MDpodHRwOi8vMTkyLjE2OC4xLjE3Nzo4MDgwIFx1NjIxNlx1NkQ0Qlx1OEJENVx1NjcwRFx1NTJBMVx1NTY2OGh0dHBzOi8veHh4eC5jb21cclxuICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsIC8vL1x1OEJCRVx1N0Y2RVx1OEJCRlx1OTVFRVx1NzZFRVx1NjgwN1x1NTczMFx1NTc0MFx1NTE0MVx1OEJCOFx1OERFOFx1NTdERlxyXG4gICAgICAgIHJld3JpdGU6IHAgPT4gcC5yZXBsYWNlKC9eXFwvZGV2LWFwaS8sICcnKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgcGx1Z2luczogW1xyXG4gICAgdnVlKCksXHJcbiAgICB3YXNtKCksXHJcbiAgICBjcmVhdGVTdmdJY29uc1BsdWdpbih7XHJcbiAgICAgIGljb25EaXJzOiBbcGF0aFJlc29sdmUoJy4vc3JjL2Fzc2V0cy9zdmdzJyldLFxyXG4gICAgICBzeW1ib2xJZDogJ2ljb24tW2Rpcl0tW25hbWVdJ1xyXG4gICAgfSksXHJcbiAgICBsZWdhY3koeyB0YXJnZXRzOiBbJ2RlZmF1bHRzJywgJ25vdCBJRSAxMSddIH0pLFxyXG4gICAgdG9wTGV2ZWxBd2FpdCh7XHJcbiAgICAgIC8vIFRoZSBleHBvcnQgbmFtZSBvZiB0b3AtbGV2ZWwgYXdhaXQgcHJvbWlzZSBmb3IgZWFjaCBjaHVuayBtb2R1bGVcclxuICAgICAgcHJvbWlzZUV4cG9ydE5hbWU6ICdfX3RsYScsXHJcbiAgICAgIC8vIFRoZSBmdW5jdGlvbiB0byBnZW5lcmF0ZSBpbXBvcnQgbmFtZXMgb2YgdG9wLWxldmVsIGF3YWl0IHByb21pc2UgaW4gZWFjaCBjaHVuayBtb2R1bGVcclxuICAgICAgcHJvbWlzZUltcG9ydE5hbWU6IGkgPT4gYF9fdGxhXyR7aX1gXHJcbiAgICB9KVxyXG4gIF0sXHJcblxyXG4gIHJlc29sdmU6IHtcclxuICAgIC8vIFx1OEJCRVx1N0Y2RVx1OERFRlx1NUY4NFx1NTIyQlx1NTQwRFxyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ34nOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi8nKSxcclxuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcclxuICAgICAgJ3Z1ZS1pMThuJzogJ3Z1ZS1pMThuL2Rpc3QvdnVlLWkxOG4uY2pzLmpzJ1xyXG4gICAgfSxcclxuXHJcbiAgICAvL1x1NTE3MVx1NEVBQlx1OTE0RFx1N0Y2RSBodHRwczovL2NuLnZpdGVqcy5kZXYvY29uZmlnL3NoYXJlZC1vcHRpb25zLmh0bWwjcmVzb2x2ZS1leHRlbnNpb25zXHJcbiAgICBleHRlbnNpb25zOiBbJy5tanMnLCAnLmpzJywgJy5tdHMnLCAnLnRzJywgJy5qc3gnLCAnLnRzeCcsICcuanNvbicsICcudnVlJ11cclxuICB9LFxyXG5cclxuICBjc3M6IHtcclxuICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgc2Nzczoge1xyXG4gICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgQGltcG9ydCBcIkAvc3R5bGVzL21peGlucy5zY3NzXCI7YFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdVLFNBQVMsY0FBYyxlQUFlO0FBQ3RXLE9BQU8sU0FBUztBQUNoQixPQUFPLFVBQVU7QUFFakIsU0FBUyw0QkFBNEI7QUFNckMsT0FBTyxZQUFZO0FBQ25CLE9BQU8sVUFBVTtBQUNqQixPQUFPLG1CQUFtQjtBQVoxQixJQUFNLG1DQUFtQztBQU16QyxJQUFNLGNBQWMsYUFBVztBQUM3QixTQUFPLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQ3hDO0FBT0EsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsTUFBTTtBQUFBO0FBQUEsRUFDTixRQUFRO0FBQUE7QUFBQSxFQUVSLFFBQVE7QUFBQSxJQUNOLGVBQWUsQ0FBQztBQUFBLEVBQ2xCO0FBQUE7QUFBQSxFQUdBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBO0FBQUEsSUFFTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUE7QUFBQTtBQUFBLElBRU4sT0FBTztBQUFBO0FBQUEsTUFFTCxZQUFZO0FBQUEsUUFDVixRQUFRO0FBQUE7QUFBQTtBQUFBLFFBRVIsY0FBYztBQUFBO0FBQUEsUUFDZCxTQUFTLE9BQUssRUFBRSxRQUFRLGNBQWMsRUFBRTtBQUFBLE1BQzFDO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLEtBQUs7QUFBQSxJQUNMLHFCQUFxQjtBQUFBLE1BQ25CLFVBQVUsQ0FBQyxZQUFZLG1CQUFtQixDQUFDO0FBQUEsTUFDM0MsVUFBVTtBQUFBLElBQ1osQ0FBQztBQUFBLElBQ0QsT0FBTyxFQUFFLFNBQVMsQ0FBQyxZQUFZLFdBQVcsRUFBRSxDQUFDO0FBQUEsSUFDN0MsY0FBYztBQUFBO0FBQUEsTUFFWixtQkFBbUI7QUFBQTtBQUFBLE1BRW5CLG1CQUFtQixPQUFLLFNBQVMsQ0FBQztBQUFBLElBQ3BDLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFQSxTQUFTO0FBQUE7QUFBQSxJQUVQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLElBQUk7QUFBQSxNQUNqQyxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDcEMsWUFBWTtBQUFBLElBQ2Q7QUFBQTtBQUFBLElBR0EsWUFBWSxDQUFDLFFBQVEsT0FBTyxRQUFRLE9BQU8sUUFBUSxRQUFRLFNBQVMsTUFBTTtBQUFBLEVBQzVFO0FBQUEsRUFFQSxLQUFLO0FBQUEsSUFDSCxxQkFBcUI7QUFBQSxNQUNuQixNQUFNO0FBQUEsUUFDSixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K

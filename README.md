# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).



整理代码结构
``` lua
web
 ├── favicon.ico
 ├── index.html                 -- 主页面
 ├── package.json               -- 包管理器代码
 ├── src                        -- 源代码
 │   ├── abi                    -- abi 组
 │   ├── api                    -- api 组
 │   ├── App.vue                -- 主页面
 │   ├── assets                 -- 静态资源
 │   ├── components             -- 全局组件
 │   ├── i18n                   -- 国际化
 │   ├── main.js                -- 主文件
 │   ├── store                  -- pinia 状态管理器，取代vuex
 │   │   ├── index.js           -- 入口文件
 │   │   └── modules            -- modules
 │   │       ├── accounts.js    -- 账号相关
 │   │       ├── buff.js        -- 池子模块相关
 │   │       ├── debtContract.js    -- 债务合约 (Contract of debt)
 │   │       ├── loanContract.js    -- 借贷合约 (Loan contract)
 │   │       ├── manageNodeContract.js    -- 管理节点合约 （Managing Node contracts)
 │   │       ├── miner.js                 -- miner
 │   │       ├── rateContract.js    --利率合约 （Interest rate contract）
 │   │       ├── set.js             --设置
 │   │       ├── sidebar.js         --侧边栏
 │   │       ├── stakeContract.js   --质押合约 (Contract of pledge)
 │   │       └── vote.js            --投票合约 (Voting contract)
 │   ├── router                 -- 路由声明文件
 │   │   └── index.js
 │   ├── style                  -- 全局样式
 │   │   ├── base.scss
 │   │   ├── index.css
 │   │   └── mixins.scss
 │   ├── utils                  -- 方法包库
 │   │   ├── gas                -- 计算gas
 │   │   ├── arraybufferToBase64.js     -- 数组转码方法
 │   │   ├── chainConfig.js     -- 使用链信息
 │   │   ├── formatAmount.js    -- 格式化金额
 │   │   ├── formatdate.js      -- 日期格式化
 │   │   ├── getParams.js       -- 获取编码参数方法
 │   │   ├── index.js           
 │   │   ├── metamask.js        -- 检测跳转下载metaMask
 │   │   ├── num.js             -- 处理数字
 │   │   ├── sleep.js            
 │   │   └── types.js           
 |   ├── views                   -- 主要view代码
 |   |   ├── buff                -- 池子页相关
 |   |   ├── home                -- 首页相关
 |   |   ├── inform              -- 消息通知
 |   |   ├── minerEnter          -- 节点入驻相关
 |   |   ├── minerInfo           -- 节点信息相关
 |   |   ├── minerInfoExit       -- 节点退出相关
 |   |   ├── set                 -- 节点设置相关
 |   |   ├── stake               -- 质押页面相关
 |   |   └── voteInfo            -- 投票信息相关
 ├── vite.config.js             -- vite 配置文件
 └── yarn.lock

```
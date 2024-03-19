<template>
  <div id="FooterCom" class="container">
    <div class="top">
      <div class="dropdownBox">
        <!-- 中英切换 -->
        <el-dropdown @command="changeLanguage">
          <span class="el-dropdown-link">
            {{ curLanguageName }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in languageList"
                :key="index"
                :command="item.value"
              >
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- 网络切换 -->
        <el-dropdown @command="changeNet">
          <span class="el-dropdown-link">
            {{ netName }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in netList"
                :key="index"
                :command="item.value"
              >
                {{ item.label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 跳转软件 -->
      <div class="linkBox">
        <ul>
          <li @click="clickLink('Discord')">
            <SvgIcon name="footer1" />
            <span>Discord</span>
          </li>
          <li @click="clickLink('Slack')">
            <SvgIcon name="footer2" />
            <span>Slack</span>
          </li>
          <li @click="clickLink('Github')">
            <SvgIcon name="footer3" />
            <span>Github</span>
          </li>
          <li @click="clickLink('Telegram')">
            <SvgIcon name="footer4" />
            <span>Telegram</span>
          </li>
          <li @click="clickLink('Twitter')">
            <SvgIcon name="footer5" />
            <span>Twitter</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 版权 -->
    <div class="Copyright">Copyright © 2023 Sun FIL. All Rights Reserved</div>
  </div>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { onMounted, ref, watch } from 'vue'
import { useAccountStore } from '@/store/module/accounts.js'
import { useMinerStore } from '@/store/module/miner.js'
import { storeToRefs } from 'pinia'

onMounted(() => {
  if (localStorage.connectMode) {
    localStorage.connectMode = 'Mainnet'
    netName.value = localStorage.getItem('connectMode')
    accountStore.connectMode = localStorage.getItem('connectMode')
  }

  if (localStorage.curLanguageName) {
    curLanguageName.value = localStorage.getItem('curLanguageName')
  } else {
    localStorage.setItem('curLanguageName', curLanguageName.value)
  }
})

// 使用pinia
const accountStore = useAccountStore()
const { connectMode } = storeToRefs(accountStore)
const minerStore = useMinerStore()
const { linkHref } = storeToRefs(minerStore)

const { locale, t, setLocaleMessage } = useI18n()

const curLanguageName = ref('English')
const languageList = ref([
  {
    value: 'zh',
    label: '中文'
  },
  {
    value: 'en',
    label: 'English'
  }
])

const changeLanguage = lang => {
  locale.value = lang
  if (lang == 'zh') {
    curLanguageName.value = '中文'
    localStorage.curLanguageName = '中文'
  } else {
    curLanguageName.value = 'English'
    localStorage.curLanguageName = 'English'
  }
}

// 切换网络
const netName = ref('Mainnet')
const netList = ref([
  {
    value: 'Mainnet',
    label: 'Mainnet'
  },
  {
    value: 'Calibration',
    label: 'Calibration'
  }
])

// 点击切换网络
const changeNet = net => {
  netName.value = net
  accountStore.connectMode = net
  // 保存本地模式
  localStorage.setItem('connectMode', net)
  localStorage.disconnect = true
  accountStore.disconnect = true

  if (net == 'Mainnet') {
    window.open('http://103.44.239.241:50053/#/home', '_self')
  } else {
    window.open('http://103.44.239.241:50052/#/home', '_self')
  }
}

//侦听网络模式
watch(
  () => [accountStore.connectMode, curLanguageName.value],

  ([new1, new2], [old1, old2]) => {
    if (new1 !== old1) {
      netName.value = new1
      if (new1 == 'Mainnet') {
        minerStore.linkHref = 'https://filfox.info/zh/message/'
        window.open('http://103.44.239.241:50053/#/home', '_self')
      } else {
        minerStore.linkHref = 'https://calibration.filfox.info/zh/message/'
        window.open('http://103.44.239.241:50052/#/home', '_self')
      }
    }

    if (new2 == '中文') {
      locale.value = 'zh'
    } else {
      locale.value = 'en'
    }
  }
)

// 社区跳转
const clickLink = val => {
  switch (val) {
    case 'Discord':
      console.log('Discord')
      break
    case 'Slack':
      window.open(
        'https://filecoinproject.slack.com/team/U05TAPG4HM0',
        '_blank'
      )
      break
    case 'Github':
      console.log('Github')
      break
    case 'Telegram':
      console.log('Telegram')
      break
    case 'Twitter':
      window.open('https://twitter.com/sunfilhk', '_blank')
      break
  }
}
</script>

<script>
export default {
  name: 'FooterCom'
}
</script>
<style lang="scss" scoped>
.container {
  padding: 0 0 30px;
  border-top: 1px solid #ccc;
  margin-top: 50px;

  .top {
    display: flex;
  }

  .dropdownBox {
    display: flex;
    flex-direction: column;
  }
}

// 下拉菜单
::v-deep .el-dropdown {
  margin-top: 20px;
  margin-left: 20px;
  color: #fff;
  padding: 0 3px 8px;
  border-bottom: 1px solid #ccc;

  .el-dropdown-link {
    &:focus-visible {
      outline: none;
    }
  }

  .example-showcase .el-dropdown-link {
    color: #fff;
  }
}

::v-deep .linkBox {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  ul {
    display: flex;
    justify-content: center;
    align-items: center;
    li {
      font-family: Manrope;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 3%;
      padding: 0 20px;
      color: #ccc;
      .svg-icon {
        width: 30px;
        height: 30px;
        margin-right: 5px;
      }

      &:hover {
        cursor: pointer;
        color: #fff;
      }
    }
  }
}

// 版权
.Copyright {
  text-align: center;
  font-family: Manrope;
  font-weight: 600;
  color: #14151b;
  margin: 8% 0 1%;
}

@media screen and (min-width: 768px) and (max-width: 992px) {
  ::v-deep .linkBox {
    flex: 1;
    ul {
      display: flex;
      justify-content: center;
      align-items: center;
      li {
        font-family: Manrope;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 25px;
        padding: 0 20px;
        color: #ccc;
        .svg-icon {
          width: 25px;
          height: 25px;
          margin-right: 5px;
        }

        &:hover {
          cursor: pointer;
          color: #fff;
        }
        span {
          font-size: 14px;
        }
      }
    }
  }
  .Copyright {
    font-size: 14px;
  }
}

@media screen and (max-width: 768px) {
  ::v-deep .linkBox {
    flex: 1;
    ul {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      li {
        font-family: Manrope;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 25px;
        padding: 0 10px;
        color: #ccc;
        .svg-icon {
          width: 20px;
          height: 20px;
          margin-right: 5px;
        }

        &:hover {
          cursor: pointer;
          color: #fff;
        }
        span {
          font-size: 14px;
        }
      }
    }
  }
  .Copyright {
    font-size: 12px;
  }
}
</style>

<template>
  <div id="exitPlatformDebt" class="container">
    <!-- 设置操作员 -->
    <div class="topProd">
      <h4>{{ $t('Exit') }}</h4>

      <!-- 退出内容 -->
      <p>
        {{ $t('Exit_txt') }}
      </p>
    </div>

    <!-- 卡片 -->
    <div class="bottomCard">
      <!-- 上一步 -->
      <div
        @click="backClick"
        class="start d-none d-sm-none d-md-none d-lg-block col-2 col-sm-2 col-md-2 col-lg-2"
        style="display: inline-block"
      >
        <div>Back</div>
      </div>

      <!-- 内容 -->
      <div class="cardInfo">
        <div class="contentBox">
          <div class="title">
            <h2>{{ $t('Exit_Node') }} {{ form.node }}</h2>
          </div>

          <!-- 入驻成功 -->
          <div class="success">
            <div><SvgIcon name="success"></SvgIcon></div>

            <!-- 未尝还债务 -->
            <div class="txtBox">
              <div>{{ $t('Exit_outstanding') }}</div>
              <div class="balance">{{ form.debt }} FIL</div>
            </div>
          </div>

          <!-- 退出描述 -->
          <div class="welcome">
            {{ $t('Exit_outstandingtxt') }}
          </div>
        </div>
        <div class="prevNextBtn d-block d-sm-block d-md-block d-lg-none">
          <el-button @click="backClick" class="prevPage">Back</el-button>
          <el-button class="nextPage">Complete</el-button>
        </div>
      </div>

      <!-- 下一步 -->
      <div
        style="display: inline-block"
        class="next d-none d-sm-none d-md-none d-lg-block col-2 col-sm-2 col-md-2 col-lg-2"
      >
        <div>Complete</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router' //路由
import { ref, onMounted, watch } from 'vue'
import { useMinerStore } from '@/store/module/miner.js'
import { useBuffStore } from '@/store/module/buff.js'
import { useAccountStore } from '@/store/module/accounts.js'
import { storeToRefs } from 'pinia'
const router = useRouter()

onMounted(() => {
  if (buffStore.departObj && accountStore.isConnected) {
    form.value = {
      node: buffStore.departObj.actor, //节点
      debt: buffStore.departObj.debt //债务
    }
  } else {
    router.push({
      path: `/buff/minerInfo/${minerStore.minerObj.node}`
    })
  }
})

const buffStore = useBuffStore()
const { departObj } = storeToRefs(buffStore)
const minerStore = useMinerStore()
const { minerObj } = storeToRefs(buffStore)
const accountStore = useAccountStore()
const { isConnected } = storeToRefs(accountStore)

const form = ref({
  node: '', //节点
  debt: '' //债务
})

// 上一步
const backClick = async () => {
  router.push(`/buff/minerInfo/${minerStore.minerObj.node}`)
}
</script>

<script>
export default {
  name: 'exitPlatformDebt'
}
</script>
<style lang="scss" scoped>
//入驻介绍
.topProd {
  padding: 20px 50px;
  h4 {
    margin-bottom: 15px;
  }
  p {
    // text-indent: 2em;
    line-height: 30px;
    color: #ccc;
  }
}

// 卡片
::v-deep .bottomCard {
  width: 100%;
  padding: 20px 30px;
  display: flex;
  // justify-content: center;

  // 卡片信息
  .cardInfo {
    flex: 1;
    z-index: 5;
  }

  .start,
  .next {
    min-height: 400px;
    width: 150px;

    border-radius: 12px;
    font-size: 25px;
    scale: 0.85;
  }

  .start {
    margin-right: -20px;
    background: #7b33c3;
    div {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &:hover {
      cursor: pointer;
      color: #6be585;
    }
  }
  .next {
    margin-left: -20px;
    background: #5f4982;
    div {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .prevNextBtn {
    width: 100%;
    text-align: center;
    .el-button {
      margin: 20px 10px;
      color: #fff;
      background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);

      &:hover {
        color: #6be585;
      }
    }
  }
}

.contentBox {
  width: 100%;
  min-height: 500px;
  background: linear-gradient(180deg, #2d1e46 0%, #5629ad 100%);
  border-radius: 20px;
  z-index: 5;
  box-shadow: -2px -2px 5px #2d1e46, 2px 2px 5px #5c2cb9;
  font-family: 'Montserrat';
  box-sizing: border-box;
  color: #ccc;

  .title {
    h2 {
      padding: 20px 30px 0;
      font-weight: 700;
      color: #fff;
    }
  }
}

.success {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: #fff;
  margin: 6% 0 0 0;

  // 图标
  .svg-icon {
    width: 150px;
    height: 150px;
  }

  .txtBox {
    color: #ccc;
    font-size: 16px;

    .balance {
      // width: 80%;
      color: #fff;
      font-weight: 700;
      margin-left: 20px;
      font-size: 18px;
      overflow: hidden; //超出隐藏
      word-break: break-all; //纯英文、数字、中文
      text-overflow: ellipsis; //省略号
      -webkit-box-orient: vertical; //垂直
      white-space: pre-line; //合并空白符序列，但是保留换行符。(如果要使用这个垂直和显示几行的代码也要写)
    }
  }
}

.welcome {
  display: flex;
  justify-content: center;
  text-align: center;
  margin-top: 30px;
  font-size: 16px;
  padding: 0 10px;
}
@media screen and (max-width: 768px) {
  .topProd {
    padding: 20px 10px;
  }
  ::v-deep .bottomCard {
    padding: 0 0 20px;
    display: flex;
    justify-content: center;
  }

  .contentBox {
    box-shadow: none;
  }

  .success {
    margin: 15% 0 0 0;

    // 图标
    .svg-icon {
      width: 100px;
      height: 100px;
    }

    .txtBox {
      color: #ccc;
      font-size: 16px;
    }
  }
}
</style>

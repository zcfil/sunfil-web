<template>
  <div id="EnterSuccess" class="container">
    <!-- 节点入驻介绍 -->
    <div class="topProd">
      <h4>{{ $t('Check') }}</h4>
      <p>
        {{ $t('Check_txt') }}
      </p>
    </div>

    <!-- 卡片 -->
    <div class="bottomCard">
      <!-- 上一步 -->

      <div
        class="start d-none d-sm-none d-md-none d-lg-block col-2 col-sm-2 col-md-2 col-lg-2"
        style="display: inline-block"
      >
        <div>Back</div>
      </div>

      <!-- 内容 -->
      <div class="cardInfo col-8 col-sm-8 col-md-8 col-lg-8">
        <div class="contentBox">
          <div class="title">
            <h2>{{ $t('Check_node') }} {{ node }}</h2>
          </div>

          <!-- 入驻文字-->
          <div class="success">
            <span> <SvgIcon name="success"></SvgIcon></span>
            <!-- 节点已入驻 -->
            <span v-if="isEnterBool == 1 || isEnterBool == 2">{{
              $t('Check_settled2')
            }}</span>

            <!-- 入驻成功 -->
            <span v-else>{{ $t('Check_settled') }}</span>
          </div>

          <!-- 欢迎您的加入，让我们一起创造未来。 -->
          <div v-if="isEnterBool == 3" class="welcome">
            {{ $t('Check_Welcome') }}
          </div>

          <!-- 立即查看节点详情 -->
          <div v-if="isEnterBool == 1 || isEnterBool == 2" class="welcome">
            {{ $t('Check_Welcome2') }}
          </div>
        </div>

        <div class="prevNextBtn d-block d-sm-block d-md-block d-lg-none">
          <el-button class="prevPage">上一页</el-button>
          <el-button disabled class="nextPage">完成</el-button>
        </div>
      </div>

      <!-- 下一步 -->
      <div
        @click="completeClick"
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
import { ref, onMounted } from 'vue'
import { useMinerStore } from '@/store/module/miner.js'
import { useBuffStore } from '@/store/module/buff.js' //buff仓
import { storeToRefs } from 'pinia'

const router = useRouter() //路由
// 使用pinia仓
const minerStore = useMinerStore()
const { minerObj, role } = storeToRefs(minerStore)
const buffStore = useBuffStore()
const { actorInfo } = storeToRefs(buffStore)

onMounted(async () => {
  if (minerStore.minerObj) {
    isEnterBool.value = await minerStore.role
    node.value = await minerStore.minerObj.node
  } else {
    router.push({
      path: '/buff/buff_home'
    })
  }
})

const node = ref()
const isEnterBool = ref() //入驻状态

// 点击完成
const completeClick = async () => {
  if (isEnterBool.value == 1 || isEnterBool.value == 2) {
    // buffStore.actorInfo.nodeId = await minerStore.minerObj.node
    buffStore.actorInfo = '' //清空节点信息
    router.push({
      path: `/buff/minerInfo/${node.value}` //详情页
    })
  } else {
    minerStore.minerObj = '' //清空节点信息

    router.push({
      path: `/buff/minerInfo/${node.value}` //详情页
    })
  }
}
</script>

<script>
export default {
  name: 'EnterSuccess'
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

@keyframes moveLeft {
  0% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(-100%, 0);
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
    overflow: hidden;

    // .move {
    //   animation: 1s moveLeft;
    // }
  }

  .start,
  .next {
    display: flex;
    align-items: center;
    min-height: 400px;
    width: 150px;
    background: #5f4982;
    border-radius: 12px;
    font-size: 25px;
    scale: 0.8;
  }

  .start {
    margin-right: -20px;
    div {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .next {
    background: #7b33c3;
    margin-left: -20px;
    div {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &:hover {
      cursor: pointer;
      color: #6be585;
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

// 类型弹框
::v-deep .el-dialog {
  background: #d9d9d9;
  border-radius: 15px;

  .el-dialog__header {
    font-size: 18px;
    padding: 10px;
    color: #000;
  }

  .el-dialog__body {
    padding: 0px 10px 10px;

    .el-button {
      padding: 15px;
      font-size: 20px;
      color: #000;
    }
  }
}

.contentBox {
  width: 100%;
  min-height: 500px;
  background: linear-gradient(180deg, #2d1e46 0%, #5629ad 100%);
  border-radius: 20px;
  z-index: 5;

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
  font-size: 35px;
  color: #fff;
  line-height: 300px;
  .svg-icon {
    width: 150px;
    height: 150px;
  }
}
.welcome {
  display: flex;
  justify-content: center;
  text-align: center;
  margin-top: 20px;
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
    font-size: 17px;
    line-height: 300px;
    .svg-icon {
      width: 100px;
      height: 100px;
    }
  }

  .welcome {
    margin-top: 0px;
  }
}
</style>

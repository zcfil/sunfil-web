<template>
  <div id="workerSuccess" class="container">
    <!-- worker设置成功 -->
    <div class="topProd">
      <h4>{{ $t('worker') }}</h4>

      <!--  如果有需要，您可以通过智能合约修改节点的worker地址。 -->
      <p>{{ $t('worker_smart') }}</p>
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
      <div class="cardInfo">
        <div class="contentBox">
          <div class="title">
            <h2>{{ $t('operator_Node') }} {{ node }}</h2>
          </div>

          <!-- 入驻成功 -->
          <div class="success">
            <span> <SvgIcon name="workerSuccess"></SvgIcon></span>

            <span> {{ $t('worker_succes') }} </span>
          </div>

          <div class="welcome">
            {{ $t('worker_been') }}
          </div>
        </div>

        <div class="prevNextBtn d-block d-sm-block d-md-block d-lg-none">
          <el-button class="prevPage">上一页</el-button>
          <el-button @click="nextClick" class="nextPage">下一页</el-button>
        </div>
      </div>

      <!-- 下一步 -->
      <div
        style="display: inline-block"
        @click="nextClick"
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
import { storeToRefs } from 'pinia'
import { useMinerStore } from '@/store/module/miner'
import { useSetStore } from '@/store/module/set.js'

const router = useRouter()
const minerStore = useMinerStore()
const { minerObj } = storeToRefs(minerStore)
const setStore = useSetStore()
const { controlInfo } = storeToRefs(setStore)

onMounted(() => {
  if (minerStore.minerObj) {
    node.value = minerStore.minerObj.node
  } else {
    router.push('/buff/buff_home')
  }
})

const node = ref() //节点

// 下一步
const nextClick = async () => {
  //清空节点信息
  minerStore.minerObj = ''
  setStore.controlInfo = ''

  router.push('/buff/buff_home')
}
</script>

<script>
export default {
  name: 'WorkerSuccess'
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
    min-height: 500px;
    width: 150px;
    background: #7b33c3;
    border-radius: 12px;
    font-size: 25px;
    scale: 0.85;
  }

  .start {
    margin-right: -20px;
    background: #5f4982;
    color: #ccc;
    div {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .next {
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
  font-size: 50px;
  color: #fff;
  margin: 6% 0 0 0;

  .svg-icon {
    width: 150px;
    height: 150px;
  }
}

.welcome {
  display: flex;
  justify-content: center;
  text-align: center;
  margin-top: 50px;
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
    font-size: 30px;
    margin: 15% 0 0 0;
    .svg-icon {
      width: 100px;
      height: 100px;
    }
  }
  .welcome {
    margin-top: 30px;
  }
}
</style>

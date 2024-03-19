<template>
  <div id="exitPlatformSuccess" class="container">
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
        class="start d-none d-sm-none d-md-none d-lg-block col-2 col-sm-2 col-md-2 col-lg-2"
        style="display: inline-block"
      >
        <div>Back</div>
      </div>

      <!-- 内容 -->
      <div class="cardInfo">
        <div class="contentBox">
          <div class="title">
            <h2>{{ $t('Exit_Node') }} {{ node }}</h2>
          </div>

          <!-- 入驻成功 -->
          <div class="success">
            <span> <SvgIcon name="success"></SvgIcon></span>
            <span> {{ $t('Exit_successfully') }} </span>
          </div>

          <!-- 退出成功描述 -->
          <div class="welcome">
            {{ $t('Exit_successfullyrxt') }}
          </div>
        </div>

        <div class="prevNextBtn d-block d-sm-block d-md-block d-lg-none">
          <el-button class="prevPage">Back</el-button>
          <el-button @click="nextClick" class="nextPage">Next</el-button>
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
import { useMinerStore } from '@/store/module/miner.js' //节点
import { useBuffStore } from '@/store/module/buff.js' //buff仓
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router' //路由
import { ref, onMounted, watch } from 'vue'

const router = useRouter()
// 使用仓库
const buffStore = useBuffStore()
const { actorInfo, departObj } = storeToRefs(buffStore)
const minerStore = useMinerStore()
const { minerObj } = storeToRefs(minerStore)
onMounted(() => {
  if (buffStore.departObj) {
    node.value = buffStore.departObj.actor
  } else {
    router.push('/buff/buff_home')
  }
})

// 节点
const node = ref()

// 下一步
const nextClick = async () => {
  buffStore.departObj = '' //清空离职信息
  minerStore.minerObj = '' //清空节点信息
  router.push('/buff/buff_home')
}
</script>

<script>
export default {
  name: 'exitPlatformSuccess'
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
    border-radius: 12px;
    font-size: 25px;
    scale: 0.85;
  }

  .start {
    background: #5f4982;
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
    margin: 15% 0 0 0;
    font-size: 30px;

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

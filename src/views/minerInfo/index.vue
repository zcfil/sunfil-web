<template>
  <div id="MinerInfo" class="container">
    <div class="topInfoBox">
      <!-- 节点信息 -->
      <div class="leftTop col-12 col-sm-12 col-md-12 col-lg-8">
        <!-- 节点信息 -->
        <div class="info">
          <div class="miner">
            <h3>
              <!-- <span style="font-weight: 400">{{ $t('Check_node') }}&nbsp;</span> -->
              <span>{{ form.node }}</span>
            </h3>

            <!-- 设置 -->

            <SvgIcon
              v-if="
                accountStore.isConnected &&
                form.role !== 3 &&
                nodeData.isOperator
              "
              @click="setClick"
              name="setting"
              style="width: 40px; height: 40px; cursor: pointer"
            />
          </div>

          <div class="cardBox">
            <!-- 节点总余额 -->
            <div class="infoLeft col-12 col-sm-12 col-md-12 col-lg-3">
              <div v-if="!skeletonShow" class="countStyleInfo">
                <countFlopTest
                  :val="nodeData.nodeTotalBalance.toFixed(2)"
                  suffix="FIL"
                />
              </div>
              <div v-else><el-skeleton :rows="0" animated /></div>

              <div>{{ $t('Check_Total') }}</div>
            </div>

            <div class="infoRight col-12 col-sm-12 col-md-12 col-lg-9">
              <!-- 债务价值 -->
              <div class="item">
                <div class="top">
                  <div v-if="!skeletonShow" class="countStyleInfo">
                    <countFlopTest
                      :val="nodeData.debtValue.toFixed(2)"
                      suffix="FIL"
                    />
                  </div>
                  <div v-else><el-skeleton :rows="0" animated /></div>
                  <div>{{ $t('Check_Debt') }}</div>
                </div>

                <!-- 节点所有权余额 -->
                <div class="bottom">
                  <div v-if="!skeletonShow" class="countStyleInfo">
                    <countFlopTest
                      :val="nodeData.nodeOwnershipBalance.toFixed(2)"
                      suffix="FIL"
                    />
                  </div>
                  <div v-else><el-skeleton :rows="0" animated /></div>
                  <div>{{ $t('Check_ownership') }}</div>
                </div>
              </div>

              <div class="item">
                <!-- 债务比例 -->
                <div class="top">
                  <div v-if="!skeletonShow" class="countStyleInfo">
                    <!-- {{ (nodeData.debtRatio * 100).toFixed(2) }} % -->
                    <countFlopTest
                      :val="(nodeData.debtRatio * 100).toFixed(2)"
                      suffix="%"
                    />
                  </div>
                  <div v-else><el-skeleton :rows="0" animated /></div>
                  <div>{{ $t('Check_Current') }}</div>
                </div>

                <!-- 最大负债率 -->
                <div class="bottom">
                  <div v-if="!skeletonShow" class="countStyleInfo">
                    <countFlopTest
                      :val="(nodeData.maxDebtRatio * 100).toFixed(2)"
                      suffix="%"
                    />
                  </div>
                  <div v-else><el-skeleton :rows="0" animated /></div>
                  <div>{{ $t('Check_Max') }}</div>
                </div>
              </div>

              <div class="item">
                <!-- 提现阈值 -->
                <div class="top">
                  <div v-if="!skeletonShow" class="countStyleInfo">
                    <countFlopTest
                      :val="nodeData.withdrawalThreshold.toFixed(2)"
                      suffix="FIL"
                    />
                  </div>
                  <div v-else><el-skeleton :rows="0" animated /></div>
                  <div>{{ $t('Check_Withdrawal') }}</div>
                </div>

                <!-- 清算阈值 -->
                <div class="bottom">
                  <div v-if="!skeletonShow" class="countStyleInfo">
                    <countFlopTest
                      :val="(nodeData.settlementThreshold * 100).toFixed(2)"
                      suffix="%"
                    />
                  </div>
                  <div v-else><el-skeleton :rows="0" animated /></div>
                  <div>{{ $t('Check_Clearing2') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 可用余额 -->
        <div class="usable">
          <div class="infoLeft col-12 col-sm-12 col-md-3 col-lg-3">
            <SvgIcon name="infoAvatar" />
          </div>

          <div class="infoRight col-12 col-sm-12 col-md-9 col-lg-9">
            <div class="item">
              <div v-if="!skeletonShow" class="countStyleInfo">
                <countFlopTest
                  :val="nodeData.nodeAvailableBalance.toFixed(2)"
                  suffix="FIL"
                />
              </div>
              <div v-else><el-skeleton :rows="0" animated /></div>
              <div>{{ $t('Check_Available2') }}</div>
            </div>

            <!-- 锁仓奖励 -->
            <div class="item">
              <div v-if="!skeletonShow" class="countStyleInfo">
                <countFlopTest
                  :val="nodeData.lockInRewards.toFixed(2)"
                  suffix="FIL"
                />
              </div>
              <div v-else><el-skeleton :rows="0" animated /></div>
              <div>{{ $t('Check_Locked') }}</div>
            </div>

            <!-- 扇区抵押 -->
            <div class="item">
              <div v-if="!skeletonShow" class="countStyleInfo">
                <countFlopTest
                  :val="nodeData.sectorPledge.toFixed(2)"
                  suffix="FIL"
                />
              </div>
              <div v-else><el-skeleton :rows="0" animated /></div>
              <div>{{ $t('Check_Initial') }}</div>
            </div>
          </div>
        </div>

        <!-- 还款/借款/提现 -->
        <!-- pc端 -->
        <el-carousel
          ref="carouselRef"
          class="d-none d-sm-block d-md-block d-lg-block"
          :autoplay="false"
          indicator-position="none"
          type="card"
          height="400px"
          @change="changeCarousel"
        >
          <!-- 借款 -->
          <el-carousel-item>
            <div class="stakeContent">
              <div class="topBox">
                <h6>{{ $t('Borrows') }}</h6>
                <div class="inputBox">
                  <el-input
                    type="number"
                    oninput="if(value.length>10)value=value.slice(0,10)"
                    :disabled="showBtnLoading3"
                    v-model.trim="input3"
                    placeholder="0.00"
                    maxlength="10"
                    @keyup="loadInputFn"
                    @keydown="onKeydown"
                    @blur="onblur($event)"
                  >
                    <template #prefix>
                      <SvgIcon name="fil" style="width: 30px; height: 30px" />
                    </template>
                    <template #suffix>
                      <el-button
                        :disabled="showBtnLoading3"
                        class="max"
                        @click="clickMax(3)"
                        >Max</el-button
                      >
                    </template>
                  </el-input>
                  <div class="loadTip">{{ $t('loadTip') }}</div>
                </div>

                <ul>
                  <li>
                    <!-- 未偿还债务 -->
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ $t('Borrows_debt') }}
                    </div>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      <SvgIcon
                        v-if="loanIcon"
                        name="greenUp"
                        style="
                          width: 16px;
                          height: 16px;
                          margin-top: -5px;
                          margin-right: 5px;
                        "
                      />
                      <span v-if="!showSkeleton">
                        {{ loanData.outstandingDebt }} FIL
                      </span>
                      <span v-else><el-skeleton :rows="0" animated /></span>
                    </div>
                  </li>

                  <!-- 最高可借额度 -->
                  <li>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ $t('Borrows_Maximum') }}
                    </div>
                    <div
                      v-if="!showSkeleton"
                      class="col-6 col-sm-6 col-md-6 col-lg-6"
                    >
                      {{ loanData.maxLoanLimit }} FIL
                    </div>
                    <div v-else class="col-6 col-sm-6 col-md-6 col-lg-6">
                      <el-skeleton :rows="0" animated />
                    </div>
                  </li>

                  <!-- 剩余可借额度 -->
                  <li>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ $t('Borrows_Remaining') }}
                    </div>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      <SvgIcon
                        v-if="loanIcon"
                        name="redDown"
                        style="
                          width: 16px;
                          height: 16px;
                          margin-top: -2px;
                          margin-right: 5px;
                        "
                      />
                      <span v-if="!showSkeleton">
                        {{ loanData.surplus }} FIL
                      </span>
                      <span v-else> <el-skeleton :rows="0" animated /></span>
                    </div>
                  </li>
                </ul>
              </div>

              <div
                @click="clickPushId(0)"
                v-if="carouselIndex == 0 && loanId"
                class="txtBox"
              >
                <span style="margin-right: 5px">交易Hash</span>
                <span>{{ loanId.slice(0, 10) }}...{{ loanId.slice(-10) }}</span>
                <SvgIcon
                  name="rocket"
                  style="
                    width: 16px;
                    height: 16px;
                    margin-top: -2px;
                    margin-left: 5px;
                  "
                />
              </div>
              <!-- 借 款 -->
              <div v-if="accountStore.isConnected" class="btnBox">
                <!-- 提 交借款  -->
                <el-button
                  :disabled="disabledLoad"
                  v-if="!showBtnLoading3"
                  @click="clickLoan"
                >
                  {{ $t('Borrows') }}
                </el-button>

                <!-- 等待交易确认-->
                <el-button v-else :loading="showBtnLoading3">
                  {{ $t('STAKE_SUBMIT2') }}
                </el-button>
              </div>

              <!-- 点击连接 -->
              <div v-else class="btnBox" @click="clickConnect">
                <el-button> {{ $t('CW') }}</el-button>
              </div>
            </div>
          </el-carousel-item>

          <!-- 提现 -->
          <el-carousel-item>
            <div class="stakeContent">
              <div class="topBox">
                <h6>{{ $t('Withdraws') }}</h6>
                <div class="inputBox">
                  <el-input
                    type="number"
                    oninput="if(value.length>10)value=value.slice(0,10)"
                    :disabled="showBtnLoading1"
                    v-model.trim="input1"
                    placeholder="0.00"
                    maxlength="10"
                    @keyup="withdrawInput"
                    @keydown="onKeydown"
                    @blur="onblur($event)"
                  >
                    <template #prefix>
                      <SvgIcon name="fil" style="width: 30px; height: 30px" />
                    </template>
                    <template #suffix>
                      <el-button
                        :disabled="showBtnLoading1"
                        class="max"
                        @click="clickMax(1)"
                        >Max</el-button
                      >
                    </template>
                  </el-input>
                </div>

                <ul>
                  <!-- 最大可提现余额 -->
                  <li>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ $t('Withdraws_Maximum') }}
                    </div>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      <SvgIcon
                        v-if="withdrawIcon"
                        name="redDown"
                        style="
                          width: 16px;
                          height: 16px;
                          margin-top: -2px;
                          margin-right: 5px;
                        "
                      />
                      <span v-if="!showSkeleton"
                        >{{ withDrawData.maxWithdrawBalance }} FIL</span
                      >
                      <span v-else><el-skeleton :rows="0" animated /></span>
                    </div>
                  </li>

                  <!-- 收款人 -->
                  <li>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ $t('Withdraws_payee') }}
                    </div>
                    <div
                      v-if="!showSkeleton"
                      class="col-6 col-sm-6 col-md-6 col-lg-6"
                    >
                      {{ withDrawData.payee }}
                    </div>
                    <div v-else class="col-6 col-sm-6 col-md-6 col-lg-6">
                      <el-skeleton :rows="0" animated />
                    </div>
                  </li>
                </ul>
              </div>

              <div
                @click="clickPushId(1)"
                v-if="carouselIndex == 1 && withdrawId"
                class="txtBox"
              >
                <span style="margin-right: 5px">交易Hash</span>
                <span
                  >{{ withdrawId.slice(0, 10) }}...{{
                    withdrawId.slice(-10)
                  }}</span
                >
                <SvgIcon
                  name="rocket"
                  style="
                    width: 16px;
                    height: 16px;
                    margin-top: -2px;
                    margin-left: 5px;
                  "
                />
              </div>

              <!-- 提现按钮 -->
              <div v-if="accountStore.isConnected" class="btnBox">
                <el-button
                  :disabled="!nodeData.isOperator"
                  v-if="!showBtnLoading1"
                  @click="clickWithdraw"
                >
                  {{ $t('Withdraws') }}
                </el-button>

                <!-- 等待交易确认-->
                <el-button v-else :loading="showBtnLoading1">
                  {{ $t('STAKE_SUBMIT2') }}
                </el-button>
              </div>

              <div v-else class="btnBox" @click="clickConnect">
                <el-button> {{ $t('CW') }}</el-button>
              </div>
            </div>
          </el-carousel-item>

          <!-- 还款 -->
          <el-carousel-item>
            <div class="stakeContent">
              <div class="topBox">
                <h6>{{ $t('Repayments') }}</h6>
                <div class="inputBox">
                  <el-input
                    type="number"
                    oninput="if(value.length>10)value=value.slice(0,10)"
                    :disabled="showBtnLoading2"
                    v-model.trim="input2"
                    placeholder="0.00"
                    maxlength="10"
                    @keyup="repaymentInput"
                    @keydown="onKeydown"
                    @blur="onblur($event)"
                  >
                    <template #prefix>
                      <SvgIcon name="fil" style="width: 30px; height: 30px" />
                    </template>
                    <template #suffix>
                      <el-button
                        :disabled="showBtnLoading2"
                        class="max"
                        @click="clickMax(2)"
                        >Max</el-button
                      >
                    </template>
                  </el-input>
                </div>

                <ul>
                  <!-- 未偿还债务 -->
                  <li>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ $t('Repayments_debt') }}
                    </div>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      <SvgIcon
                        v-if="nodeRepayIcon"
                        name="redDown"
                        style="
                          width: 16px;
                          height: 16px;
                          margin-top: -2px;
                          margin-right: 5px;
                        "
                      />
                      <span v-if="!showSkeleton">
                        {{ nodeRepayData.outstandingDebt }} FIL
                      </span>
                      <span v-else><el-skeleton :rows="0" animated /></span>
                    </div>
                  </li>

                  <!--  最高可借额度 -->
                  <li>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ $t('Repayments_Maximum') }}
                    </div>
                    <div
                      v-if="!showSkeleton"
                      class="col-6 col-sm-6 col-md-6 col-lg-6"
                    >
                      {{ nodeRepayData.maxLoanLimit }} FIL
                    </div>
                    <div v-else class="col-6 col-sm-6 col-md-6 col-lg-6">
                      <el-skeleton :rows="0" animated />
                    </div>
                  </li>

                  <!--  剩余可借额度 -->
                  <li>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ $t('Repayments_Remaining') }}
                    </div>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      <SvgIcon
                        v-if="nodeRepayIcon"
                        name="greenUp"
                        style="
                          width: 16px;
                          height: 16px;
                          margin-top: -4px;
                          margin-right: 5px;
                        "
                      />
                      <span v-if="!showSkeleton"
                        >{{ nodeRepayData.surplus }} FIL</span
                      >
                      <span v-else><el-skeleton :rows="0" animated /></span>
                    </div>
                  </li>
                </ul>
              </div>

              <div
                @click="clickPushId(2)"
                v-if="carouselIndex == 2 && repaymentId"
                class="txtBox"
              >
                <span style="margin-right: 5px">交易Hash</span>
                <span
                  >{{ repaymentId.slice(0, 10) }}...{{
                    repaymentId.slice(-10)
                  }}</span
                >
                <SvgIcon
                  name="rocket"
                  style="
                    width: 16px;
                    height: 16px;
                    margin-top: -2px;
                    margin-left: 5px;
                  "
                />
              </div>
              <!-- 提 交借款  -->
              <div v-if="accountStore.isConnected" class="btnBox">
                <el-button
                  :disabled="!nodeData.isOperator"
                  v-if="!showBtnLoading2"
                  @click="clickRepayment"
                >
                  {{ $t('Repayments') }}
                </el-button>

                <!-- 等待交易确认-->
                <el-button v-else :loading="showBtnLoading2">
                  {{ $t('STAKE_SUBMIT2') }}
                </el-button>
              </div>

              <div v-else class="btnBox" @click="clickConnect">
                <el-button> {{ $t('CW') }}</el-button>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>

        <!-- 手机端 -->
        <el-carousel
          class="d-block d-sm-none d-md-none d-lg-none"
          height="600px"
          direction="vertical"
          indicator-position="none"
          type="card"
          :autoplay="false"
        >
          <!-- 借款 -->
          <el-carousel-item>
            <div class="stakeContent">
              <div class="topBox">
                <h6>{{ $t('Borrows') }}</h6>
                <div class="inputBox">
                  <el-input
                    type="number"
                    oninput="if(value.length>10)value=value.slice(0,10)"
                    :disabled="showBtnLoading3"
                    v-model.trim="input3"
                    placeholder="0.00"
                    maxlength="10"
                    @keyup="loadInputFn"
                    @keydown="onKeydown"
                    @blur="onblur($event)"
                  >
                    <template #prefix>
                      <SvgIcon name="fil" style="width: 30px; height: 30px" />
                    </template>
                    <template #suffix>
                      <el-button class="max" @click="clickMax(3)"
                        >Max</el-button
                      >
                    </template>
                  </el-input>
                  <!-- 最低借款 -->
                  <div class="loadTip">{{ $t('loadTip') }}</div>
                </div>

                <ul>
                  <!--  未偿还债务 -->
                  <li>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ $t('Borrows_debt') }}
                    </div>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      <SvgIcon
                        v-if="loanIcon"
                        name="greenUp"
                        style="
                          width: 16px;
                          height: 16px;
                          margin-top: -5px;
                          margin-right: 5px;
                        "
                      />
                      <span> {{ loanData.outstandingDebt }} FIL</span>
                    </div>
                  </li>

                  <!--   最高可借额度 -->
                  <li>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ $t('Borrows_Maximum') }}
                    </div>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ loanData.maxLoanLimit }}FIL
                    </div>
                  </li>

                  <!--   剩余可借额度 -->
                  <li>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ $t('Borrows_Remaining') }}
                    </div>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      <SvgIcon
                        v-if="loanIcon"
                        name="redDown"
                        style="
                          width: 16px;
                          height: 16px;
                          margin-top: -2px;
                          margin-right: 5px;
                        "
                      />
                      <span> {{ loanData.surplus }} FIL </span>
                    </div>
                  </li>
                </ul>
              </div>
              <!-- 借款按钮 -->
              <div v-if="accountStore.isConnected" class="btnBox">
                <!-- 提 交借款  -->
                <el-button
                  :disabled="disabledLoad"
                  v-if="!showBtnLoading3"
                  @click="clickLoan"
                >
                  {{ $t('Borrows') }}
                </el-button>

                <!-- 等待交易确认-->
                <el-button v-else :loading="showBtnLoading3">
                  {{ $t('STAKE_SUBMIT2') }}
                </el-button>
              </div>
              <div v-else class="btnBox" @click="clickConnect">
                <el-button> {{ $t('CW') }}</el-button>
              </div>
            </div>
          </el-carousel-item>

          <!-- 提现 -->
          <el-carousel-item>
            <div class="stakeContent">
              <div class="topBox">
                <h6>{{ $t('Withdraws') }}</h6>
                <div class="inputBox">
                  <el-input
                    type="number"
                    oninput="if(value.length>10)value=value.slice(0,10)"
                    v-model.trim="input1"
                    placeholder="0.00"
                    maxlength="10"
                    @keyup="withdrawInput"
                    @keydown="onKeydown"
                    @blur="onblur($event)"
                  >
                    <!-- icon图标 -->
                    <template #prefix>
                      <SvgIcon name="fil" style="width: 30px; height: 30px" />
                    </template>
                    <!-- max按钮 -->
                    <template #suffix>
                      <el-button class="max" @click="clickMax(1)"
                        >Max</el-button
                      >
                    </template>
                  </el-input>

                  <!-- <el-input v-model.trim="input1" placeholder="0.00">
                <template #prefix>
                  <SvgIcon name="logo" style="width: 30px; height: 30px" />
                </template>
                <template #suffix>
                  <el-button class="max">Max</el-button>
                </template>
              </el-input> -->
                </div>

                <ul>
                  <!-- 最大可提现余额 -->
                  <li>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ $t('Withdraws_Maximum') }}
                    </div>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      <SvgIcon
                        v-if="withdrawIcon"
                        name="redDown"
                        style="
                          width: 16px;
                          height: 16px;
                          margin-top: -2px;
                          margin-right: 5px;
                        "
                      />
                      <span>{{ withDrawData.maxWithdrawBalance }} FIL</span>
                    </div>
                  </li>

                  <!-- 收款人 -->
                  <li>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ $t('Withdraws_payee') }}
                    </div>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ withDrawData.payee }} FIL
                    </div>
                  </li>
                </ul>
              </div>

              <div v-if="accountStore.isConnected" class="btnBox">
                <!-- 提 交借款  -->
                <el-button
                  :disabled="!nodeData.isOperator"
                  v-if="!showBtnLoading1"
                  @click="clickWithdraw"
                >
                  {{ $t('Withdraws') }}
                </el-button>

                <!-- 等待交易确认-->
                <el-button v-else :loading="showBtnLoading1">
                  {{ $t('STAKE_SUBMIT2') }}
                </el-button>
              </div>
              <div v-else class="btnBox" @click="clickConnect">
                <el-button> {{ $t('CW') }}</el-button>
              </div>
            </div>
          </el-carousel-item>

          <!-- 还款 -->
          <el-carousel-item>
            <div class="stakeContent">
              <div class="topBox">
                <h6>{{ $t('Repayments') }}</h6>
                <div class="inputBox">
                  <el-input
                    type="number"
                    oninput="if(value.length>10)value=value.slice(0,10)"
                    v-model.trim="input2"
                    placeholder="0.00"
                    maxlength="10"
                    @keyup="repaymentInput"
                    @keydown="onKeydown"
                    @blur="onblur($event)"
                  >
                    <template #prefix>
                      <SvgIcon name="fil" style="width: 30px; height: 30px" />
                    </template>
                    <template #suffix>
                      <el-button class="max" @click="clickMax(2)"
                        >Max</el-button
                      >
                    </template>
                  </el-input>

                  <!-- <el-input v-model.trim="input1" placeholder="0.00">
                <template #prefix>
                  <SvgIcon name="logo" style="width: 30px; height: 30px" />
                </template>
                <template #suffix>
                  <el-button class="max">Max</el-button>
                </template>
              </el-input> -->
                </div>

                <ul>
                  <!-- 未偿还债务 -->
                  <li>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ $t('Repayments_debt') }}
                    </div>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      <SvgIcon
                        v-if="nodeRepayIcon"
                        name="redDown"
                        style="
                          width: 16px;
                          height: 16px;
                          margin-top: -2px;
                          margin-right: 5px;
                        "
                      />
                      <span> {{ nodeRepayData.outstandingDebt }} FIL </span>
                    </div>
                  </li>

                  <!-- 最高可借额度 -->
                  <li>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ $t('Repayments_Maximum') }}
                    </div>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ nodeRepayData.maxLoanLimit }} FIL
                    </div>
                  </li>

                  <!--   剩余可借额度 -->
                  <li>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      {{ $t('Repayments_Remaining') }}
                    </div>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-6">
                      <SvgIcon
                        v-if="nodeRepayIcon"
                        name="greenUp"
                        style="
                          width: 16px;
                          height: 16px;
                          margin-top: -4px;
                          margin-right: 5px;
                        "
                      />
                      <span> {{ nodeRepayData.surplus }} FIL </span>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- 还 款按钮 -->

              <div v-if="accountStore.isConnected" class="btnBox">
                <!-- 提 交借款  -->
                <el-button
                  :disabled="!nodeData.isOperator"
                  v-if="!showBtnLoading2"
                  @click="clickRepayment"
                >
                  {{ $t('Repayments') }}
                </el-button>

                <!-- 等待交易确认-->
                <el-button v-else :loading="showBtnLoading2">
                  {{ $t('STAKE_SUBMIT2') }}
                </el-button>
              </div>
              <div v-else class="btnBox" @click="clickConnect">
                <el-button> {{ $t('CW') }}</el-button>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <!-- 侧边栏 -->
      <div class="right col-12 col-sm-12 col-md-12 col-lg-4">
        <div class="topRight">
          <p>
            <span>
              <span style="font-size: 12px">{{ $t('loan') }}&nbsp;</span>
              <span style="font-size: 18px; font-weight: 800">APY</span>
            </span>
            <i :class="greenCircle"></i>
          </p>

          <!-- <h2>{{ (rateObj.loanAPY * 100).toFixed(2) }}%</h2> -->
          <h2 class="countStyleLoan countColorLoan">
            <countFlopTest
              :val="(rateObj.loanAPY * 100).toFixed(2)"
              suffix="%"
            />
          </h2>

          <div class="useRate">
            <h5 style="font-weight: 700">{{ $t('U_rate') }}</h5>
            <!-- <h5 style="text-align: right; font-size: 25px">
              {{ (rateObj.financeUseRate * 100).toFixed(2) }}%
            </h5> -->

            <h5 class="countStyle2">
              <countFlopTest
                :val="(rateObj.financeUseRate * 100).toFixed(2)"
                suffix="%"
              />
            </h5>
          </div>
        </div>
        <!-- 底部 -->
        <Sidebar />
      </div>
    </div>

    <div class="bottomInfoBox col-12 col-sm-12 col-md-12 col-lg-12">
      <!-- 历史记录 pc端 -->
      <div class="history d-none d-sm-none d-md-block d-lg-block">
        <h4>{{ $t('history') }}</h4>

        <!-- 轮播按钮 -->
        <div class="swipeBtnBox">
          <ul @mouseover="mouseOver" @mouseleave="mouseLeave">
            <li
              @click="moveClick(index)"
              :class="{
                active: index == moveIndex
              }"
              v-for="(item, index) in btnArr"
              :key="index"
            >
              {{ item.label }}
            </li>
          </ul>
        </div>

        <!-- 表格 -->
        <div class="tableBox">
          <!-- Borrows 借款 -->
          <el-table
            @mouseover="mouseOver"
            @mouseleave="mouseLeave"
            v-if="moveIndex == 0"
            :header-cell-style="{
              background: '#323338',
              textAlign: 'center',
              fontWeight: '700',
              color: '#ccc'
            }"
            :cell-style="{ textAlign: 'center' }"
            :data="borrowsArr"
            :row-class-name="tableRowClassName"
          >
            <el-table-column show-overflow-tooltip label="Txn Hash" prop="cid">
              <template v-slot="{ row }">
                <span @dblclick="cellClick(row.cid)">
                  {{ row.cid.slice(0, 6) }}...{{ row.cid.slice(-6) }}
                </span>
              </template>
            </el-table-column>
            <!-- 操作员 -->
            <el-table-column
              show-overflow-tooltip
              :label="$t('Borrows_listoperator')"
              prop="fromAddr"
            >
              <template v-slot="{ row }">
                <span @dblclick="cellClick(row.fromAddr)">
                  {{ row.fromAddr.slice(0, 6) }}...{{ row.fromAddr.slice(-6) }}
                </span>
              </template>
            </el-table-column>

            <!-- 时间 -->
            <el-table-column
              show-overflow-tooltip
              :label="$t('Borrows_listtime')"
              prop="timeDuration"
            />

            <!-- 数量 -->
            <el-table-column
              show-overflow-tooltip
              :label="$t('Borrows_listAmount')"
              prop="amount"
            >
              <template v-slot="{ row }">
                <span> {{ row.amount }} FIL </span>
              </template>
            </el-table-column>
          </el-table>

          <!-- Repayments 还款 -->
          <el-table
            @mouseover="mouseOver"
            @mouseleave="mouseLeave"
            v-if="moveIndex == 1"
            :header-cell-style="{
              background: '#323338',
              textAlign: 'center',
              fontWeight: '700',
              color: '#ccc'
            }"
            :cell-style="{ textAlign: 'center' }"
            :data="repaymentsArr"
            :row-class-name="tableRowClassName"
          >
            <el-table-column show-overflow-tooltip label="Txn Hash" prop="cid">
              <template v-slot="{ row }">
                <span @dblclick="cellClick(row.cid)">
                  {{ row.cid.slice(0, 6) }}...{{ row.cid.slice(-6) }}
                </span>
              </template>
            </el-table-column>
            <!-- 操作员 -->
            <el-table-column
              show-overflow-tooltip
              :label="$t('Borrows_listoperator')"
              prop="fromAddr"
            >
              <template v-slot="{ row }">
                <span @dblclick="cellClick(row.fromAddr)">
                  {{ row.fromAddr.slice(0, 6) }}...{{ row.fromAddr.slice(-6) }}
                </span>
              </template>
            </el-table-column>

            <!-- 时间 -->
            <el-table-column
              show-overflow-tooltip
              :label="$t('Repayments_listtime')"
              prop="timeDuration"
            />

            <!-- 数量 -->
            <el-table-column
              show-overflow-tooltip
              :label="$t('Repayments_listAmount')"
              prop="amount"
            >
              <template v-slot="{ row }">
                <span> {{ row.amount }} FIL </span>
              </template>
            </el-table-column>
          </el-table>

          <!-- Withdraws 提现-->
          <el-table
            @mouseover="mouseOver"
            @mouseleave="mouseLeave"
            v-if="moveIndex == 2"
            :header-cell-style="{
              background: '#323338',
              textAlign: 'center',
              fontWeight: '700',
              color: '#ccc'
            }"
            :cell-style="{ textAlign: 'center' }"
            :data="withdrawArr"
            :row-class-name="tableRowClassName"
          >
            <el-table-column show-overflow-tooltip label="Txn Hash" prop="cid">
              <template v-slot="{ row }">
                <span @dblclick="cellClick(row.cid)">
                  {{ row.cid.slice(0, 6) }}...{{ row.cid.slice(-6) }}
                </span>
              </template>
            </el-table-column>
            <!-- 操作员 -->
            <el-table-column
              show-overflow-tooltip
              :label="$t('Borrows_listoperator')"
              prop="fromAddr"
            >
              <template v-slot="{ row }">
                <span @dblclick="cellClick(row.fromAddr)">
                  {{ row.fromAddr.slice(0, 6) }}...{{ row.fromAddr.slice(-6) }}
                </span>
              </template>
            </el-table-column>

            <!-- 时间 -->
            <el-table-column
              show-overflow-tooltip
              :label="$t('Withdraws_listtime')"
              prop="timeDuration"
            />

            <!-- 接收方 -->
            <el-table-column
              show-overflow-tooltip
              :label="$t('Withdraws_listpayee')"
              prop="toAddr"
            >
              <template v-slot="{ row }">
                <span
                  v-if="row.toAddr.length <= 12"
                  @dblclick="cellClick(row.toAddr)"
                >
                  {{ row.toAddr }}
                </span>
                <span v-else @dblclick="cellClick(row.toAddr)">
                  {{ row.toAddr.slice(0, 6) }}...{{ row.toAddr.slice(-6) }}
                </span>
              </template>
            </el-table-column>

            <!-- 数量 -->
            <el-table-column
              show-overflow-tooltip
              :label="$t('Withdraws_listAmount')"
              prop="amount"
            >
              <template v-slot="{ row }">
                <span> {{ row.amount }} FIL </span>
              </template>
            </el-table-column>
          </el-table>

          <!-- liquidation 清算-->
          <div class="liquidationBox" v-if="moveIndex == 3">
            <el-table
              @mouseover="mouseOver"
              @mouseleave="mouseLeave"
              :header-cell-style="{
                background: '#323338',
                textAlign: 'center',
                fontWeight: '700',
                color: '#ccc'
              }"
              :cell-style="{ textAlign: 'center' }"
              :data="liquidationArr"
              :row-class-name="tableRowClassName"
            >
              <!-- hash -->
              <!-- <el-table-column
                show-overflow-tooltip
                label="Txn Hash"
                prop="cid"
              >
                <template v-slot="{ row }">
                  <span>
                    {{ row.cid.slice(0, 6) }}...{{ row.cid.slice(-6) }}
                  </span>
                </template>
              </el-table-column> -->

              <!-- 清算类型 -->
              <el-table-column
                show-overflow-tooltip
                :label="$t('Withdraws_type')"
                prop="opType"
              >
                <template v-slot="{ row }">
                  <span>
                    {{
                      {
                        1: '入职',
                        2: '离职',
                        3: '修改操作人',
                        4: '提现',
                        5: '借款',
                        6: '还款',
                        7: '修改worker',
                        8: '修改control',
                        9: '受益人入职',
                        10: '受益人离职',
                        11: '决策清算',
                        12: '保护清算'
                      }[row.opType]
                    }}
                  </span>
                </template>
              </el-table-column>

              <!-- 时间 -->
              <el-table-column
                show-overflow-tooltip
                :label="$t('Withdraws_listtime')"
                prop="timeDuration"
              />

              <!-- 接收方 -->
              <el-table-column
                show-overflow-tooltip
                :label="$t('Withdraws_listpayee')"
                prop="toAddr"
              >
                <template v-slot="{ row }">
                  <span
                    v-if="row.toAddr.length <= 12"
                    @dblclick="cellClick(row.toAddr)"
                  >
                    {{ row.toAddr }}
                  </span>
                  <span v-else @dblclick="cellClick(row.toAddr)">
                    {{ row.toAddr.slice(0, 6) }}...{{ row.toAddr.slice(-6) }}
                  </span>
                </template>
              </el-table-column>

              <!-- 数量 -->
              <el-table-column
                show-overflow-tooltip
                :label="$t('Withdraws_listAmount')"
                prop="amount"
              >
                <template v-slot="{ row }">
                  <span> {{ row.amount }} FIL </span>
                </template>
              </el-table-column>
            </el-table>

            <div class="descBox">
              <div class="liquidationDesc">
                {{ $t('liquidationDesc') }}
              </div>
              <div class="liquidationDesc">
                {{ $t('liquidationDesc2') }}
              </div>
            </div>
          </div>

          <!-- nodeChange 节点变更-->
          <el-table
            @mouseover="mouseOver"
            @mouseleave="mouseLeave"
            v-if="moveIndex == 4"
            :header-cell-style="{
              background: '#323338',
              textAlign: 'center',
              fontWeight: '700',
              color: '#ccc'
            }"
            :cell-style="{ textAlign: 'center' }"
            :data="nodeChangeArr"
            :row-class-name="tableRowClassName"
          >
            <el-table-column show-overflow-tooltip label="Txn Hash" prop="cid">
              <template v-slot="{ row }">
                <span @dblclick="cellClick(row.cid)">
                  {{ row.cid.slice(0, 6) }}...{{ row.cid.slice(-6) }}
                </span>
              </template>
            </el-table-column>
            <!-- 变更类型 -->
            <el-table-column
              show-overflow-tooltip
              :label="$t('Withdraws_type2')"
              prop="opType"
            >
              <template v-slot="{ row }">
                <span>
                  {{
                    {
                      1: '入职',
                      2: '离职',
                      3: '修改操作人',
                      4: '提现',
                      5: '借款',
                      6: '还款',
                      7: '修改worker',
                      8: '修改control',
                      9: '受益人入职',
                      10: '受益人离职',
                      11: '决策清算',
                      12: '保护清算'
                    }[row.opType]
                  }}
                </span>
              </template>
            </el-table-column>

            <!-- 时间 -->
            <el-table-column
              show-overflow-tooltip
              :label="$t('Withdraws_listtime')"
              prop="timeDuration"
            />

            <!-- 节点 -->
            <el-table-column
              show-overflow-tooltip
              :label="$t('Withdraws_node')"
              prop="actorId"
            />

            <!-- 动作 -->
            <el-table-column
              show-overflow-tooltip
              :label="$t('Withdraws_action')"
              prop="nodeAction"
            >
              <template v-slot="{ row }">
                <span>
                  {{
                    { 0: '操作人操作', 1: '入驻', 2: '变更', 3: '退出' }[
                      row.nodeAction
                    ]
                  }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 移动端展示 -->
      <div class="history d-block d-sm-block d-md-none d-lg-none">
        <h4>{{ $t('history') }}</h4>
        <!-- 轮播按钮 -->
        <div class="selectBox">
          <el-select
            @change="changeMode"
            v-model="historyMode"
            placeholder="Select"
          >
            <el-option
              v-for="(item, index) in btnArr"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <!--借款 -->
        <div v-if="historyMode == 'borrow'">
          <div
            class="tableList"
            v-for="(item, index) in borrowsArr"
            :key="index"
          >
            <div class="tableItemBox">
              <!-- Txn Hash -->
              <div class="table-item">
                <div class="col-4 col-sm-4">Txn Hash</div>
                <div v-if="item.cid" class="col-8 col-sm-8">
                  {{ item.cid.slice(0, 6) }}...{{ item.cid.slice(-6) }}
                </div>
                <div v-else class="col-8 col-sm-8">--</div>
              </div>

              <!-- 操作员 -->
              <div class="table-item">
                <div class="col-4 col-sm-4">
                  {{ $t('Withdraws_listoperator') }}
                </div>
                <div v-if="item.fromAddr" class="col-8 col-sm-8">
                  {{ item.fromAddr.slice(0, 6) }}...{{
                    item.fromAddr.slice(-6)
                  }}
                </div>
                <div v-else class="col-8 col-sm-8">--</div>
              </div>

              <!-- 时间 -->
              <div class="table-item">
                <div class="col-4 col-sm-4">{{ $t('Withdraws_listtime') }}</div>
                <div class="col-8 col-sm-8">{{ item.timeDuration }}</div>
              </div>

              <!-- 数量 -->
              <div v-if="historyMode !== 'nodeChange'" class="table-item">
                <div class="col-4 col-sm-4">
                  {{ $t('Withdraws_listAmount') }}
                </div>
                <div class="col-8 col-sm-8">{{ item.amount }} FIL</div>
              </div>

              <div class="divider"></div>
            </div>
          </div>
        </div>

        <!--还款 -->
        <div v-if="historyMode == 'repayment'">
          <div
            class="tableList"
            v-for="(item, index) in repaymentsArr"
            :key="index"
          >
            <div class="tableItemBox">
              <!-- Txn Hash -->
              <div class="table-item">
                <div class="col-4 col-sm-4">Txn Hash</div>
                <div v-if="item.cid" class="col-8 col-sm-8">
                  {{ item.cid.slice(0, 6) }}...{{ item.cid.slice(-6) }}
                </div>
                <div v-else class="col-8 col-sm-8">--</div>
              </div>

              <!-- 操作员 -->
              <div class="table-item">
                <div class="col-4 col-sm-4">
                  {{ $t('Withdraws_listoperator') }}
                </div>
                <div v-if="item.fromAddr" class="col-8 col-sm-8">
                  {{ item.fromAddr.slice(0, 6) }}...{{
                    item.fromAddr.slice(-6)
                  }}
                </div>
                <div v-else class="col-8 col-sm-8">--</div>
              </div>

              <!-- 时间 -->
              <div class="table-item">
                <div class="col-4 col-sm-4">{{ $t('Withdraws_listtime') }}</div>
                <div class="col-8 col-sm-8">{{ item.timeDuration }}</div>
              </div>

              <!-- 数量 -->
              <div v-if="historyMode !== 'nodeChange'" class="table-item">
                <div class="col-4 col-sm-4">
                  {{ $t('Withdraws_listAmount') }}
                </div>
                <div class="col-8 col-sm-8">{{ item.amount }} FIL</div>
              </div>

              <div class="divider"></div>
            </div>
          </div>
        </div>

        <!--提现 -->
        <div v-if="historyMode == 'withdraw'">
          <div
            class="tableList"
            v-for="(item, index) in withdrawArr"
            :key="index"
          >
            <div class="tableItemBox">
              <!-- Txn Hash -->
              <div class="table-item">
                <div class="col-4 col-sm-4">Txn Hash</div>
                <div v-if="item.cid" class="col-8 col-sm-8">
                  {{ item.cid.slice(0, 6) }}...{{ item.cid.slice(-6) }}
                </div>
                <div v-else class="col-8 col-sm-8">--</div>
              </div>

              <!-- 操作员 -->
              <div class="table-item">
                <div class="col-4 col-sm-4">
                  {{ $t('Withdraws_listoperator') }}
                </div>
                <div v-if="item.fromAddr" class="col-8 col-sm-8">
                  {{ item.fromAddr.slice(0, 6) }}...{{
                    item.fromAddr.slice(-6)
                  }}
                </div>
                <div v-else class="col-8 col-sm-8">--</div>
              </div>

              <!-- 时间 -->
              <div class="table-item">
                <div class="col-4 col-sm-4">{{ $t('Withdraws_listtime') }}</div>
                <div class="col-8 col-sm-8">{{ item.timeDuration }}</div>
              </div>

              <!-- 接收方 -->
              <div
                v-if="historyMode == 'liquidation' || historyMode == 'withdraw'"
                class="table-item"
              >
                <div class="col-4 col-sm-4">
                  {{ $t('Withdraws_listpayee') }}
                </div>
                <div
                  v-if="item.toAddr && item.toAddr.length <= 12"
                  class="col-8 col-sm-8"
                >
                  {{ item.toAddr }}
                </div>
                <div
                  v-else-if="item.toAddr && item.toAddr.length > 12"
                  class="col-8 col-sm-8"
                >
                  {{ item.toAddr.slice(0, 6) }}...{{ item.toAddr.slice(-6) }}
                </div>
                <div v-else class="col-8 col-sm-8">--</div>
              </div>

              <!-- 数量 -->
              <div v-if="historyMode !== 'nodeChange'" class="table-item">
                <div class="col-4 col-sm-4">
                  {{ $t('Withdraws_listAmount') }}
                </div>
                <div class="col-8 col-sm-8">{{ item.amount }} FIL</div>
              </div>

              <div class="divider"></div>
            </div>
          </div>
        </div>

        <!--清算 -->
        <div v-if="historyMode == 'liquidation'">
          <div
            class="tableList"
            v-for="(item, index) in liquidationArr"
            :key="index"
          >
            <div class="tableItemBox">
              <!-- Txn Hash -->
              <!-- <div class="table-item">
                <div class="col-4 col-sm-4">Txn Hash</div>
                <div v-if="item.cid" class="col-8 col-sm-8">
                  {{ item.cid.slice(0, 6) }}...{{ item.cid.slice(-6) }}
                </div>
                <div v-else class="col-8 col-sm-8">--</div>
              </div> -->

              <!-- 清算类型  -->
              <div v-if="historyMode == 'liquidation'" class="table-item">
                <div class="col-4 col-sm-4">
                  {{ $t('Withdraws_type') }}
                </div>
                <div v-if="item.opType" class="col-8 col-sm-8">
                  {{
                    {
                      1: '入职',
                      2: '离职',
                      3: '修改操作人',
                      4: '提现',
                      5: '借款',
                      6: '还款',
                      7: '修改worker',
                      8: '修改control',
                      9: '受益人入职',
                      10: '受益人离职',
                      11: '决策清算',
                      12: '保护清算'
                    }[item.opType]
                  }}
                </div>
                <div v-else class="col-8 col-sm-8">--</div>
              </div>

              <!-- 时间 -->
              <div class="table-item">
                <div class="col-4 col-sm-4">{{ $t('Withdraws_listtime') }}</div>
                <div class="col-8 col-sm-8">{{ item.timeDuration }}</div>
              </div>

              <!-- 接收方 -->
              <div
                v-if="historyMode == 'liquidation' || historyMode == 'withdraw'"
                class="table-item"
              >
                <div class="col-4 col-sm-4">
                  {{ $t('Withdraws_listpayee') }}
                </div>
                <div v-if="item.toAddr.length > 12" class="col-8 col-sm-8">
                  {{ item.toAddr.slice(0, 6) }}...{{ item.toAddr.slice(-6) }}
                </div>
                <div v-else class="col-8 col-sm-8">
                  {{ item.toAddr }}
                </div>
              </div>

              <!-- 数量 -->
              <div v-if="historyMode !== 'nodeChange'" class="table-item">
                <div class="col-4 col-sm-4">
                  {{ $t('Withdraws_listAmount') }}
                </div>
                <div class="col-8 col-sm-8">{{ item.amount }} FIL</div>
              </div>

              <div class="divider"></div>
            </div>
          </div>

          <div v-if="liquidationArr.length > 0" class="liquidationDesc">
            {{ $t('liquidationDesc') }}
          </div>
          <div v-if="liquidationArr.length > 0" class="liquidationDesc">
            {{ $t('liquidationDesc2') }}
          </div>
        </div>

        <!--节点变更 -->
        <div v-if="historyMode == 'nodeChange'">
          <div
            class="tableList"
            v-for="(item, index) in nodeChangeArr"
            :key="index"
          >
            <div class="tableItemBox">
              <!-- Txn Hash -->
              <div class="table-item">
                <div class="col-4 col-sm-4">Txn Hash</div>
                <div v-if="item.cid" class="col-8 col-sm-8">
                  {{ item.cid.slice(0, 6) }}...{{ item.cid.slice(-6) }}
                </div>
                <div v-else class="col-8 col-sm-8">--</div>
              </div>

              <!-- 变更类型 -->
              <div v-if="historyMode == 'nodeChange'" class="table-item">
                <div class="col-4 col-sm-4">
                  {{ $t('Withdraws_listoperator') }}
                </div>
                <div v-if="item.opType" class="col-8 col-sm-8">
                  {{
                    {
                      1: '入职',
                      2: '离职',
                      3: '修改操作人',
                      4: '提现',
                      5: '借款',
                      6: '还款',
                      7: '修改worker',
                      8: '修改control',
                      9: '受益人入职',
                      10: '受益人离职',
                      11: '决策清算',
                      12: '保护清算'
                    }[item.opType]
                  }}
                </div>
                <div class="col-8 col-sm-8">--</div>
              </div>

              <!-- 时间 -->
              <div class="table-item">
                <div class="col-4 col-sm-4">{{ $t('Withdraws_listtime') }}</div>
                <div class="col-8 col-sm-8">{{ item.timeDuration }}</div>
              </div>

              <!-- 节点 -->
              <div v-if="historyMode == 'nodeChange'" class="table-item">
                <div class="col-4 col-sm-4">
                  {{ $t('Withdraws_node') }}
                </div>
                <div class="col-8 col-sm-8">{{ item.actorId }}</div>
              </div>

              <!-- 动作 -->
              <div v-if="historyMode == 'nodeChange'" class="table-item">
                <div class="col-4 col-sm-4">
                  {{ $t('Withdraws_action') }}
                </div>
                <div v-if="item.nodeAction" class="col-8 col-sm-8">
                  {{
                    { 0: '操作人操作', 1: '入驻', 2: '变更', 3: '退出' }[
                      item.nodeAction
                    ]
                  }}
                </div>
                <div v-else class="col-8 col-sm-8">--</div>
              </div>

              <div class="divider"></div>
            </div>
          </div>
        </div>

        <div v-if="showNoData" class="noDataBox">暂无数据</div>
      </div>
    </div>

    <!-- 设置操作人弹框 -->
    <SetOwner :showSet="showSet" @close="close" />
  </div>
</template>

<script setup>
import countFlopTest from '@/components/countFlopTest.vue'
import { getNonceFn, getGasFn, getGasPriceData } from '@/utils/gas/gas.js'
import { gasParams } from '@/utils/arraybufferToBase64.js'
import { toFixedNum } from '@/utils/num.js'
import { nodeRecordList } from '@/api/node.js'
import { useBuffStore } from '@/store/module/buff.js' //buff仓
import { useLoanContractStore } from '@/store/module/loanContract' //借贷合约仓
import { useRateContractStore } from '@/store/module/rateContract'
import { useAccountStore } from '@/store/module/accounts.js' //账号
import { useMinerStore } from '@/store/module/miner' //节点信息
import { useSidebarStore } from '@/store/module/sidebar.js' //侧边栏数据
import { storeToRefs } from 'pinia'
import { ElMessage, ElNotification } from 'element-plus'
import Sidebar from '@/components/sidebar.vue'
import SetOwner from '@/views/set/index.vue' //设置弹框组件
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import Web3 from 'web3'
import { ethers } from 'ethers'
import { useRoute } from 'vue-router'
import useClipboard from 'vue-clipboard3' //复制插件

// 初始化
onMounted(async () => {
  getTotalFilSideData() //侧边栏数据

  changeColor() //顶部呼吸灯
  loanContract.value = loanContractStore.getLoanContract() // 生成借贷合约
  fromAccountAddress.value = accountStore.account //小狐狸钱包
  form.value.node = route.params.id //节点对象

  form1.value.nodeId = route.params.id // 获取历史记录
  form2.value.nodeId = route.params.id //获取卡片信息
  form2.value.operator = accountStore.account //获取卡片信息

  target.value = form.value.node //调取智能合约参数

  await getDetailData() // 获取节点详情
  getCardData() // 获取卡片数据
  getNodeRecord() //历史记录

  // 从入职成功界面跳转过来
  if (minerStore.isEnterRole == 1 || minerStore.isEnterRole == 2) {
    form.value.role = minerStore.isEnterRole
  }
})

// 使用路由
const route = useRoute()
const { toClipboard } = useClipboard() //使用复制插件

// 使用仓库
const accountStore = useAccountStore()
const { account, isConnected, showType } = storeToRefs(accountStore)
const minerStore = useMinerStore()
const { minerObj, role, isEnterRole, linkHref, linkNet } =
  storeToRefs(minerStore)
const loanContractStore = useLoanContractStore()
const { getLoanContract, loanContractAddress } = storeToRefs(loanContractStore)

const buffStore = useBuffStore()
const { actorInfo } = storeToRefs(buffStore)

const sidebarStore = useSidebarStore()
const { getTotalFilSideInfo, rateData } = storeToRefs(sidebarStore)

// 利率
const rateContractStore = useRateContractStore()
const { getNodeInfoData, getMinerData } = storeToRefs(rateContractStore)

const form = ref({
  node: '',
  isConnected: false,
  role: ''
})

// getNodeRecord 历史记录
const form1 = ref({
  nodeId: '', //	是	string	节点id, 如节点为t032219, 传值t032219即可
  opType: 'borrow', //	是	string	节点记录类型：borrow 借款，repayment 还款，withdraw 提现，nodeChange 节点变更
  page: 1, //	否	int64	页码
  pageSize: 9999999 //	否	int64	每页条数
})

// getCardData 获取卡片信息
const form2 = ref({
  nodeId: '', //	是	string	节点id, 如节点为t032219, 传值t032219即可
  operator: '' //	否	string	当前小狐狸地址, 未连接则传空,用以确定有哪个节点是和小狐狸绑定的
})

// 监听连接状态和在职身份和小狐狸账号
watch(
  () => [
    accountStore.isConnected,
    minerStore.role,
    accountStore.account,
    route.params.id,
    sidebarStore.rateData
  ],
  async ([new1, new2, new3, new4, new5], [old1, old2, old3, old4, old5]) => {
    if (new1 !== old1) {
      input1.value = ''
      input2.value = ''
      input3.value = ''
      withdrawIcon.value = false
      nodeRepayIcon.value = false
      loanIcon.value = false
      form.value.isConnected = new1
      // 重新获取节点详情
      form2.value.operator = accountStore.account
      getDetailData()
    }

    if (new2 !== 3) {
      form.value.role = new2 // 1 owner 2受益人 3不在职
    }

    fromAccountAddress.value = accountStore.account
    form2.value.operator = accountStore.account

    // 账号切换
    if (new3 !== old3) {
      // 重新获取节点详情
      getDetailData()
    }

    if (new4 !== old4 && new4 !== '' && new4 !== undefined && new4 !== null) {
      form.value.node = new4
      form1.value.nodeId = new4
      form2.value.nodeId = new4
      target.value = new4
      moveIndex.value = 0

      await getDetailData() //节点详情
      getCardData() // 获取卡片数据
      getNodeRecord() //历史记录
    }

    // 侧边栏数据
    if (new5) {
      rateObj.value = sidebarStore.rateData
    }
  }
)

const nonce = ref() //nonce值
const gasParam = ref() //合约方法名生成的参数
const gasTxObj = ref({
  From: '', //发送地址
  To: '', // 接收地址（交易发给谁）
  Method: 3844450837, //方法类型
  Params: '', // 方法名和是否需要传参生成的编码
  Value: '0', //金额 nonpayable接口传'0'  payable接口传 '1'
  Nonce: '', // 获取的nonce值
  Version: 0, // 0
  GasFeeCap: '0' //消耗的gas
})
const gasData = ref() //gas值

//封装获取gas
const getGasDataFn = async (value, boolNum, mode, node) => {
  // 获取nonce值
  nonce.value = await getNonceFn(accountStore.account)

  switch (mode) {
    // 借款
    case 'loan':
      gasParam.value = await gasParams(
        'loan(uint64,uint256,uint256)',
        'loan',
        value.toString(),
        boolNum,
        node
      )

      break
    // 还款
    case 'repay':
      gasParam.value = await gasParams(
        'repayment(uint64,uint256,uint256)',
        'repay',
        value.toString(),
        boolNum,
        node
      )
      break
    //提现
    case 'withdraw':
      gasParam.value = await gasParams(
        'withdraw(uint64,uint256,uint256)',
        'withdraw',
        value.toString(),
        boolNum,
        node
      )
      break
  }

  // 组装参数
  gasTxObj.value = {
    From: accountStore.account, //owner钱包地址
    To: loanContractStore.loanContractAddress, //合约
    Method: 3844450837, //方法类型
    Params: gasParam.value, //3.生成的param参数
    Value: '0', //nonpayable接口传'0'  payable接口传 '1'
    Nonce: nonce.value, // 获取的nonce值
    Version: 0, //0
    GasFeeCap: '0' //消耗的gas
  }

  gasData.value = await getGasFn(gasTxObj.value)
  const gasPriceData = await getGasPriceData()

  // 生成交易结构体
  let overrides = {}

  if (gasData.value) {
    if (Number(gasPriceData) < Number(gasData.value.GasFeeCap)) {
      overrides = {
        gasLimit: Math.floor(gasData.value.GasLimit * 0.85), // 设置交易燃气限制
        gasPrice: Math.floor(Number(gasPriceData * 1.25).toString()), // 设置交易燃气价格
        nonce: nonce.value
      }
    } else {
      overrides = {
        gasLimit: Math.floor(gasData.value.GasLimit * 0.85), // 设置交易燃气限制
        gasPrice: Math.floor(Number(gasData.value.GasFeeCap * 1.25).toString()), // 设置交易燃气价格
        nonce: nonce.value
      }
    }
  } else {
    // 重新获取
    await getGasDataFn(value, boolNum, mode, node)
    console.log('repetitionGas')
  }

  return overrides
}

// 侧边栏数据
const rateObj = ref({
  stakeAPY: 0, // 质押利率
  loanAPY: 0, //借贷利率
  financeUseRate: 0, // 资金利用率
  totalBalance: 0, // 池子Fil总量
  filValue: 0, // fil币价值
  totalBalanceValue: 0, // 池子Fil总价值
  totalLockValue: 0, // 池子锁定的总价值
  lastAvailableBalance: 0, // 剩余可用流动资产
  stakeNum: 0, // 质押人数
  nodeNum: 0, // 节点数
  businessCoefficient: 0, // 运营储备系数
  riskCoefficient: 0 // 风险储备系数
}) //侧边栏数据

// 获取侧边栏数据
const getTotalFilSideData = async () => {
  rateObj.value = await sidebarStore.getTotalFilSideInfo()
}

// 获取还款
const nodeRepayData = ref({
  outstandingDebt: '', // 债务
  maxLoanLimit: '', // 最大可借
  surplus: '' //剩余可借
})
const isTotalRepay = ref(false) //是否最大还款
const nodeRepayObj = ref() //数据深拷贝

// 借款
const loanData = ref({
  outstandingDebt: '', // 债务
  maxLoanLimit: '', // 最大可借
  surplus: '' //剩余可借
})

const isTotalLoan = ref(false) //是否最大借款
// 提现
const withDrawData = ref({
  maxWithdrawBalance: '', // 最大可提现余额
  payee: '' // 收款人
})
const withDrawObj = ref() //提现数据
const isTotalWithdraw = ref(false) //是否最大提现

// 获取卡片数据
const showSkeleton = ref(true)
const getCardData = async () => {
  // showSkeleton.value = true //每次请求前都打开骨架屏
  const web3 = new Web3(window.ethereum) //实例化

  // 借款/还款
  const res = await rateContractStore.getMinerData(1, target.value)
  // rateContractStore
  // 获取提现
  const res2 = await rateContractStore.getMinerData(2, target.value)
  if (res2.data) {
    showSkeleton.value = false
  }

  withDrawData.value = res2.data
  withDrawData.value.maxWithdrawBalance = toFixedNum(
    web3.utils.fromWei(res2.data.maxWithdrawBalance, 'ether'),
    5
  )

  withDrawObj.value = JSON.parse(JSON.stringify(res2.data)) //深拷贝

  // 债务
  nodeRepayData.value.outstandingDebt = toFixedNum(
    Number(web3.utils.fromWei(res.data.outstandingDebt, 'ether')),
    5
  )
  // 最大可借
  nodeRepayData.value.maxLoanLimit = toFixedNum(
    Number(web3.utils.fromWei(res.data.maxLoanLimit, 'ether')),
    5
  )

  // 剩余可借等于最高可借
  nodeRepayData.value.surplus = nodeRepayData.value.maxLoanLimit

  // 借款
  loanData.value = JSON.parse(JSON.stringify(nodeRepayData.value))

  // 深拷贝
  nodeRepayObj.value = await JSON.parse(JSON.stringify(nodeRepayData.value))
  nodeRepayObj.value = JSON.parse(JSON.stringify(nodeRepayData.value))
}

// 获取节点详情
const skeletonShow = ref(true)
const nodeData = ref({
  nodeTotalBalance: '', // 节点总余额
  debtValue: '', // 债务价值
  debtRatio: '', // 债务比例
  withdrawalThreshold: '', // 提现阈值
  nodeOwnershipBalance: '', // 节点所有权余额
  maxDebtRatio: '', // 最大负载率
  settlementThreshold: '', // 清算阈值
  nodeAvailableBalance: '', // 节点可用余额
  lockInRewards: '', // 锁仓奖励
  sectorPledge: '', // 扇区抵押
  isOperator: false // 是否是操作者
})

const getDetailData = async () => {
  const res = await rateContractStore.getNodeInfoData(
    target.value,
    form2.value.operator
  )

  nodeData.value = res.data
  //当前查询项
  buffStore.actorInfo = res.data
  buffStore.actorInfo.nodeId = route.params.id //节点号
  if (res.code == 0) {
    skeletonShow.value = false
  } else {
    ElMessage.error(res.msg)
  }
}

const input1 = ref() //提现
const input2 = ref() //还款
const input3 = ref() //借款
const withdrawIcon = ref(false) //提现
const nodeRepayIcon = ref(false) //还款
const loanIcon = ref(false) //借款
const showBtnLoading1 = ref(false) //提现
const showBtnLoading2 = ref(false) //还款
const showBtnLoading3 = ref(false) //借款
// const disabledLoad = ref(true) //借款禁用
const disabledLoad = ref(false) //借款禁用

//封装方法
const checkWithdraw = () => {
  if (input1.value) {
    withdrawIcon.value = true //开启图标

    if (Number(input1.value) > Number(withDrawObj.value.maxWithdrawBalance)) {
      isTotalWithdraw.value = true //是否最大提现
      withDrawData.value.maxWithdrawBalance = '0.00000' //清空可提余额

      // 最大提现
      input1.value = withDrawObj.value.maxWithdrawBalance
    } else {
      isTotalWithdraw.value = false //是否最大提现

      // 剩余可提
      withDrawData.value.maxWithdrawBalance = toFixedNum(
        Number(withDrawObj.value.maxWithdrawBalance) - Number(input1.value),
        5
      )
    }
  } else {
    withdrawIcon.value = false //关闭图标
    isTotalWithdraw.value = false //是否最大提现

    // 剩余可提
    withDrawData.value.maxWithdrawBalance = toFixedNum(
      Number(withDrawObj.value.maxWithdrawBalance),
      5
    )
  }
}

const checkRepayFn = () => {
  if (input2.value) {
    nodeRepayIcon.value = true //开启图标

    //是否最大还款
    if (Number(input2.value) >= Number(nodeRepayObj.value.outstandingDebt)) {
      isTotalRepay.value = true //是最大还款
      nodeRepayData.value.outstandingDebt = '0.00000' //清空债务

      // 最大还款
      input2.value = nodeRepayObj.value.outstandingDebt

      // 剩余可借
      nodeRepayData.value.surplus = toFixedNum(
        Number(nodeRepayObj.value.surplus) + Number(input2.value),
        5
      )
    } else {
      isTotalRepay.value = false //不是最大还款

      // 债务
      nodeRepayData.value.outstandingDebt = toFixedNum(
        Number(nodeRepayObj.value.outstandingDebt) - Number(input2.value),
        5
      )

      // 剩余可借
      nodeRepayData.value.surplus = toFixedNum(
        Number(nodeRepayObj.value.surplus) + Number(input2.value),
        5
      )
    }
  } else {
    isTotalRepay.value = false //是否最大还款
    nodeRepayIcon.value = false //关闭图标

    // 未还债务
    nodeRepayData.value.outstandingDebt = nodeRepayObj.value.outstandingDebt

    // 剩余可借
    nodeRepayData.value.surplus = toFixedNum(
      Number(nodeRepayObj.value.surplus),
      5
    )
  }
}

const checkLoanFn = () => {
  // 判断借款有没有大于可流动
  if (Number(input3.value) >= Number(rateObj.value.lastAvailableBalance)) {
    input3.value = toFixedNum(rateObj.value.lastAvailableBalance, 5) //等于最大可用

    // 债务 原债务+最大保留5位小数
    loanData.value.outstandingDebt = toFixedNum(
      Number(nodeRepayObj.value.outstandingDebt) + Number(input3.value),
      5
    )
    // 剩余可借 原可借-最大保留5位小数
    loanData.value.surplus = toFixedNum(
      Number(nodeRepayObj.value.surplus) - Number(input3.value),
      5
    )

    // 判断有没有大于最大可借
    if (Number(input3.value) >= Number(nodeRepayObj.value.maxLoanLimit)) {
      isTotalLoan.value = true //最大借贷
      input3.value = toFixedNum(nodeRepayObj.value.maxLoanLimit, 5) //等于最大可借

      // 债务 原债务+最大保留5位小数
      loanData.value.outstandingDebt = toFixedNum(
        Number(nodeRepayObj.value.outstandingDebt) + Number(input3.value),
        5
      )

      // 剩余可借 原可借-最大保留5位小数
      loanData.value.surplus = toFixedNum(
        Number(nodeRepayObj.value.surplus) - Number(input3.value),
        5
      )
    } else {
      isTotalLoan.value = false

      // 债务
      loanData.value.outstandingDebt = toFixedNum(
        Number(nodeRepayObj.value.outstandingDebt) + Number(input3.value),
        5
      )

      // 剩余可借
      loanData.value.surplus = toFixedNum(
        Number(nodeRepayObj.value.surplus) - Number(input3.value),
        5
      )
    }
  } else {
    // 判断有没有大于最大可借
    if (Number(input3.value) >= Number(nodeRepayObj.value.maxLoanLimit)) {
      isTotalLoan.value = true //最大借贷
      input3.value = toFixedNum(nodeRepayObj.value.maxLoanLimit, 5) //等于最大可借

      // 债务 原债务+最大保留5位小数
      loanData.value.outstandingDebt = toFixedNum(
        Number(nodeRepayObj.value.outstandingDebt) + Number(input3.value),
        5
      )

      // 剩余可借 原可借-最大保留5位小数
      loanData.value.surplus = toFixedNum(
        Number(nodeRepayObj.value.surplus) - Number(input3.value),
        5
      )
    } else {
      isTotalLoan.value = false

      // 债务
      loanData.value.outstandingDebt = toFixedNum(
        Number(nodeRepayObj.value.outstandingDebt) + Number(input3.value),
        5
      )

      // 剩余可借
      loanData.value.surplus = toFixedNum(
        Number(nodeRepayObj.value.surplus) - Number(input3.value),
        5
      )
    }
  }
}

// 输入框中禁止输入e、+、-
const onKeydown = e => {
  let key = e.key
  if (key === 'e' || key === 'E' || key === '+' || key === '-') {
    e.returnValue = false
  } else {
    e.returnValue = true
  }
}

// 去除多余零
const onblur = e => {
  // 可以再次通过失焦事件先去除开头的0 再取出末尾的0
  e.target.value = e.target.value.replace(/^0+\./g, '0.') //把小数0开头的多余0去掉
  e.target.value = e.target.value.replace(/^[0]+/, '') //把整数0开头的多余0去掉

  e.target.value = parseFloat(e.target.value) //去除末尾的0

  switch (carouselIndex.value) {
    case 0:
      input3.value = e.target.value //重新赋值给变量
      break
    case 1:
      input1.value = e.target.value //重新赋值给变量
      break
    case 2:
      input2.value = e.target.value //重新赋值给变量
      break
  }
}

// 提现输入框
const withdrawInput = () => {
  checkWithdraw()
}

// 还款输入框
const repaymentInput = () => {
  checkRepayFn()
}

//借款输入框
const loadInputFn = async () => {
  // if (input3.value) {
  //   loanIcon.value = true //开启图标
  //   // 判断是否大于等于10且是操作人 开启借款按钮
  //   if (Number(input3.value) >= 10 && nodeData.value.isOperator) {
  //     // disabledLoad.value = false // 开启借贷
  //     checkLoanFn()
  //   } else if (Number(input3.value) < 10 && nodeData.value.isOperator) {
  //     // disabledLoad.value = true // 小于10禁用借款
  //     checkLoanFn()
  //   } else {
  //     // disabledLoad.value = true // 小于10禁用借款
  //     checkLoanFn()
  //   }
  // } else {
  //   isTotalLoan.value = false //是否最大借款
  //   loanIcon.value = false //关闭图标
  //   // 债务
  //   loanData.value.outstandingDebt = toFixedNum(
  //     Number(nodeRepayObj.value.outstandingDebt) + Number(input3.value),
  //     5
  //   )
  //   // 剩余可借
  //   loanData.value.surplus = toFixedNum(
  //     Number(nodeRepayObj.value.surplus) - Number(input3.value),
  //     5
  //   )
  // }
}

const loanContract = ref() //合约
const target = ref() //节点号去掉t0的部分, 如节点为t030996, 则输入30996
const fromAccountAddress = ref() //取当前小狐狸连接账号

// 点击最大 1提现 2还款 3借款
const clickMax = async num => {
  switch (num) {
    case 1:
      // 提现

      withdrawIcon.value = true //开启图标

      // 可流动资金知否充足
      if (
        Number(rateObj.value.lastAvailableBalance) >=
        Number(withDrawObj.value.maxWithdrawBalance)
      ) {
        isTotalWithdraw.value = true //是否最大提现
        withDrawData.value.maxWithdrawBalance = '0.00000' //可提清空
        input1.value = await withDrawObj.value.maxWithdrawBalance //最大可提
      } else {
        input1.value = toFixedNum(nodeData.value.nodeAvailableBalance, 5)
        checkWithdraw()
      }

      break
    case 2:
      //还款
      nodeRepayIcon.value = true //开启图标

      //节点可用余额大于债务
      if (
        Number(nodeData.value.nodeAvailableBalance) >=
        Number(nodeRepayObj.value.outstandingDebt)
      ) {
        isTotalRepay.value = true //是否最大还款
        // 最大还款
        input2.value = nodeRepayObj.value.outstandingDebt
        // 债务清空
        nodeRepayData.value.outstandingDebt = '0.00000'
      } else {
        isTotalRepay.value = false //是否最大还款
        // 最大还款等于节点余额
        input2.value = nodeData.value.nodeAvailableBalance
      }

      // 剩余可借
      nodeRepayData.value.surplus = toFixedNum(
        Number(nodeRepayObj.value.surplus) + Number(input2.value),
        5
      )

      break
    case 3:
      loanIcon.value = true //开启图标
      input3.value = nodeRepayObj.value.maxLoanLimit

      // 流动资金大于借款
      if (
        Number(rateObj.value.lastAvailableBalance) > Number(input3.value) &&
        Number(input3.value) >= 10
      ) {
        // disabledLoad.value = false //开启借款
        input3.value = nodeRepayObj.value.maxLoanLimit // 最大借款
        isTotalLoan.value = true //是否最大可借
      } else if (
        Number(rateObj.value.lastAvailableBalance) < Number(input3.value) &&
        Number(input3.value) >= 10
      ) {
        // disabledLoad.value = false //开启借款
        isTotalLoan.value = false //不是最大可借
        input3.value = rateObj.value.lastAvailableBalance
      } else {
        // disabledLoad.value = true //禁止借款
      }

      // 债务
      loanData.value.outstandingDebt = toFixedNum(
        Number(nodeRepayObj.value.outstandingDebt) + Number(input3.value),
        5
      )

      // 剩余可借
      loanData.value.surplus = toFixedNum(
        Number(nodeRepayObj.value.surplus) - Number(input3.value),
        5
      )

      break
  }
}

// 点击提现
const withdrawId = ref() //提现消息id
const clickWithdraw = async () => {
  if (
    !showBtnLoading1.value &&
    !showBtnLoading2.value &&
    !showBtnLoading3.value
  ) {
    if (input1.value && nodeData.value.isOperator) {
      loanContract.value = loanContractStore.getLoanContract(2) // 生成借贷合约
      showBtnLoading1.value = true //开启交易加载

      let num = JSON.parse(JSON.stringify(input1.value))
      let amount = ethers.utils.parseEther(input1.value)

      let boolNum = isTotalWithdraw.value ? 1 : 0 //是否最大值
      // 结构参数
      let overrides = await getGasDataFn(
        amount,
        boolNum,
        'withdraw',
        target.value
      )

      try {
        //拿到交易hash
        const tx = await loanContract.value.withdraw(
          target.value.substr(2),
          amount.toString(),
          boolNum,
          overrides
        )

        withdrawId.value = tx.hash
        const receipt = await tx.wait() // 等待交易被确认并返回收据

        if (receipt.status === 1) {
          ElNotification.success({
            title: 'Success',
            message: `<strong>You have successfully withdraw  ${num} FIL</strong>`,
            duration: 5000, //显示时长
            dangerouslyUseHTMLString: true
          })

          input1.value = '' //重置提现输入框
          withdrawIcon.value = false //关闭icon
          showBtnLoading1.value = false //关闭交易加载
          isTotalWithdraw.value = false //关闭最大
          withdrawId.value = '' //成功则清空
          getCardData() //刷新卡片数据
          getDetailData() //刷新详情数据
          sidebarStore.getTotalFilSideInfo() //刷新侧边栏
        }
      } catch (error) {
        getCardData() //刷新卡片数据
        input1.value = '' //重置提现输入框
        withdrawIcon.value = false //关闭icon
        showBtnLoading1.value = false //关闭加载
        isTotalWithdraw.value = false //关闭最大
        if (error.code == -32603) {
          ElNotification.error({
            title: 'Error',
            message: `<strong>There may be outstanding transaction activity.</strong>`,
            duration: 5000, //显示时长
            dangerouslyUseHTMLString: true
          })
        }
        console.log('withdrawError', error)
      }
    } else {
      ElMessage.error('Amount is empty')
    }
  } else {
    ElMessage.info('存在等待交易')
  }
}

// 点击还款
const repaymentId = ref() //还款消息id
const clickRepayment = async () => {
  if (
    !showBtnLoading1.value &&
    !showBtnLoading2.value &&
    !showBtnLoading3.value
  ) {
    if (input2.value && nodeData.value.isOperator) {
      loanContract.value = loanContractStore.getLoanContract(2) // 生成借贷合约
      showBtnLoading2.value = true //开启交易加载

      let num = JSON.parse(JSON.stringify(input2.value))
      let amount = ethers.utils.parseEther(input2.value)
      let boolNum = isTotalRepay.value ? 1 : 0 //是否最大值
      // 结构参数
      let overrides = await getGasDataFn(amount, boolNum, 'repay', target.value)

      // 节点可用大于还款金额
      if (Number(nodeData.value.nodeAvailableBalance) > Number(input2.value)) {
        try {
          //拿到交易hash
          const tx = await loanContract.value.repayment(
            target.value.substr(2),
            amount.toString(),
            boolNum,
            overrides
          )

          repaymentId.value = tx.hash
          const receipt = await tx.wait() // 等待交易被确认并返回收据

          if (receipt.status === 1) {
            ElNotification.success({
              title: 'Success',
              message: `<strong>You have successfully repayment ${num} FIL</strong>`,
              duration: 5000, //显示时长
              dangerouslyUseHTMLString: true
            })

            input2.value = '' //重置还款输入框
            nodeRepayIcon.value = false //关闭icon
            showBtnLoading2.value = false //关闭加载
            isTotalRepay.value = false //关闭最大
            repaymentId.value = '' //成功则清空

            getCardData() //刷新卡片数据
            getDetailData() //刷新详情数据
            sidebarStore.getTotalFilSideInfo() //刷新侧边栏
          }
        } catch (error) {
          getCardData() //刷新卡片数据
          input2.value = '' //重置还款输入框
          nodeRepayIcon.value = false //关闭icon
          showBtnLoading2.value = false //关闭加载
          isTotalRepay.value = false //关闭最大
          console.log('clickRepayment', error)

          if (error.code == -32603) {
            ElNotification.error({
              title: 'Error',
              message: `<strong>There may be outstanding transaction activity.</strong>`,
              duration: 5000, //显示时长
              dangerouslyUseHTMLString: true
            })
          }
        }
      } else {
        // 节点可用小于还款金额,最大还款为可用余额
        input2.value = await nodeData.value.nodeAvailableBalance
        await checkRepayFn()

        num = input2.value
        amount = ethers.utils.parseEther(input2.value)
        boolNum = isTotalRepay.value ? 1 : 0 //是否最大值

        try {
          //拿到交易hash
          const tx = await loanContract.value.repayment(
            target.value.substr(2),
            amount.toString(),
            boolNum,
            overrides
          )

          repaymentId.value = tx.hash
          const receipt = await tx.wait() // 等待交易被确认并返回收据

          if (receipt.status === 1) {
            ElNotification.success({
              title: 'Success',
              message: `<strong>You have successfully repayment ${num} FIL</strong>`,
              duration: 5000, //显示时长
              dangerouslyUseHTMLString: true
            })

            input2.value = '' //重置还款输入框
            nodeRepayIcon.value = false //关闭icon
            showBtnLoading2.value = false //关闭加载
            isTotalRepay.value = false //关闭最大
            repaymentId.value = '' //成功则清空

            getCardData() //刷新卡片数据
            getDetailData() //刷新详情数据
            sidebarStore.getTotalFilSideInfo() //刷新侧边栏
          }
        } catch (error) {
          getCardData() //刷新卡片数据
          input2.value = '' //重置还款输入框
          nodeRepayIcon.value = false //关闭icon
          showBtnLoading2.value = false //关闭加载
          isTotalRepay.value = false //关闭最大
          console.log('clickRepayment', error)

          if (error.code == -32603) {
            ElNotification.error({
              title: 'Error',
              message: `<strong>There may be outstanding transaction activity.</strong>`,
              duration: 5000, //显示时长
              dangerouslyUseHTMLString: true
            })
          }
        }
      }
    } else {
      ElMessage.error('Amount is empty.')
    }
  } else {
    ElMessage.info('存在等待交易')
  }
}

// 点击借款
const loanId = ref() //借款消息id
const clickLoan = async () => {
  if (
    !showBtnLoading1.value &&
    !showBtnLoading2.value &&
    !showBtnLoading3.value
  ) {
    loanContract.value = loanContractStore.getLoanContract(2) // 生成借贷合约

    showBtnLoading3.value = true //开启交易加载

    let num = JSON.parse(JSON.stringify(input3.value))
    let amount = ethers.utils.parseEther(input3.value)
    let boolNum = isTotalLoan.value ? 1 : 0 //是否最大值

    let overrides = await getGasDataFn(amount, boolNum, 'loan', target.value)

    // 如果借款小于流动资金直接借
    if (Number(input3.value) < Number(rateObj.value.lastAvailableBalance)) {
      try {
        //拿到交易hash
        const tx = await loanContract.value.loan(
          target.value.substr(2),
          amount.toString(),
          boolNum,
          overrides
        )

        loanId.value = tx.hash
        const receipt = await tx.wait() // 等待交易被确认并返回收据

        if (receipt.status === 1) {
          ElNotification.success({
            title: 'Success',
            message: `<strong>You have successfully borrowed ${num} FIL</strong>`,
            duration: 5000, //显示时长
            dangerouslyUseHTMLString: true
          })

          loanId.value = '' //成功则清空
          input3.value = '' //清空借款输入框 等提示信息出来之后才能清空
          loanIcon.value = false //关闭图标
          isTotalLoan.value = false //关闭最大
          showBtnLoading3.value = false //关闭加载

          getCardData() //刷新卡片数据
          getDetailData() //刷新详情数据
          sidebarStore.getTotalFilSideInfo() //刷新侧边栏
        }
      } catch (error) {
        getCardData() //刷新卡片数据
        loanId.value = '' //清空上链 hash
        input3.value = '' //清空借款输入框 等提示信息出来之后才能清空
        loanIcon.value = false //关闭图标
        showBtnLoading3.value = false //关闭加载
        isTotalLoan.value = false //关闭最大

        if (error.code == -32603) {
          ElNotification.error({
            title: 'Error',
            message: `<strong>There may be outstanding transaction activity.</strong>`,
            duration: 5000, //显示时长
            dangerouslyUseHTMLString: true
          })
        }
        console.log('loanError:', error)
      }
    } else {
      // 当贷款额大于流动资金时，实际贷款额等于流动资金
      ElNotification.info({
        title: 'Tip',
        message: `<strong>When the loan amount is greater than the working capital, the actual loan amount is equal to the working capital.</strong>`,
        duration: 5000, //显示时长
        dangerouslyUseHTMLString: true
      })

      // 借款金额等于流动金额
      input3.value = await rateObj.value.lastAvailableBalance
      num = input3.value

      // 再次判断是否大于最大借款
      if (Number(input3.value) < Number(nodeRepayObj.value.maxLoanLimit)) {
        isTotalLoan.value = false //是否最大借款
      } else {
        isTotalLoan.value = true //是否最大借款
      }

      amount = await ethers.utils.parseEther(input3.value)

      try {
        //拿到交易hash
        const tx = await loanContract.value.loan(
          target.value.substr(2),
          amount.toString(),
          boolNum,
          overrides
        )

        loanId.value = tx.hash
        const receipt = await tx.wait() // 等待交易被确认并返回收据

        if (receipt.status === 1) {
          ElNotification.success({
            title: 'Success',
            message: `<strong>You have successfully borrowed ${num} FIL</strong>`,
            duration: 5000, //显示时长
            dangerouslyUseHTMLString: true
          })

          loanId.value = '' //成功则清空
          input3.value = '' //清空借款输入框 等提示信息出来之后才能清空
          loanIcon.value = false //关闭图标
          isTotalLoan.value = false //关闭最大
          showBtnLoading3.value = false //关闭加载

          getCardData() //刷新卡片数据
          getDetailData() //刷新详情数据
          sidebarStore.getTotalFilSideInfo() //刷新侧边栏
        }
      } catch (error) {
        getCardData() //刷新卡片数据
        input3.value = '' //清空借款输入框 等提示信息出来之后才能清空
        loanIcon.value = false //关闭图标
        showBtnLoading3.value = false //关闭加载
        isTotalLoan.value = false //关闭最大
        ElNotification.error({
          title: 'Failed',
          message: `<strong>failure of transaction.</strong>`,
          duration: 5000, //显示时长
          dangerouslyUseHTMLString: true
        })
        console.log('loanError:', error)
      }
    }
  } else {
    ElMessage.info('存在等待交易')
  }
}

//点击消息ID跳到区块浏览器查询
const clickPushId = val => {
  switch (val) {
    // 借款
    case 0:
      window.open(minerStore.linkHref + loanId.value, '_blank')
      break
    case 1:
      // 提现
      window.open(minerStore.linkHref + withdrawId.value, '_blank')
      break
    case 2:
      // 还款
      window.open(minerStore.linkHref + repaymentId.value, '_blank')

      break
  }
}

// 点击切换走马灯
const carouselIndex = ref(0)
const changeCarousel = val => {
  carouselIndex.value = val
}

// 点击连接钱包
const clickConnect = () => {
  accountStore.showType = true
}

// 点击设置
const showSet = ref(false) // 控制设置弹框显示
const setClick = () => {
  showSet.value = true
}

//关闭设置弹框
const close = () => {
  showSet.value = false
}

// 数据刷新定时器
const dataTime = ref()
dataTime.value = setInterval(() => {
  getCardData()
  getDetailData()
}, 60000)

// 历史记录
const moveIndex = ref(0) // 移动下标
const borrowsArr = ref() // 借款列表
const repaymentsArr = ref() // 还款列表
const withdrawArr = ref() // 提现列表
const liquidationArr = ref() // 清算列表
const nodeChangeArr = ref() // 节点变更列表
const showNoData = ref(true) //控制无数据显示
// 获取历史记录
const getNodeRecord = async (index = 0) => {
  const web3 = new Web3(window.ethereum)

  // 借款
  const res = await nodeRecordList(form1.value)
  res.data.list.map(
    v => (v.amount = toFixedNum(web3.utils.fromWei(v.amount, 'ether'), 5))
  )

  switch (index) {
    case 0:
      borrowsArr.value = res.data.list

      break
    case 1:
      // 还款
      repaymentsArr.value = res.data.list

      break
    case 2:
      // 提现
      withdrawArr.value = res.data.list

      break
    case 3:
      // 清算
      liquidationArr.value = res.data.list

      break
    case 4:
      // 节点变更
      nodeChangeArr.value = res.data.list

      break
  }
}

// 点击历史记录按钮
const btnArr = ref([
  {
    label: 'Borrows',
    value: 'borrow'
  },
  {
    label: 'Repayments',
    value: 'repayment'
  },
  {
    label: 'Withdraws',
    value: 'withdraw'
  },
  {
    label: 'Liquidation',
    value: 'liquidation'
  },
  {
    label: 'Node Change',
    value: 'nodeChange'
  }
])
const moveClick = async index => {
  moveIndex.value = index

  switch (index) {
    case 0:
      // 还款
      form1.value.opType = await 'borrow'
      getNodeRecord(0)
      break
    case 1:
      // 还款
      form1.value.opType = await 'repayment'
      getNodeRecord(1)
      break

    case 2:
      // 提现
      form1.value.opType = await 'withdraw'
      getNodeRecord(2)
      break
    case 3:
      // 清算
      form1.value.opType = await 'liquidation'
      getNodeRecord(3)
      break
    case 4:
      // 节点变更
      form1.value.opType = await 'nodeChange'
      getNodeRecord(4)
      break
  }
}

// 双击复制
const cellClick = async val => {
  await toClipboard(val)
  ElMessage.success(' Copy success.')
}

// 移动端历史记录
const historyMode = ref('borrow') //历史记录选中值

const changeMode = async () => {
  const web3 = new Web3(window.ethereum)
  form1.value.opType = historyMode.value

  // 借款
  const res = await nodeRecordList(form1.value)

  res.data.list.map(
    v => (v.amount = toFixedNum(web3.utils.fromWei(v.amount, 'ether'), 5))
  )

  // 开启暂无数据
  if (res.data.list.length > 0) {
    showNoData.value = false
  } else {
    showNoData.value = true
  }

  switch (historyMode.value) {
    case 'borrow':
      borrowsArr.value = res.data.list
      break
    case 'repayment':
      repaymentsArr.value = res.data.list
      break
    case 'withdraw':
      withdrawArr.value = res.data.list
      break
    case 'liquidation':
      liquidationArr.value = res.data.list
      break
    case 'nodeChange':
      nodeChangeArr.value = res.data.list
      break
  }
}

const greenCircle = ref('greenCircle') //呼吸灯类名
const time2 = ref()
const changeColor = () => {
  time2.value = setInterval(async () => {
    if (greenCircle.value == 'greenCircle') {
      greenCircle.value = 'grayColor'
    } else if (greenCircle.value == 'grayColor') {
      greenCircle.value = 'greenCircle'
    }
  }, 10000)
}

// 轮播-10秒轮播一次
const time = ref()
time.value = setInterval(async () => {
  await moveIndex.value++
  if (moveIndex.value >= 5) {
    moveIndex.value = 0
  }
  await moveClick(moveIndex.value)
}, 10000)

// 清除定时器
const mouseOver = () => {
  clearInterval(time.value)
}

// 重启
const mouseLeave = () => {
  time.value = setInterval(async () => {
    await moveIndex.value++
    if (moveIndex.value >= 5) {
      moveIndex.value = 0
    }
    await moveClick(moveIndex.value)
  }, 10000)
}

// 表格隔行变色
const tableRowClassName = ({ rowIndex }) => {
  if ((rowIndex + 1) % 2 === 0) {
    return 'oddRow'
  } else {
    return 'evenRow'
  }
}

// 页面关闭销毁定时器
onBeforeUnmount(() => {
  clearInterval(time.value)
  clearInterval(dataTime.value)
})
</script>

<script>
export default {
  name: 'MinerInfo'
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixins.scss'; //引用此混合样式

#MinerInfo {
  padding: 20px 0 50px;
  // 骨架屏
  ::v-deep .el-skeleton.is-animated .el-skeleton__item {
    background: linear-gradient(
      103deg,
      #7b33c3 25%,
      var(--el-skeleton-to-color) 37%,
      var(--el-skeleton-color) 63%
    );
    background-size: 400% 100%;
    -webkit-animation: el-skeleton-loading 1.4s ease infinite;
    animation: el-skeleton-loading 1.4s ease infinite;
  }

  .el-skeleton__p.is-first {
    width: 100%;
  }

  // 输入框去除步进器样式
  ::v-deep input::-webkit-outer-spin-button,
  ::v-deep input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::v-deep input[type='number'] {
    -moz-appearance: textfield;
  }

  .topInfoBox {
    display: flex;
  }
}

// 节点信息
.leftTop {
  border-radius: 20px;
  background: #272932;
  padding: 15px 20px 30px;
}
.right {
  flex: 1;
  margin-left: 20px;
}

//节点信息
.info {
  border-radius: 20px;
  background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);
  padding: 10px 15px 20px;
}

.miner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    font-family: Bakbak One;
    font-size: 30px;
    span:last-child {
      font-weight: 700;
    }
  }
}

.cardBox {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  .infoLeft {
    text-align: left;
    word-break: break-all; //纯英文、数字、中文
    padding: 0 2% 0 4%;
    margin-top: -3px;

    div:first-child {
      font-family: Montserrat;
      font-weight: 600;
      font-size: 20px;
      word-break: break-all; //纯英文、数字、中文
      margin: 0;
    }

    div:last-child {
      font-size: 12px;
      color: #ccc;
      scale: 0.9;
      // margin-top: 13%;
      margin-left: -4%;
    }
  }

  .infoRight {
    display: flex;
    justify-content: space-evenly;
  }

  .item {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: left;

    .top,
    .bottom {
      div:first-child {
        font-family: Montserrat;
        font-weight: 600;
        font-size: 18px;
        word-break: break-all; //纯英文、数字、中文
      }

      div:last-child {
        font-size: 12px;
        color: #ccc;
        scale: 0.9;
        margin-left: -4%;
      }
    }
    .top {
      margin-bottom: 15px;
    }
  }
}

// 可用余额
.usable {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .infoLeft {
    width: 100px;
    height: 100px;
    background: #fff;
    border-radius: 50%;
    margin: 0 auto;
    margin-top: -20px;

    .svg-icon {
      width: 100%;
      height: 100%;
      scale: 0.85;
    }
  }

  .infoRight {
    display: flex;
    justify-content: space-evenly;
    text-align: center;
    margin: 10px 0;

    .item {
      flex: 1;
      word-break: break-all; //纯英文、数字、中文
      padding: 0 5px;

      div:first-child {
        font-family: Montserrat;
        font-weight: 600;
        font-size: 18px;
        word-break: break-all; //纯英文、数字、中文
      }

      div:last-child {
        font-size: 12px;
        color: #ccc;
        scale: 0.9;
        margin-left: -4%;
      }
    }

    .item:nth-child(2) {
      border-right: 1px solid #5b5b5b;
      border-left: 1px solid #5b5b5b;
    }
  }
}

// 卡片
::v-deep .stakeContent {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 15px;
  &:hover {
    cursor: pointer;
  }

  h6 {
    margin: 20px 0 15px;
  }

  /* 输入框 */
  .el-input {
    height: 40px;
    .el-input__wrapper {
      border-radius: 10px;
      .el-input__inner {
        font-family: 'Montserrat';
        font-size: 20px;
        // color: #7139cf;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .el-button {
      width: 50px;
    }
  }

  // 文字提示
  .loadTip {
    margin-top: 5px;
    font-size: 12px;
    padding: 0 15px;
    color: #ccc;
  }

  /* 汇率兑换 */
  ul {
    margin-top: 5px;
    padding: 0 15px;
    li {
      display: flex;
      justify-content: space-between;

      font-size: 15px;
      font-family: Montserrat;

      div:nth-child(1) {
        color: #ccc;
        font-size: 12px;
      }

      div:nth-child(2) {
        color: #fff;
        font-size: 12px;
        word-break: break-all;
        text-align: right;
      }
    }
  }

  // 消息Id
  .txtBox {
    font-size: 12px;
    color: #ccc;
    text-align: center;
    margin-top: 110px;
    &:hover {
      cursor: pointer;
      color: #fff;
    }
  }

  .btnBox {
    text-align: center;
    cursor: default;
    .el-button {
      width: 90%;
      height: 40px;
      border-radius: 10px;
      font-weight: 600;
      color: #fff;
      margin: 0 auto;
      background: #7940cf;
      border: 1px solid transparent;
      cursor: cursor;

      .is-disabled {
        border: 1px solid transparent;
        background: #5e4b92;
        box-shadow: none;
        outline: none;
        cursor: default;
      }
    }

    .is-loading:hover {
      cursor: default;
    }
  }
}

// 走马灯
::v-deep .el-carousel {
  padding-top: 50px;

  .el-carousel__container {
    .el-carousel__item {
      padding: 15px 20px;
      border-radius: 15px;
    }

    .el-carousel__mask {
      opacity: 0;
    }
  }
  .el-carousel__item:nth-child(2n) {
    // background-color: #99a9bf;
    background: #34363e;
  }

  .el-carousel__item:nth-child(2n + 1) {
    // background-color: #d3dce6;
    background: #34363e;
  }

  .el-carousel__item.is-active {
    background: linear-gradient(180deg, #7940cf 0%, #5921cb 100%);
    box-shadow: 0px 4px 80px 0px rgba(0, 0, 0, 0.03);

    .btnBox {
      .el-button {
        background: #fff;
        color: #7940cf;
      }
    }
  }
}

// 最大值
.max {
  color: #fff;
  border: none;
  background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);
  padding: 0px 10px;

  &:hover {
    // color: #6be585;
    color: #fff;
    border: none;
    background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);
  }
}

/* 资金利用率 */
.topRight {
  min-height: 260px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 20px;

  padding: 10px 20px 15px;
  border-radius: 10px;
  background-color: $cardBgColor;
  font-family: 'Montserrat';
  // margin-left: 20px;

  p {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .greenCircle {
    // display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 3px;
    background: #65efad;
  }

  .grayColor {
    display: inline-block;
    min-width: 5px;
    height: 5px;
    border-radius: 3px;
    background: transparent;
  }

  h2 {
    text-align: center;
    font-style: normal;
    font-weight: 800;
    font-size: 50px;
    text-transform: capitalize;
    background: $txtColor;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    padding: 10px 0;
  }

  div {
    font-weight: 800;
  }

  h5 {
    font-weight: 700;
  }
}

// 历史记录
.history {
  margin-top: 20px;
  padding: 20px;
  border-radius: 12px;
  background: rgba(39, 41, 50, 0.95);
}

// 历史记录按钮
.swipeBtnBox {
  // width: 100%;

  text-align: center;

  margin: 10px 80px 10px;

  ul {
    // width: 100%;
    background: #222;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-content: center;
    // text-align: center;

    &:hover {
      cursor: pointer;
    }
    li {
      width: 20%;
      padding: 10px 0px;
      font-size: 15px;

      &.active {
        background: #c4c4c4;
        border-radius: 8px;
        color: #000;
      }
    }
  }
}

// 历史记录下拉框
::v-deep .selectBox {
  width: 100%;
  margin: 15px 0;
  .el-select {
    width: 100%;
  }
}

.tableList {
  padding: 0 10px;

  .tableItemBox {
    border-bottom: 1px solid #ccc;
    margin-top: 15px;
    padding-bottom: 15px;
  }
  .table-item:nth-child(1) {
    font-weight: 900;
    color: #5f27cc;
  }

  .table-item {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    margin-bottom: 3px;

    div:nth-child(2) {
      text-align: right;
    }
  }
}

::v-deep .tableBox {
  position: relative;
  min-height: 450px;
  border: 10px solid #254a50;
  &:hover {
    cursor: pointer;
  }

  // 清算表格
  .liquidationBox {
    .el-table {
      margin-bottom: 60px;
    }
    .descBox {
      position: absolute;
      bottom: 10px;
    }

    .liquidationDesc {
      font-size: 12px;

      margin: 0 10px;
      color: #ccc;
    }
  }

  .el-table {
    --el-table-border-color: none;

    // 单
    .oddRow {
      //斑马纹样式
      color: #ccc;
      background: #323338;
    }

    // 双
    .evenRow {
      color: #ccc;
      background-color: #272931;
    }

    .el-table td.el-table__cell,
    .el-table th.el-table__cell.is-leaf {
      border: none;
    }

    // 无数据
    .el-table__body-wrapper .el-scrollbar .el-table__empty-block {
      background: #2e2c38;
      .el-table__empty-text {
        line-height: 340px;
        font-size: 20px;
        color: #ccc;
      }
    }
  }

  .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background-color: #387983;
    color: #fff;
  }
}

@media screen and (min-width: 768px) and (max-width: 991px) {
  #MinerInfo {
    display: flex;
    flex-direction: column;
  }

  // 头部
  .topInfoBox {
    display: flex;
    flex-wrap: wrap;
  }

  .right {
    margin: 20px 0 0 0;
  }

  .cardBox {
    display: block;

    .infoLeft {
      text-align: left;
      word-break: break-all; //纯英文、数字、中文
      padding: 0;
      margin-top: 0;

      div:first-child {
        font-family: Montserrat;
        font-weight: 600;
        font-size: 20px;
        word-break: break-all; //纯英文、数字、中文
      }

      div:last-child {
        font-size: 12px;
        color: #ccc;
        scale: 0.9;
        margin-top: 0px;
        margin-left: -5%;
      }
    }

    .infoRight {
      margin-top: 10px;
    }
    .stakeContent.active {
      scale: 1;
    }

    .stakeContent:nth-child(2) {
      margin: 20px 0;
    }
  }

  .usable {
    margin: 10px 0;

    .infoLeft {
      width: 60px;
      height: 60px;
      margin-top: 0px;
    }
  }
}

@media screen and (max-width: 768px) {
  #MinerInfo {
    display: flex;
    flex-direction: column;
  }

  // 头部
  .topInfoBox {
    display: flex;
    flex-wrap: wrap;
  }
  .right {
    margin: 20px 0 0 0;
  }

  .cardBox {
    display: block;

    .infoLeft {
      margin-bottom: 15px;
      text-align: left;
      word-break: break-all; //纯英文、数字、中文
      padding: 0;
      margin-top: 0;

      div:first-child {
        font-family: Montserrat;
        font-weight: 600;
        font-size: 20px;
        word-break: break-all; //纯英文、数字、中文
      }

      div:last-child {
        font-size: 12px;
        color: #ccc;
        scale: 0.9;
        margin-top: 0px;
        margin-left: -5%;
      }
    }

    .stakeContent {
      margin: 0;
    }

    .stakeContent:nth-child(2) {
      margin: 20px 0;
    }
  }

  .right,
  .usable {
    display: flex;
    flex-direction: column;
  }

  .usable {
    margin: 10px 0;

    .infoLeft {
      width: 60px;
      height: 60px;
      margin-top: 0px;
    }

    .infoRight {
      display: flex;
      justify-content: space-evenly;
      text-align: center;
      margin: 10px 0;

      .item {
        div:first-child {
          font-size: 17px;
        }
      }
    }
  }

  // 卡片
  .stakeContent {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 15px;
    &:hover {
      cursor: pointer;
    }

    h6 {
      margin: 20px 0 15px;
    }

    /* 输入框 */
    .el-input {
      height: 40px;
      .el-input__wrapper {
        border-radius: 10px;
        .el-input__inner {
          font-family: 'Montserrat';
          font-size: 15px;
          // color: #7139cf;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .el-button {
        width: 40px;
      }
    }

    // 最低借贷
    .loadTip {
      padding: 0;
    }

    /* 汇率兑换 */
    ul {
      padding: 0;
      li {
        div:nth-child(2) {
          font-size: 12px;
        }
      }
    }
  }

  // 历史记录
  .liquidationDesc {
    padding: 0 10px;
    font-size: 12px;
    margin-top: 5px;
    color: #ccc;
  }

  // 无数据
  .noDataBox {
    height: 130px;
    line-height: 110px;
    text-align: center;
    color: #ccc;
  }
}

::v-deep .countStyleLoan {
  display: flex;
  justify-content: center;
  align-content: center;
  .count-flop {
    /* 可更改 */
    height: 50px;
    line-height: 50px;
  }
  .count-flop-content {
    font-size: 50px;
  }

  .count-flop-box {
    margin-right: 0;
    width: 30px;
    border: 0;
    border-radius: 0;
    line-height: 50px;
  }
  .count-flop-point {
    margin-right: 0;
    width: 14px;
  }

  .count-flop-unit {
    font-size: 50px;
    line-height: 50px;
    font-weight: 600;
    padding-left: 1px;
  }
}

// 设置字体颜色
::v-deep .countColorLoan {
  .count-flop-content,
  .count-flop-num,
  .count-flop-point,
  .count-flop-unit {
    background: $txtColor;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
}

::v-deep .countStyle2 {
  display: flex;
  justify-content: end;
  margin-bottom: 10px;
  .count-flop {
    /* 可更改 */
    height: 20px;
    line-height: 20px;
    font-size: 25px;
    color: #fff;
  }
}

::v-deep .countStyleInfo {
  margin-left: 4%;
  .count-flop {
    /* 可更改 */
    height: 20px;
    line-height: 20px;
  }
  .count-flop-content {
    font-size: 20px;
    color: #fff;
  }

  .count-flop-box {
    margin-right: 0;
    width: 13px;
    border: 0;
    border-radius: 0;
    line-height: 20px;
    color: #fff;
  }
  .count-flop-point {
    margin-right: 0;
    width: 7px;
    color: #fff;
  }

  .count-flop-unit {
    font-size: 20px;
    line-height: 20px;
    font-weight: 600;
    padding-left: 3px;
    color: #fff;
  }
}
</style>

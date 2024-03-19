<template>
  <div id="MinerInfoExit" class="container">
    <div class="topInfoBox">
      <!-- 节点信息 -->
      <div class="leftTop col-12 col-sm-12 col-md-12 col-lg-8">
        <!-- 节点信息 -->
        <div class="info">
          <div class="miner">
            <h3>
              <span>{{ form.node }}</span>
            </h3>
            <!-- 设置 -->
            <SvgIcon
              v-if="status !== 0"
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
                <el-table-column
                  show-overflow-tooltip
                  label="Txn Hash"
                  prop="cid"
                >
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
                      {{ row.fromAddr.slice(0, 6) }}...{{
                        row.fromAddr.slice(-6)
                      }}
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
                <el-table-column
                  show-overflow-tooltip
                  label="Txn Hash"
                  prop="cid"
                >
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
                      {{ row.fromAddr.slice(0, 6) }}...{{
                        row.fromAddr.slice(-6)
                      }}
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
                <el-table-column
                  show-overflow-tooltip
                  label="Txn Hash"
                  prop="cid"
                >
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
                      {{ row.fromAddr.slice(0, 6) }}...{{
                        row.fromAddr.slice(-6)
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
                    <span @dblclick="cellClick(row.toAddr)">
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
                        v-if="row.toAddr.length > 12"
                        @dblclick="cellClick(row.toAddr)"
                      >
                        {{ row.toAddr.slice(0, 6) }}...{{
                          row.toAddr.slice(-6)
                        }}
                      </span>
                      <span v-else @dblclick="cellClick(row.toAddr)">
                        {{ row.toAddr }}
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
                <el-table-column
                  show-overflow-tooltip
                  label="Txn Hash"
                  prop="cid"
                >
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
                    <div class="col-4 col-sm-4">
                      {{ $t('Withdraws_listtime') }}
                    </div>
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
                    <div class="col-4 col-sm-4">
                      {{ $t('Withdraws_listtime') }}
                    </div>
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
                    <div class="col-4 col-sm-4">
                      {{ $t('Withdraws_listtime') }}
                    </div>
                    <div class="col-8 col-sm-8">{{ item.timeDuration }}</div>
                  </div>

                  <!-- 接收方 -->
                  <div
                    v-if="
                      historyMode == 'liquidation' || historyMode == 'withdraw'
                    "
                    class="table-item"
                  >
                    <div class="col-4 col-sm-4">
                      {{ $t('Withdraws_listpayee') }}
                    </div>
                    <div v-if="item.toAddr.length > 12" class="col-8 col-sm-8">
                      {{ item.toAddr.slice(0, 6) }}...{{
                        item.toAddr.slice(-6)
                      }}
                    </div>
                    <div
                      v-else-if="item.toAddr.length <= 12"
                      class="col-8 col-sm-8"
                    >
                      {{ item.toAddr }}
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
                    <div class="col-4 col-sm-4">
                      {{ $t('Withdraws_listtime') }}
                    </div>
                    <div class="col-8 col-sm-8">{{ item.timeDuration }}</div>
                  </div>

                  <!-- 接收方 -->
                  <div
                    v-if="
                      historyMode == 'liquidation' || historyMode == 'withdraw'
                    "
                    class="table-item"
                  >
                    <div class="col-4 col-sm-4">
                      {{ $t('Withdraws_listpayee') }}
                    </div>
                    <div v-if="item.toAddr.length > 12" class="col-8 col-sm-8">
                      {{ item.toAddr.slice(0, 6) }}...{{
                        item.toAddr.slice(-6)
                      }}
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

              <div v-if="historyMode == 'liquidation'" class="liquidationDesc">
                {{ $t('liquidationDesc') }}
              </div>
              <div v-if="historyMode == 'liquidation'" class="liquidationDesc">
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
                    <div class="col-4 col-sm-4">
                      {{ $t('Withdraws_listtime') }}
                    </div>
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
      </div>

      <!-- 侧边栏 -->
      <div class="right col-12 col-sm-12 col-md-12 col-lg-4">
        <div class="topRight">
          <p>
            <span>
              <span style="font-size: 12px">{{ $t('loan') }}&nbsp;</span>
              <span style="font-size: 18px; font-weight: 800">APY</span>
            </span>
            <i class="greenCircle"></i>
          </p>

          <!-- <h2>{{ (totalObj.loanAPY * 100).toFixed(2) }}%</h2> -->
          <h2 class="countStyleLoan countColorLoan">
            <countFlopTest
              :val="(totalObj.loanAPY * 100).toFixed(2)"
              suffix="%"
            />
          </h2>
          <h5 style="font-weight: 700">{{ $t('U_rate') }}</h5>
          <!-- <h5 style="text-align: right; font-size: 25px">
            {{ (totalObj.financeUseRate * 100).toFixed(2) }}%
          </h5> -->
          <h5 class="countStyle2">
            <countFlopTest
              :val="(totalObj.financeUseRate * 100).toFixed(2)"
              suffix="%"
            />
          </h5>
        </div>

        <Sidebar />
      </div>
    </div>
    <!-- 设置操作人弹框 -->
    <SetOwner
      ref="SetOwnerRef"
      :showSet="showSet"
      @close="close"
      @showSkeleton="showSkeleton"
      @getStatus="getStatus"
    />
  </div>
</template>

<script setup>
import countFlopTest from '@/components/countFlopTest.vue'
import { nodeRecordList } from '@/api/node.js'
import { useBuffStore } from '@/store/module/buff.js' //buff仓
import { useAccountStore } from '@/store/module/accounts.js' //账号
import { useMinerStore } from '@/store/module/miner' //节点信息
import { useSidebarStore } from '@/store/module/sidebar.js' //侧边栏数据
import { useRateContractStore } from '@/store/module/rateContract'
import SetOwner from '@/views/set/index.vue' //设置弹框组件
import { storeToRefs } from 'pinia'
import { ElMessage, ElNotification } from 'element-plus'
import Sidebar from '@/components/sidebar.vue'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Web3 from 'web3'
import { toFixedNum } from '@/utils/num.js'
import useClipboard from 'vue-clipboard3' //复制插件

// 初始化
onMounted(() => {
  getTotalFilSideData() //侧边栏数据

  form.value.node = route.params.id
  form.value.role = minerStore.role

  form1.value.nodeId = route.params.id

  form2.value.nodeId = route.params.id
  if (accountStore.isConnected) {
    form2.value.operator = accountStore.account
  }

  getDetail() //节点详情
  getNodeRecord() //历史记录
})

// 使用路由
const route = useRoute()
const { toClipboard } = useClipboard() //使用复制插件

// 使用仓库
const accountStore = useAccountStore()
const { account, isConnected } = storeToRefs(accountStore)
const minerStore = useMinerStore()
const { role, judgeMode } = storeToRefs(minerStore)

const buffStore = useBuffStore()
const { actorInfo, departObj } = storeToRefs(buffStore)

const sidebarStore = useSidebarStore()
const { rateData, getTotalFilSideInfo } = storeToRefs(sidebarStore)

// 利率
const rateContractStore = useRateContractStore()
const { getNodeInfoData } = storeToRefs(rateContractStore)

const form = ref({
  node: '',
  role: ''
})

// getNodeRecord 历史记录
const form1 = ref({
  nodeId: '', //	是	string	节点id, 如节点为t032219, 传值t032219即可
  opType: 'borrow', //	是	string	节点记录类型：borrow 借款，repayment 还款，withdraw 提现，nodeChange 节点变更
  page: 1, //	否	int64	页码
  pageSize: 9999999 //	否	int64	每页条数
})

// getDetail 获取卡片信息
const form2 = ref({
  nodeId: '', //	是	string	节点id, 如节点为t032219, 传值t032219即可
  operator: '' //	否	string	当前小狐狸地址, 未连接则传空,用以确定有哪个节点是和小狐狸绑定的
})

// 监听连接状态和在职身份
watch(
  () => [
    minerStore.role,
    accountStore.account,
    route.params.id,
    sidebarStore.rateData
  ],
  async ([new2, new3, new4, new5], [old2, old3, old4, old5]) => {
    form.value.role = new2 // 1 owner 2受益人 3不在职

    if (new4 !== old4) {
      form.value.node = new4
      form1.value.nodeId = new4
      form2.value.nodeId = new4
      getDetail() //节点详情
      getNodeRecord(0) //历史记录
    }

    if (new5 !== old5) {
      totalObj.value = new5
    }
  }
)

const SetOwnerRef = ref() //子组件

// 点击设置
const showSet = ref(false) // 控制设置弹框显示
const setClick = () => {
  showSet.value = true
}

// 控制设置按钮
const status = ref(0)
const getStatus = val => {
  status.value = val
}

//关闭设置弹框
const close = () => {
  showSet.value = false
}
// 开启骨架屏
const showSkeleton = () => {
  skeletonShow.value = true
}

// 获取侧边栏数据
const totalObj = ref({
  stakeAPY: 0, // 质押利率
  financeUseRate: 0 // 资金利用率
})
const getTotalFilSideData = async () => {
  totalObj.value = await sidebarStore.getTotalFilSideInfo()
}

// 节点详情
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

// 获取节点详情
const getDetail = async () => {
  const res = await rateContractStore.getNodeInfoData(
    form2.value.nodeId,
    form2.value.operator
  )
  if (res.code == 0) {
    nodeData.value = res.data
    skeletonShow.value = false
  } else {
    ElMessage.info('无节点信息')
  }
}

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

// 轮播
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
</script>

<script>
export default {
  name: 'MinerInfoExit'
}
</script>
<style lang="scss" scoped>
@import '@/styles/mixins.scss'; //引用此混合样式

#MinerInfoExit {
  // display: flex;
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
  padding: 15px 20px 0px;
}
.right {
  flex: 1;
  margin-left: 20px;
}

//节点信息
.info {
  border-radius: 20px;
  background: linear-gradient(179.64deg, #753dcf 0.32%, #53348d 80.94%);
  padding: 5px 15px;
}

.miner {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

  /* 汇率兑换 */
  ul {
    margin-top: 15px;
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
    color: #6be585;
    border: none;
  }
}

/* 资金利用率 */
.topRight {
  margin-bottom: 10px;
  padding: 10px 20px;
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

  h2 {
    text-align: center;
    height: 60px;
    line-height: 60px;
    font-style: normal;
    font-weight: 800;
    font-size: 60px;
    text-transform: capitalize;
    background: $txtColor;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;

    margin: 50px 0;
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

  margin: 10px 40px 10px;

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
      display: flex;
      justify-content: center;
      align-items: center;

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
  min-height: 400px;
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
  #MinerInfoExit {
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
  #MinerInfoExit {
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

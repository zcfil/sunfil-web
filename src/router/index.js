import { createRouter, createWebHashHistory } from 'vue-router'

// 路由配置 （Route configuration）
const routes = [
  {
    path: '/',
    redirect: '/home'
  },

  // 首页 (Home - Display platform data information)
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/home/index.vue'),
    meta: {
      title: 'SunFIL-Filecoin Liquid Staking'
    }
  },

  // 公告通知 (Announcement notices are mainly clearing nodes and voting broadcast)
  {
    path: '/home/inform',
    name: 'Inform',
    component: () => import('@/views/inform/index.vue'),
    meta: {
      title: 'SunFIL-Filecoin Liquid Staking'
    }
  },

  // 投票信息 - Voting information
  {
    path: '/home/voteInfo',
    name: 'VoteInfo',
    component: () => import('@/views/voteInfo/index.vue'),
    meta: {
      title: 'SunFIL-Filecoin Liquid Staking'
    }
  },

  // 质押 (Pledge - The transaction investment and redemption of coins)
  {
    path: '/stake',
    name: 'Stake',
    component: () => import('@/views/stake/index.vue'),
    meta: {
      title: 'SunFIL-Filecoin Liquid Staking'
    }
  },

  // 池子 (View the node records of the arrivals and departures)
  {
    path: '/buff',
    name: 'Buff',
    component: () => import('@/views/buff/index.vue'),
    meta: {
      title: 'SunFIL-Filecoin Liquid Staking'
    },

    children: [
      //  默认显示 (Default)
      {
        path: '/buff',
        redirect: '/buff/buff_home'
      },

      {
        path: '/buff/buff_home',
        name: 'BuffHome',
        component: () => import('@/views/buff/components/buff_home.vue'),
        meta: {
          title: 'SunFIL-Filecoin Liquid Staking'
        }
      },

      // 入驻节点 (Resident node)
      {
        path: '/buff/minerEnter',
        name: 'MinerEnter',
        component: () => import('@/views/minerEnter/index.vue'),
        meta: {
          title: 'SunFIL-Filecoin Liquid Staking'
        },

        children: [
          {
            path: '/buff/minerEnter',
            redirect: '/buff/minerSearch'
          },
          // 节点查询 (Node query)
          {
            path: '/buff/minerSearch',
            name: 'MinerSearch',
            component: () => import('@/views/minerEnter/components/search.vue'),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 角色信息 （Role information）
          {
            path: '/buff/minerRoleInfo',
            name: 'MinerRoleInfo',
            component: () =>
              import('@/views/minerEnter/components/roleInfo.vue'),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 设置操作人 （Set operator）
          {
            path: '/buff/setOperator',
            name: 'SetOperator',
            component: () =>
              import('@/views/minerEnter/components/setOperator.vue'),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 入驻成功 （Successful settlement）
          {
            path: '/buff/enterSuccess',
            name: 'EnterSuccess',
            component: () =>
              import('@/views/minerEnter/components/enterSuccess.vue'),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 单签申请 （Application for single signature）
          {
            path: '/buff/singleApply',
            name: 'SingleApply',
            component: () =>
              import('@/views/minerEnter/components/singleApply.vue'),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 单签--接收申请 （Single signature - Receive applications）
          {
            path: '/buff/singleReceiveApply',
            name: 'SingleReceiveApply',
            component: () =>
              import('@/views/minerEnter/components/singleReceiveApply.vue'),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 多签申请 (Multi-signature application)
          {
            path: '/buff/multipleApply',
            name: 'MultipleApply',
            component: () =>
              import('@/views/minerEnter/components/multipleApply.vue'),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 多签--接收申请 (Multi-sign - Accept applications)
          {
            path: '/buff/multipleReceiveApply',
            name: 'MultipleReceiveApply',
            component: () =>
              import('@/views/minerEnter/components/multipleReceiveApply.vue'),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          }
        ]
      },

      // 节点信息 (Node information)
      {
        path: '/buff/minerInfo/:id',
        name: 'MinerInfo',
        component: () => import('@/views/minerInfo/index.vue'),
        meta: {
          title: 'SunFIL-Filecoin Liquid Staking'
        }
      },

      // 未入驻节点信息 （Information of unsettled nodes)
      {
        path: '/buff/minerInfoExit/:id',
        name: 'minerInfoExit',
        component: () => import('@/views/minerInfoExit/index.vue'),
        meta: {
          title: 'SunFIL-Filecoin Liquid Staking'
        }
      },

      // 设置owner钱包操作员 (Set up the owner wallet operator)
      {
        path: '/buff/setOwner',
        name: 'SetOwner',
        component: () => import('@/views/set/components/owner/index.vue'),
        meta: {
          title: 'SunFIL-Filecoin Liquid Staking'
        },

        children: [
          {
            path: '/buff/setOwner',
            redirect: '/buff/setOwner_update'
          },

          // 更新地址 (Update address)
          {
            path: '/buff/setOwner_update',
            name: 'SetOwnerUpdate',
            component: () =>
              import(
                '@/views/set/components/owner/components/setOwner_update.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 单签消息内容 （Single sign message content)
          {
            path: '/buff/setOwner_singleInfo',
            name: 'SetOwnerSingleInfo',
            component: () =>
              import(
                '@/views/set/components/owner/components/setOwner_singleInfo.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 多签消息内容 (Multisign message content)
          {
            path: '/buff/setOwner_multipleInfo',
            name: 'SetOwnerMultipleInfo',
            component: () =>
              import(
                '@/views/set/components/owner/components/setOwner_multipleInfo.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 成功 (Success)
          {
            path: '/buff/setOwner_success',
            name: 'SetOwnerSuccess',
            component: () =>
              import(
                '@/views/set/components/owner/components/setOwner_success.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          }
        ]
      },

      // 修改worker （Modifying Workers)
      {
        path: '/buff/amendWorker',
        name: 'Worker',
        component: () => import('@/views/set/components/worker/index.vue'),
        meta: {
          title: 'SunFIL-Filecoin Liquid Staking'
        },

        children: [
          {
            path: '/buff/amendWorker',
            redirect: '/buff/worker_update'
          },

          // 更新地址 (Update address)
          {
            path: '/buff/worker_update',
            name: 'WorkerUpdate',
            component: () =>
              import(
                '@/views/set/components/worker/components/worker_update.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 单签 （Single signature）
          {
            path: '/buff/worker_single',
            name: 'WorkerSingle',
            component: () =>
              import(
                '@/views/set/components/worker/components/worker_single.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },
          // 单签确认 (Single signature confirmation)
          {
            path: '/buff/worker_singleConfirm',
            name: 'WorkerSingleConfirm',
            component: () =>
              import(
                '@/views/set/components/worker/components/worker_singleConfirm.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 多签 (Multiple signings)
          {
            path: '/buff/worker_multiple',
            name: 'WorkerMultiple',
            component: () =>
              import(
                '@/views/set/components/worker/components/worker_multiple.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 多签确认 (Multiple signature confirmation)
          {
            path: '/buff/worker_multipleConfirm',
            name: 'WorkerMultipleConfirm',
            component: () =>
              import(
                '@/views/set/components/worker/components/worker_multipleConfirm.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 等待生效 (Waiting for effect)
          {
            path: '/buff/worker_await',
            name: 'WorkerAwait',
            component: () =>
              import(
                '@/views/set/components/worker/components/worker_await.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 成功 (Success)
          {
            path: '/buff/worker_success',
            name: 'WorkerSuccess',
            component: () =>
              import(
                '@/views/set/components/worker/components/worker_success.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          }
        ]
      },

      // 修改control (Modifying control)
      {
        path: '/buff/amendControl',
        name: 'Control',
        component: () => import('@/views/set/components/control/index.vue'),
        meta: {
          title: 'SunFIL-Filecoin Liquid Staking'
        },

        children: [
          {
            path: '/buff/amendControl',
            redirect: '/buff/control_update'
          },

          // 更新地址 (Update address)
          {
            path: '/buff/control_update',
            name: 'ControlUpdate',
            component: () =>
              import(
                '@/views/set/components/control/components/control_update.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 单签 （Single signature)
          {
            path: '/buff/control_single',
            name: 'ControlSingle',
            component: () =>
              import(
                '@/views/set/components/control/components/control_single.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },
          // 多签 (Multiple signings)
          {
            path: '/buff/control_multiple',
            name: 'ControlMultiple',
            component: () =>
              import(
                '@/views/set/components/control/components/control_multiple.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 成功 (Success)
          {
            path: '/buff/control_success',
            name: 'ControlSuccess',
            component: () =>
              import(
                '@/views/set/components/control/components/control_success.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          }
        ]
      },

      // 退出平台 （Exit the platform）
      {
        path: '/buff/exitPlatform',
        name: 'ExitPlatform',
        component: () =>
          import('@/views/set/components/exitPlatform/index.vue'),
        meta: {
          title: 'SunFIL-Filecoin Liquid Staking'
        },
        children: [
          {
            path: '/buff/exitPlatform',
            redirect: '/buff/exitPlatform_apply'
          },

          // 多签退出申请 （Multiple exit applications）
          {
            path: '/buff/exitPlatform_multipleApply',
            name: 'exitMultipleApply',
            component: () =>
              import(
                '@/views/set/components/exitPlatform/components/exitPlatform_multipleApply.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 接收多签退出申请 （Multi-signature withdrawal requests are accepted)
          {
            path: '/buff/exitPlatform_multipleReceiveApply',
            name: 'exitMultipleReceiveApply',
            component: () =>
              import(
                '@/views/set/components/exitPlatform/components/exitPlatform_multipleReceiveApply.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 单签退出申请 在职 (Single signature withdrawal application for employment)
          {
            path: '/buff/exitPlatform_singleApply',
            name: 'exitPlatformSingleApply',
            component: () =>
              import(
                '@/views/set/components/exitPlatform/components/exitPlatform_singleApply.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 接收单签离职申请 (Receive single signed separation application)
          {
            path: '/buff/exitPlatform_singleReceiveApply',
            name: 'exitSingleReceiveApply',
            component: () =>
              import(
                '@/views/set/components/exitPlatform/components/exitPlatform_singleReceiveApply.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 错误 (Error)
          {
            path: '/buff/exitPlatform_debt',
            name: 'exitPlatformDebt',
            component: () =>
              import(
                '@/views/set/components/exitPlatform/components/exitPlatform_debt.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          },

          // 成功 (Success)
          {
            path: '/buff/exitPlatform_success',
            name: 'exitPlatformSuccess',
            component: () =>
              import(
                '@/views/set/components/exitPlatform/components/exitPlatform_success.vue'
              ),
            meta: {
              title: 'SunFIL-Filecoin Liquid Staking'
            }
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

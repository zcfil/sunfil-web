import { useAccountStore } from './module/account'
import { useStakeContractStore } from './module/stakeContract'

export default () => {
  return {
    useAccountStore: useAccountStore(),
    useStakeContractStore: useStakeContractStore()
  }
}

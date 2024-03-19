import { ref } from 'vue'
import { waitFor } from './sleep.js'
let globalCbor
import('@ipld/dag-cbor')
  .then(localCbor => {
    globalCbor = localCbor
  })
  .catch(e => {
    throw e
  })

let globalMultiformats
import('multiformats')
  .then(localMultiformats => {
    globalMultiformats = localMultiformats
  })
  .catch(e => {
    throw e
  })
/**
 * Allows to create and serialize parameters related to the exec method of the init actor.
 * For more information about this type, please refer to this {@link https://github.com/filecoin-project/builtin-actors/blob/master/actors/init/src/lib.rs|code}
 */

let targetActorCid = ref()
let targetConstructorParams = ref()

function constructor (targetActorCid, targetConstructorParams) {
  targetActorCid.value = targetActorCid
  targetConstructorParams.value = targetConstructorParams

  console.log('  targetActorCid.value :', targetActorCid.value)
  console.log(' targetConstructorParams.value:', targetConstructorParams.value)

  const serialize = async () => {
    const cbor = await waitFor(() => globalCbor)

    const multiformats = await waitFor(() => globalMultiformats)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

    return cbor.encode([
      multiformats.CID.parse(targetActorCid.value),
      targetConstructorParams.value
    ])
  }

  return serialize
}

class ExecParams {
  targetActorCid
  targetConstructorParams
  /**
   * Create new exec params instance
   * @param targetActorCid - actor cid the init actor will create
   * @param targetConstructorParams - constructor parameters of the new actor instance the init actor will create
   */
  constructor (targetActorCid, targetConstructorParams) {
    this.targetActorCid = targetActorCid
    this.targetConstructorParams = targetConstructorParams
  }

  /**
   * Serialize to cbor. Required to sign and send an exec transaction to the blockchain
   * @returns serialized data
   */
  serialize = async () => {
    const cbor = await waitFor(() => globalCbor)

    const multiformats = await waitFor(() => globalMultiformats)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment

    return cbor.encode([
      multiformats.CID.parse(this.targetActorCid),
      this.targetConstructorParams
    ])
  }
}

export default constructor

import "@hazae41/symbol-dispose-polyfill"

import { Base16 } from "@hazae41/base16"
import { Writable } from "@hazae41/binary"
import { Abi } from "@hazae41/cubane"
import { Keccak256 } from "@hazae41/keccak256"

Keccak256.set(await Keccak256.fromMorax())

const DivisorStruct = Abi.Tuple.create(Abi.Uint256, Abi.Address, Abi.Uint256)

/**
 * Precomputed chainId + contract hash
 */
const keyBigInt = 90442557349208564432276667675164889511323241952563730180144940511601581330995n
const keyBase16 = keyBigInt.toString(16)
const keyBytes = Base16.get().padStartAndDecodeOrThrow(keyBase16).copyAndDispose()

/**
 * Receiver address
 */
const receiverZeroHex = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
const receiverBase16 = receiverZeroHex.slice(2)
const receiverBytes = Base16.get().padStartAndDecodeOrThrow(receiverBase16).copyAndDispose()

while (true) {
  /**
   * Generate a secret
   */
  const secretBytes = crypto.getRandomValues(new Uint8Array(32))

  /**
   * Generate a proof of the secret
   */
  const proofBytes = Keccak256.get().hashOrThrow(secretBytes).copyAndDispose()

  /**
   * Mix the proof with the public stuff
   */
  const mixinAbi = DivisorStruct.from([keyBytes, receiverBytes, proofBytes])
  const mixinBytes = Writable.writeToBytesOrThrow(mixinAbi)

  /**
   * Compute the divisor
   */
  const divisorBytes = Keccak256.get().hashOrThrow(mixinBytes).copyAndDispose()
  const divisorBase16 = Base16.get().encodeOrThrow(divisorBytes)
  const divisorBigInt = BigInt(`0x${divisorBase16}`)

  /**
   * Compute the value
   */
  const value = ((2n ** 256n) - 1n) / divisorBigInt

  /**
   * Filter values that are too small
   */
  if (value > (10n ** 6n)) {
    const secretBase16 = Base16.get().encodeOrThrow(secretBytes)
    const secretZeroHex = `0x${secretBase16.padStart(64, "0")}`

    const proofBase16 = Base16.get().encodeOrThrow(proofBytes)
    const proofZeroHex = `0x${proofBase16.padStart(64, "0")}`

    console.log(value, secretZeroHex, proofZeroHex)
    continue
  }

  continue
}
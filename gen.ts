import "@hazae41/symbol-dispose-polyfill"

import { Base16 } from "@hazae41/base16"
import { Writable } from "@hazae41/binary"
import { Abi } from "@hazae41/cubane"
import { Keccak256 } from "@hazae41/keccak256"

Keccak256.set(await Keccak256.fromMorax())

const KeyStruct = Abi.Tuple.create(Abi.Uint64, Abi.Address, Abi.Address)
const DivisorStruct = Abi.Tuple.create(Abi.Uint256, Abi.Uint256)

const chainId = 1
const contract = "0xb27A31f1b0AF2946B7F582768f03239b1eC07c2c"
const address = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"

/**
 * Compute the public stuff
 */
const keyAbi = KeyStruct.from([chainId, contract, address])
const keyBytes = Writable.writeToBytesOrThrow(keyAbi)
const keyHashBytes = Keccak256.get().hashOrThrow(keyBytes).copyAndDispose()

while (true) {
  /**
   * Generate a secret
   */
  const nonceBytes = crypto.getRandomValues(new Uint8Array(32))

  /**
   * Generate a proof of the secret
   */
  const nonceHashBytes = Keccak256.get().hashOrThrow(nonceBytes).copyAndDispose()

  /**
   * Mix the proof with the public stuff
   */
  const divisorAbi = DivisorStruct.from([keyHashBytes, nonceHashBytes])
  const divisorBytes = Writable.writeToBytesOrThrow(divisorAbi)
  const divisorHashBytes = Keccak256.get().hashOrThrow(divisorBytes).copyAndDispose()
  const divisorHashBase16 = Base16.get().encodeOrThrow(divisorHashBytes)
  const divisorHashBigInt = BigInt(`0x${divisorHashBase16}`)

  /**
   * Compute the value
   */
  const value = ((2n ** 256n) - 1n) / divisorHashBigInt

  /**
   * Filter values that are too small
   */
  if (value > (10n ** 6n)) {
    /**
     * Secret
     */
    const nonceBase16 = Base16.get().encodeOrThrow(nonceBytes)
    const nonceZeroHex = `0x${nonceBase16.padStart(64, "0")}`

    /**
     * Proof
     */
    const nonceHashBase16 = Base16.get().encodeOrThrow(nonceHashBytes)
    const nonceHashZeroHex = `0x${nonceHashBase16.padStart(64, "0")}`

    console.log(value, nonceZeroHex, nonceHashZeroHex)
    continue
  }

  continue
}
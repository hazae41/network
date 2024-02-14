import "@hazae41/symbol-dispose-polyfill"

import { Base16 } from "@hazae41/base16"
import { Writable } from "@hazae41/binary"
import { Abi } from "@hazae41/cubane"
import { Keccak256 } from "@hazae41/keccak256"

Keccak256.set(await Keccak256.fromMorax())

const Offset = Abi.Tuple.create(Abi.Uint64, Abi.Address)

/**
 * Compute public inputs
 */
const offsetAbi = Offset.from([1, "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"])
const offsetBytes = Writable.writeToBytesOrThrow(offsetAbi)
const offsetHashMemory = Keccak256.get().hashOrThrow(offsetBytes)
const offsetHashBase16 = Base16.get().encodeOrThrow(offsetHashMemory)
const offsetBigInt = BigInt(`0x${offsetHashBase16}`)

while (true) {
  const nonceBytes = crypto.getRandomValues(new Uint8Array(32))
  const nonceBase16 = Base16.get().encodeOrThrow(nonceBytes)

  const hashMemory = Keccak256.get().hashOrThrow(nonceBytes)
  const hashBase16 = Base16.get().encodeOrThrow(hashMemory)
  const hashBigInt = BigInt(`0x${hashBase16}`)

  const value = (((2n ** 256n) - 1n) / ((offsetBigInt + hashBigInt) % (2n ** 256n)))

  /**
   * Arbitrary value we want to be paid
   */
  if (value > (10n ** 6n)) {
    const zeroHexNonce = `0x${nonceBase16.padStart(64, "0")}`
    const zeroHexHash = `0x${hashBase16.padStart(64, "0")}`

    console.log(value, zeroHexNonce, zeroHexHash)
  }

  continue
}
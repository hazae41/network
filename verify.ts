import "@hazae41/symbol-dispose-polyfill"

import { Base16 } from "@hazae41/base16"
import { Writable } from "@hazae41/binary"
import { Abi } from "@hazae41/cubane"
import { Keccak256 } from "@hazae41/keccak256"

Keccak256.set(await Keccak256.fromMorax())

/**
 * Max uint256 value
 */
const maxUint256BigInt = (2n ** 256n) - 1n

/**
 * Mixing ABI struct
 */
const Mixin = Abi.Tuple.create(Abi.Uint64, Abi.Address, Abi.Address, Abi.Uint256)

/**
 * Chain ID
 */
const chainInt = 1
const chainBase16 = chainInt.toString(16)
const chainBytes = Base16.get().padStartAndDecodeOrThrow(chainBase16).copyAndDispose()

/**
 * Contract address
 */
const contractZeroHex = "0xB57ee0797C3fc0205714a577c02F7205bB89dF30"
const contractBase16 = contractZeroHex.slice(2)
const contractBytes = Base16.get().padStartAndDecodeOrThrow(contractBase16).copyAndDispose()

/**
 * Receiver address
 */
const receiverZeroHex = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
const receiverBase16 = receiverZeroHex.slice(2)
const receiverBytes = Base16.get().padStartAndDecodeOrThrow(receiverBase16).copyAndDispose()

const mixinAbi = Mixin.from([chainBytes, contractBytes, receiverBytes, new Uint8Array(32)])
const mixinBytes = Writable.writeToBytesOrThrow(mixinAbi)
const mixinOffset = mixinBytes.length - 32

const secretsBase16 = "e1b7dce662e3b553a1f2b1c386bb72b548c74114c405af72bf7e2583957490301236282d4beb9d362143ae3f6d69b2aff031e7233a224dcc06805b757891420054c9a08b17697e34ce6423857d8eb653a6321a84cad960263d42dacc96f1ba33"
const secretsBytes = Base16.get().padStartAndDecodeOrThrow(secretsBase16).copyAndDispose()

let totalBigInt = 0n

const start = Date.now()

for (let i = 0; i < secretsBytes.length / 32; i++) {
  const secretBytes = secretsBytes.subarray(i * 32, (i + 1) * 32)

  /**
   * Generate a proof of the secret
   */
  const proofBytes = Keccak256.get().hashOrThrow(secretBytes).copyAndDispose()

  /**
   * Mix the proof with the public stuff
   */
  mixinBytes.set(proofBytes, mixinOffset)

  /**
   * Compute the divisor
   */
  const divisorBytes = Keccak256.get().hashOrThrow(mixinBytes).copyAndDispose()
  const divisorBase16 = Base16.get().encodeOrThrow(divisorBytes)
  const divisorBigInt = BigInt(`0x${divisorBase16}`)

  /**
   * Compute the value
   */
  const valueBigInt = maxUint256BigInt / divisorBigInt

  totalBigInt += valueBigInt
}

const end = Date.now()

console.log(`Verified ${totalBigInt} wei in ${end - start} milliseconds`)
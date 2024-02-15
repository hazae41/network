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

let amountBigInt = 0n

interface Secret {
  readonly secretZeroHex: string,
  readonly proofZeroHex: string,
  readonly valueBigInt: bigint
}

const secrets = new Array<Secret>()

function sort(a: Secret, b: Secret) {
  return a.valueBigInt < b.valueBigInt ? -1 : 1
}

const start = Date.now()

while (amountBigInt < (10n ** 6n)) {
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
  mixinBytes.set(proofBytes, mixinBytes.length - 32)

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

  if (valueBigInt < 1000n)
    continue

  const secretBase16 = Base16.get().encodeOrThrow(secretBytes)
  const secretZeroHex = `0x${secretBase16.padStart(64, "0")}`

  const proofBase16 = Base16.get().encodeOrThrow(proofBytes)
  const proofZeroHex = `0x${proofBase16.padStart(64, "0")}`

  if (secrets.length === 10) {
    if (valueBigInt < secrets[0].valueBigInt)
      continue

    amountBigInt -= secrets[0].valueBigInt
    secrets[0] = { secretZeroHex, valueBigInt, proofZeroHex }
    secrets.sort(sort)
    amountBigInt += valueBigInt
  } else {
    secrets.push({ secretZeroHex, valueBigInt, proofZeroHex })
    secrets.sort(sort)
    amountBigInt += valueBigInt
  }

  continue
}

for (const { secretZeroHex, proofZeroHex, valueBigInt } of secrets)
  console.log(valueBigInt, secretZeroHex, proofZeroHex)

console.log(`You just generated ${amountBigInt} wei with ${secrets.length} secrets in ${Date.now() - start} milliseconds`)
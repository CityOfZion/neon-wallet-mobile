import * as Random from 'expo-random'
if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer
}

const RNRandomBytes = require('react-native').NativeModules.RNRandomBytes
const sjcl = require('sjcl')
function noop() {}

function toBuffer(nativeStr) {
  //@ts-ignore
  return new Buffer(nativeStr, 'base64')
}

function init() {
  if (RNRandomBytes && RNRandomBytes.seed) {
    const seedBuffer = toBuffer(RNRandomBytes.seed)
    addEntropy(seedBuffer)
  } else {
    seedSJCL()
  }
}

function addEntropy(entropyBuf) {
  const hexString = entropyBuf.toString('hex')
  const stanfordSeed = sjcl.codec.hex.toBits(hexString)
  sjcl.random.addEntropy(stanfordSeed)
}

export function seedSJCL(cb) {
  cb = cb || noop
  randomBytes(4096, function (err, buffer) {
    if (err) return cb(err)

    addEntropy(buffer)
  })
}

export function randomBytes(length, cb) {
  if (!cb) {
    const size = length
    const wordCount = Math.ceil(size * 0.25)
    const randomBytes = sjcl.random.randomWords(wordCount, 10)
    let hexString = sjcl.codec.hex.fromBits(randomBytes)
    hexString = hexString.substr(0, size * 2) //@ts-ignore
    return new Buffer(hexString, 'hex')
  }

  if (RNRandomBytes) {
    RNRandomBytes.randomBytes(length, function (err, base64String) {
      if (err) {
        cb(err)
      } else {
        cb(null, toBuffer(base64String))
      }
    })
  } else {
    const value = Random.getRandomBytes(Math.ceil(length * 0.25))
    cb(null, value)
  }
}

init()

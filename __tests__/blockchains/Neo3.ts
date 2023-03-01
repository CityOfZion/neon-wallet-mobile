import { BSNeo3 } from '../../src/blockchain/Neo3/services/BSNeo3'

const blockchain = new BSNeo3()
const address = 'NV96QgerjXNmu4jLdMW4ZWkhySVMYX52Ex'
const wif = 'Kwbo91nddqMhgpJi8MiWNpMpaz8wECRV5Abw6kpRRCVU4AF3bFmZ'
const encryptedKey = '6PYN6mjwYfjPUuYT3Exajvx25UddFVLpCw4bMsmtLdnKwZ9t1Mi3CfKe8S'

describe('Neo Legacy Blockchain All methods', () => {
  test('Validate address', () => {
    const result = blockchain.validateAddress(address)
    expect(result).toEqual(true)
  })

  test('Validade WIF', () => {
    const result = blockchain.validateWif(wif)
    expect(result).toEqual(true)
  })

  test('Validate private key with password', () => {
    const result = blockchain.validatePrivateKeyWithPassword(encryptedKey)
    expect(result).toEqual(true)
  })
})

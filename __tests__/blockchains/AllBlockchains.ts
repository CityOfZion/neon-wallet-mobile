import {validateAddressAllBlockchains, validateWifAllBlockchains, validatePrivateKeyWithPasswordAllBlockchains} from '~src/~src/src/blockchain'

const addressNeoLegacy = 'AeGgZTTWPzyVtNiQRcpngkV75Xip1hznmi'
const wifNeoLegacy = 'Kwbo91nddqMhgpJi8MiWNpMpaz8wECRV5Abw6kpRRCVU4AF3bFmZ'
const encryptedKeyNeoLegacy = '6PYN6mjwYfjPUuYT3Exajvx25UddFVLpCw4bMsmtLdnKwZ9t1Mi3CfKe8S'

const addressNeo3 = 'NV96QgerjXNmu4jLdMW4ZWkhySVMYX52Ex'

describe('Validate informations in all blockchains', () => {
    test('validate address neo legacy', () => {
        const result = validateAddressAllBlockchains(addressNeoLegacy)
        expect(result).toEqual(true)
    })
    test('validate wif neo legacy', () => {
        const result = validateWifAllBlockchains(wifNeoLegacy)
        expect(result).toEqual(true)
    })

    test('validate private key with password neo legacy', () => {
        const result = validatePrivateKeyWithPasswordAllBlockchains(encryptedKeyNeoLegacy)
        expect(result).toEqual(true)
    })
    test('validate address neo 3', () => {
        const result = validateAddressAllBlockchains(addressNeo3)
        expect(result).toEqual(true)
    })
})
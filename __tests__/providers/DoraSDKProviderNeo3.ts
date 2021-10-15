import { Neo3ProviderOptions } from '../../src/blockchain/Neo3'
import { Transaction } from '../../src/models/Transaction'
import {BalanceResponse} from '../../src/models/response/BalanceResponse'
import {TransactionAddressResponse} from '../../src/models/response/TransactionAddressResponse'
import {UnclaimedResponse} from '../../src/models/response/UnclaimedResponse'
const provider = Neo3ProviderOptions('doraSDK')
const address = 'NV96QgerjXNmu4jLdMW4ZWkhySVMYX52Ex'
const txid = '67bdf09cf305a771680f3f12186858ec6c6b218f8300f741abebc5920cee9c63'

describe('Neo 3 Dora SDK Provider validate format requests', () => {

    test('get all nodes', async () => {
        const result = await provider.getAllNodes()
        expect(result).toBeInstanceOf(Array)
    })

    test('get transaction', async () => {
        const result = await provider.getTransaction(txid)
        expect(result).toBeInstanceOf(Transaction)
    })

    test('get balance', async () => {
        const result = await provider.getBalance(address)
        expect(result).toBeInstanceOf(BalanceResponse)
    })

    test('get address abstracts', async () => {
        const result = await provider.getAddressAbstracts(address)
        expect(result).toBeInstanceOf(TransactionAddressResponse)
    })

    test('get unclaimed', async () => {
        const result = await provider.getUnclaimed(address)
        expect(result).toBeInstanceOf(UnclaimedResponse)
    })
})
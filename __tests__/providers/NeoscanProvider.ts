import { NeoLegacyProviderOption } from '../../src/blockchain/NeoLegacy'
import { Transaction } from '../../src/models/Transaction'
import {BalanceResponse} from '../../src/models/response/BalanceResponse'
import {TransactionAddressResponse} from '../../src/models/response/TransactionAddressResponse'
import {UnclaimedResponse} from '../../src/models/response/UnclaimedResponse'
const provider = NeoLegacyProviderOption('neoscan')
const address = 'AeGgZTTWPzyVtNiQRcpngkV75Xip1hznmi'
const txid = '02e8f3f51b59c4bf7ec7b8b9474494c437e2f45acc510b9a108d4367935329b2'

describe('Neoscan Provider validate format requests', () => {

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
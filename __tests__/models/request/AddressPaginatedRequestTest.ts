import {AddressPaginatedRequest} from '~src/models/request/AddressPaginatedRequest'
import {TransactionAddressResponse} from '~src/models/response/TransactionAddressResponse'

describe('AddressPaginatedRequest', () => {
  const TEST_ADDRESS = 'AQRfihDwLeQ2VzqhBDPhR8oR4xmujkis2G'
  const request = new AddressPaginatedRequest(TEST_ADDRESS)

  it('can get address abstracts', async () => {
    const result = await request.getAddressAbstracts()

    expect(result).toBeInstanceOf(TransactionAddressResponse)
  })

  it('can get last transactions', async () => {
    const result = await request.getLastTransactions()

    expect(result).toBeInstanceOf(Array)
  })
})

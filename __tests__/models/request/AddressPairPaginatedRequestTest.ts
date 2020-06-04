import {AddressPairPaginatedRequest} from '~src/models/request/AddressPairPaginatedRequest'
import {TransactionAddressResponse} from '~src/models/response/TransactionAddressResponse'

describe('AddressPairPaginatedRequest', () => {
  const TEST_ADDRESS = 'Ad83tfsuWxxexhefPzXVpn5vv6oCbLKFEx'

  const request = new AddressPairPaginatedRequest(TEST_ADDRESS, TEST_ADDRESS)

  it('can get address to address abstracts', async () => {
    try {
      const result = await request.getAddressToAddressAbstracts()

      expect(result).toBeInstanceOf(TransactionAddressResponse)
    } catch (e) {
      expect(e.response.status).toEqual(404)
    }
  })
})

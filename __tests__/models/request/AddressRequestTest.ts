import {AddressRequest} from '~src/models/request/AddressRequest'
import {BalanceResponse} from '~src/models/response/BalanceResponse'
import {ClaimableResponse} from '~src/models/response/ClaimableResponse'
import {ClaimedResponse} from '~src/models/response/ClaimedResponse'
import {UnclaimedResponse} from '~src/models/response/UnclaimedResponse'

describe('AddressRequest', () => {
  const TEST_ADDRESS = 'AQRfihDwLeQ2VzqhBDPhR8oR4xmujkis2G'
  const request = new AddressRequest(TEST_ADDRESS)

  it('can get balance', async () => {
    const result = await request.getBalance()

    expect(result).toBeInstanceOf(BalanceResponse)
  })

  it('can get claimable', async () => {
    const result = await request.getClaimable()

    expect(result).toBeInstanceOf(ClaimableResponse)
  })

  it('can get claimed', async () => {
    const result = await request.getClaimed()

    expect(result).toBeInstanceOf(ClaimedResponse)
  })

  it('can get unclaimed', async () => {
    const result = await request.getUnclaimed()

    expect(result).toBeInstanceOf(UnclaimedResponse)
  })
})

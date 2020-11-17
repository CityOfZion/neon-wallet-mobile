import {Transaction} from '~src/models/Transaction'
import {TransactionRequest} from '~src/models/request/TransactionRequest'

describe('TransactionRequest', () => {
  /*const TEST_TRANSACTION_HASH =
    '3757005a16d4c7e76d160a9c18bdb7b710860418d7cf20843d9c184ae59dc74d'*/
    const TEST_TRANSACTION_HASH = '840c16f4a4c16ffb8a0ba77dd92f6bbe0c865d204096adca70745c6ea53e3676'
  const request = new TransactionRequest(TEST_TRANSACTION_HASH)

  it('can get transaction', async () => {
    const result = await request.getTransaction()

    expect(result).toBeInstanceOf(Transaction)
  })
})

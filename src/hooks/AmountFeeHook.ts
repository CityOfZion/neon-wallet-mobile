import {useState, useCallback} from 'react'

import {BlockchainServiceKey, blockchainServices} from '~src/blockchain'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'

export function useAmountFee(blockchain: BlockchainServiceKey) {
  const [amount, setAmount] = useState<number>(-1)

  const calc = useCallback(
    async (token: TokenAsset, account: Account, receiverAddress: string) => {
      const result = await blockchainServices[blockchain].calculateTransferFee({
        receiverAddress,
        senderAddress: account.address,
        token,
      })
      setAmount(result)
    },
    []
  )

  return {amount, calc}
}

import {useState, useCallback} from 'react'

import {BlockchainServiceKey} from '../blockchain'
import {applicationConfig} from '../config/ApplicationConfig'
import {TokenAsset} from '../models/TokenAsset'
import {Account} from '../models/redux/Account'

export function useAmountFee(blockchain: BlockchainServiceKey) {
  const [amount, setAmount] = useState<number>(-1)

  const calc = useCallback(
    async (token: TokenAsset, account: Account, receiverAddress: string) => {
      const result = await applicationConfig.blockchain[
        blockchain
      ].calculateFee({receiverAddress, senderAddress: account.address, token})
      setAmount(result)
    },
    []
  )

  return {amount, calc}
}

import { ReducerWrapper } from '@simpli/redux-wrapper'

import { blockchainServices } from '~/src/blockchain'
import { Account } from '~/src/models/redux/Account'
import { Model } from '~src/app/Model'
import { PriorityFee } from '~src/models/PriorityFee'
import { TokenAsset } from '~src/models/TokenAsset'
import { SenderTransaction } from '~src/models/redux/SenderTransaction'
import { FeeAmountDispatcher } from '~src/store/senderTransaction/dispatchers/FeeAmountDispatcher'
import { FiatDispatcher } from '~src/store/senderTransaction/dispatchers/FiatDispatcher'
import { ReceiverAddressDispatcher } from '~src/store/senderTransaction/dispatchers/ReceiverAddressDispatcher'
import { SenderAddressDispatcher } from '~src/store/senderTransaction/dispatchers/SenderAddressDispatcher'
import { TipDispatcher } from '~src/store/senderTransaction/dispatchers/TipDispatcher'
import { TokenDispatcher } from '~src/store/senderTransaction/dispatchers/TokenDispatcher'

export class SendTransactionReducer extends ReducerWrapper<
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction
> {
  protected readonly initialState = Model.parse<SenderTransactionState>(SenderTransaction)

  protected readonly dispatchers = [
    SenderAddressDispatcher,
    FeeAmountDispatcher,
    ReceiverAddressDispatcher,
    TokenDispatcher,
    FiatDispatcher,
    TipDispatcher,
  ]

  readonly actions = {
    setToken: (token: TokenAsset) => {
      return this.commit('SET_TOKEN', { token })
    },
    setSenderAddress: (senderAddress: string) => {
      return this.commit('SET_SENDER_ADDRESS', { senderAddress })
    },
    setReceiverAddress: (receiverAddress: string) => {
      return this.commit('SET_RECEIVER_ADDRESS', { receiverAddress })
    },
    setFeeAmount: (feeAmount: PriorityFee) => {
      return this.commit('SET_FEE_AMOUNT', { feeAmount })
    },
    setFiat: (fiat: number) => {
      return this.commit('SET_FIAT', { fiat })
    },
    setTip: (tip: { amount: number; address: string } | undefined) => {
      return this.commit('SET_TIP', { tip })
    },
    sendAsset: (account: Account): AsyncAction<string | null | undefined> => {
      return async (dispatch, getState) => {
        const sendTx = getState().senderTransaction

        try {
          return await blockchainServices[account.blockchain].sendTransaction(sendTx)
        } catch {
          throw new Error('Transaction has failed')
        }
      }
    },
  }
}

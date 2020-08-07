import {ReducerWrapper} from '@simpli/redux-wrapper'
import {plainToClass} from 'class-transformer'

import {Config} from '~src/app/Config'
import {Facade} from '~src/app/Facade'
import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {NeonHelper} from '~src/helpers/NeonHelper'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {AccountDispatcher} from '~src/store/senderTransaction/dispatchers/AccountDispatcher'
import {ClearStateDispatcher} from '~src/store/senderTransaction/dispatchers/ClearStateDispatcher'
import {FeeAmountDispatcher} from '~src/store/senderTransaction/dispatchers/FeeAmountDispatcher'
import {ReceiverAddressDispatcher} from '~src/store/senderTransaction/dispatchers/ReceiverAddressDispatcher'
import {TokenDispatcher} from '~src/store/senderTransaction/dispatchers/TokenDispatcher'

export class SendTransactionReducer extends ReducerWrapper<
  SenderTransactionActionsType,
  SenderTransactionState,
  SenderTransactionAction
> {
  protected readonly initialState = Model.parse<SenderTransactionState>(
    SenderTransaction
  )

  protected readonly dispatchers = [
    AccountDispatcher,
    FeeAmountDispatcher,
    ReceiverAddressDispatcher,
    TokenDispatcher,
    ClearStateDispatcher,
  ]

  readonly actions = {
    setAccount: (account: Account) => {
      return this.commit('SET_ACCOUNT', {account})
    },
    setReceiverAddress: (receiverAddress: string) => {
      return this.commit('SET_RECEIVER_ADDRESS', {receiverAddress})
    },
    setToken: (token: TokenAsset) => {
      return this.commit('SET_TOKEN', {token})
    },
    setFeeAmount: (feeAmount: number | null) => {
      return this.commit('SET_FEE_AMOUNT', {feeAmount})
    },
    clearState: () => {
      return this.commit('CLEAR_STATE', {})
    },
    sendAsset: (): AsyncAction<string | null> => {
      return async (dispatch, getState) => {
        const sendTx = getState().senderTransaction

        const {account, token, receiverAddress, feeAmount} = sendTx
        const fees = feeAmount ?? undefined

        if (!account) throw new Error('Account not defined')
        if (!token) throw new Error('Token not defined')
        if (!receiverAddress) throw new Error('Receiver account not defined')

        const {symbol, amount} = token
        const nativeAssets = Config.application.assets.split(',')

        if (nativeAssets.includes(symbol)) {
          const assets = symbol as 'GAS' | 'NEO'

          return await NeonHelper.sendNativeAsset(
            account,
            receiverAddress,
            assets,
            amount,
            fees
          )
        }

        return await NeonHelper.sendNep5Asset(
          account,
          receiverAddress,
          token,
          fees
        )
      }
    },
    saveToHistory: (
      transactionHash: string
    ): AsyncAction<SenderTransaction> => {
      return async (dispatch, getState) => {
        const pendingTransactions =
          (await Storage.pendingTransactions.load()) ?? []

        const senderTransaction = plainToClass(
          SenderTransaction,
          getState().senderTransaction
        )
        senderTransaction.sentAt = Facade.moment().format()
        senderTransaction.transactionHash = transactionHash

        pendingTransactions.push(senderTransaction)

        await Storage.pendingTransactions.save(pendingTransactions)

        return senderTransaction
      }
    },
  }
}

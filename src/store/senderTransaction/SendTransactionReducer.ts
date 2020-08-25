import {ReducerWrapper} from '@simpli/redux-wrapper'
import {plainToClass} from 'class-transformer'

import {Config} from '~src/app/Config'
import {Facade} from '~src/app/Facade'
import {Model} from '~src/app/Model'
import {Storage} from '~src/app/Storage'
import {NeonHelper} from '~src/helpers/NeonHelper'
import {PriorityFee} from '~src/models/PriorityFee'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {ClearStateDispatcher} from '~src/store/senderTransaction/dispatchers/ClearStateDispatcher'
import {FeeAmountDispatcher} from '~src/store/senderTransaction/dispatchers/FeeAmountDispatcher'
import {ReceiverAddressDispatcher} from '~src/store/senderTransaction/dispatchers/ReceiverAddressDispatcher'
import {SenderAddressDispatcher} from '~src/store/senderTransaction/dispatchers/SenderAddressDispatcher'
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
    SenderAddressDispatcher,
    FeeAmountDispatcher,
    ReceiverAddressDispatcher,
    TokenDispatcher,
    ClearStateDispatcher,
  ]

  readonly actions = {
    setToken: (token: TokenAsset) => {
      return this.commit('SET_TOKEN', {token})
    },
    setSenderAddress: (senderAddress: string) => {
      return this.commit('SET_SENDER_ADDRESS', {senderAddress})
    },
    setReceiverAddress: (receiverAddress: string) => {
      return this.commit('SET_RECEIVER_ADDRESS', {receiverAddress})
    },
    setFeeAmount: (feeAmount: PriorityFee) => {
      return this.commit('SET_FEE_AMOUNT', {feeAmount})
    },
    clearState: () => {
      return this.commit('CLEAR_STATE', {})
    },
    sendAsset: (): AsyncAction<string | null> => {
      return async (dispatch, getState) => {
        const sendTx = getState().senderTransaction

        const {token, senderAddress, receiverAddress, feeAmount} = sendTx
        const fees = feeAmount

        if (!token) throw new Error('Token not defined')
        if (!senderAddress) throw new Error('Sender address not defined')
        if (!receiverAddress) throw new Error('Receiver address not defined')

        const {symbol, amount} = token
        const nativeAssets = Config.application.assets.split(',')

        if (nativeAssets.includes(symbol)) {
          const assets = symbol as 'GAS' | 'NEO'

          return await NeonHelper.sendNativeAsset(
            senderAddress,
            receiverAddress,
            assets,
            amount,
            fees?.fee
          )
        }

        return await NeonHelper.sendNep5Asset(
          senderAddress,
          receiverAddress,
          token,
          fees?.fee
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
        senderTransaction.isPending = true

        pendingTransactions.push(senderTransaction)

        await Storage.pendingTransactions.save(pendingTransactions)

        return senderTransaction
      }
    },
    removeFromHistory: (
      transactionHash: string
    ): AsyncAction<SenderTransaction | null> => {
      return async (dispatch, getState) => {
        const pendingTransactions =
          (await Storage.pendingTransactions.load()) ?? []

        const index = pendingTransactions.findIndex(
          (it) => it.transactionHash === transactionHash
        )
        if (index >= 0) {
          pendingTransactions.splice(index, 1)

          await Storage.pendingTransactions.save(pendingTransactions)

          return pendingTransactions[index] ?? null
        }

        return null
      }
    },
  }
}

import {ReducerWrapper} from '@simpli/redux-wrapper'

import {Config} from '~src/app/Config'
import {Model} from '~src/app/Model'
import {NeonHelper} from '~src/helpers/NeonHelper'
import {PriorityFee} from '~src/models/PriorityFee'
import {TokenAsset} from '~src/models/TokenAsset'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {ClearStateDispatcher} from '~src/store/senderTransaction/dispatchers/ClearStateDispatcher'
import {FeeAmountDispatcher} from '~src/store/senderTransaction/dispatchers/FeeAmountDispatcher'
import {FiatDispatcher} from '~src/store/senderTransaction/dispatchers/FiatDispatcher'
import {ReceiverAddressDispatcher} from '~src/store/senderTransaction/dispatchers/ReceiverAddressDispatcher'
import {SenderAddressDispatcher} from '~src/store/senderTransaction/dispatchers/SenderAddressDispatcher'
import {TipDispatcher} from '~src/store/senderTransaction/dispatchers/TipDispatcher'
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
    FiatDispatcher,
    TipDispatcher,
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
    setFiat: (fiat: number) => {
      return this.commit('SET_FIAT', {fiat})
    },
    clearState: () => {
      return this.commit('CLEAR_STATE_SENDER_TRANSACTION', {})
    },
    setTip: (tip: {amount: number; address: string} | undefined) => {
      return this.commit('SET_TIP', {tip})
    },
    sendAsset: (): AsyncAction<string | null> => {
      return async (dispatch, getState) => {
        const sendTx = getState().senderTransaction

        const {token, senderAddress, receiverAddress, feeAmount, tip} = sendTx
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
            fees?.fee,
            tip ? tip.amount : undefined,
            tip ? tip.address : undefined
          )
        }

        return await NeonHelper.sendNep5Asset(
          senderAddress,
          receiverAddress,
          token,
          fees?.fee,
          tip ? tip.amount : undefined,
          tip ? tip.address : undefined
        )
      }
    },
    getHash: (): AsyncAction<string | undefined> => {
      return async (dispatch, getState) => {
        const sendTx = getState().senderTransaction
          
        const {token, senderAddress, receiverAddress, feeAmount} = sendTx
        const fees = feeAmount

        if (!token) throw new Error('Token not defined')
        if (!senderAddress) throw new Error('Sender address not defined')
        if (!receiverAddress) throw new Error('Receiver address not defined')

        const {symbol, amount} = token

        return await NeonHelper.getHash(senderAddress, symbol,amount,receiverAddress, fees?.fee)
      }
    },
  }
}

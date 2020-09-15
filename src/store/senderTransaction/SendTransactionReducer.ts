import {ReducerWrapper} from '@simpli/redux-wrapper'

import {Config} from '~src/app/Config'
import {Model} from '~src/app/Model'
import {NeonHelper} from '~src/helpers/NeonHelper'
import {PriorityFee} from '~src/models/PriorityFee'
import {TokenAsset} from '~src/models/TokenAsset'
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
  }
}

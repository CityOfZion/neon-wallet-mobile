import i18n from 'i18n-js'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Normalize } from '~/src/app/Normalize'
import { blockchainServices } from '~/src/blockchain'
import { TokenHelper } from '~/src/helpers/TokenHelper'
import { Token } from '~/src/models/Token'
import { Account } from '~/src/models/redux/Account'
import { RootState } from '~/src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'
import { TokenBalance } from '~/src/types/query'

type Props = {
  ratio?: number
  amount?: number
  tip?: number
  fee?: number
  token?: Token
  account: Account
  destinationAddress?: string
  destinationAddressIsValid?: boolean
  onFeeChange(fee?: number): void
  onRequest(isRequesting: boolean): void
  feeTokenBalance?: TokenBalance
}

export const TotalFee = ({
  amount,
  ratio,
  tip,
  fee,
  token,
  account,
  destinationAddress,
  destinationAddressIsValid,
  onFeeChange,
  onRequest,
  feeTokenBalance,
}: Props) => {
  const currency = useSelector((state: RootState) => state.settings.currency)

  const fiatFee = useMemo(() => {
    if (!fee || !ratio) {
      return
    }

    return ratio * fee
  }, [fee, token, account, currency])

  const isInsuficientFunds = useMemo(() => {
    if (!token || !amount || amount <= 0 || !fee || !feeTokenBalance) return

    let calculatedFee = feeTokenBalance.amount - fee

    if (token.symbol === feeTokenBalance.symbol) {
      calculatedFee -= amount
    }

    if (calculatedFee <= 0) {
      return true
    }

    return false
  }, [fee, account, token, amount])

  const calculateFee = useCallback(async () => {
    const { address: senderAddress } = account

    if (!destinationAddressIsValid || !destinationAddress || !senderAddress || !token || !amount) {
      onFeeChange(undefined)
      return
    }

    onRequest(true)

    const calculatedFee = await blockchainServices[account.blockchain].calculateTransferFee({
      receiverAddress: destinationAddress,
      senderAddress,
      amount,
      tokenHash: token.hash,
      tokenDecimals: token.decimals,
      tip,
    })

    onRequest(false)
    onFeeChange(calculatedFee)
  }, [destinationAddressIsValid, destinationAddress, account, token, amount, tip])

  useEffect(() => {
    calculateFee()
  }, [calculateFee])

  return (
    <LinearLayout>
      <LinearLayout justifyContent="space-between" orientation="horiz" mt={30} mb={20}>
        <TextView fontWeight={700} color="text.0" fontFamily="bold" fontSize="14px">
          {i18n.t('modals.sendTransactionModal.totalFee')}
        </TextView>

        {isInsuficientFunds && (
          <LinearLayout orientation="horiz">
            <ImageView
              width={Normalize.scale(14)}
              height={Normalize.scale(14)}
              source={require('~/src/assets/images/icon-alert-purple.png')}
              mr={2}
            />
            <TextView fontFamily="bold" fontSize="13px" color="quinary">
              {i18n.t('modals.sendTransactionModal.insufficientGas')}
            </TextView>
          </LinearLayout>
        )}
      </LinearLayout>

      <LinearLayout
        borderRadius={4}
        orientation="horiz"
        backgroundColor="background.1"
        justifyContent="space-around"
        paddingY="8px"
      >
        <LinearLayout width="48%" orientation="horiz" alignItems="center">
          <LinearLayout orientation="horiz" paddingX="8px">
            <ImageView
              mr={4}
              mt={1}
              width={Normalize.scale(19)}
              height={Normalize.scale(21)}
              resizeMode="contain"
              source={TokenHelper.getIcon(blockchainServices[account.blockchain].feeToken.token, account.blockchain)}
            />
            <TextView color="text.0" fontFamily="semibold" fontSize="18px">
              {fee ? fee.toFixed(8) : 0}
            </TextView>
          </LinearLayout>
        </LinearLayout>

        <LinearLayout backgroundColor="text.3" height={50} width="1px" />

        <LinearLayout width="48%" orientation="horiz" alignItems="center">
          <LinearLayout orientation="horiz" paddingX="8px">
            <TextView color="primary" fontFamily="bold" fontSize="18px">
              {currency}
            </TextView>
            <TextView color="text.0" fontFamily="semibold" fontSize="18px" pl={3}>
              {fiatFee ? fiatFee.toFixed(2) : 0}
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
}

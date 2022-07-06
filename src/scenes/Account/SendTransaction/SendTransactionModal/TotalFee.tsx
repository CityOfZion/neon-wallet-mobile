import i18n from 'i18n-js'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Normalize } from '~/src/app/Normalize'
import { blockchainServices } from '~/src/blockchain'
import { useExchange } from '~/src/hooks/useExchange'
import { TokenAsset } from '~/src/models/TokenAsset'
import { Account } from '~/src/models/redux/Account'
import { RootState } from '~/src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'

type Props = {
  amount?: number
  tip?: number
  fee?: number
  token?: TokenAsset
  account: Account
  destinationAddress?: string
  destinationAddressIsValid?: boolean
  onFeeChange(fee?: number): void
  onRequest(isRequesting: boolean): void
}

export const TotalFee = ({
  amount,
  tip,
  fee,
  token,
  account,
  destinationAddress,
  destinationAddressIsValid,
  onFeeChange,
  onRequest,
}: Props) => {
  const currency = useSelector((state: RootState) => state.settings.currency)
  const { exchange } = useExchange({ filter: { currencies: currency } })

  const fiatFee = useMemo(() => {
    if (!token || !fee || !exchange) {
      return
    }

    const ratio = exchange[token.symbol]?.to[currency]

    return ratio * fee
  }, [fee, token, account, currency])

  const isInsuficientFunds = useMemo(() => {
    if (!token || !amount || amount <= 0 || !fee) {
      return
    }

    const feeToken = account.tokenAssets.find(
      token => token.symbol === blockchainServices[account.blockchain].feeToken.token
    )

    if (!feeToken) {
      return false
    }

    let calculatedFee = feeToken.amount - fee

    if (token.symbol === feeToken.symbol) {
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
              source={blockchainServices[account.blockchain].feeToken.img}
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
              {fiatFee ? fiatFee.toFixed(2) : 0} {/** TODO set SkeletonContainer */}
            </TextView>
          </LinearLayout>
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
}

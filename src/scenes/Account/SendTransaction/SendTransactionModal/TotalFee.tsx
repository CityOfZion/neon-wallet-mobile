import { Token, isCalculableFee } from '@cityofzion/blockchain-service'
import i18n from 'i18n-js'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Normalize } from '~/src/app/Normalize'
import { TokenIcon } from '~/src/components/TokenIcon'
import { blockchainConfig } from '~/src/config/BlockchainConfig'
import { RootState } from '~/src/store/RootStore'
import { Account } from '~/src/store/account/Account'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'
import { TokenBalance } from '~/src/types/query'

type Props = {
  ratio?: number
  amount?: string
  tip?: string
  fee?: string
  token?: Token
  account: Account
  destinationAddress?: string
  destinationAddressIsValid?: boolean
  onFeeChange(fee?: string): void
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
  const blockchainService = useSelector(
    (state: RootState) => state.blockchain.bsAggregator.blockchainServicesByName[account.blockchain]
  )
  const currency = useSelector((state: RootState) => state.settings.currency)

  const fiatFee = useMemo(() => {
    if (!fee || !ratio) {
      return
    }

    return ratio * Number(fee)
  }, [fee, token, account, currency])

  const isInsuficientFunds = useMemo(() => {
    const amountNumber = parseFloat(amount ?? '0')
    if (!token || !amount || amountNumber <= 0 || !fee || !feeTokenBalance) return

    let calculatedFee = feeTokenBalance.amountNumber - Number(fee)

    if (token.symbol === feeTokenBalance.token.symbol) {
      calculatedFee -= amountNumber
    }

    if (calculatedFee <= 0) {
      return true
    }

    return false
  }, [fee, account, token, amount])

  const calculateFee = useCallback(async () => {
    const senderKey = await account.getKey()
    if (
      !destinationAddressIsValid ||
      !destinationAddress ||
      !senderKey ||
      !token ||
      !amount ||
      !isCalculableFee(blockchainService)
    ) {
      onFeeChange(undefined)
      return
    }

    onRequest(true)

    const tipConfig = blockchainConfig.mainnetTipByBlockchain[account.blockchain]

    const calculatedFee = await blockchainService.calculateTransferFee({
      tipIntent:
        tipConfig && tip
          ? {
              amount: tip,
              receiverAddress: tipConfig.address,
              tokenHash: tipConfig.token.hash,
              tokenDecimals: tipConfig.token.decimals,
            }
          : undefined,
      senderAccount: {
        address: account.address,
        key: senderKey,
        type: 'wif',
      },
      intent: {
        amount,
        receiverAddress: destinationAddress,
        tokenHash: token.hash,
        tokenDecimals: token.decimals,
      },
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
          <LinearLayout orientation="horiz" paddingX="8px" flexGrow={1} flexShrink={1}>
            <TokenIcon
              marginRight={4}
              marginTop={1}
              width={20}
              height={20}
              resizeMode="contain"
              blockchain={account.blockchain}
              symbol={blockchainService.feeToken.symbol}
              hash={blockchainService.feeToken.hash}
            />
            <TextView color="text.0" fontFamily="semibold" fontSize="18px" flexGrow={1} flexShrink={1}>
              {fee ?? 0}
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

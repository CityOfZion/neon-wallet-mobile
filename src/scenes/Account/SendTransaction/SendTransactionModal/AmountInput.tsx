import i18n from 'i18n-js'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import InputLabel from '~/src/components/InputLabel'
import InputWithValidation from '~/src/components/InputWithValidation'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { useTokens } from '~/src/hooks/useTokens'
import { Token } from '~/src/models/Token'
import { Account } from '~/src/models/redux/Account'
import { RootState } from '~/src/store/RootStore'
import { ButtonView, ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'
import { TokenBalance } from '~/src/types/query'

type Props = {
  account: Account
  token?: Token
  tokenBalance?: TokenBalance
  amount?: string
  fiat?: string
  ratio?: number
  onAmountChange(amount?: string): void
  onFiatChange(fiat?: string): void
  onAmountValidation(isValid: boolean): void
  feeTokenBalance?: TokenBalance
  fee?: number
}

export const AmountInput = ({
  account,
  token,
  tokenBalance,
  amount,
  onAmountChange,
  onAmountValidation,
  onFiatChange,
  fiat,
  ratio,
  feeTokenBalance,
  fee
}: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)
  const { getTokenBySymbol } = useTokens({ blockchain: account.blockchain })

  const supportedToken = useMemo(() => {
    if (!token) return

    return getTokenBySymbol(token.symbol)
  }, [getTokenBySymbol, token])

  const [remaining, setRemaining] = useState<number>()

  const handleValidateAmount = (text: string) => {
    if (text.length <= 0 || Number(text) <= 0 || !token || !tokenBalance) {
      onAmountValidation(false)
      return false
    }

    const isValid = tokenBalance.amount >= Number(text)

    onAmountValidation(isValid)

    return isValid
  }

  const handleChangeAmount = (text: string) => {
    if (!token) return

    if (text.length <= 0) {
      onAmountChange()
      onFiatChange()
      return
    }

    let formattedAmount = text
      .replace(/,|\.\.|\.,/g, '.')
      .replace(/\s|-/g, '')
      .replace(/[0-9]+\.[0-9]{9,}$/g, Number(text).toFixed(supportedToken?.decimals ?? 8))

    if (supportedToken && supportedToken.decimals < 1) {
      formattedAmount = formattedAmount.replace('.', '')
    }

    onAmountChange(formattedAmount)

    if (!ratio) return

    let newFiat = String(ratio * Number(formattedAmount)).replace(/[\d.]+e-[0-9]+/g, '0')
    
    newFiat = newFiat.replace(/[0-9]+\.[0-9]{3,}$/g, Number(newFiat).toFixed(2))

    onFiatChange(newFiat)
  }

  const handleValidateFiat = (text: string) => {
    if (!token || text.length <= 0 || Number(text) <= 0 || !tokenBalance || !ratio || !amount) return false
    if(tokenBalance.symbol === feeTokenBalance?.symbol){
      if(!fee) return false
      return Number(text) + (fee * ratio) <= (tokenBalance.amount * ratio)
    }
    return Number(text) <= (tokenBalance.amount * ratio)
  }

  const handleChangeFiat = (text: string) => {
    if (!supportedToken) return

    if (text.length <= 0) {
      onAmountChange()
      onFiatChange()
      return
    }

    const formattedFiat = text
      .replace(/,|\.\.|\.,/g, '.')
      .replace(/\s|-/g, '')
      .replace(/[0-9]+\.[0-9]{3,}$/g, Number(text).toFixed(2))

    onFiatChange(formattedFiat)

    if (!ratio) return

    let newAmount = String(Number(formattedFiat) / ratio)
    newAmount = newAmount.replace(/[0-9]+\.[0-9]{9,}$/g, Number(newAmount).toFixed(supportedToken.decimals))

    onAmountChange(newAmount)
  }

  const handlePressRoundButton = () => {
    if (!fiat || fiat.length <= 0 || Number(fiat) <= 1) {
      return
    }

    handleChangeFiat(String(Math.floor(Number(fiat))))
  }

  const handlePressMaxButton = () => {
    if (!token || !tokenBalance) return

    handleChangeAmount(String(tokenBalance.amount))
  }

  useEffect(() => {
    if (!token || !tokenBalance) {
      setRemaining(undefined)
      return
    }

    const remaining = tokenBalance.amount - (amount ? Number(amount) : 0)

    setRemaining(remaining > 0 ? remaining : undefined)
  }, [amount, token])

  return (
    <>
      <LinearLayout orientation="horiz" justifyContent="space-between" mt={30} mb={20}>
        <InputLabel title={i18n.t('modals.sendTransactionModal.amount')} color="text.0" capitalize />

        <LinearLayout orientation="horiz" alignItems="center">
          <TextView mr="6px" color="text.10">
            {i18n.t('modals.sendTransactionModal.totalAfterTransaction')}
          </TextView>
          <TextView color="text.0" fontFamily="bold" fontSize="16px">
            {remaining ? FilterHelper.decimal(remaining, language) : '-'}
          </TextView>
          <ButtonView ml="6px" onPress={handlePressMaxButton} disabled={!token}>
            <TextView color="primary" fontSize="15px" fontFamily="medium">
              {i18n.t('modals.sendTransactionModal.max')}
            </TextView>
          </ButtonView>
        </LinearLayout>
      </LinearLayout>

      <LinearLayout orientation="horiz" justifyContent="space-between">
        <LinearLayout width="50%">
          <InputWithValidation
            onChangeText={handleChangeAmount}
            color={theme.colors.text[0]}
            invalidColor={theme.colors.text[10]}
            invalidMessageColor={theme.colors.quinary}
            value={amount ?? ''}
            placeholder={i18n.t('modals.sendTransactionModal.enterValue', {
              value: token ? token.symbol : 'Token',
            })}
            validator={handleValidateAmount}
            invalidMessage={i18n.t('modals.sendTransactionModal.insufficientFunds')}
            separatorColor={theme.colors.background[13]}
            sideMargins={0}
            hidePaste
            hideScan
            keyboardType="numeric"
            editable={!!token}
          />
        </LinearLayout>

        <LinearLayout width="45%">
          <LinearLayout orientation="horiz">
            <TextView color="white" fontSize="16px" fontFamily="medium" alignSelf="center" mr={4}>
              {`${currency}:`}
            </TextView>
            <InputWithValidation
              onChangeText={handleChangeFiat}
              color={theme.colors.text[0]}
              invalidColor={theme.colors.text[10]}
              invalidMessageColor={theme.colors.quinary}
              value={fiat ?? ''}
              placeholder={i18n.t('modals.sendTransactionModal.enterValue', {
                value: currency,
              })}
              validator={handleValidateFiat}
              invalidMessage={i18n.t('modals.sendTransactionModal.insufficientFunds')}
              separatorColor={theme.colors.background[13]}
              sideMargins={0}
              hidePaste
              hideScan
              keyboardType="numeric"
              editable={!!supportedToken?.decimals}
            />
          </LinearLayout>
          <ButtonView alignSelf="flex-end" onPress={handlePressRoundButton} disabled={!supportedToken?.decimals} mt={3}>
            <LinearLayout orientation="horiz">
              <ImageView
                mr={3}
                alignSelf="center"
                source={require('~src/assets/images/round-down-arrows.png')}
                resizeMode="contain"
              />
              <TextView color="primary" fontSize="15px" fontFamily="medium" mb="2">
                {i18n.t('modals.sendTransactionModal.roundDown')}
              </TextView>
            </LinearLayout>
          </ButtonView>
        </LinearLayout>
      </LinearLayout>
    </>
  )
}

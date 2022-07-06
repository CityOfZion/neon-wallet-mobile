import i18n from 'i18n-js'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import InputLabel from '~/src/components/InputLabel'
import InputWithValidation from '~/src/components/InputWithValidation'
import { FilterHelper } from '~/src/helpers/FilterHelper'
import { useExchange } from '~/src/hooks/useExchange';
import { TokenAsset } from '~/src/models/TokenAsset';
import { Account } from '~/src/models/redux/Account';
import { RootState } from '~/src/store/RootStore';
import { ButtonView, ImageView, LinearLayout, TextView } from '~/src/styles/styled-components';

type Props = {
  selectedToken?: TokenAsset
  amount?: string
  fiat?: string
  account: Account
  onAmountChange(amount?: string): void
  onFiatChange(fiat?: string): void
  onAmountValidation(isValid: boolean): void
}

export const AmountInput = ({
  selectedToken,
  account,
  amount,
  onAmountChange,
  onAmountValidation,
  onFiatChange,
  fiat,
}: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const currency = useSelector((state: RootState) => state.settings.currency)
  const { exchange } = useExchange({ filter: { currencies: currency } })
  const tokens = useSelector((state: RootState) => state.app.tokens)
  const language = useSelector((state: RootState) => state.settings.language)

  const [remaining, setRemaining] = useState<number>()

  const tokenDecimals = useMemo(() => {
    if (!selectedToken) {
      return
    }

    const findedToken = tokens.find(
      token => token.symbol === selectedToken.symbol && token.blockchain === account.blockchain
    )

    if (!findedToken) {
      return
    }
    return findedToken.decimals ?? undefined
  }, [selectedToken, tokens])

  const handleValidateAmount = (text: string) => {
    if (text.length <= 0 || Number(text) <= 0 || !selectedToken) {
      onAmountValidation(false)
      return false
    }

    const accountBalance = account.getBalanceAmountByAsset(selectedToken.symbol)

    if (!accountBalance) {
      onAmountValidation(false)
      return false
    }

    const isValid = accountBalance >= Number(text)

    onAmountValidation(isValid)

    return isValid
  }

  const handleChangeAmount = (text: string) => {
    if (!selectedToken) {
      return
    }

    if (text.length <= 0) {
      onAmountChange()
      onFiatChange()
      return
    }

    let formattedAmount = text
      .replace(/,|\.\.|\.,/g, '.')
      .replace(/\s|-/g, '')
      .replace(/[0-9]+\.[0-9]{9,}$/g, Number(text).toFixed(tokenDecimals ?? 8))

    if (tokenDecimals && tokenDecimals < 1) {
      formattedAmount = formattedAmount.replace('.', '')
    }

    onAmountChange(formattedAmount)

    if (tokenDecimals === undefined || !exchange) {
      return
    }

    const ratio = exchange[selectedToken.symbol]?.to[currency]

    if (!ratio) {
      return
    }

    let newFiat = String(ratio * Number(formattedAmount)).replace(/[\d.]+e-[0-9]+/g, '0')

    newFiat = newFiat.replace(/[0-9]+\.[0-9]{3,}$/g, Number(newFiat).toFixed(2))

    onFiatChange(newFiat)
  }

  const handleValidateFiat = (text: string) => {
    if (!selectedToken || text.length <= 0 || Number(text) <= 0 || !exchange) {
      return false
    }

    const ratio = exchange[selectedToken.symbol]?.to[currency]

    if (!ratio) {
      return false
    }

    const accountBalance = account.getBalanceAmountByAsset(selectedToken.symbol)

    if (!accountBalance) {
      return false
    }

    return accountBalance * ratio > Number(text)
  }

  const handleChangeFiat = (text: string) => {
    if (!selectedToken) {
      return
    }

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

    if (!exchange) {
      return
    }

    const ratio = exchange[selectedToken.symbol]?.to[currency]

    if (!ratio) {
      return
    }

    let newAmount = String(Number(formattedFiat) / ratio)
    newAmount = newAmount.replace(/[0-9]+\.[0-9]{9,}$/g, Number(newAmount).toFixed(selectedToken.decimals ?? 8))

    onAmountChange(newAmount)
  }

  const handlePressRoundButton = () => {
    if (!fiat || fiat.length <= 0 || Number(fiat) <= 1) {
      return
    }

    handleChangeFiat(String(Math.floor(Number(fiat))))
  }

  const handlePressMaxButton = () => {
    if (!selectedToken) {
      return
    }

    const accountBalance = account.getBalanceAmountByAsset(selectedToken.symbol)

    if (!accountBalance) {
      return
    }

    handleChangeAmount(String(accountBalance))
  }

  useEffect(() => {
    if (!selectedToken) {
      setRemaining(undefined)
      return
    }

    const accountBalance = account.getBalanceAmountByAsset(selectedToken.symbol)

    if (!accountBalance) {
      setRemaining(undefined)
      return
    }

    const remaining = accountBalance - (amount ? Number(amount) : 0)

    setRemaining(remaining > 0 ? remaining : undefined)
  }, [amount, account, selectedToken])

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
          <ButtonView ml="6px" onPress={handlePressMaxButton} disabled={!selectedToken}>
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
              value: selectedToken ? selectedToken.symbol : 'Token',
            })}
            validator={handleValidateAmount}
            invalidMessage={i18n.t('modals.sendTransactionModal.insufficientFunds')}
            separatorColor={theme.colors.background[13]}
            sideMargins={0}
            hidePaste
            hideScan
            keyboardType="numeric"
            editable={!!selectedToken}
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
              editable={!!tokenDecimals}
            />
          </LinearLayout>
          <ButtonView alignSelf="flex-end" onPress={handlePressRoundButton} disabled={!tokenDecimals} mt={3}>
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

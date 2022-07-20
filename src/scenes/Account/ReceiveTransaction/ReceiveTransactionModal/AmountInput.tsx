import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import InputLabel from '~/src/components/InputLabel'
import InputWithValidation from '~/src/components/InputWithValidation'
import { useTokens } from '~/src/hooks/useTokens'
import { Token } from '~/src/models/Token'
import { Account } from '~/src/models/redux/Account'
import { RootState } from '~/src/store/RootStore'

interface Props {
  amount?: string
  token?: Token
  account: Account
  onChange: (amount?: string) => void
}

export const AmountInput = ({ onChange, amount, token, account }: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const { getTokenBySymbol } = useTokens({ blockchain: account.blockchain })

  const supportedToken = useMemo(() => {
    if (!token) return

    return getTokenBySymbol(token.symbol)
  }, [getTokenBySymbol, token])

  const handleChange = (text: string) => {
    if (text.length <= 0) {
      onChange()
      return
    }

    let formattedAmount = text
      .replace(/,|\.\.|\.,/g, '.')
      .replace(/\s|-/g, '')
      .replace(/[0-9]+\.[0-9]{9,}$/g, Number(text).toFixed(supportedToken?.decimals ?? 8))

    if (supportedToken && supportedToken.decimals < 1) {
      formattedAmount = formattedAmount.replace('.', '')
    }

    onChange(formattedAmount)
  }

  return (
    <>
      <InputLabel
        title={i18n.t('modals.receiveTransactionModal.amount')}
        color="text.0"
        marginTop={42}
        marginBottom={20}
        capitalize
      />

      <InputWithValidation
        onChangeText={handleChange}
        color={theme.colors.text[0]}
        invalidColor={theme.colors.text[10]}
        fontStyle="normal"
        value={amount ?? ''}
        placeholder={i18n.t('modals.receiveTransactionModal.enterAmount')}
        validator={() => true}
        separatorColor={theme.colors.background[13]}
        sideMargins={0}
        hidePaste
        hideScan
        keyboardType="numeric"
      />
    </>
  )
}

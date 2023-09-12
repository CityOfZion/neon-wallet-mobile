import { Token } from '@cityofzion/blockchain-service'
import i18n from 'i18n-js'
import React from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import InputLabel from '~/src/components/InputLabel'
import InputWithValidation from '~/src/components/InputWithValidation'
import { RootState } from '~/src/store/RootStore'
import { Account } from '~/src/store/account/Account'

interface Props {
  amount?: string
  token?: Token
  account: Account
  onChange: (amount?: string) => void
}

export const AmountInput = ({ onChange, amount, token, account }: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const handleChange = (text: string) => {
    if (!token) return

    if (text.length <= 0) {
      onChange()
      return
    }

    let formattedAmount = text
      .replace(/,|\.\.|\.,/g, '.')
      .replace(/\s|-/g, '')
      .replace(/[0-9]+\.[0-9]{9,}$/g, Number(text).toFixed(token.decimals))

    if (token.decimals < 1) {
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

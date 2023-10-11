import { TSession, TSessionRequest } from '@cityofzion/wallet-connect-sdk-wallet-react'
import i18n from 'i18n-js'
import React, { useCallback, useEffect, useState } from 'react'

import { WalletConnectNeonAdapter } from '~/src/libs/WalletConnectNeonAdapter'
import { LinearLayout, TextView } from '~/src/styles/styled-components'

type TransactionFeeProps = {
  request: TSessionRequest
  session: TSession
}

export const TransactionFee = ({ request, session }: TransactionFeeProps) => {
  const [feeRequest, setFeeRequest] = useState<number>()

  const handleCalculateFee = useCallback(async () => {
    const adapter = new WalletConnectNeonAdapter()
    const { total } = await adapter.calculateFee({ request, session })

    setFeeRequest(total)
  }, [request, session])

  useEffect(() => {
    handleCalculateFee()
  }, [handleCalculateFee])

  return (
    <LinearLayout
      bg="background.1"
      orientation="horiz"
      borderRadius={6}
      mb="13px"
      pt="13px"
      pb="13px"
      justifyContent="space-between"
    >
      <TextView color="text.10" weight={2} fontFamily="bold" fontSize={14} pl="18px">
        {i18n.t('modals.transactionRequest.transactionFee')}
      </TextView>
      <LinearLayout orientation="horiz">
        <TextView color="primary" alignSelf="flex-end" pb="3px" fontSize="16px" fontFamily="bold" pr="20px">
          {i18n.t('modals.transactionRequest.xGas', {
            amount: feeRequest ? (feeRequest / 8).toFixed(8) : '',
          })}
        </TextView>
      </LinearLayout>
    </LinearLayout>
  )
}

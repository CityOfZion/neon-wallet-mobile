import i18n from 'i18n-js'
import React from 'react'
import { useSelector } from 'react-redux'

import { TransactionRequestBase } from '../TransactionRequestBase'
import { TransactionRequestMethodComponentProps } from '../WCTransactionRequestModal'
import { EncryptFailed } from './EncryptFailed'
import { EncryptSuccess } from './EncryptSuccess'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { RootState } from '~/src/store/RootStore'
import { LinearLayout, TextView } from '~/src/styles/styled-components'

export const EncryptTransactionRequest = ({ request, session, account }: TransactionRequestMethodComponentProps) => {
  const message = request.params.request.params[0] as string
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  return (
    <TransactionRequestBase
      acceptButtonLabel={i18n.t('modals.encrypt.button.accept')}
      rejectButtonLabel={i18n.t('modals.transactionRequest.buttom.decline')}
      title={i18n.t('modals.encrypt.title', {
        dAppName: session.peer.metadata.name,
      })}
      hideDappName
      request={request}
      session={session}
      account={account}
      successElement={EncryptSuccess}
      failedElement={EncryptFailed}
    >
      <LinearLayout orientation="verti" alignItems="center">
        <TextView
          color={theme.colors.text[6]}
          fontSize={14}
          fontWeight={500}
          fontFamily="medium"
          textAlign="center"
          mb={4}
          borderRadius={5}
        >
          {i18n.t('modals.encrypt.labelMessage')}
        </TextView>
        <TextView
          color={theme.colors.text[0]}
          fontSize={16}
          fontWeight={300}
          lineHeight="20px"
          fontFamily="light"
          width="90%"
          minHeight="73px"
          bg={theme.colors.background[7]}
          px={5}
          py={2}
          mb="auto"
          borderRadius={5}
        >
          {message}
        </TextView>
      </LinearLayout>
    </TransactionRequestBase>
  )
}

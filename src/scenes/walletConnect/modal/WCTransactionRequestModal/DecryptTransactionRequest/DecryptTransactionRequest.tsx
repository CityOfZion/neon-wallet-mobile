import i18n from 'i18n-js'
import React from 'react'
import { useSelector } from 'react-redux'

import { DecryptPayload, TDecryptPayload } from '../../../components/DecryptPayload'
import { TransactionRequestBase } from '../TransactionRequestBase'
import { TransactionRequestMethodComponentProps } from '../WCTransactionRequestModal'
import { DecryptFailed } from './DecryptFailed'
import { DecryptSuccess } from './DecryptSuccess'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { RootState } from '~/src/store/RootStore'
import { LinearLayout, TextView } from '~/src/styles/styled-components'

export const DecryptTransactionRequest = ({ request, session, account }: TransactionRequestMethodComponentProps) => {
  const payload = request.params.request.params[0] as TDecryptPayload
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  return (
    <TransactionRequestBase
      acceptButtonLabel={i18n.t('modals.decrypt.button.accept')}
      rejectButtonLabel={i18n.t('modals.transactionRequest.buttom.decline')}
      title={i18n.t('modals.decrypt.title', {
        dAppName: session.peer.metadata.name,
      })}
      hideDappName
      request={request}
      session={session}
      account={account}
      successElement={DecryptSuccess}
      failedElement={DecryptFailed}
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
          {i18n.t('modals.decrypt.labelMessage')}
        </TextView>
        <DecryptPayload {...payload} />
      </LinearLayout>
    </TransactionRequestBase>
  )
}

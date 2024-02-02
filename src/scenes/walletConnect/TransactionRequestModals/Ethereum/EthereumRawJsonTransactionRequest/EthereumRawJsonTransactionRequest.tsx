import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'

import { TransactionRequestBase } from '../../../TransactionRequestBase'
import { TransactionRequestMethodComponentProps } from '../../../WCTransactionRequestModal'
import { EthereumRawJsonTransactionRequestFailed } from './EthereumRawJsonTransactionRequestFailed'
import { EthereumRawJsonTransactionRequestSuccess } from './EthereumRawJsonTransactionRequestSuccess'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { CopyButton } from '~/src/components/CopyButton'
import { RootState } from '~/src/store/RootStore'
import { LinearLayout, TextView } from '~src/styles/styled-components'

export const EthereumRawJsonTransactionRequest = ({
  account,
  request,
  session,
}: TransactionRequestMethodComponentProps) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const dataJson = useMemo(() => {
    const array = request.params.request.params.map((item: any) => {
      try {
        return JSON.parse(item)
      } catch {
        return item
      }
    })

    return JSON.stringify(array, null, 2)
  }, [request])

  return (
    <TransactionRequestBase
      acceptButtonLabel={i18n.t('modals.transactionRequest.buttom.accept')}
      rejectButtonLabel={i18n.t('modals.transactionRequest.buttom.decline')}
      title={i18n.t(`modals.EthereumRawJsonTransactionRequest.titleByMethods.${request.params.request.method}`, {
        dAppName: session.peer.metadata.name,
      })}
      hideDappName
      request={request}
      session={session}
      account={account}
      successElement={EthereumRawJsonTransactionRequestSuccess}
      failedElement={EthereumRawJsonTransactionRequestFailed}
    >
      <LinearLayout orientation="horiz" width="100%" justifyContent="space-between">
        <TextView fontSize="18px" fontFamily="medium" color="text.10">
          {i18n.t('modals.rawJson.data')}
        </TextView>

        <CopyButton text={dataJson} />
      </LinearLayout>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: theme.colors.background[1],
          borderRadius: 8,
          flexGrow: 1,
          padding: 22,
          marginBottom: 12,
        }}
      >
        <TextView fontFamily="light" fontSize="16px" color="white">
          {dataJson}
        </TextView>
      </ScrollView>
    </TransactionRequestBase>
  )
}

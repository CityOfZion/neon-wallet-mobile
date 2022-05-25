import i18n from 'i18n-js'
import React, {useCallback} from 'react'
import {Linking} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'

import {blockchainServices} from '~/src/blockchain'
import ThemedButton from '~/src/components/themed/ThemedButton'
import {Account} from '~/src/models/redux/Account'
import {RootStore} from '~/src/store/RootStore'
import {LinearLayout} from '~/src/styles/styled-components'
interface Props {
  mt?: string
  disable?: boolean
  txid: string
  account?: Account
}

export const ThemedButtonViewOnDora = (props: Props) => {
  const dispatch = useDispatch<SyncDispatch<Account>>()

  const navigateToDora = useCallback(() => {
    if (props.account) {
      Linking.openURL(
        blockchainServices[props.account.blockchain]?.provider.siteUrlQuery +
          props.txid
      )
    }
  }, [props.account])

  return (
    <LinearLayout width="100%" mt={props.mt}>
      <ThemedButton
        onPress={navigateToDora}
        disabled={props.disable ?? false}
        label={i18n.t('modals.transactionSent.viewOnDora')}
      />
    </LinearLayout>
  )
}

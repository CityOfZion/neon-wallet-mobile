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
}

export const ThemedButtonViewOnDora = (props: Props) => {
  const dispatch = useDispatch<SyncDispatch<Account>>()
  const account = useSelector((state: RootState) => state.account)
  const navigateToDora = useCallback(() => {
    const acc = dispatch(RootStore.account.actions.getFromSelection())
    Linking.openURL(
      blockchainServices[acc.blockchain]?.siteUrlQuery + props.txid
    )
  }, [account])
  return (
    <LinearLayout width="100%" mt={props.mt}>
      <ThemedButton
        disabled={props.disable ?? false}
        label={i18n.t('modals.transactionSent.viewOnDora')}
      />
    </LinearLayout>
  )
}

import {useNavigation} from '@react-navigation/native'
import i18n from 'i18n-js'
import React, {useCallback} from 'react'

import {wrapper} from '~/src/app/ApplicationWrapper'
import ThemedButton from '~/src/components/themed/ThemedButton'
import {Account} from '~/src/models/redux/Account'
import {LinearLayout} from '~/src/styles/styled-components'

interface Props {
  disable?: boolean
  account?: Account
}

export const ThemedButtonViewTransaction = (props: Props) => {
  const navigation = useNavigation()

  const navigateToTransactions = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {name: wrapper.route.Tab.name},
        {name: wrapper.route.GetAccount.name},
      ],
    })

    navigation.navigate(wrapper.route.AccountTransactionsScreen.name, {
      account: props.account,
    })
  }, [navigation])

  return (
    <LinearLayout width="100%">
      <ThemedButton
        disabled={props.disable ?? false}
        onPress={navigateToTransactions}
        label={i18n.t('modals.transactionSent.viewTransaction')}
      />
    </LinearLayout>
  )
}

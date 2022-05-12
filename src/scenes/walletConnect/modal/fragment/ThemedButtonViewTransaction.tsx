import {useNavigation} from '@react-navigation/native'
import {SessionTypes} from '@walletconnect/types'
import i18n from 'i18n-js'
import React, {useCallback} from 'react'
import {useSelector} from 'react-redux'

import {wrapper} from '~/src/app/ApplicationWrapper'
import ThemedButton from '~/src/components/themed/ThemedButton'
import {LinearLayout} from '~/src/styles/styled-components'
import {ContractInvocationMulti} from '~src/helpers/NeonWcAdapter'

interface Props {
  disable?: boolean
  request: SessionTypes.RequestEvent
}

export const ThemedButtonViewTransaction = (props: Props) => {
  const navigation = useNavigation()
  const accountsPool = useSelector((state: RootState) => state.app.accounts)

  const navigateToTransactions = useCallback(() => {
    const params = props.request.request.params as ContractInvocationMulti

    const account = accountsPool.find((account) =>
      params.invocations.some(
        ({args}) => account.address && account.address === args[0].value
      )
    )

    navigation.reset({
      index: 0,
      routes: [
        {name: wrapper.route.Tab.name},
        {name: wrapper.route.GetAccount.name},
      ],
    })

    navigation.navigate(wrapper.route.AccountTransactionsScreen.name, {
      account,
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

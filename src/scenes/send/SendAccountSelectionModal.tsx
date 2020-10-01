import {RouteProp, useNavigationState} from '@react-navigation/native'
import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import React, {useEffect, useState} from 'react'
import {ScrollView, TouchableHighlight} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import BalanceList from '~src/components/BalanceList'
import {PANEL_OFFSET} from '~src/components/SwiperPanel'
import AccountPicker from '~src/components/misc/AccountPicker'
import ThemedButton from '~src/components/themed/ThemedButton'
import {NeoURI} from '~src/helpers/UriHelper'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import {SendModalStackParamList} from '~src/navigation/SendModalStackNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'

export interface SendAccountSelectionModalParams {
  wallet: Wallet
  uri?: NeoURI
}

interface Props {
  navigation: StackNavigationProp<SendModalStackParamList>
  route: RouteProp<SendModalStackParamList, 'SendAccountSelectionModal'>
}

const SendAccountSelectionModal = (props: Props) => {
  const {wallet} = props.route.params
  const show = useNavigationState(
    (state) =>
      state.routes[state.routes.length - 1].name ===
      Facade.route.SendAccountSelectionModal.name
  )

  const accountsPool = useSelector((state: RootState) => state.app.accounts)

  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(
    accounts[0]
  )

  useEffect(() => {
    Facade.await.run('populate', populate)
  }, [accountsPool])

  const populate = async () => {
    const accounts = wallet.getAccounts(accountsPool)
    setAccounts(accounts)
    setSelectedAccount(accounts[0])
  }

  return show ? (
    <ScrollView
      style={{
        width: '100%',
        marginTop: useHeaderHeight(),
      }}
      contentContainerStyle={{
        flexGrow: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        paddingBottom: PANEL_OFFSET + 20,
        paddingLeft: 5,
        paddingRight: 5,
      }}
    >
      <TouchableHighlight>
        <LinearLayout px={5}>
          <TextView
            mb={4}
            color={'text.3'}
            fontSize={'md'}
            fontFamily={'bold'}
            textAlign={'center'}
          >
            {props.route.params.wallet.name?.toUpperCase()}
          </TextView>

          <TextView
            color={'text.0'}
            fontSize={'lg'}
            fontFamily={'medium'}
            textAlign={'center'}
          >
            {Facade.t('modals.send.accountSelection.subtitle')}
          </TextView>

          <LinearLayout minHeight={260} mx={-5}>
            <AccountPicker accounts={accounts} onSelect={setSelectedAccount} />
          </LinearLayout>

          <TextView
            mb={4}
            color={'text.3'}
            fontSize={'md'}
            textAlign={'center'}
          >
            {Facade.t('modals.send.accountSelection.label')}
          </TextView>

          {selectedAccount && (
            <LinearLayout width={'100%'} mb={6}>
              <BalanceList
                tokenAssets={selectedAccount.tokenAssets}
                fromAccountView={false}
                fromListWalletView={false}
              />
            </LinearLayout>
          )}

          <LinearLayout mb={6} minWidth={'80%'} maxWidth={'100%'}>
            <ThemedButton
              label={Facade.t('app.next')}
              onPress={() =>
                props.navigation.navigate(
                  Facade.route.SendTransactionInputModal.name,
                  {
                    walletTitle: props.route.params.wallet.name ?? '',
                    account: selectedAccount ?? new Account(),
                    uri: props.route.params?.uri,
                  }
                )
              }
              disabled={!selectedAccount?.hasFunds}
            />
          </LinearLayout>
        </LinearLayout>
      </TouchableHighlight>
    </ScrollView>
  ) : (
    <LinearLayout />
  )
}

export default SendAccountSelectionModal

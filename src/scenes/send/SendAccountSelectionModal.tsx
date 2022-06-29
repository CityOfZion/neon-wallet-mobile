import { RouteProp, useNavigationState } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useEffect, useState } from 'react'
import { ScrollView, TouchableHighlight } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'

import { useHeaderHeight } from '~/node_modules/@react-navigation/stack'
import { wrapper } from '~/src/app/ApplicationWrapper'
import { getBlockchainByAddress } from '~/src/blockchain'
import { RootState, RootStore } from '~/src/store/RootStore'
import BalanceList from '~src/components/BalanceList'
import { PANEL_OFFSET } from '~src/components/SwiperPanel'
import AccountPicker from '~src/components/misc/AccountPicker'
import ThemedButton from '~src/components/themed/ThemedButton'
import { IURI } from '~src/helpers/UriHelper'
import { Account } from '~src/models/redux/Account'
import { Wallet } from '~src/models/redux/Wallet'
import { SendModalStackParamList } from '~src/navigation/SendModalStackNavigation'
import { LinearLayout, TextView } from '~src/styles/styled-components'

export interface SendAccountSelectionModalParams {
  wallet: Wallet
  uri?: IURI
}

interface Props {
  navigation: StackNavigationProp<SendModalStackParamList>
  route: RouteProp<SendModalStackParamList, 'SendAccountSelectionModal'>
}

const SendAccountSelectionModal = (props: Props) => {
  const { wallet } = props.route.params
  const show = useNavigationState(
    state => state.routes[state.routes.length - 1].name === wrapper.route.SendAccountSelectionModal.name
  )
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const headerHeight = useHeaderHeight()

  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(accounts[0])

  const dispatch = useDispatch()

  useEffect(() => {
    Await.run('populate', populate)
  }, [accountsPool])

  const populate = async () => {
    const addressUri = props.route.params.uri?.address ?? ''
    const blockchainAddressUri = getBlockchainByAddress(addressUri) //if the addressUri is empty, blockchainAddressUri will go null
    const accounts = wallet.getAccounts(accountsPool).filter(acc => {
      if (blockchainAddressUri) {
        return acc.blockchain === blockchainAddressUri
      } else {
        return acc
      }
    })
    setAccounts(accounts)
    setSelectedAccount(accounts[0])
  }
  const handleChangeAccount = (account: Account) => {
    if (account.address !== selectedAccount?.address) {
      setSelectedAccount(account)
    }
  }

  useEffect(() => {
    if (selectedAccount) {
      dispatch(RootStore.account.actions.selectAccount(selectedAccount.address))
    }
  }, [selectedAccount])

  return show ? (
    <LinearLayout>
      <ScrollView
        style={{
          width: '100%',
          marginTop: headerHeight,
          marginBottom: '10%',
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
            <TextView mb={4} color="text.3" fontSize="md" fontFamily="bold" textAlign="center">
              {props.route.params.wallet.name?.toUpperCase()}
            </TextView>

            <TextView color="text.0" fontSize="lg" fontFamily="medium" textAlign="center">
              {i18n.t('modals.send.accountSelection.subtitle')}
            </TextView>

            <LinearLayout minHeight={260} mx={-5}>
              <AccountPicker accounts={accounts} onSelect={handleChangeAccount} />
            </LinearLayout>

            <TextView mb={4} color="text.3" fontSize="md" textAlign="center">
              {i18n.t('modals.send.accountSelection.label')}
            </TextView>

            {selectedAccount && (
              <LinearLayout width="100%" mb={6}>
                <BalanceList
                  tokenAssets={selectedAccount.tokenAssets}
                  fromAccountView={false}
                  fromSendAccountSelectionModal={!props.route.params?.uri?.tokenHash}
                  walletTitle={props.route.params.wallet.name ?? ''}
                  account={selectedAccount ?? new Account()}
                  uri={props.route.params?.uri}
                />
              </LinearLayout>
            )}
          </LinearLayout>
        </TouchableHighlight>
      </ScrollView>
      <LinearLayout position="absolute" left="10%" right="10%" bottom="9%">
        <LinearLayout minWidth="80%" maxWidth="100%" marginBottom="8px" marginTop="30px">
          <ThemedButton
            label={i18n.t('app.next')}
            onPress={() =>
              props.navigation.navigate(wrapper.route.SendTransactionInputModal.name, {
                walletTitle: props.route.params.wallet.name ?? '',
                account: selectedAccount ?? new Account(),
                uri: props.route.params?.uri,
              })
            }
            disabled={!selectedAccount?.hasFunds || !isConnected}
          />
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  ) : (
    <LinearLayout />
  )
}

export default SendAccountSelectionModal

import {RouteProp, useNavigationState} from '@react-navigation/native'
import {StackNavigationProp, useHeaderHeight} from '@react-navigation/stack'
import {Await} from '@simpli/react-native-await'
import {LinearGradient} from 'expo-linear-gradient'
import i18n from 'i18n-js'
import React, {useEffect, useState} from 'react'
import {ScrollView, StyleSheet, View, TouchableHighlight} from 'react-native'
import {useSelector} from 'react-redux'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {FilterHelper} from '~/src/helpers/FilterHelper'
import {TokenAsset} from '~/src/models/TokenAsset'
import {ReceiveModalStackParamList} from '~/src/navigation/ReceiveModalStackNavigation'
import BalanceList from '~src/components/BalanceList'
import {PANEL_OFFSET} from '~src/components/SwiperPanel'
import AccountPicker from '~src/components/misc/AccountPicker'
import ThemedButton from '~src/components/themed/ThemedButton'
import {Account} from '~src/models/redux/Account'
import {Wallet} from '~src/models/redux/Wallet'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'
export interface ReceiveAccountSelectionModalParams {
  wallet: Wallet
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList & WalletStackParamList>
  route: RouteProp<ReceiveModalStackParamList, 'ReceiveAccountSelectionModal'>
}

const ReceiveAccountSelectionModal = (props: Props) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const {wallet} = props.route.params

  const show = useNavigationState(
    (state) =>
      state.routes[state.routes.length - 1].name ===
      wrapper.route.ReceiveAccountSelectionModal.name
  )

  const accountsPool = useSelector((state: RootState) => state.app.accounts)

  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(
    accounts[0]
  )

  useEffect(() => {
    Await.run('populate', populate)
  }, [accountsPool])

  const populate = async () => {
    const accounts = wallet.getAccounts(accountsPool)
    setAccounts(accounts)
    setSelectedAccount(accounts[0])
  }

  const showListTokenAssets = (tokenAssets: TokenAsset[] | undefined) => {
    let show = false
    if (tokenAssets) {
      tokenAssets.forEach((token) => {
        if (token.amount > 0) {
          show = true
        }
      })
    }
    return show
  }
  return show ? (
    <LinearLayout>
      <ScrollView
        style={{
          width: '100%',
          marginTop: useHeaderHeight(),
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
        nestedScrollEnabled={true}
      >
        <TouchableHighlight>
          <LinearLayout px={5}>
            <TextView
              mb={4}
              color={'text.2'}
              fontSize={'14px'}
              fontFamily={'bold'}
              textAlign={'center'}
            >
              {props.route.params.wallet.name?.toUpperCase()}
            </TextView>

            <TextView
              color={'text.0'}
              fontSize={'18px'}
              fontFamily={'medium'}
              textAlign={'center'}
            >
              {i18n.t('modals.receive.accountSelection.subtitle')}
            </TextView>

            <LinearLayout minHeight={200} mx={-5}>
              <AccountPicker
                accounts={accounts}
                onSelect={setSelectedAccount}
                initialAccount={
                  selectedAccount
                    ? accounts.indexOf(selectedAccount)
                    : undefined
                }
                isCompacted={false}
              />
            </LinearLayout>

            {showListTokenAssets(selectedAccount?.tokenAssets) ? (
              <TextView
                mb={4}
                color={'text.2'}
                fontSize={'14px'}
                fontFamily={'medium'}
                textAlign={'center'}
              >
                {`${props.route.params.wallet.name?.toUpperCase()} ${i18n
                  .t('modals.receive.accountSelection.tokensValue')
                  .toUpperCase()}`}
              </TextView>
            ) : (
              <View />
            )}

            {selectedAccount && (
              <LinearLayout width={'100%'} mb={6}>
                <BalanceList
                  hideEmptyMessage={true}
                  zeroBalance={false}
                  tokenAssets={selectedAccount.tokenAssets}
                  fromAccountView={false}
                  fromListWalletView={false}
                  fromSendAccountSelectionModal={false}
                />
              </LinearLayout>
            )}
          </LinearLayout>
        </TouchableHighlight>
      </ScrollView>
      <LinearLayout
        position={'absolute'}
        bottom={'1%'}
        height={'26%'}
        width={'100%'}
        alignItens={'center'}
      >
        <LinearGradient
          style={styles.shadowNext}
          colors={[
            'transparent',
            FilterHelper.toDarkerShade(theme.colors.background[17], 1, 0.85),
          ]}
          start={[1, 0]}
          end={[1, 0.45]}
        >
          <LinearLayout
            alignSelf={'center'}
            position={'absolute'}
            bottom={'30%'}
          >
            <LinearLayout
              minWidth={'80%'}
              maxWidth={'100%'}
              marginBottom={'8px'}
              marginTop={'30px'}
            >
              <ThemedButton
                label={i18n.t('app.next')}
                onPress={() =>
                  props.navigation.navigate(
                    wrapper.route.ReceiveToAccountModal.name,
                    {
                      wallet: props.route.params.wallet,
                      account: selectedAccount ?? new Account(),
                    }
                  )
                }
              />
            </LinearLayout>
          </LinearLayout>
        </LinearGradient>
      </LinearLayout>
    </LinearLayout>
  ) : (
    <LinearLayout />
  )
}

const styles = StyleSheet.create({
  shadowNext: {
    height: '100%',
  },
})

export default ReceiveAccountSelectionModal

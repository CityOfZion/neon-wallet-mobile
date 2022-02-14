import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {Await} from '@simpli/react-native-await'
import {LinearGradient} from 'expo-linear-gradient'
import i18n from 'i18n-js'
import React, {useEffect, useState} from 'react'
import {StyleSheet, View, TouchableHighlight} from 'react-native'
import {useSelector} from 'react-redux'

import {wrapper} from '~/src/app/ApplicationWrapper'
import ThemedCloseButton from '~/src/components/themed/ThemedCloseButton'
import {FilterHelper} from '~/src/helpers/FilterHelper'
import {TokenAsset} from '~/src/models/TokenAsset'
import {ReceiveModalStackParamList} from '~/src/navigation/ReceiveModalStackNavigation'
import BalanceList from '~src/components/BalanceList'
import SwiperPanel, {
  BackButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
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

interface NextButtonProps {
  onPress: () => void
  mt?: string
}

const NextButton = ({onPress, ...props}: NextButtonProps) => {
  return (
    <LinearLayout minWidth={'80%'} alignSelf={'center'} {...props}>
      <ThemedButton label={i18n.t('app.next')} onPress={onPress} />
    </LinearLayout>
  )
}

const ReceiveAccountSelectionModal = (props: Props) => {
  const controller = useSwiperController(true)

  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  const {wallet} = props.route.params

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

  const shouldShowListTokenAssets = (tokenAssets: TokenAsset[]) => {
    return tokenAssets
      ? tokenAssets.some((token) => {
          return token.amount > 0
        })
      : false
  }
  return (
    <>
      <SwiperPanel
        controller={controller}
        fullSize={true}
        title={i18n.t('modals.receive.title')}
        padding={0}
        rightButton={<ThemedCloseButton onPress={controller.close} />}
        leftButton={<BackButton text={i18n.t('app.back')} />}
        onLeftPress={controller.close}
        onRightPress={controller.close}
        onClose={() => props.navigation.goBack()}
        solidColorBG={true}
      >
        <LinearLayout mt={6}>
          <TouchableHighlight>
            <LinearLayout>
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
                mb={'28px'}
              >
                {i18n.t('modals.receive.accountSelection.subtitle')}
              </TextView>

              <LinearLayout minHeight={200}>
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

              {!!selectedAccount &&
              shouldShowListTokenAssets(selectedAccount.tokenAssets) ? (
                <>
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
                  <LinearLayout width={'100%'} px={5}>
                    <BalanceList
                      hideEmptyMessage={true}
                      zeroBalance={false}
                      tokenAssets={selectedAccount.tokenAssets}
                      fromAccountView={false}
                      fromSendAccountSelectionModal={false}
                    />
                  </LinearLayout>
                </>
              ) : (
                <NextButton
                  mt={'28px'}
                  onPress={() =>
                    props.navigation.navigate(wrapper.route.Modal.name, {
                      screen: wrapper.route.ReceiveModalStack.name,
                      params: {
                        screen: wrapper.route.ReceiveToAccountModal.name,
                        params: {
                          wallet: props.route.params.wallet,
                          account: selectedAccount ?? new Account(),
                        },
                      },
                    })
                  }
                />
              )}
            </LinearLayout>
          </TouchableHighlight>
        </LinearLayout>
      </SwiperPanel>
      {!!selectedAccount &&
        shouldShowListTokenAssets(selectedAccount.tokenAssets) && (
          <LinearLayout
            position={'absolute'}
            bottom={'0px'}
            height={'125px'}
            width={'100%'}
          >
            <LinearGradient
              style={styles.shadowNext}
              colors={[
                'transparent',
                FilterHelper.toDarkerShade(
                  theme.colors.background[17],
                  1,
                  0.85
                ),
              ]}
              start={[1, 0]}
              end={[1, 0.5]}
            >
              <NextButton
                onPress={() =>
                  props.navigation.navigate(wrapper.route.Modal.name, {
                    screen: wrapper.route.ReceiveModalStack.name,
                    params: {
                      screen: wrapper.route.ReceiveToAccountModal.name,
                      params: {
                        wallet: props.route.params.wallet,
                        account: selectedAccount ?? new Account(),
                      },
                    },
                  })
                }
              />
            </LinearGradient>
          </LinearLayout>
        )}
    </>
  )
}

const styles = StyleSheet.create({
  shadowNext: {
    height: '100%',
    justifyContent: 'center',
  },
})

export default ReceiveAccountSelectionModal

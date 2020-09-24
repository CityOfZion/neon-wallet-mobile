import {CommonActions, RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useRef, useState} from 'react'
import {Alert, TouchableWithoutFeedback, View} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import BalanceList from '~src/components/BalanceList'
import Notification from '~src/components/Notification'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import WalletPicker from '~src/components/misc/WalletPicker'
import ThemedMoreButton from '~src/components/themed/ThemedMoreButton'
import {Currency} from '~src/enums/Currency'
import {Lang} from '~src/enums/Lang'
import {Wallet} from '~src/models/redux/Wallet'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'
import {ApplicationTheme} from '~src/themes/ApplicationTheme'
import {Exchange} from '~src/types/exchange'

export interface ListWalletParams {
  wallet?: Wallet
}

interface WalletProps {
  navigation: StackNavigationProp<WalletStackParamList & MoreStackParamList>
  route: RouteProp<WalletStackParamList, 'ListWalletsPage'>
  theme: ApplicationTheme
}

const WalletChangeComponent = (props: {
  wallet?: Wallet
  currency: Currency
  language: Lang
  exchange: Exchange
  onPressWarning: () => void
}) => {
  if (!props.wallet) return <View />

  return (
    <>
      <LinearLayout mb={6} orientation="verti" alignItems="center">
        {
          <TextView fontSize="11px" color="text.2">
            {props.wallet.formattedLastVisitedAt}
          </TextView>
        }

        <LinearLayout orientation="horiz" minHeight={56}>
          <TextView fontSize="36px" color="text.0" fontFamily="medium">
            {props.wallet.calculateBalanceFormatted(
              props.currency,
              props.language,
              props.exchange
            )}
          </TextView>

          {props.wallet.hasFunds && (
            <ButtonView onPress={props.onPressWarning}>
              <ImageView
                mt="8px"
                mx="4px"
                source={require('~src/assets/images/icon-warning-green.png')}
              />
            </ButtonView>
          )}

          {/*TODO: fix percentage*/}
          {/*<TextView fontSize="36px" color="primary" fontFamily="semibold">*/}
          {/*  {calculateChangePercentage(wallet)}*/}
          {/*</TextView>*/}
        </LinearLayout>
      </LinearLayout>
    </>
  )
}

const EmptyListComponent = () => {
  return (
    <LinearLayout alignItems={'center'} mx={3}>
      <TouchableWithoutFeedback
        onPress={() =>
          CommonActions.navigate(Facade.route.Tab.name, {
            screen: Facade.route.More.name,
            params: {
              screen: Facade.route.Step1CreateWallet.name,
            },
          })
        }
      >
        <LinearLayout
          my={6}
          orientation={'horiz'}
          width={Facade.scale(300)}
          maxWidth={'100%'}
          alignItems={'center'}
          justifyContent={'center'}
          borderStyle={'dashed'}
          borderColor={'text.0'}
          borderRadius={17}
          borderWidth={1}
          style={{
            aspectRatio: 20 / 25,
          }}
        >
          <ImageView
            source={require('~src/assets/images/icon-plus-white.png')}
          />

          <TextView
            color="white"
            fontSize={18}
            mt={2}
            ml={3}
            fontFamily="medium"
          >
            {Facade.t('screens.listWallets.createFirstWallet')}
          </TextView>
        </LinearLayout>
      </TouchableWithoutFeedback>
    </LinearLayout>
  )
}

const ListWalletView = (props: WalletProps) => {
  const {wallets, accounts, exchange} = useSelector(
    (state: RootState) => state.app
  )

  const {currency, language} = useSelector((state: RootState) => state.settings)

  const [selectedWallet, setSelectedWallet] = useState<Wallet | undefined>(
    wallets[0]
  )

  const isListNotEmpty = () => {
    return Boolean(wallets.length)
  }

  const selectEvent = async (wallet: Wallet) => {
    if (wallet.walletType !== 'standard') {
      goToFirstAccount(wallet)
    } else {
      goToWallet(wallet)
    }
  }

  const goToFirstAccount = (wallet: Wallet) => {
    const accountsFromWallet = wallet.getAccounts(accounts)

    if (accountsFromWallet.length > 0) {
      props.navigation.navigate(Facade.route.GetAccount.name, {
        account: accountsFromWallet[0],
      })
    } else {
      // Fall back
      goToWallet(wallet)
    }
  }

  const goToWallet = (wallet: Wallet) => {
    props.navigation.navigate(Facade.route.GetWallet.name, {
      wallet,
    })
  }
  const openWarning = () =>
    Alert.alert(
      Facade.t('screens.listWallets.incompleteBalanceWarningTitle'),
      Facade.t('screens.listWallets.incompleteBalanceWarningText'),
      [{text: Facade.t('screens.listWallets.incompleteBalanceWarningButton')}],
      {cancelable: false}
    )

  const calculateChangePercentage = (wallet: Wallet) => {
    return null
    // TODO: fix percentage
    // const changePercentage =
    //   ((wallet.currentValue - wallet.previousValue) / wallet.previousValue) *
    //   100
    // return `${changePercentage > 0 ? '+' : ''}${Math.round(changePercentage)}%`
  }

  return (
    <ScreenLayout
      useHeaderPadding={false}
      useStatusBarPadding={true}
      padding={0}
    >
      <>
        <LinearLayout alignSelf={'flex-end'}>
          <ThemedMoreButton
            onPress={() =>
              props.navigation.navigate(Facade.route.Modal.name, {
                screen: Facade.route.WalletContextModal.name,
              })
            }
          />
        </LinearLayout>

        <AwaitActivity name={'populateWallet'}>
          <LinearLayout mt={4} justifyContent={'center'} height={400}>
            {isListNotEmpty() ? (
              <WalletPicker
                wallets={wallets}
                onSelect={setSelectedWallet}
                onPress={selectEvent}
                goTo={props.route.params?.wallet}
              />
            ) : (
              <EmptyListComponent />
            )}
          </LinearLayout>

          <WalletChangeComponent
            currency={currency}
            exchange={exchange}
            language={language}
            wallet={selectedWallet}
            onPressWarning={openWarning}
          />

          <LinearLayout mx={'16px'}>
            {selectedWallet?.showBackupAlert &&
              selectedWallet.walletType === 'standard' && (
                <LinearLayout mb={6}>
                  <Notification
                    text={Facade.t('screens.listWallets.noBackup')}
                    wallet={selectedWallet}
                  />
                </LinearLayout>
              )}

            {isListNotEmpty() && (
              <BalanceList
                mb={6}
                tokenAssets={selectedWallet?.tokenAssets ?? []}
                fromAccountView={false}
              />
            )}
          </LinearLayout>
        </AwaitActivity>
      </>
    </ScreenLayout>
  )
}

export default ListWalletView

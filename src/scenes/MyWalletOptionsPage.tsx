import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {Alert} from 'react-native'
import {DefaultTheme} from 'styled-components'

import * as LocalAuthentication from '~/node_modules/expo-local-authentication'
import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import MenuItem, {RightIconType} from '~src/components/MenuItem'
import HeaderBar from '~src/components/layout/HeaderBar'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'

interface Props {
  route: RouteProp<SettingsStackParamList, 'MyWalletOptions'>
  navigation: StackNavigationProp<SettingsStackParamList & RootStackParamList>
  theme: DefaultTheme
}

const MyWalletOptionsPage = (props: Props) => {
  const {wallet} = props.route.params

  props.navigation.setOptions({
    headerTitle: () =>
      HeaderBar({
        title: wallet.name ?? '',
      }),
  })

  const checkForAuth = async () => {
    // If user has set up authentication (either hardware or passcode)
    const hasAuth = await Storage.hasAuthentication.load()
    if (hasAuth === true) {
      // Checks if user set up a passcode
      const passcode = await Facade.security.loadPasscode()

      // If passcode, navigates to passcode confirmation screen
      if (passcode) {
        props.navigation.navigate(Facade.route.PasscodeStack.name, {
          screen: Facade.route.VerifyPasscode.name,
          params: {
            onValidate: (it) => {
              if (it) {
                props.navigation.navigate(Facade.route.Step1BackupWallet.name, {
                  wallet,
                })
              }
            },
          },
        })
      } else {
        // If no passcode, hardware authentication
        await tryAuth()
      }
    }
  }

  const tryAuth = async () => {
    const canUseHardware = await LocalAuthentication.hasHardwareAsync()

    if (canUseHardware) {
      const result = await LocalAuthentication.authenticateAsync()

      if (!result.success) {
        alertDialog()
      } else {
        props.navigation.navigate(Facade.route.Step1BackupWallet.name, {
          wallet,
        })
      }
    }
  }

  const alertDialog = () =>
    Alert.alert(
      Facade.t('myWalletOptions.dialog.title'),
      Facade.t('myWalletOptions.dialog.subtitle'),
      [
        {
          text: Facade.t('myWalletOptions.dialog.confirm'),
          onPress: async () => await tryAuth,
        },
        {
          text: Facade.t('myWalletOptions.dialog.cancel'),
          style: 'cancel',
        },
      ],
      {cancelable: true}
    )

  return (
    <ScreenLayout padding={20}>
      <MenuItem
        title={Facade.t('myWalletOptions.details')}
        icon={require('~src/assets/images/icon-details-green.png')}
        iconMarginRight={4}
        arrowDirection={RightIconType.ARROW_RIGHT}
        onPress={() =>
          props.navigation.navigate(Facade.route.WalletDetails.name, {wallet})
        }
      />

      {wallet.walletType === 'standard' && (
        <MenuItem
          title={Facade.t('myWalletOptions.backupWallet')}
          icon={require('~src/assets/images/icon-screen-lock-green.png')}
          iconMarginLeft={2}
          iconMarginRight={5}
          arrowDirection={RightIconType.ARROW_RIGHT}
          onPress={checkForAuth}
        />
      )}
    </ScreenLayout>
  )
}

export default MyWalletOptionsPage

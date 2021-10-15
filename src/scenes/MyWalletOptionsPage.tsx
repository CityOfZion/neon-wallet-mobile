import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import {Alert} from 'react-native'
import {DefaultTheme} from 'styled-components'

import {wrapper} from '../app/ApplicationWrapper'
import {SecurityHelper} from '../helpers/SecurityHelper'

import * as LocalAuthentication from '~/node_modules/expo-local-authentication'
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
    const hasAuthHard = await Storage.hasAuthenticationForHardware.load()
    if (hasAuth === true) {
      // Checks if user set up a passcode
      const passcode = await SecurityHelper.loadPasscode()

      // If passcode, navigates to passcode confirmation screen
      if (passcode) {
        props.navigation.navigate(wrapper.route.PasscodeStack.name, {
          screen: wrapper.route.VerifyPasscode.name,
          params: {
            onValidate: (it) => {
              if (it) {
                props.navigation.navigate(
                  wrapper.route.Step1BackupWallet.name,
                  {
                    wallet,
                  }
                )
              }
            },
          },
        })
      }
    } else {
      // If no passcode, hardware authentication
      if (hasAuthHard === true) {
        tryAuth()
      } else {
        props.navigation.navigate(wrapper.route.Step1BackupWallet.name, {
          wallet,
        })
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
        props.navigation.navigate(wrapper.route.Step1BackupWallet.name, {
          wallet,
        })
      }
    }
  }

  const alertDialog = () =>
    Alert.alert(
      i18n.t('myWalletOptions.dialog.title'),
      i18n.t('myWalletOptions.dialog.subtitle'),
      [
        {
          text: i18n.t('myWalletOptions.dialog.confirm'),
          onPress: async () => await tryAuth,
        },
        {
          text: i18n.t('myWalletOptions.dialog.cancel'),
          style: 'cancel',
        },
      ],
      {cancelable: true}
    )

  return (
    <ScreenLayout padding={20}>
      <MenuItem
        title={i18n.t('myWalletOptions.details')}
        icon={require('~src/assets/images/icon-details-green.png')}
        iconMarginRight={4}
        arrowDirection={RightIconType.ARROW_RIGHT}
        onPress={() =>
          props.navigation.navigate(wrapper.route.WalletDetails.name, {wallet})
        }
      />

      {wallet.walletType === 'standard' && (
        <MenuItem
          title={i18n.t('myWalletOptions.backupWallet')}
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

import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { Alert, TouchableWithoutFeedback } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import MenuItem, { RightIconType } from '~/src/components/MenuItem'
import ScreenLayout from '~/src/components/layout/ScreenLayout'
import { useLocalAuthentication } from '~/src/hooks'
import { Wallet } from '~/src/models/redux/Wallet'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { RootState, RootStore } from '~/src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'
import { AsyncDispatch, DispatchResult } from '~/src/types/reducers/root'

export interface WalletSettingViewParams {
  wallet: Wallet
}

interface Props {
  route: RouteProp<WalletStackParamList, 'WalletSettingsView'>
  navigation: StackNavigationProp<RootStackParamList & WalletStackParamList & TabStackParamList & ModalStackParamList>
}

export const WalletSettingsView = (props: Props) => {
  const { wallet } = props.route.params

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const { authenticate } = useLocalAuthentication()

  const dispatch = useDispatch<DispatchResult>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const deleteAction = async () => {
    if (!wallet.id) {
      return
    }

    await dispatchAsync(RootStore.wallet.actions.delete(wallet.id))

    await dispatchAsync(RootStore.app.actions.syncWallets())
    await dispatchAsync(RootStore.app.actions.syncAccounts())
    await dispatchAsync(RootStore.app.actions.syncTokenAssets())
    dispatch(RootStore.wallet.actions.selectWallet(null))

    props.navigation.reset({
      index: 0,
      routes: [{ name: wrapper.route.ListWalletsPage.name }],
    })

    props.navigation.navigate(wrapper.route.ListWalletsPage.name)
  }

  const alertDelete = () => {
    Alert.alert(
      '',
      i18n.t('screens.walletSettingsView.deleteAlert'),
      [
        {
          text: i18n.t('screens.walletSettingsView.navigation.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('screens.walletSettingsView.navigation.delete'),
          onPress: deleteAction,
        },
      ],
      { cancelable: true }
    )
  }

  const handlePressOnBackup = async () => {
    try {
      await authenticate()

      props.navigation.navigate(wrapper.route.Step1BackupWallet.name, {
        wallet,
      })
    } catch {}
  }

  return (
    <ScreenLayout padding={20} darkerSolidColorBG>
      <MenuItem
        title={i18n.t('screens.walletSettingsView.customize')}
        icon={require('~src/assets/images/icon-palette-green.png')}
        iconMarginRight={4}
        arrowDirection={RightIconType.ARROW_RIGHT}
        onPress={() =>
          props.navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.EditWalletModal.name,
            params: {
              wallet,
            },
          })
        }
      />

      {wallet.walletType === 'standard' && (
        <MenuItem
          title={i18n.t('screens.walletSettingsView.backup')}
          icon={require('~src/assets/images/icon-screen-lock-green.png')}
          iconMarginLeft={2}
          iconMarginRight={4}
          arrowDirection={RightIconType.ARROW_RIGHT}
          onPress={handlePressOnBackup}
        />
      )}

      <LinearLayout alignItems="center" flex={1} justifyContent="flex-end" marginBottom="40px">
        <TextView fontSize={14} fontFamily="bold" color={theme.colors.background[3]} alignItems="center">
          {i18n.t('screens.walletSettingsView.deleteTitle').toUpperCase()}
        </TextView>
        <TextView color={theme.colors.text[0]} marginBottom="30px" paddingX="24px" textAlign="center">
          {i18n.t('screens.walletSettingsView.deleteSubtitle')}
        </TextView>

        <TouchableWithoutFeedback onPress={alertDelete}>
          <LinearLayout
            width="100%"
            borderRadius="4px"
            borderWidth="1px"
            borderColor="primary"
            justifyContent="center"
            alignItems="center"
            orientation="horiz"
            p="10px"
          >
            <ImageView
              resizeMode="center"
              width={Normalize.scale(20)}
              height={Normalize.scale(20)}
              source={require('~/src/assets/images/icon-trash-can-primary.png')}
            />

            <TextView style={{ includeFontPadding: false }} ml={3} color="primary" fontSize={20}>
              {i18n.t('screens.walletSettingsView.deleteButtom')}
            </TextView>
          </LinearLayout>
        </TouchableWithoutFeedback>
      </LinearLayout>
    </ScreenLayout>
  )
}

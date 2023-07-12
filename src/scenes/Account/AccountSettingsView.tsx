import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import { Alert, AlertButton } from '~/src/components/Alert'
import MenuItem, { RightIconType } from '~/src/components/MenuItem'
import ScreenLayout from '~/src/components/layout/ScreenLayout'
import { useLocalAuthentication } from '~/src/hooks/useLocalAuthentication'
import { Account } from '~/src/models/redux/Account'
import { Wallet } from '~/src/models/redux/Wallet'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { accountReducerActions } from '~/src/store/account/AccountReducer'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'

export interface AccountSettingsViewParams {
  account: Account
  wallet: Wallet
}

interface Props {
  route: RouteProp<WalletStackParamList, 'AccountSettingsView'>
  navigation: StackNavigationProp<RootStackParamList & TabStackParamList & ModalStackParamList & WalletStackParamList>
}

export const AccountSettingsView = (props: Props) => {
  const { account, wallet } = props.route.params

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const { authenticate } = useLocalAuthentication()

  const dispatch = useDispatch()

  const [deleteModalIsVisible, setDeleteModalIsVisible] = useState(false)

  const deleteAction = async () => {
    if (account?.address) {
      dispatch(accountReducerActions.deleteAccount(account.address))
    }

    props.navigation.reset({
      index: 0,
      routes: [{ name: wrapper.route.Tab.name }],
    })
    props.navigation.navigate(wrapper.route.GetWallet.name, { wallet })
  }

  const handlePressExportWif = async () => {
    try {
      await authenticate()

      props.navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.ExportWIFModal.name,
        params: {
          account,
        },
      })
    } catch {}
  }

  return (
    <ScreenLayout>
      <MenuItem
        title={i18n.t('screens.accountSettingsView.customize')}
        icon={require('~src/assets/images/icon-palette-green.png')}
        iconMarginRight={4}
        arrowDirection={RightIconType.ARROW_RIGHT}
        onPress={() =>
          props.navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.EditAccountModal.name,
            params: {
              account,
            },
          })
        }
      />

      {account.accountType !== 'watch' && (
        <MenuItem
          title={i18n.t('screens.accountSettingsView.exportWif')}
          icon={require('~src/assets/images/icon-screen-lock-green.png')}
          iconMarginLeft={2}
          iconMarginRight={4}
          arrowDirection={RightIconType.ARROW_RIGHT}
          onPress={handlePressExportWif}
        />
      )}

      <LinearLayout alignItems="center" flex={1} justifyContent="flex-end" marginBottom="40px">
        <TextView fontSize={14} fontFamily="bold" color={theme.colors.background[3]} alignItems="center">
          {i18n.t('screens.accountSettingsView.deleteTitle').toUpperCase()}
        </TextView>
        <TextView color={theme.colors.text[0]} marginBottom="30px" paddingX="24px" textAlign="center">
          {i18n.t('screens.accountSettingsView.deleteSubtitle')}
        </TextView>

        <TouchableWithoutFeedback onPress={() => setDeleteModalIsVisible(true)}>
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
              width={Normalize.scale(20)}
              height={Normalize.scale(20)}
              source={require('~/src/assets/images/icon-trash-can-primary.png')}
            />

            <TextView style={{ includeFontPadding: false }} ml={3} color="primary" fontSize={20}>
              {i18n.t('screens.accountSettingsView.deleteButtom')}
            </TextView>
          </LinearLayout>
        </TouchableWithoutFeedback>
      </LinearLayout>

      <Alert
        subtitle={i18n.t('screens.accountSettingsView.deleteAlert')}
        visible={deleteModalIsVisible}
        onRequestClose={() => setDeleteModalIsVisible(false)}
      >
        <AlertButton
          label={i18n.t('screens.accountSettingsView.navigation.cancel')}
          onPress={() => setDeleteModalIsVisible(false)}
        />
        <AlertButton label={i18n.t('screens.accountSettingsView.navigation.delete')} onPress={deleteAction} />
      </Alert>
    </ScreenLayout>
  )
}

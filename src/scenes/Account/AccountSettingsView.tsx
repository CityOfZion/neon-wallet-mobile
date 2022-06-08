import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import {Alert, TouchableWithoutFeedback, View} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {wrapper} from '~/src/app/ApplicationWrapper'
import MenuItem, {RightIconType} from '~/src/components/MenuItem'
import ScreenLayout from '~/src/components/layout/ScreenLayout'
import {Account} from '~/src/models/redux/Account'
import {ModalStackParamList} from '~/src/navigation/ModalStackNavigation'
import {TabStackParamList} from '~/src/navigation/TabNavigation'
import {WalletStackParamList} from '~/src/navigation/WalletsStackNavigation'
import {RootStore} from '~/src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~/src/styles/styled-components'

export interface AccountSettingsViewParams {
  account: Account
}

interface Props {
  route: RouteProp<WalletStackParamList, 'AccountSettingsView'>
  navigation: StackNavigationProp<
    TabStackParamList & ModalStackParamList & WalletStackParamList
  >
}

export const AccountSettingsView = (props: Props) => {
  const {account} = props.route.params

  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const deleteAction = async () => {
    if (account?.address) {
      await dispatchAsync(RootStore.account.actions.delete(account.address))
    }

    await dispatchAsync(RootStore.app.actions.syncAccounts())

    props.navigation.reset({
      index: 0,
      routes: [{name: wrapper.route.Tab.name}],
    })
    props.navigation.navigate(wrapper.route.GetWallet.name)
  }

  const alertDelete = () => {
    Alert.alert(
      '',
      i18n.t('screens.accountSettingsView.deleteAlert'),
      [
        {
          text: i18n.t('screens.accountSettingsView.navigation.cancel'),
          style: 'cancel',
        },
        {
          text: i18n.t('screens.accountSettingsView.navigation.delete'),
          onPress: deleteAction,
        },
      ],
      {cancelable: true}
    )
  }

  return (
    <ScreenLayout padding={20} darkerSolidColorBG>
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

      {account.accountType === 'standard' && (
        <MenuItem
          title={i18n.t('screens.accountSettingsView.exportWif')}
          icon={require('~src/assets/images/icon-screen-lock-green.png')}
          iconMarginLeft={2}
          iconMarginRight={4}
          arrowDirection={RightIconType.ARROW_RIGHT}
          onPress={() =>
            props.navigation.navigate(wrapper.route.Modal.name, {
              screen: wrapper.route.ExportWIFModal.name,
              params: {
                account,
              },
            })
          }
        />
      )}

      <LinearLayout
        alignItems="center"
        flex={1}
        justifyContent="flex-end"
        marginBottom="40px"
      >
        <TextView
          fontSize={14}
          fontFamily="bold"
          color={theme.colors.background[3]}
          alignItems="center"
        >
          {i18n.t('screens.accountSettingsView.deleteTitle').toUpperCase()}
        </TextView>
        <TextView color={theme.colors.text[0]} marginBottom={'30px'}>
          {i18n.t('screens.accountSettingsView.deleteSubtitle')}
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
              imageSize={[20, 20]}
              source={require('~/src/assets/images/icon-trash-can-primary.png')}
            />

            <TextView
              style={{includeFontPadding: false}}
              ml={3}
              color={'primary'}
              fontSize={20}
            >
              {i18n.t('screens.accountSettingsView.deleteButtom')}
            </TextView>
          </LinearLayout>
        </TouchableWithoutFeedback>
      </LinearLayout>
    </ScreenLayout>
  )
}

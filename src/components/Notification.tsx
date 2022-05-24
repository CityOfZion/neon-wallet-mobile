import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, {useState} from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {useDispatch} from 'react-redux'

import {TabStackParamList} from '../navigation/TabNavigation'

import {wrapper} from '~src/app/ApplicationWrapper'
import {Wallet} from '~src/models/redux/Wallet'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {WalletStackParamList} from '~src/navigation/WalletsStackNavigation'
import {RootStore} from '~src/store/RootStore'
import styled, {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

type Props = WalletStackParamList &
  TabStackParamList &
  RootStackParamList &
  ModalStackParamList

interface NotificationProps {
  wallet: Wallet
  text: string
  propsNavigation: StackNavigationProp<Props>
}

const Notification = (props: NotificationProps) => {
  const [seen, setSeen] = useState(!props.wallet.showBackupAlert)
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  if (seen) return null

  const close = async () => {
    setSeen(true)

    if (props.wallet.id) {
      await dispatchAsync(
        RootStore.wallet.actions.setShowBackupAlert(props.wallet.id, false)
      )
      await dispatchAsync(RootStore.app.actions.syncWallets())
    }
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (props.wallet) {
          navigation.navigate(wrapper.route.Tab.name, {
            screen: wrapper.route.More.name,
            params: {
              screen: wrapper.route.Settings.name,
              initial: false,
              params: {
                screen: wrapper.route.Step1BackupWallet.name,
                params: {
                  wallet: props.wallet,
                  accessByNotification: true,
                },
              },
            },
          })
        }
      }}
    >
      <NotificationBox
        orientation="verti"
        height={72}
        width="100%"
        bg="background.1"
        borderColor="primary"
      >
        <LinearLayout orientation="horiz" justifyContent="space-between">
          <TextView color="text.2" fontSize="10px" mb="4px" px="11px" pt="8px">
            {i18n.t('components.notification.title')}
          </TextView>
          <ButtonView
            alignSelf="flex-start"
            onPress={() => close()}
            px="11px"
            py="8px"
          >
            <ImageView
              height={'9px'}
              width={'9px'}
              source={require('~src/assets/images/button_close_white.png')}
            />
          </ButtonView>
        </LinearLayout>
        <TextView
          color="text.0"
          fontSize="15px"
          lineHeight="15px"
          weight={1}
          px="11px"
          pb="8px"
        >
          {props.text}
        </TextView>
      </NotificationBox>
    </TouchableWithoutFeedback>
  )
}

const NotificationBox = styled(LinearLayout)`
  border-radius: 7px;
  border-left-width: 7px;
  shadow-offset: { width: 2, height: 6 };
  shadow-opacity: 0.39;
  shadow-radius: 8.3px;
  elevation: 7;
`

export default Notification

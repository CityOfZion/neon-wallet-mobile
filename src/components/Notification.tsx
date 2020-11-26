import { wallet } from '@cityofzion/neon-js'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { useDispatch } from 'react-redux'

import { SettingsStackParamList } from '../navigation/SettingsStackNavigation'

import { Facade } from '~src/app/Facade'
import { Wallet } from '~src/models/redux/Wallet'
import { RootStore } from '~src/store/RootStore'
import styled, {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'
import { WalletStackParamList } from '../navigation/WalletsStackNavigation'
import { MoreStackParamList } from '../navigation/MoreStackNavigation'

interface NotificationProps {
  wallet: Wallet
  text: string,
  propsNavigation: StackNavigationProp<WalletStackParamList & MoreStackParamList>
}

const Notification = (props: NotificationProps) => {
  const [seen, setSeen] = useState(!props.wallet.showBackupAlert)
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const navigation = useNavigation()

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
          navigation.reset({
            index: 0,
            routes: [{ name: Facade.route.Settings.name }]
          })
          navigation.navigate(Facade.route.Settings.name, {
            screen: Facade.route.Step1BackupWallet.name,
            params: {
              wallet: props.wallet
            }
          })
        }
      }}
    >
      <NotificationBox
        orientation="verti"
        height={72}
        width="100%"
        py="8px"
        px="11px"
        bg="background.1"
        borderColor="primary"
      >
        <TextView color="text.2" fontSize="10px" mb="4px">
          {Facade.t('components.notification.title')}
        </TextView>
        <LinearLayout orientation="horiz">
          <TextView color="text.0" fontSize="15px" lineHeight="15px" weight={1}>
            {props.text}
          </TextView>
          <ButtonView alignSelf="center" onPress={() => close()}>
            <ImageView
              height={'9px'}
              width={'9px'}
              source={require('~src/assets/images/button_close_white.png')}
            />
          </ButtonView>
        </LinearLayout>
      </NotificationBox>
    </TouchableWithoutFeedback>
  )
}

const NotificationBox = styled(LinearLayout)`
  border-radius: 7px;
  border-left-width: 7px;
  shadow-color: #fff;
  shadow-offset: { width: 2, height: 6 };
  shadow-opacity: 0.39;
  shadow-radius: 8.3px;
  elevation: 7;
`

export default Notification

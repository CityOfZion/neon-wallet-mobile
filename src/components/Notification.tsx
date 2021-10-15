import {useNavigation} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, {useState} from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {useDispatch} from 'react-redux'

import {wrapper} from '../app/ApplicationWrapper'
import {MoreStackParamList} from '../navigation/MoreStackNavigation'
import {SettingsStackParamList} from '../navigation/SettingsStackNavigation'
import {WalletStackParamList} from '../navigation/WalletsStackNavigation'

import {Wallet} from '~src/models/redux/Wallet'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootStore} from '~src/store/RootStore'
import styled, {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

type Props = WalletStackParamList &
  MoreStackParamList &
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
  const navigation = useNavigation<
    StackNavigationProp<SettingsStackParamList>
  >()

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
            routes: [{name: wrapper.route.Settings.name}],
          })
          navigation.navigate(wrapper.route.Settings.name, {
            screen: wrapper.route.Step1BackupWallet.name,
            params: {
              wallet: props.wallet,
            },
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
        <LinearLayout orientation="horiz">
          <TextView color="text.2" fontSize="10px" mb="4px" width="98%">
            {i18n.t('components.notification.title')}
          </TextView>
          <ButtonView alignSelf="flex-start" width="2%" onPress={() => close()}>
            <ImageView
              height={'9px'}
              width={'9px'}
              source={require('~src/assets/images/button_close_white.png')}
            />
          </ButtonView>
        </LinearLayout>
        <TextView color="text.0" fontSize="15px" lineHeight="15px" weight={1}>
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

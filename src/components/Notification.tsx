import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { Shadow } from 'react-native-shadow-2'
import { useDispatch } from 'react-redux'

import { TabStackParamList } from '../navigation/TabNavigation'
import { WalletStackParamList } from '../navigation/WalletsStackNavigation'
import { walletReducerActions } from '../store/wallet/WalletReducer'

import { wrapper } from '~src/app/ApplicationWrapper'
import { Wallet } from '~src/models/redux/Wallet'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ButtonView, ButtonWithoutFeedbackView, ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface Props {
  wallet: Wallet
  text: string
  onClose?: () => void
}

const Notification = (props: Props) => {
  const dispatch = useDispatch()
  const navigation = useNavigation<StackNavigationProp<RootStackParamList & TabStackParamList & WalletStackParamList>>()

  const close = async () => {
    if (!props.wallet.id) return

    props.wallet.showBackupAlert = false
    dispatch(walletReducerActions.saveWallet(props.wallet))

    if (props.onClose) props.onClose()
  }

  const handlePress = () => {
    navigation.navigate(wrapper.route.Tab.name, {
      screen: wrapper.route.ListWallets.name,
      params: {
        screen: wrapper.route.Step1BackupWallet.name,
        params: {
          wallet: props.wallet,
          accessByNotification: true,
        },
      },
    })
  }

  return (
    <ButtonWithoutFeedbackView onPress={handlePress}>
      <Shadow viewStyle={{ width: '100%' }}>
        <LinearLayout
          orientation="verti"
          height={72}
          width="100%"
          bg="background.1"
          borderColor="primary"
          borderRadius="7px"
          borderLeftWidth="7px"
        >
          <LinearLayout orientation="horiz" justifyContent="space-between">
            <TextView color="text.2" fontSize="10px" mb="4px" px="11px" pt="8px">
              {i18n.t('components.notification.title')}
            </TextView>
            <ButtonView alignSelf="flex-start" onPress={() => close()} px="11px" py="8px">
              <ImageView
                source={require('~src/assets/images/button_close_white.png')}
                style={{
                  height: 9,
                  width: 9,
                }}
              />
            </ButtonView>
          </LinearLayout>
          <TextView color="text.0" fontSize="15px" lineHeight="15px" weight={1} px="11px" pb="8px">
            {props.text}
          </TextView>
        </LinearLayout>
      </Shadow>
    </ButtonWithoutFeedbackView>
  )
}

export default Notification

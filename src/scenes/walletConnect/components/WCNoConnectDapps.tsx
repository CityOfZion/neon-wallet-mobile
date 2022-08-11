import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useCallback } from 'react'
import { Dimensions, TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { TextView, LinearLayout, ImageView } from '~/src/styles/styled-components'
import ScreenLayout from '~src/components/layout/ScreenLayout'

export const WCNoConnectDapps = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList & ModalStackParamList>>()
  const { isConnected } = useSelector((state: RootState) => state.network)

  const handleNavigation = useCallback(() => {
    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WCConnectDappModal.name,
    })
  }, [])

  return (
    <ScreenLayout darkerSolidColorBG>
      <LinearLayout height="100%" pt={Dimensions.get('window').height * 0.2}>
        <LinearLayout height={200} justifyContent="space-around">
          <TextView fontFamily="medium" fontSize="24px" color="#899fa8" textAlign="center">
            {i18n.t('walletconnect.noDAppsConnected')}
          </TextView>
          <TouchableWithoutFeedback onPress={handleNavigation} disabled={!isConnected}>
            <LinearLayout
              orientation="horiz"
              width="385px"
              alignItems="center"
              justifyContent="center"
              borderStyle="dashed"
              borderColor="#54686b"
              borderRadius={8}
              borderWidth={1}
              padding={4}
            >
              <ImageView source={require('~src/assets/images/icon-plus-white.png')} style={{ marginRight: 8 }} />

              <TextView color="white" fontSize={18} fontFamily="medium">
                {i18n.t('walletconnect.connectDAppLabel')}
              </TextView>
            </LinearLayout>
          </TouchableWithoutFeedback>
        </LinearLayout>
      </LinearLayout>
    </ScreenLayout>
  )
}

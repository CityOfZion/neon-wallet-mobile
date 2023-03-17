import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useState, useCallback } from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import InputWithValidation from '~/src/components/InputWithValidation'
import ThemedButton from '~/src/components/themed/ThemedButton'
import { WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { LinearLayout, TextView } from '~/src/styles/styled-components'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'

interface WCConnectDappModalProps {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'WCConnectDappModal'>
}

export const WCConnectDappModal = (props: WCConnectDappModalProps) => {
  const [url, setUrl] = useState<string>('')
  const isConnected = useSelector((state: RootState) => state.network.isConnected)
  const controller = useSwiperController(true)
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const validateURL = useCallback(() => {
    return WalletConnectHelper.isValidURI(url)
  }, [url])

  const handleChange = (text: string) => {
    setUrl(text)
  }

  const handleScan = (data: string) => {
    if (!WalletConnectHelper.isValidURI(data)) return

    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WCConnectionRequestModal.name,
      params: {
        uri: data,
      },
    })
  }

  const handlePress = useCallback(() => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WCConnectionRequestModal.name,
      params: {
        uri: url,
      },
    })
  }, [url])

  return (
    <SwiperPanel
      padding={20}
      fullSize
      controller={controller}
      rightButton={<CloseButton mr="20px" />}
      title={i18n.t('modals.connectDApp.title')}
      onClose={props.navigation.goBack}
      onRightPress={controller.close}
      solidColorBG
    >
      <LinearLayout height="100%" justifyContent="space-between">
        <LinearLayout height="50%" justifyContent="space-between" pb={5}>
          <TextView color="#fff" fontFamily="regular" fontSize="18px" pt={5} textAlign="center">
            {i18n.t('modals.connectDApp.subtitle')}
          </TextView>

          <LinearLayout>
            <TextView color="#fff" fontFamily="bold" fontSize="14px" pt={7} pb={3}>
              {i18n.t('modals.connectDApp.url')}
            </TextView>
            <LinearLayout ml={-5} mr={-5}>
              <InputWithValidation
                onChangeText={handleChange}
                onScan={handleScan}
                color="text.10"
                separatorColor="text.3"
                invalidColor="text.10"
                validator={validateURL}
                value={url}
                placeholder={i18n.t('modals.connectDApp.placeholder')}
                invalidMessageColor={theme.colors.quinary}
              />
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>

        <LinearLayout>
          <ThemedButton
            label={i18n.t('modals.connectDApp.connectLabel')}
            disabled={!validateURL() || !isConnected}
            onPress={handlePress}
          />
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

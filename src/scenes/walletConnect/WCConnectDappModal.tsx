import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import InputLabel from '~/src/components/InputLabel'
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

  const handleScan = (data: string) => {
    if (!WalletConnectHelper.isValidURI(data)) return

    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WCConnectionRequestModal.name,
      params: {
        uri: data,
      },
    })
  }

  const handlePress = () => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WCConnectionRequestModal.name,
      params: {
        uri: url,
      },
    })
  }

  return (
    <SwiperPanel
      controller={controller}
      rightButton={<CloseButton onPress={controller.close} />}
      title={i18n.t('modals.connectDApp.title')}
      onClose={props.navigation.goBack}
      contentStyle={{ justifyContent: 'space-between' }}
    >
      <LinearLayout justifyContent="space-between">
        <TextView color="#fff" fontFamily="regular" fontSize="18px" pt={5} textAlign="center">
          {i18n.t('modals.connectDApp.subtitle')}
        </TextView>

        <LinearLayout mt="64px">
          <InputLabel title={i18n.t('modals.connectDApp.url')} color="text.0" />

          <InputWithValidation
            sideMargins={0}
            onChangeText={setUrl}
            onScan={handleScan}
            color="text.10"
            separatorColor="text.3"
            invalidColor="text.10"
            validator={WalletConnectHelper.isValidURI}
            value={url}
            placeholder={i18n.t('modals.connectDApp.placeholder')}
            invalidMessageColor={theme.colors.quinary}
          />
        </LinearLayout>
      </LinearLayout>

      <ThemedButton
        label={i18n.t('modals.connectDApp.connectLabel')}
        disabled={!WalletConnectHelper.isValidURI(url) || !isConnected}
        onPress={handlePress}
      />
    </SwiperPanel>
  )
}

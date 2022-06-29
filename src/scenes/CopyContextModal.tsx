import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import * as Sharing from 'expo-sharing'
import { SharingOptions } from 'expo-sharing/src/Sharing'
import i18n from 'i18n-js'
import React, { Fragment } from 'react'
import { ImageLoadEventData, TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'

import { RootState } from '../store/RootStore'

import { wrapper } from '~src/app/ApplicationWrapper'
import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
import { UtilsHelper } from '~src/helpers/UtilsHelper'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export interface CopyContextModalParams {
  qrCode: string // File URI
  address: string
}

interface CopyContextModalProps {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'CopyContextModal'>
}

interface ListItem {
  title: string
  source: ImageLoadEventData
  onClick: () => void
}

export const CopyContextModal = (props: CopyContextModalProps) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const controller = useSwiperController(true)

  const items: ListItem[] = [
    {
      title: i18n.t('modals.copyContext.shareQr'),
      source: require('~src/assets/images/icon-circle-qr-primary.png'),
      onClick: () => {
        const options: SharingOptions = {
          mimeType: 'image/*',
          dialogTitle: i18n.t('modals.copyContext.shareQr'),
          UTI: 'public.png',
        }

        Sharing.shareAsync(props.route.params.qrCode, options)
      },
    },
    {
      title: i18n.t('modals.copyContext.copyAddress'),
      source: require('~src/assets/images/icon-circle-location-primary.png'),
      onClick: () => UtilsHelper.copyToClipboard(props.route.params.address),
    },
  ]

  const runClosing = (callback: () => void) => {
    controller.close()
    callback()
  }

  return (
    <SwiperPanel controller={controller} noHeader padding={36} onClose={props.navigation.goBack} solidColorBG>
      <>
        {items.map((item, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => {
              runClosing(item.onClick)
            }}
          >
            <LinearLayout>
              <LinearLayout orientation="horiz" pb="18px" pt="16px" alignItems="center">
                <LinearLayout>
                  <TextView color={theme.colors.text[0]} fontSize={18} fontFamily="regular">
                    {item.title}
                  </TextView>
                </LinearLayout>
                <LinearLayout weight={1} />
                <ImageView width={35} height={35} mr="13px" source={item.source} />
              </LinearLayout>

              <LinearLayout height="1px" bg={theme.colors.background[5]} />
            </LinearLayout>
          </TouchableWithoutFeedback>
        ))}
        <TouchableWithoutFeedback onPress={controller.close}>
          <TextView mt={38} mb={12} color="primary" fontSize={22} textAlign="center">
            {i18n.t('modals.copyContext.cancel')}
          </TextView>
        </TouchableWithoutFeedback>
      </>
    </SwiperPanel>
  )
}

export default CopyContextModal

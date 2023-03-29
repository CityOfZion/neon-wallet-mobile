import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import * as Sharing from 'expo-sharing'
import { SharingOptions } from 'expo-sharing/src/Sharing'
import i18n from 'i18n-js'
import React, { Fragment, useRef } from 'react'
import { ImageSourcePropType } from 'react-native'

import { AlterMenuItem } from '../components/AlterMenuItem'
import ThemedButton from '../components/themed/ThemedButton'

import SwiperPanel, { useSwiperController } from '~src/components/SwiperPanel'
import { UtilsHelper } from '~src/helpers/UtilsHelper'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { LinearLayout } from '~src/styles/styled-components'

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
  source: ImageSourcePropType
  onClick: () => void
}

export const CopyContextModal = (props: CopyContextModalProps) => {
  const controller = useSwiperController(true)

  const callback = useRef<() => Promise<void> | void>()

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

  const run = (cb: () => void) => {
    callback.current = cb
    controller.close()
  }

  const handleClose = () => {
    props.navigation.goBack()

    if (callback.current) {
      callback.current()
    }
  }
  return (
    <SwiperPanel controller={controller} withoutHeader size="dinamic" onClose={handleClose}>
      <>
        {items.map(item => (
          <AlterMenuItem onPress={() => run(item.onClick)} icon={item.source} title={item.title} key={item.title} />
        ))}

        <LinearLayout mt="38px">
          <ThemedButton flat label={i18n.t('modals.copyContext.cancel')} />
        </LinearLayout>
      </>
    </SwiperPanel>
  )
}

export default CopyContextModal

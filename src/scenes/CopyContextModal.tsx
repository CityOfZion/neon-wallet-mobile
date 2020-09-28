import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import * as Sharing from 'expo-sharing'
import {SharingOptions} from 'expo-sharing/src/Sharing'
import React, {Fragment} from 'react'
import {ImageSourcePropType, TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

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
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const controller = useSwiperController(true)

  const items: ListItem[] = [
    {
      title: Facade.t('modals.copyContext.shareQr'),
      source: require('~src/assets/images/icon-circle-qr-primary.png'),
      onClick: () => {
        const options: SharingOptions = {
          mimeType: 'image/*',
          dialogTitle: Facade.t('modals.copyContext.shareQr'),
          UTI: 'public.png',
        }

        Sharing.shareAsync(props.route.params.qrCode, options)
      },
    },
    {
      title: Facade.t('modals.copyContext.copyAddress'),
      source: require('~src/assets/images/icon-circle-location-primary.png'),
      onClick: () => Facade.utils.copyToClipboard(props.route.params.address),
    },
  ]

  const runClosing = (callback: () => void) => {
    controller.close()
    callback()
  }

  return (
    <SwiperPanel
      controller={controller}
      noHeader={true}
      padding={36}
      onClose={props.navigation.goBack}
    >
      <Fragment>
        {items.map((item, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => {
              runClosing(item.onClick)
            }}
          >
            <LinearLayout>
              <LinearLayout
                orientation="horiz"
                pb="18px"
                pt="16px"
                alignItems="center"
              >
                <ImageView
                  width={35}
                  height={35}
                  mr="13px"
                  source={item.source}
                />

                <LinearLayout>
                  <TextView
                    color={theme.colors.text[0]}
                    fontSize={18}
                    fontFamily="bold"
                  >
                    {item.title}
                  </TextView>
                </LinearLayout>
              </LinearLayout>

              <LinearLayout height="1px" bg={theme.colors.background[5]} />
            </LinearLayout>
          </TouchableWithoutFeedback>
        ))}
        <TouchableWithoutFeedback onPress={controller.close}>
          <TextView
            mt={38}
            mb={12}
            color="primary"
            fontSize={22}
            textAlign="center"
          >
            {Facade.t('modals.copyContext.cancel')}
          </TextView>
        </TouchableWithoutFeedback>
      </Fragment>
    </SwiperPanel>
  )
}

export default CopyContextModal

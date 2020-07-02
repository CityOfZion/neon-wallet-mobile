import {useNavigation} from '@react-navigation/native'
import i18n from 'i18n-js'
import React from 'react'
import {ImageSourcePropType, TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {FOOTER_HEIGHT} from '~/constants'
import {useRoutePath} from '~src/app/RouteUtils'
import SwiperPanel, {SwiperController} from '~src/components/SwiperPanel'
import {RootState} from '~src/store/reducers/root'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface ListItem {
  title: string
  subtitle: string
  source: ImageSourcePropType
  onClick: () => void
}

interface Props {
  controller: SwiperController
}

export default function QuickToolsMenu(props: Props) {
  const theme = useSelector((state: RootState) => state.themeReducer.theme)
  const navigation = useNavigation()
  const path = useRoutePath()

  const items: ListItem[] = [
    {
      title: i18n.t('quickTools.qrCode.title'),
      subtitle: i18n.t('quickTools.qrCode.subtitle'),
      source: require('~src/assets/images/icon-circle-qr-primary.png'),
      onClick: () =>
        navigation.navigate(path.QuickTools.name, {
          screen: path.QrCodeScanTest.name,
        }),
    },
    {
      title: i18n.t('quickTools.send.title'),
      subtitle: i18n.t('quickTools.send.subtitle'),
      source: require('~src/assets/images/icon-circle-send-primary.png'),
      onClick: () =>
        navigation.navigate('Modal', {
          screen: path.SendWalletSelectionModal.name,
        }),
    },
    {
      title: i18n.t('quickTools.receive.title'),
      subtitle: i18n.t('quickTools.receive.subtitle'),
      source: require('~src/assets/images/icon-circle-receive-primary.png'),
      onClick: () =>
        navigation.navigate('Modal', {
          screen: path.ReceiveWalletSelectionModal.name,
        }),
    },
  ]

  function runClosing(callback: () => void) {
    props.controller.close()
    callback()
  }

  return (
    <SwiperPanel
      controller={props.controller}
      noHeader={true}
      draggable={false}
      paddingLeft={36}
      paddingRight={36}
      paddingTop={40}
      paddingBottom={24 + FOOTER_HEIGHT}
    >
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
                <TextView
                  color={theme.colors.text[6]}
                  fontSize={16}
                  fontFamily="medium"
                >
                  {item.subtitle}
                </TextView>
              </LinearLayout>
            </LinearLayout>

            <LinearLayout height="1px" bg={theme.colors.background[5]} />
          </LinearLayout>
        </TouchableWithoutFeedback>
      ))}
    </SwiperPanel>
  )
}

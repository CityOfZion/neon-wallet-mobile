import {useNavigation} from '@react-navigation/native'
import React from 'react'
import {ImageSourcePropType, TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import SwiperPanel, {SwiperController} from '~src/components/SwiperPanel'
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
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )
  const navigation = useNavigation()

  const items: ListItem[] = [
    {
      title: Facade.t('quickTools.qrCode.title'),
      subtitle: Facade.t('quickTools.qrCode.subtitle'),
      source: require('~src/assets/images/icon-circle-qr-primary.png'),
      onClick: () => navigation.navigate(Facade.route.QRCodeScan.name),
    },
    {
      title: Facade.t('quickTools.send.title'),
      subtitle: Facade.t('quickTools.send.subtitle'),
      source: require('~src/assets/images/icon-circle-send-primary.png'),
      onClick: () =>
        navigation.navigate(Facade.route.Modal.name, {
          screen: Facade.route.SendWalletSelectionModal.name,
        }),
    },
    {
      title: Facade.t('quickTools.receive.title'),
      subtitle: Facade.t('quickTools.receive.subtitle'),
      source: require('~src/assets/images/icon-circle-receive-primary.png'),
      onClick: () =>
        navigation.navigate(Facade.route.Modal.name, {
          screen: Facade.route.ReceiveWalletSelectionModal.name,
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
      paddingLeft={Facade.scale<number>(36)}
      paddingRight={Facade.scale<number>(36)}
      paddingTop={20}
      paddingBottom={24 + Facade.app.footerHeight}
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
              <LinearLayout>
                <TextView
                  color={theme.colors.text[0]}
                  fontSize={18}
                  fontFamily="regular"
                  fontWeight={500}
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
              <LinearLayout weight={1}/>
              <ImageView
                width={35}
                height={35}
                mr="13px"
                source={item.source}
              />
            </LinearLayout>

            <LinearLayout height="1px" bg={theme.colors.background[5]} />
          </LinearLayout>
        </TouchableWithoutFeedback>
      ))}
    </SwiperPanel>
  )
}

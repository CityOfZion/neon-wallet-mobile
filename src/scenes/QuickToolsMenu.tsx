import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { ImageLoadEventData, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

import { RootState } from '../store/RootStore'

import { wrapper } from '~src/app/ApplicationWrapper'
import SwiperPanel, { SwiperController } from '~src/components/SwiperPanel'
import { applicationConfig } from '~src/config/ApplicationConfig'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface ListItem {
  title: string
  subtitle: string
  source: ImageLoadEventData
  onClick: () => void
}

interface Props {
  controller: SwiperController
}

function QuickToolsItem(props: { onPress: () => void; item: ListItem; index: number; listItems: ListItem[] }) {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        {
          backgroundColor: pressed ? theme.colors.background[16] : undefined,
        },
      ]}
    >
      {() => (
        <LinearLayout paddingRight={25} paddingLeft={25}>
          <LinearLayout orientation="horiz" pb="18px" pt="16px" alignItems="center">
            <LinearLayout>
              <TextView
                style={{ includeFontPadding: false }}
                color={theme.colors.text[0]}
                fontSize={18}
                fontFamily="regular"
              >
                {props.item.title}
              </TextView>
              <TextView
                style={{ includeFontPadding: false }}
                color={theme.colors.text[6]}
                fontSize={16}
                fontFamily="medium"
              >
                {props.item.subtitle}
              </TextView>
            </LinearLayout>
            <LinearLayout weight={1} />
            <ImageView width={35} height={35} mr="13px" source={props.item.source} />
          </LinearLayout>

          {props.index !== props.listItems.length - 1 && (
            <LinearLayout height="1px" bg={theme.colors.background[10]} width="96%" />
          )}
        </LinearLayout>
      )}
    </Pressable>
  )
}

export default function QuickToolsMenu(props: Props) {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>()

  const items: ListItem[] = [
    {
      title: i18n.t('quickTools.qrCode.title'),
      subtitle: i18n.t('quickTools.qrCode.subtitle'),
      source: require('~src/assets/images/icon-circle-qr-primary.png'),
      onClick: () => navigation.navigate(wrapper.route.QRCodeScan.name, {}),
    },
    {
      title: i18n.t('quickTools.send.title'),
      subtitle: i18n.t('quickTools.send.subtitle'),
      source: require('~src/assets/images/icon-circle-send-primary.png'),
      onClick: () =>
        navigation.navigate(wrapper.route.Modal.name, {
          screen: wrapper.route.SendTransactionWalletSelectionModal.name,
          params: {},
        }),
    },
    {
      title: i18n.t('quickTools.receive.title'),
      subtitle: i18n.t('quickTools.receive.subtitle'),
      source: require('~src/assets/images/icon-circle-receive-primary.png'),
      onClick: () =>
        navigation.navigate(wrapper.route.Modal.name, {
          screen: wrapper.route.ReceiveModalStack.name,
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
      noHeader
      draggable
      paddingTop={20}
      paddingBottom={24 + applicationConfig.footerHeight + useSafeAreaInsets().bottom}
      paddingLeft={0}
      paddingRight={0}
      solidColorBG
    >
      {items.map((item, index) => (
        <QuickToolsItem
          key={index}
          onPress={() => {
            runClosing(item.onClick)
          }}
          item={item}
          index={index}
          listItems={items}
        />
      ))}
    </SwiperPanel>
  )
}

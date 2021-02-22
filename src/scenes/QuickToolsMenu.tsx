import {useNavigation} from '@react-navigation/native'
import React, {useState} from 'react'
import {ImageSourcePropType, Pressable} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import SwiperPanel, {SwiperController} from '~src/components/SwiperPanel'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

interface ListItem {
  title: string
  subtitle: string
  source: ImageSourcePropType
  onClick: () => void
}

interface Props {
  controller: SwiperController
}

function QuickToolsItem(props: {
  onPress: () => void
  item: ListItem
  index: number
  listItems: ListItem[]
}) {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  return (
    <Pressable
      onPress={props.onPress}
      style={({pressed}) => [
        {
          backgroundColor: pressed ? theme.colors.background[16] : undefined,
        },
      ]}
    >
      {({pressed}) => (
        <LinearLayout paddingRight={25} paddingLeft={25}>
          <LinearLayout
            orientation="horiz"
            pb="18px"
            pt="16px"
            alignItems="center"
          >
            <LinearLayout>
              <TextView
                style={{includeFontPadding: false}}
                color={theme.colors.text[0]}
                fontSize={18}
                fontFamily="regular"
              >
                {props.item.title}
              </TextView>
              <TextView
                style={{includeFontPadding: false}}
                color={theme.colors.text[6]}
                fontSize={16}
                fontFamily="medium"
              >
                {props.item.subtitle}
              </TextView>
            </LinearLayout>
            <LinearLayout weight={1} />
            <ImageView
              width={35}
              height={35}
              mr="13px"
              source={props.item.source}
            />
          </LinearLayout>

          {props.index !== props.listItems.length - 1 && (
            <LinearLayout
              height="1px"
              bg={theme.colors.background[10]}
              width={'96%'}
            />
          )}
        </LinearLayout>
      )}
    </Pressable>
  )
}

export default function QuickToolsMenu(props: Props) {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  const [isSelected, setSelected] = useState(false)

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
          screen: Facade.route.SendModalStack.name,
        }),
    },
    {
      title: Facade.t('quickTools.receive.title'),
      subtitle: Facade.t('quickTools.receive.subtitle'),
      source: require('~src/assets/images/icon-circle-receive-primary.png'),
      onClick: () =>
        navigation.navigate(Facade.route.Modal.name, {
          screen: Facade.route.ReceiveModalStack.name,
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
      draggable={true}
      paddingTop={20}
      paddingBottom={24 + Facade.app.footerHeight + useSafeAreaInsets().bottom}
      paddingLeft={0}
      paddingRight={0}
      solidColorBG={true}
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

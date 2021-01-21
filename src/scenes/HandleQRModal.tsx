import {CommonActions} from '@react-navigation/native'
import React from 'react'
import {ImageSourcePropType, TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import SwiperPanel, {SwiperController} from '~src/components/SwiperPanel'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'
interface ListItem {
  title: string
  subtitle: string
  source: ImageSourcePropType
  onClick: () => void
}

export interface Props {
  controller: SwiperController
  address: string
  onClick?: (action: CommonActions.Action) => void
}

const HandleQRModal = (props: Props) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  const items: ListItem[] = [
    {
      title: Facade.t('modals.handleQrCode.send.title'),
      subtitle: Facade.t('modals.handleQrCode.send.subtitle'),
      source: require('~src/assets/images/icon-circle-send-primary.png'),
      onClick: () =>
        props?.onClick?.(
          CommonActions.navigate(Facade.route.Modal.name, {
            screen: Facade.route.SendModalStack.name,
            params: {
              screen: Facade.route.SendWalletSelectionModal.name,
              params: {
                uri: {address: props.address},
              },
            },
          })
        ),
    },
    {
      title: Facade.t('modals.handleQrCode.watch.title'),
      subtitle: Facade.t('modals.handleQrCode.watch.subtitle'),
      source: require('~src/assets/images/icon-cicle-watch-primary.png'),
      onClick: () =>
        props?.onClick?.(
          CommonActions.navigate(Facade.route.Tab.name, {
            screen: Facade.route.More.name,
            params: {
              screen: Facade.route.ImportReadAccount.name,
              initial: false,
              params: {
                address: props.address,
              },
            },
          })
        ),
    },
    {
      title: Facade.t('modals.handleQrCode.contact.title'),
      subtitle: Facade.t('modals.handleQrCode.contact.subtitle'),
      source: require('~src/assets/images/icon-cicle-contacts-primary.png'),
      onClick: () => console.log('TODO'),
    },
  ]

  return (
    <SwiperPanel
      controller={props.controller}
      draggable={false}
      paddingTop={0}
      paddingBottom={42}
      noHeader={true}
      solidColorBG={true}
    >
      <LinearLayout height={'60px'} />
      <LinearLayout>
        {items.map((item, index) => (
          <>
            <TouchableWithoutFeedback key={index} onPress={item.onClick}>
              <LinearLayout mx="10px">
                <LinearLayout
                  orientation="horiz"
                  pb="18px"
                  pt="16px"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <LinearLayout>
                    <TextView color={theme.colors.text[0]} fontSize={18}>
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

                  <ImageView width={36} height={36} source={item.source} />
                </LinearLayout>

                <LinearLayout height="1px" bg={theme.colors.background[5]} />
              </LinearLayout>
            </TouchableWithoutFeedback>
          </>
        ))}
      </LinearLayout>
      <LinearLayout
        position={'absolute'}
        right={Facade.scale(-18)}
        top={Facade.scale(3)}
      >
        <ThemedCloseButton
          iconSize={[18, 27]}
          onPress={props.controller.close}
        />
      </LinearLayout>
    </SwiperPanel>
  )
}

export default HandleQRModal

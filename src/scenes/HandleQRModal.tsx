import {CommonActions} from '@react-navigation/native'
import i18n from 'i18n-js'
import React from 'react'
import {ImageLoadEventData, TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {wrapper} from '~src/app/ApplicationWrapper'
import {Normalize} from '~src/app/Normalize'
import SwiperPanel, {SwiperController} from '~src/components/SwiperPanel'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface ListItem {
  title: string
  subtitle: string
  source: ImageLoadEventData
  onClick: () => void
}

export interface Props {
  controller: SwiperController
  address: string
  onClick?: (action: CommonActions.Action) => void
}

const HandleQRModal = (props: Props) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  const items: ListItem[] = [
    {
      title: i18n.t('modals.handleQrCode.send.title'),
      subtitle: i18n.t('modals.handleQrCode.send.subtitle'),
      source: require('~src/assets/images/icon-circle-send-primary.png'),
      onClick: () =>
        props?.onClick?.(
          CommonActions.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.SendModalStack.name,
            params: {
              screen: wrapper.route.SendWalletSelectionModal.name,
              params: {
                uri: {address: props.address},
              },
            },
          })
        ),
    },
    {
      title: i18n.t('modals.handleQrCode.watch.title'),
      subtitle: i18n.t('modals.handleQrCode.watch.subtitle'),
      source: require('~src/assets/images/icon-cicle-watch-primary.png'),
      onClick: () =>
        props?.onClick?.(
          CommonActions.navigate(wrapper.route.Tab.name, {
            screen: wrapper.route.More.name,
            params: {
              screen: wrapper.route.ImportReadAccount.name,
              initial: false,
              params: {
                address: props.address,
              },
            },
          })
        ),
    },
    {
      title: i18n.t('modals.handleQrCode.contact.title'),
      subtitle: i18n.t('modals.handleQrCode.contact.subtitle'),
      source: require('~src/assets/images/icon-cicle-contacts-primary.png'),
      onClick: () =>
        props?.onClick?.(
          CommonActions.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.PersistContact.name,
            params: {
              addingContact: true,
              startingAddress: props.address,
            },
          })
        ),
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
      <LinearLayout height={'35px'} />
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
        right={Normalize.scale(-18)}
        top={Normalize.scale(3)}
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

import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, {Fragment} from 'react'
import {ImageLoadEventData, TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {wrapper} from '../app/ApplicationWrapper'

import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import {Wallet} from '~src/models/redux/Wallet'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

export interface WalletContextModalParams {
  wallets: Wallet[]
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'WalletContextModal'>
}

interface ListItem {
  title: string
  source: ImageLoadEventData
  onClick: () => void
}

export default function WalletContextModal(props: Props) {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )
  const controller = useSwiperController(true)
  const items: ListItem[] =
    props.route.params.wallets.length > 1
      ? [
          {
            title: i18n.t('modals.walletContext.create'),
            source: require('~src/assets/images/icon-circle-plus-green.png'),
            onClick: () => {
              props.navigation.navigate(wrapper.route.Tab.name, {
                screen: wrapper.route.More.name,
                params: {
                  screen: wrapper.route.Step1CreateWallet.name,
                  initial: false,
                  params: {
                    source: wrapper.route.WalletContextModal.name,
                  },
                },
              })
            },
          },
          {
            title: i18n.t('modals.walletContext.reorder'),
            source: require('~src/assets/images/icon-circle-swap-green.png'),
            onClick: () => {
              props.navigation.navigate(wrapper.route.ReorderWalletModal.name)
            },
          },
        ]
      : [
          {
            title: i18n.t('modals.walletContext.create'),
            source: require('~src/assets/images/icon-circle-plus-green.png'),
            onClick: () => {
              props.navigation.navigate(wrapper.route.Tab.name, {
                screen: wrapper.route.More.name,
                params: {
                  screen: wrapper.route.Step1CreateWallet.name,
                  initial: false,
                  params: {
                    source: wrapper.route.WalletContextModal.name,
                  },
                },
              })
            },
          },
        ]

  function runClosing(callback: () => void) {
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
                justifyContent="space-between"
              >
                <LinearLayout>
                  <TextView color={theme.colors.text[0]} fontSize={18}>
                    {item.title}
                  </TextView>
                </LinearLayout>

                <ImageView
                  width={35}
                  height={35}
                  ml="13px"
                  source={item.source}
                />
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
            {i18n.t('modals.walletContext.cancel')}
          </TextView>
        </TouchableWithoutFeedback>
      </Fragment>
    </SwiperPanel>
  )
}

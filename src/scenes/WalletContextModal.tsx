import {StackNavigationProp} from '@react-navigation/stack'
import React, {Fragment} from 'react'
import {ImageSourcePropType, TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<ModalStackParamList & TabStackParamList>
}

interface ListItem {
  title: string
  source: ImageSourcePropType
  onClick: () => void
}

export default function WalletContextModal(props: Props) {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const controller = useSwiperController(true)

  const items: ListItem[] = [
    {
      title: Facade.t('modals.walletContext.create'),
      source: require('~src/assets/images/icon-circle-plus-green.png'),
      onClick: () => {
        props.navigation.navigate(Facade.route.More.name, {
          screen: Facade.route.Step1CreateWallet.name,
        })
      },
    },
    {
      title: Facade.t('modals.walletContext.reorder'),
      source: require('~src/assets/images/icon-circle-swap-green.png'),
      onClick: () => {
        props.navigation.navigate(Facade.route.ReoderWalletModal.name)
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
            {Facade.t('modals.walletContext.cancel')}
          </TextView>
        </TouchableWithoutFeedback>
      </Fragment>
    </SwiperPanel>
  )
}

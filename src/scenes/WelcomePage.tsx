import { RouteProp, CommonActions } from '@react-navigation/native'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Image, ScrollView, Dimensions } from 'react-native'

import { StackNavigationProp } from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import { wrapper } from '~src/app/ApplicationWrapper'
import { Normalize } from '~src/app/Normalize'
import { Storage } from '~src/app/Storage'
import SwiperPanel, { PANEL_OFFSET, useSwiperController } from '~src/components/SwiperPanel'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import { ThemedFlatButton } from '~src/components/themed/ThemedFlatButton'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { TabStackParamList } from '~src/navigation/TabNavigation'
import { LinearLayout, TextView } from '~src/styles/styled-components'
// Why are you like this, Typescript
type ParamList = TabStackParamList & RootStackParamList

export interface WelcomeModalParam {
  showChangelog?: boolean
}

interface Props {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<ModalStackParamList, 'WelcomeModal'>
}

const WelcomePage = (props: Props) => {
  const controller = useSwiperController(true)
  const [action, setAction] = useState<CommonActions.Action>()
  const showChangelog = props.route.params?.showChangelog

  const persist = async (value: boolean) => {
    await Storage.welcomeHidden.save(value)
  }

  const closeTo = async (...arg: NavParam<ParamList>) => {
    await persist(true)
    setAction(CommonActions.navigate(...arg))
    controller.close()
  }
  const imgWidth = Dimensions.get('window').width * 1.1
  const imgHeight = Dimensions.get('window').height * 0.55
  return (
    <SwiperPanel
      controller={controller}
      fullSize
      paddingTop={20}
      noHeader
      onClose={() => {
        if (showChangelog) {
          persist(true)
          props.navigation.navigate(wrapper.route.Modal.name, {
            screen: wrapper.route.ChangelogModal.name,
          })
        } else if (action) {
          props.navigation.dispatch(action)
        } else {
          props.navigation.goBack()
        }
      }}
      image={require('~/src/assets/images/icon-plus-circle-white.png')}
      disableDefaultScrollView
      darkerSolidColorBG
    >
      <ScrollView style={{ marginHorizontal: -20 }}>
        <LinearLayout mb={PANEL_OFFSET} pt={30} flex={1}>
          <LinearLayout weight={1} />
          <Image
            source={require('~src/assets/images/get_started.png')}
            style={{
              width: imgWidth * 1.2,
              height: imgHeight * 1.2,
              marginLeft: 10,
              resizeMode: 'contain',
              alignSelf: 'center',
              marginTop: 10,
            }}
            width={imgWidth}
            height={imgHeight}
            resizeMode="contain"
          />
          <TextView mb={5} color="primary" fontSize={Normalize.scale(30)} fontFamily="regular" textAlign="center">
            {i18n.t('welcome.title')}
          </TextView>

          <TextView mb={6} mr={5} ml={5} color="text.0" fontSize="lg" textAlign="center">
            {i18n.t('welcome.body_1_1_2')}
          </TextView>

          <LinearLayout weight={1} />

          <LinearLayout mt={3} mb={6} style={{ alignSelf: 'center', width: '85%' }}>
            <ThemedFlatButton
              text={i18n.t('welcome.button_3')}
              onPress={() => {
                closeTo(
                  // TODO: figure out a way to remove the explicity of 'undefined'
                  wrapper.route.Tab.name,
                  undefined
                )
              }}
              alignItems="flex-start"
              textAlign="center"
            />
          </LinearLayout>

          <LinearLayout position="absolute" right={Normalize.scale(2)} top={Normalize.scale(-10)}>
            <ThemedCloseButton
              iconSize={[18, 18]}
              onPress={() =>
                closeTo(
                  // TODO: figure out a way to remove the explicity of 'undefined'
                  wrapper.route.Tab.name,
                  undefined
                )
              }
            />
          </LinearLayout>
        </LinearLayout>
      </ScrollView>
    </SwiperPanel>
  )
}

WelcomePage.propTypes = {
  onClose: PropTypes.func,
}

export default WelcomePage

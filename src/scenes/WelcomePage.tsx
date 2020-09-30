import {RouteProp, CommonActions} from '@react-navigation/native'
import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {TouchableWithoutFeedback} from 'react-native'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import SwiperPanel, {
  PANEL_OFFSET,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCheckbox from '~src/components/themed/ThemedCheckbox'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {ThemedFlatButton} from '~src/components/themed/ThemedFlatButton'
import {RootStackParamList} from '~src/navigation/AppNavigation'
import {LoginStackParamList} from '~src/navigation/LoginStackNavigation'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

// Why are you like this, Typescript
type ParamList = LoginStackParamList & TabStackParamList & RootStackParamList

interface Props {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<ModalStackParamList, keyof ModalStackParamList>
}

const WelcomePage = (props: Props) => {
  const controller = useSwiperController(true)
  const [action, setAction] = useState<CommonActions.Action>()

  const persist = async (value: boolean) => {
    await Storage.welcomeHidden.save(value)
  }

  const closeTo = (...arg: NavParam<ParamList>) => {
    setAction(CommonActions.navigate(...arg))
    controller.close()
  }

  return (
    <SwiperPanel
      controller={controller}
      fullSize={true}
      paddingTop={20}
      noHeader={true}
      onClose={() =>
        action ? props.navigation.dispatch(action) : props.navigation.goBack()
      }
      image={require('~/src/assets/images/icon-plus-circle-white.png')}
      disableDefaultScrollView={true}
    >
      <LinearLayout mb={PANEL_OFFSET} pt={30} flex={1}>
        <LinearLayout weight={1} />
        <TextView
          mb={5}
          color={'primary'}
          fontSize={Facade.scale(30)}
          fontFamily={'regular'}
          textAlign="center"
        >
          {Facade.t('welcome.title')}
        </TextView>

        <TextView mb={6} color={'text.0'} fontSize={'lg'} textAlign={'center'}>
          {Facade.t('welcome.body_1_1')}

          <TextView fontFamily={'bold'} color={'text.0'}>
            {Facade.t('welcome.body_1_2')}
          </TextView>

          {Facade.t('welcome.body_1_3')}

          <TextView fontFamily={'bold'} color={'text.0'}>
            {Facade.t('welcome.body_1_4')}
          </TextView>
        </TextView>

        <TextView mb={6} color={'text.0'} fontSize={'lg'} textAlign={'center'}>
          {Facade.t('welcome.body_2_1')}

          <TextView>{Facade.t('welcome.body_2_2')}</TextView>

          {Facade.t('welcome.body_2_3')}
        </TextView>

        <LinearLayout weight={1} />
        <TextView
          color={'text.11'}
          fontSize={'xl'}
          fontFamily={'bold'}
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
          mb={5}
          textAlign="center"
        >
          {Facade.t('welcome.label_1')}
        </TextView>

        <LinearLayout mt={3} mb={6} width={'100%'}>
          <ThemedFlatButton
            text={Facade.t('welcome.button_1')}
            onPress={() =>
              closeTo(Facade.route.Tab.name, {
                screen: Facade.route.More.name,
                params: {
                  screen: Facade.route.ImportKey.name,
                  initial: false,
                },
              })
            }
          />
          <ThemedFlatButton
            text={Facade.t('welcome.button_2')}
            onPress={() =>
              closeTo(Facade.route.Modal.name, {
                screen: Facade.route.ReceiveWalletSelectionModal.name,
              })
            }
          />
        </LinearLayout>
        <LinearLayout mb={6} alignSelf={'center'}>
          <ThemedCheckbox
            onChange={(checked) => persist(checked)}
            label={Facade.t('welcome.checkbox_1')}
            checked={true}
          />
        </LinearLayout>

        <LinearLayout
          position={'absolute'}
          right={Facade.scale(5)}
          top={Facade.scale(5)}
        >
          <ThemedCloseButton
            onPress={() =>
              closeTo(
                // TODO: figure out a way to remove the explicity of 'undefined'
                Facade.route.Tab.name,
                undefined
              )
            }
          />
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

WelcomePage.propTypes = {
  onClose: PropTypes.func,
}

export default WelcomePage

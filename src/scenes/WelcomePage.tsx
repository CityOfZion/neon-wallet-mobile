import {RouteProp, CommonActions} from '@react-navigation/native'
import PropTypes from 'prop-types'
import React, {useState} from 'react'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCheckbox from '~src/components/themed/ThemedCheckbox'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
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
    >
      <LinearLayout mb={5} alignItems={'center'}>
        <ImageView source={require('~/src/assets/images/logo-small.png')} />
        <TextView
          mt={-2}
          color={'text.0'}
          fontSize={'3xl'}
          letterSpacing={'3px'}
        >
          {Facade.t('welcome.brand')}
        </TextView>
      </LinearLayout>

      <TextView
        mb={5}
        color={'text.0'}
        fontSize={Facade.scale(36)}
        fontFamily={'bold'}
        textAlign="center"
      >
        {Facade.t('welcome.title')}
      </TextView>

      <TextView mb={6} color={'text.0'} fontSize={'lg'} textAlign={'center'}>
        {Facade.t('welcome.body_1_1')}

        <TextView
          onPress={() =>
            closeTo(Facade.route.Tab.name, {
              screen: Facade.route.Settings.name,
              initial: false,
            })
          }
          color={'primary'}
        >
          {Facade.t('welcome.body_1_2')}
        </TextView>

        {Facade.t('welcome.body_1_3')}

        <TextView
          onPress={() =>
            closeTo(Facade.route.Tab.name, {
              screen: Facade.route.ListWallets.name,
            })
          }
          color={'primary'}
        >
          {Facade.t('welcome.body_1_4')}
        </TextView>
      </TextView>

      <TextView mb={6} color={'text.0'} fontSize={'lg'} textAlign={'center'}>
        {Facade.t('welcome.body_2_1')}

        <TextView fontFamily={'bold'}>{Facade.t('welcome.body_2_2')}</TextView>

        {Facade.t('welcome.body_2_3')}
      </TextView>

      <TextView
        color={'primary'}
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
        {/*TODO: change navigation target*/}
        <ThemedButton
          onPress={() =>
            closeTo(Facade.route.Tab.name, {
              screen: Facade.route.ListWallets.name,
            })
          }
          label={Facade.t('welcome.button_1')}
        />
      </LinearLayout>

      <LinearLayout mb={7} width={'100%'}>
        {/*TODO: change navigation target*/}
        <ThemedButton
          onPress={() =>
            closeTo(Facade.route.Tab.name, {
              screen: Facade.route.ListWallets.name,
            })
          }
          label={Facade.t('welcome.button_2')}
        />
      </LinearLayout>

      <LinearLayout mb={6}>
        <ThemedCheckbox
          onChange={(checked) => persist(checked)}
          label={Facade.t('welcome.checkbox_1')}
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
    </SwiperPanel>
  )
}

WelcomePage.propTypes = {
  onClose: PropTypes.func,
}

export default WelcomePage

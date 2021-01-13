import {RouteProp, CommonActions} from '@react-navigation/native'
import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {Image, ScrollView, Dimensions} from 'react-native'

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
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

// Why are you like this, Typescript
type ParamList = TabStackParamList & RootStackParamList

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
  const imgWidth = Dimensions.get('window').width * 1.1
  const imgHeight = Dimensions.get('window').height * 0.55
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
      <ScrollView style={{marginHorizontal: -20}}>
        <LinearLayout mb={PANEL_OFFSET} pt={30} flex={1}>
          <LinearLayout weight={1} />
          <Image
            source={require('~src/assets/images/wellcomeGetstarted.png')}
            style={{
              marginLeft: -50,
              width: imgWidth,
              height: imgHeight,
              resizeMode: 'stretch',
              alignSelf: 'center',
              marginTop: 30
            }}
            width={imgWidth}
            height={imgHeight}
            resizeMode={'stretch'}
          />
          <TextView
            mb={5}
            color={'primary'}
            fontSize={Facade.scale(30)}
            fontFamily={'regular'}
            textAlign="center"
          >
            {Facade.t('welcome.title')}
          </TextView>

          <TextView
            mb={6}
            color={'text.0'}
            fontSize={'lg'}
            textAlign={'center'}
          >
            {Facade.t('welcome.body_1_1_2')}
          </TextView>

          <LinearLayout weight={1} />

          <LinearLayout mt={3} mb={6} style={{alignSelf: 'center', width: '85%'}}>
            <ThemedFlatButton
              text={Facade.t('welcome.button_3')}
              onPress={controller.close}
              alignItems={'flex-start'}
              textAlign={'center'}
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
      </ScrollView>
    </SwiperPanel>
  )
}

WelcomePage.propTypes = {
  onClose: PropTypes.func,
}

export default WelcomePage

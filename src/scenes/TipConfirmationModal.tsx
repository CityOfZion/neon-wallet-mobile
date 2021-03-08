import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useState} from 'react'
import {Button, TextComponent, View} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import SelectorList, {SelectorItem} from '~src/components/SelectorList'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~src/components/SwiperPanel'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {Lang} from '~src/enums/Lang'
import {NeoURI} from '~src/helpers/UriHelper'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {SendModalStackParamList} from '~src/navigation/SendModalStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

export interface TipConfirmationModalParams {
  callback?: (arg: boolean) => void
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'TipConfirmationModal'>
}

const TipConfirmationModal = (props: Props) => {
  const controller = useSwiperController(true)
  const [value, setValue] = useState(true)

  const setAndClose = () => {
    props.route?.params?.callback?.(value)
    props.navigation.goBack()
  }

  return (
    <SwiperPanel
      controller={controller}
      title={Facade.t('modals.tipping.title')}
      fullSize={true}
      padding={16}
      onClose={setAndClose}
      rightButton={<CloseButton mr={'20px'} />}
      onRightPress={controller.close}
      solidColorBG={true}
    >
      <LinearLayout height="100%" orientation="verti">
        <ImageView
          mt="24px"
          resizeMode="center"
          source={require('~/src/assets/images/neo-tipping-logo.png')}
          alignSelf={'center'}
        />
        <LinearLayout orientation="horiz" justifyContent="center" mb="36px">
          <ImageView
            mr="4px"
            resizeMode="center"
            source={require('~/src/assets/images/star-primary.png')}
            alignSelf={'center'}
          />
          <TextView fontFamily="medium" fontSize="22px" color="text.0">
            {Facade.t('modals.tipping.subtitle')}
          </TextView>
        </LinearLayout>
        <TextView
          fontFamily="light"
          fontSize="18px"
          color="text.0"
          textAlign="center"
          mb="32px"
        >
          {Facade.t('modals.tipping.description')}
        </TextView>
        <LinearLayout width="100%" alignSelf="center" mb="28px">
          <ThemedButton
            label={Facade.t('modals.tipping.keepTip')}
            subLabel={Facade.t('modals.tipping.recommended')}
            onPress={() => {
              setValue(true)
              controller.close()
            }}
            rounded={true}
            radius={8}
          />
        </LinearLayout>
        <LinearLayout width="100%" alignSelf="center">
          <ThemedButton
            label={Facade.t('modals.tipping.removeTip')}
            onPress={() => {
              setValue(false)
              controller.close()
            }}
            rounded={true}
            radius={8}
          />
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default TipConfirmationModal

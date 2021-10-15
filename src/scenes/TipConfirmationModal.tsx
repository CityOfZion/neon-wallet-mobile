import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, {useState} from 'react'
import {Button, TextComponent, View} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

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
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

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
      title={i18n.t('modals.tipping.title')}
      fullSize={true}
      padding={16}
      onClose={setAndClose}
      rightButton={<CloseButton mr={'20px'} />}
      onRightPress={controller.close}
      solidColorBG={true}
    >
      <LinearLayout height="100%" orientation="verti">
        <ImageView
          mr="-50px" // Negative margin because the original image has a shadow offset to the right
          resizeMode="center"
          height="210px"
          source={require('~/src/assets/images/neo-tipping-logo.png')}
          alignSelf={'center'}
        />
        <LinearLayout orientation="horiz" justifyContent="center" mb="20px">
          <ImageView
            mr="4px"
            resizeMode="center"
            source={require('~/src/assets/images/star-primary.png')}
            alignSelf={'center'}
          />
          <TextView fontFamily="medium" fontSize="22px" color="text.0">
            {i18n.t('modals.tipping.subtitle')}
          </TextView>
        </LinearLayout>
        <TextView
          fontFamily="light"
          fontSize="18px"
          color="text.0"
          textAlign="center"
          mb="20px"
        >
          {i18n.t('modals.tipping.description')}
        </TextView>
        <LinearLayout width="100%" alignSelf="center" mb="25px">
          <ThemedButton
            label={i18n.t('modals.tipping.keepTip')}
            subLabel={i18n.t('modals.tipping.recommended')}
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
            label={i18n.t('modals.tipping.removeTip')}
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

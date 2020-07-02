import {useAsyncStorage} from '@react-native-community/async-storage'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React from 'react'

import {useRoutePath} from '~src/app/RouteUtils'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCheckbox from '~src/components/themed/ThemedCheckbox'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {
  ImageView,
  LinearLayout,
  normalize,
  TextView,
} from '~src/styles/styled-components'

interface Props {
  onClose?: (routeTargetName?: string) => void
}

const WelcomePage: React.FC<Props> = (props) => {
  const {setItem} = useAsyncStorage('@welcomeDontShow')
  const path = useRoutePath()

  return (
    <ScreenLayout
      useHeaderPadding={false}
      useTabBarPadding={false}
      alignX={'center'}
      padding={30}
    >
      <LinearLayout mb={5} alignItems={'center'}>
        <ImageView source={require('~/src/assets/images/logo-small.png')} />
        <TextView
          mt={-2}
          color={'text.0'}
          fontSize={'3xl'}
          letterSpacing={'3px'}
        >
          {i18n.t('welcome.brand')}
        </TextView>
      </LinearLayout>

      <TextView mb={5} color={'text.0'} fontSize={36} fontFamily={'bold'}>
        {i18n.t('welcome.title')}
      </TextView>

      <TextView mb={6} color={'text.0'} fontSize={'lg'} textAlign={'center'}>
        {i18n.t('welcome.body_1_1')}

        <TextView
          onPress={() => props.onClose?.(path.Settings.name)}
          color={'primary'}
        >
          {i18n.t('welcome.body_1_2')}
        </TextView>

        {i18n.t('welcome.body_1_3')}

        <TextView
          onPress={() => props.onClose?.(path.ListWallets.name)}
          color={'primary'}
        >
          {i18n.t('welcome.body_1_4')}
        </TextView>
      </TextView>

      <TextView mb={6} color={'text.0'} fontSize={'lg'} textAlign={'center'}>
        {i18n.t('welcome.body_2_0')}
      </TextView>

      <LinearLayout mb={5} width={'100%'}>
        {/*TODO: change navigation target*/}
        <ThemedButton
          onPress={() => props.onClose?.(path.ListWallets.name)}
          label={i18n.t('welcome.button_1')}
          flat={true}
        />
      </LinearLayout>

      <LinearLayout mb={6} width={'100%'}>
        {/*TODO: change navigation target*/}
        <ThemedButton
          onPress={() => props.onClose?.(path.ListWallets.name)}
          label={i18n.t('welcome.button_2')}
        />
      </LinearLayout>

      <LinearLayout mb={7} width={'100%'}>
        {/*TODO: change navigation target*/}
        <ThemedButton
          onPress={() => props.onClose?.(path.ListWallets.name)}
          label={i18n.t('welcome.button_3')}
        />
      </LinearLayout>

      <LinearLayout mb={6} width={'100%'}>
        <ThemedCheckbox
          onChange={(checked) => setItem(String(checked))}
          label={i18n.t('welcome.checkbox_1')}
        />
      </LinearLayout>

      <LinearLayout
        position={'absolute'}
        right={normalize(5)}
        top={normalize(5)}
      >
        <ThemedCloseButton onPress={() => props.onClose?.()} />
      </LinearLayout>
    </ScreenLayout>
  )
}

WelcomePage.propTypes = {
  onClose: PropTypes.func,
}

export default WelcomePage

import {useAsyncStorage} from '@react-native-community/async-storage'
import PropTypes from 'prop-types'
import React from 'react'

import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCheckbox from '~src/components/themed/ThemedCheckbox'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  onClose?: (routeTargetName?: string) => void
}

const WelcomePage: React.FC<Props> = (props) => {
  const {setItem} = useAsyncStorage('@welcomeDontShow')

  return (
    <ScreenLayout
      useHeaderPadding={false}
      useFooterPadding={false}
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
          {Facade.t('welcome.brand')}
        </TextView>
      </LinearLayout>

      <TextView mb={5} color={'text.0'} fontSize={36} fontFamily={'bold'}>
        {Facade.t('welcome.title')}
      </TextView>

      <TextView mb={6} color={'text.0'} fontSize={'lg'} textAlign={'center'}>
        {Facade.t('welcome.body_1_1')}

        <TextView
          onPress={() => props.onClose?.(Facade.path.Settings.name)}
          color={'primary'}
        >
          {Facade.t('welcome.body_1_2')}
        </TextView>

        {Facade.t('welcome.body_1_3')}

        <TextView
          onPress={() => props.onClose?.(Facade.path.ListWallets.name)}
          color={'primary'}
        >
          {Facade.t('welcome.body_1_4')}
        </TextView>
      </TextView>

      <TextView mb={6} color={'text.0'} fontSize={'lg'} textAlign={'center'}>
        {Facade.t('welcome.body_2_0')}
      </TextView>

      <LinearLayout mb={5} width={'100%'}>
        {/*TODO: change navigation target*/}
        <ThemedButton
          onPress={() => props.onClose?.(Facade.path.ListWallets.name)}
          label={Facade.t('welcome.button_1')}
          flat={true}
        />
      </LinearLayout>

      <LinearLayout mb={6} width={'100%'}>
        {/*TODO: change navigation target*/}
        <ThemedButton
          onPress={() => props.onClose?.(Facade.path.ListWallets.name)}
          label={Facade.t('welcome.button_2')}
        />
      </LinearLayout>

      <LinearLayout mb={7} width={'100%'}>
        {/*TODO: change navigation target*/}
        <ThemedButton
          onPress={() => props.onClose?.(Facade.path.ListWallets.name)}
          label={Facade.t('welcome.button_3')}
        />
      </LinearLayout>

      <LinearLayout mb={6} width={'100%'}>
        <ThemedCheckbox
          onChange={(checked) => setItem(String(checked))}
          label={Facade.t('welcome.checkbox_1')}
        />
      </LinearLayout>

      <LinearLayout
        position={'absolute'}
        right={Facade.space(5)}
        top={Facade.space(5)}
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

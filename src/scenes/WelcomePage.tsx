import PropTypes from 'prop-types'
import React from 'react'

import {Facade} from '~src/app/Facade'
import {Storage} from '~src/app/Storage'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCheckbox from '~src/components/themed/ThemedCheckbox'
import ThemedCloseButton from '~src/components/themed/ThemedCloseButton'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  onClose?: (routeTargetName?: string) => void
}

const WelcomePage: React.FC<Props> = (props) => {
  const persist = async (value: boolean) => {
    await Storage.welcomeHidden.save(value)
  }

  return (
    <ScreenLayout
      useHeaderPadding={false}
      useFooterPadding={false}
      alignX={'center'}
    >
      <LinearLayout mb={5} alignItems={'center'}>
        <ImageView source={require('~/src/assets/images/logo-small.png')} />
        <TextView
          mt={'-4%'}
          color={'text.0'}
          fontSize={'3xl'}
          letterSpacing={'3px'}
        >
          {Facade.t('welcome.brand')}
        </TextView>
      </LinearLayout>

      <TextView
        mt={'-4%'}
        color={'text.0'}
        fontSize={Facade.scale(34)}
        fontFamily={'bold'}
      >
        {Facade.t('welcome.title')}
      </TextView>

      <TextView mb={'1%'} color={'text.0'} fontSize={'md'} textAlign={'center'}>
        {Facade.t('welcome.body_1_1')}

        <TextView
          onPress={() => props.onClose?.(Facade.route.Settings.name)}
          color={'primary'}
        >
          {Facade.t('welcome.body_1_2')}
        </TextView>

        {Facade.t('welcome.body_1_3')}

        <TextView
          onPress={() => props.onClose?.(Facade.route.ListWallets.name)}
          color={'primary'}
        >
          {Facade.t('welcome.body_1_4')}
        </TextView>
      </TextView>

      <TextView mb={'5%'} color={'text.0'} fontSize={'md'} textAlign={'center'}>
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
        numberOfLines={1}
        mb={'3%'}
      >
        {Facade.t('welcome.label_1')}
      </TextView>

      <LinearLayout mt={'1%'} mb={'3%'} width={'100%'}>
        {/*TODO: change navigation target*/}
        <ThemedButton
          onPress={() => props.onClose?.(Facade.route.ListWallets.name)}
          label={Facade.t('welcome.button_1')}
        />
      </LinearLayout>

      <LinearLayout mb={'5%'} width={'100%'}>
        {/*TODO: change navigation target*/}
        <ThemedButton
          onPress={() => props.onClose?.(Facade.route.ListWallets.name)}
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
        <ThemedCloseButton onPress={() => props.onClose?.()} />
      </LinearLayout>
    </ScreenLayout>
  )
}

WelcomePage.propTypes = {
  onClose: PropTypes.func,
}

export default WelcomePage

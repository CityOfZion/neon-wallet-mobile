import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React from 'react'

import {useRoutePath} from '~src/app/RouteUtils'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {
  TextView,
  LinearLayout,
  ImageView,
  normalize,
} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<MoreStackParamList>
}

const Step5CreateWalletPage: React.FC<Props> = (props) => {
  const path = useRoutePath()

  return (
    <ScreenLayout alignX={'center'}>
      <LinearLayout mt={5} weight={1}>
        <LinearLayout mb={6} width={'100%'}>
          <LinearLayout alignItems={'center'}>
            <ImageView
              mt={6}
              mb={4}
              source={require('~/src/assets/images/logo-3d.png')}
              style={{marginLeft: normalize(60)}}
            />
          </LinearLayout>

          <TextView
            mb={5}
            color={'text.0'}
            fontSize={'2xl'}
            textAlign={'center'}
            lineHeight={normalize(24)}
          >
            {i18n.t('step5CreateWallet.label_1')}
          </TextView>

          <TextView
            mb={5}
            color={'text.2'}
            fontSize={'lg'}
            textAlign={'center'}
            lineHeight={normalize(20)}
          >
            {i18n.t('step5CreateWallet.body_1')}
          </TextView>

          <TextView
            color={'text.2'}
            fontSize={'lg'}
            textAlign={'center'}
            lineHeight={normalize(20)}
          >
            {i18n.t('step5CreateWallet.body_2')}
          </TextView>
        </LinearLayout>
      </LinearLayout>

      <LinearLayout mt={5} mb={6} px={5} width={'100%'}>
        <ThemedButton
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: path.More.name}],
            })
            props.navigation.navigate(path.ListWallets.name)
          }}
          label={i18n.t('step5CreateWallet.viewWallet')}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}

Step5CreateWalletPage.propTypes = {
  navigation: PropTypes.any,
}

export default Step5CreateWalletPage

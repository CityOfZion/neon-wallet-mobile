import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import PropTypes from 'prop-types'
import React from 'react'

import {WalletStackParamList} from '~/src/navigation/WalletsStackNavigation'
import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {TabStackParamList} from '~src/navigation/TabNavigation'
import {TextView, LinearLayout, ImageView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<TabStackParamList & WalletStackParamList>
  route: RouteProp<MoreStackParamList, 'Step5CreateWallet'>
}

const Step5CreateWalletPage = (props: Props) => {
  return (
    <ScreenLayout alignX={'center'}>
      <LinearLayout mt={5} weight={1}>
        <LinearLayout mb={6} width={'100%'}>
          <LinearLayout alignItems={'center'}>
            <ImageView
              mt={6}
              mb={4}
              source={require('~/src/assets/images/logo-3d.png')}
              style={{marginLeft: Facade.scale(60)}}
            />
          </LinearLayout>

          <TextView
            mb={5}
            color={'text.0'}
            fontSize={'2xl'}
            textAlign={'center'}
            lineHeight={Facade.scale(24)}
          >
            {Facade.t('step5CreateWallet.label_1')}
          </TextView>

          <TextView
            color={'text.0'}
            fontSize={'lg'}
            textAlign={'center'}
            lineHeight={Facade.scale(20)}
            fontFamily={'light'}
          >
            {Facade.t('step5CreateWallet.body_1')}
          </TextView>

          <TextView
            color={'text.0'}
            fontSize={'lg'}
            textAlign={'center'}
            fontFamily={'light'}
            lineHeight={Facade.scale(20)}
          >
            {Facade.t('step5CreateWallet.body_2')}
          </TextView>
        </LinearLayout>
      </LinearLayout>

      <LinearLayout mt={5} mb={6} px={5} width={'100%'}>
        <ThemedButton
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: Facade.route.MorePage.name}],
            })
            props.navigation.navigate(Facade.route.ListWalletsPage.name, {})
          }}
          label={Facade.t('step5CreateWallet.viewWallet')}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}

Step5CreateWalletPage.propTypes = {
  navigation: PropTypes.any,
}

export default Step5CreateWalletPage

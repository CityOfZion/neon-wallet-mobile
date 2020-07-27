import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import PropTypes from 'prop-types'
import React from 'react'

import {Facade} from '~src/app/Facade'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'
import {TextView, LinearLayout, ImageView} from '~src/styles/styled-components'

interface Props {
  route: RouteProp<SettingsStackParamList, 'Step3BackupWallet'>
  navigation: StackNavigationProp<SettingsStackParamList>
}

const Step3BackupWalletPage: React.FC<Props> = (props) => {
  const {wallet} = props.route.params

  props.navigation.setOptions({
    headerRight: () =>
      HeaderActionButton({
        actionTitle: Facade.t('app.done'),
        actionButtonStyle: 'highlight',
        actionOnPress: () => {
          props.navigation.reset({
            index: 0,
            routes: [{name: Facade.route.Settings.name}],
          })
        },
      }),
  })

  return (
    <ScreenLayout alignX={'center'} alignY={'center'}>
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
        {Facade.t('step3BackupWallet.label_1')}
      </TextView>
    </ScreenLayout>
  )
}

Step3BackupWalletPage.propTypes = {
  navigation: PropTypes.any,
  route: PropTypes.any,
}

export default Step3BackupWalletPage

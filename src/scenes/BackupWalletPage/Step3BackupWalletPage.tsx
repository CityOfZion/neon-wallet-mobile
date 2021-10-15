import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React from 'react'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {Normalize} from '~/src/app/Normalize'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'
import {TextView, LinearLayout, ImageView} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<SettingsStackParamList>
}

const Step3BackupWalletPage: React.FC<Props> = (props) => {
  props.navigation.setOptions({
    headerRight: () =>
      HeaderActionButton({
        actionTitle: i18n.t('app.done'),
        actionButtonStyle: 'highlight',
        actionOnPress: () => {
          props.navigation.reset({
            index: 0,
            routes: [{name: wrapper.route.SettingsPage.name}],
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
          style={{marginLeft: Normalize.scale(60)}}
        />
      </LinearLayout>

      <TextView
        mb={5}
        color={'text.0'}
        fontSize={'2xl'}
        textAlign={'center'}
        lineHeight={Normalize.scale(24)}
      >
        {i18n.t('step3BackupWallet.label_1')}
      </TextView>
    </ScreenLayout>
  )
}

Step3BackupWalletPage.propTypes = {
  navigation: PropTypes.any,
}

export default Step3BackupWalletPage

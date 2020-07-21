import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {DefaultTheme} from 'styled-components'

import {Facade} from '~src/app/Facade'
import MenuItem, {RightIconType} from '~src/components/MenuItem'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'

interface Props {
  route: RouteProp<SettingsStackParamList, 'MyWalletOptions'>
  navigation: StackNavigationProp<SettingsStackParamList>
  theme: DefaultTheme
}

const MyWalletOptionsPage = (props: Props) => {
  const {wallet} = props.route.params

  return (
    <ScreenLayout padding={20}>
      <MenuItem
        title={Facade.t('myWalletOptions.details')}
        icon={require('~src/assets/images/icon-details-green.png')}
        iconMarginRight={4}
        arrowDirection={RightIconType.ARROW_RIGHT}
      />

      <MenuItem
        title={Facade.t('myWalletOptions.backupWallet')}
        icon={require('~src/assets/images/icon-screen-lock-green.png')}
        iconMarginLeft={2}
        iconMarginRight={5}
        arrowDirection={RightIconType.ARROW_RIGHT}
        onPress={() =>
          props.navigation.navigate(Facade.route.Step1BackupWallet.name, {
            wallet,
            actionTitle: Facade.t('app.cancel'),
            actionButtonStyle: 'highlight',
            actionOnPress: () => {
              props.navigation.reset({
                index: 2,
                routes: [{name: Facade.route.Settings.name}],
              })
              props.navigation.navigate(Facade.route.MyWalletOptions.name, {
                wallet,
              })
            },
          })
        }
      />
    </ScreenLayout>
  )
}

export default MyWalletOptionsPage

import {StackNavigationProp} from '@react-navigation/stack'
import React from 'react'
import {DefaultTheme} from 'styled-components'

import {Facade} from '~src/app/Facade'
import MenuItem, {RightIconType} from '~src/components/MenuItem'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {LinearLayout} from '~src/styles/styled-components'

interface MoreProps {
  navigation: StackNavigationProp<MoreStackParamList>
  theme: DefaultTheme
  navigationOptions: object
}

const MorePage = (props: MoreProps) => {
  const showHelp: boolean = false
  return (
    <ScreenLayout padding={20}>
      <MenuItem
        title={Facade.t('more.createWallet')}
        icon={require('~/src/assets/images/wallet-icon-green.png')}
        iconMarginRight={12}
        iconHeight={28}
        arrowDirection={RightIconType.NONE}
        onPress={() => {
          props.navigation.navigate(Facade.route.Step1CreateWallet.name, {})
        }}
      />
      <MenuItem
        title={Facade.t('more.createWatchAccount')}
        icon={require('~/src/assets/images/icon-watch-green.png')}
        iconHeight={25}
        iconWidth={25}
        iconMarginRight={5}
        arrowDirection={RightIconType.NONE}
        onPress={() => {
          props.navigation.navigate(Facade.route.ImportReadAccount.name, {})
        }}
      />
      <MenuItem
        title={Facade.t('more.import')}
        icon={require('~/src/assets/images/icon-import-green.png')}
        iconHeight={26}
        iconWidth={26}
        iconMarginRight={15}
        iconMarginLeft={1}
        arrowDirection={RightIconType.NONE}
        onPress={() => {
          props.navigation.navigate(Facade.route.ImportKey.name)
        }}
      />
      {showHelp && (
        <MenuItem
          title={Facade.t('more.help')}
          icon={require('~/src/assets/images/icon-help-green.png')}
          iconWidth={21}
          iconMarginLeft={1}
          iconMarginRight={17}
          arrowDirection={RightIconType.NONE}
        />
      )}
    </ScreenLayout>
  )
}

export default MorePage

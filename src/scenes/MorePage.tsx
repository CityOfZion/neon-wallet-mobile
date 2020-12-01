import {StackNavigationProp} from '@react-navigation/stack'
import Constants from 'expo-constants'
import * as WebBrowser from 'expo-web-browser'
import React from 'react'
import {useSelector} from 'react-redux'
import {DefaultTheme} from 'styled-components'

import {Facade} from '~src/app/Facade'
import MenuItem, {RightIconType} from '~src/components/MenuItem'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {LinearLayout, TextView} from '~src/styles/styled-components'

interface MoreProps {
  navigation: StackNavigationProp<MoreStackParamList>
  theme: DefaultTheme
  navigationOptions: object
}

const MorePage = (props: MoreProps) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  const handlePressHelp = async () => {
    const result = await WebBrowser.openBrowserAsync(
      'https://app.pipefy.com/public/form/wUJ8xQoC?embedded=true'
    )
    return result
  }

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
      <MenuItem
        title={Facade.t('more.help')}
        icon={require('~/src/assets/images/icon-help-green.png')}
        iconWidth={21}
        iconMarginLeft={1}
        iconMarginRight={17}
        arrowDirection={RightIconType.NONE}
        onPress={() => {
          handlePressHelp()
        }}
      />
      <LinearLayout
        position={'absolute'}
        left={'5%'}
        right={'5%'}
        bottom={'3%'}
      >
        <TextView
          fontSize={14}
          color="white"
          textAlign="left"
          numberOfLines={1}
          width={'88%'}
          allowFontScaling={true}
        >
          {`v${Constants.nativeAppVersion}-${Constants.nativeBuildVersion}`}
        </TextView>
      </LinearLayout>
    </ScreenLayout>
  )
}

export default MorePage

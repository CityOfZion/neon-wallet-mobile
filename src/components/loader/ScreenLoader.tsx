import React, {useState} from 'react'
import {ActivityIndicator} from 'react-native'
import {WebView} from 'react-native-webview'
import {useSelector} from 'react-redux'
import {ReactComponent as SvgAnimated} from '~src/assets/images/youtube-icon-dark-grey.svg'

import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'

const ScreenLoader = (props?: {transparent?: boolean}) => {
  const theme = useSelector(
    (state: RootState) => Facade.theme[state.settings.theme]
  )

  const [renderedOnce, setRenderedOnce] = useState(false)

  const updateSource = () => {
    setRenderedOnce(true)
  }

  //const svgPath = require('~src/assets/logos/Logo-3.svg')
  const svgPath =
    'file://C:/Workspace/neon-wallet-mobile/src/assets/logos/Logo-3.svg'

  return (
    <WebView
      scalesPageToFit={false}
      originWhitelist={['*']}
      //source={renderedOnce ? {url: 'http://www.google.com.br'} : undefined}
      // source={{'http://www.google.com.br'}}
      // style={{
      //   width: 300,
      //   height: 300,
      // }}
      source={{
        uri: 'http://www.google.com.br',
      }}
      style={{marginTop: 20}}
      onLoad={updateSource}
      allowFileAccess={true}
    />
    // <ScreenLayout
    //   hideOfflineBar={true}
    //   alignY={'center'}
    //   transparent={props?.transparent ?? false}
    // >
    //   <ActivityIndicator size={'large'} color={theme.colors.text[0]} />
    // </ScreenLayout>
  )
}

export default ScreenLoader

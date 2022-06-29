import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React from 'react'
import WebView from 'react-native-webview'
import { useSelector } from 'react-redux'

import { wrapper } from '../app/ApplicationWrapper'
import { BackButton } from '../components/BackButton'
import { CopyButton } from '../components/CopyButton'
import ScreenLayout from '../components/layout/ScreenLayout'
import { RootStackParamList } from '../navigation/AppNavigation'
import { ModalStackParamList } from '../navigation/ModalStackNavigation'
import { RootState } from '../store/RootStore'
import { LinearLayout, TextView } from '../styles/styled-components'

export interface WebViewModalParams {
  uri: string
  title?: string
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'WebViewModal'>
}

const WebViewModal = ({ navigation, route }: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const { uri, title } = route.params

  function handleOnPressBack() {
    navigation.goBack()
  }

  return (
    <ScreenLayout useHeaderPadding={false} useStatusBarPadding useFooterPadding={false} padding={0}>
      <LinearLayout orientation="horiz" alignItems="center" padding={12}>
        <BackButton onPress={handleOnPressBack} />

        <LinearLayout justifyContent="center" mr={12} ml={12} flex={1}>
          {title && (
            <TextView numberOfLines={1} color={theme.colors.text[0]} fontFamily="bold" fontSize="16px">
              {title}
            </TextView>
          )}
          <TextView
            numberOfLines={1}
            color={theme.colors.text[4]}
            fontFamily="medium"
            fontSize="12px"
            ellipsizeMode="tail"
          >
            {route.params.uri}
          </TextView>
        </LinearLayout>

        <CopyButton text={uri} />
      </LinearLayout>

      <LinearLayout width="100%" height="100%">
        <WebView source={{ uri }} />
      </LinearLayout>
    </ScreenLayout>
  )
}

export default WebViewModal

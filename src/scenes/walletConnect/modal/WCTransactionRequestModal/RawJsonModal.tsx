import { TSession, TSessionRequest } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { ScrollView } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { CopyButton } from '~/src/components/CopyButton'
import { RootState } from '~/src/store/RootStore'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { TabStackParamList } from '~src/navigation/TabNavigation'
import ConnectionHeader from '~src/scenes/walletConnect/components/ConnectionHeader'
import { LinearLayout, TextView } from '~src/styles/styled-components'
type ParamList = TabStackParamList & RootStackParamList & ModalStackParamList

export interface RawJsonModalParams {
  request: TSessionRequest
  session: TSession
}

interface Props {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<ModalStackParamList, 'RawJsonModal'>
}

const RawJsonModal = (props: Props) => {
  const { request, session } = props.route.params
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const controller = useSwiperController(true)

  return (
    <SwiperPanel
      controller={controller}
      size="small"
      title={i18n.t('modals.rawJson.title')}
      rightButton={<CloseButton onPress={controller.close} />}
      onClose={props.navigation.goBack}
      withoutScrollView
      contentStyle={{
        alignItems: 'center',
      }}
    >
      <ConnectionHeader title={session.peer.metadata.name} imageUri={session.peer.metadata.icons[0]} />

      <LinearLayout orientation="horiz" width="100%" justifyContent="space-between" mt="30px" mb="7px">
        <TextView fontSize="18px" fontFamily="medium" color="text.10">
          {i18n.t('modals.rawJson.data')}
        </TextView>

        <CopyButton text="props.route.params.dataJson" />
      </LinearLayout>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: theme.colors.background[1],
          borderRadius: 8,
          flexGrow: 1,
          padding: 22,
        }}
      >
        <TextView fontFamily="light" fontSize="16px" color="white">
          {JSON.stringify(request, null, 2)}
        </TextView>
      </ScrollView>
    </SwiperPanel>
  )
}

export default RawJsonModal

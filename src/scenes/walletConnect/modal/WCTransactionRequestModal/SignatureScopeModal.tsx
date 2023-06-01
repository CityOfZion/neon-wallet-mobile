import { Signer } from '@cityofzion/neo3-invoker'
import { tx } from '@cityofzion/neon-core'
import { TSession } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '~/src/store/RootStore'
import { wrapper } from '~src/app/ApplicationWrapper'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { TabStackParamList } from '~src/navigation/TabNavigation'
import ConnectionHeader from '~src/scenes/walletConnect/components/ConnectionHeader'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'
type ParamList = TabStackParamList & RootStackParamList & ModalStackParamList

export interface SignatureScopeModalParams {
  data?: Signer
  session: TSession
}

interface Props {
  navigation: StackNavigationProp<ParamList>
  route: RouteProp<ModalStackParamList, 'SignatureScopeModal'>
}

const SignatureScopeModal = (props: Props) => {
  const { data, session } = props.route.params
  const scope = data?.scopes ?? tx.WitnessScope.CalledByEntry
  const showWarning = scope !== tx.WitnessScope.None && scope !== tx.WitnessScope.CalledByEntry
  const showAllowedList = scope === tx.WitnessScope.CustomContracts || scope === tx.WitnessScope.CustomGroups
  const isCustomContracts = scope === tx.WitnessScope.CustomContracts
  const allowedList = isCustomContracts ? data?.allowedContracts : data?.allowedGroups
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const controller = useSwiperController(true)

  return (
    <SwiperPanel
      controller={controller}
      size="small"
      title={i18n.t('modals.signatureScope.title')}
      rightButton={<CloseButton onPress={controller.close} />}
      onClose={props.navigation.goBack}
    >
      <ConnectionHeader title={session.peer.metadata.name} imageUri={session.peer.metadata.icons[0]} />

      <LinearLayout orientation="verti" width="100%">
        <TextView color={theme.colors.text[10]} fontFamily="medium" fontSize="18px" mb="7px">
          {i18n.t('modals.signatureScope.scopeTitle')}
        </TextView>

        <LinearLayout bg={theme.colors.background[1]} borderRadius="7px" px="19px" py="18px" mb="17px">
          {showWarning && (
            <LinearLayout bg="#ea5d8e" borderRadius="3px" px="8px" py="3px" orientation="horiz" mb="7px">
              <ImageView
                source={require('~src/assets/images/icon-warning-black.png')}
                resizeMode="contain"
                alignSelf="center"
                style={{
                  width: 24,
                  height: 24,
                }}
              />
              <TextView px="5px" color="#141b20" fontFamily="medium" fontSize="14px">
                {i18n.t(`modals.signatureScope.${scope}.warning`)}
              </TextView>
            </LinearLayout>
          )}
          <TextView color="white" fontFamily="light" fontSize="16px">
            {i18n.t(`modals.signatureScope.${scope}.scope`)}
          </TextView>
        </LinearLayout>

        {showAllowedList && (
          <>
            <TextView color={theme.colors.text[10]} fontFamily="medium" fontSize="18px" mb="7px">
              {i18n.t(`modals.signatureScope.${scope}.allowedList`)}
            </TextView>
            <LinearLayout bg={theme.colors.background[1]} borderRadius="7px" px="19px" py="10px" mb="17px">
              <TextView color="white" fontFamily="light" fontSize="16px">
                {allowedList?.join(',\r\n')}
              </TextView>
            </LinearLayout>
          </>
        )}
        <TextView color={theme.colors.text[10]} fontFamily="medium" fontSize="18px" mb="7px">
          {i18n.t('modals.signatureScope.explanationTitle')}
        </TextView>
        <LinearLayout bg={theme.colors.background[1]} borderRadius="7px" px="19px" py="18px" mb="15px">
          <TextView color="white" fontFamily="light" fontSize="16px">
            {i18n.t(`modals.signatureScope.${scope}.explanation`)}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    </SwiperPanel>
  )
}

export default SignatureScopeModal

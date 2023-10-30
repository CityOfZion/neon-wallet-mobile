import { Signer } from '@cityofzion/neon-dappkit-types'
import { TSession } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { useNavigation } from '@react-navigation/native'
import i18n from 'i18n-js'
import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { RootState } from '~/src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'
import { WalletConnectHelper } from '~src/helpers/WalletConnectHelper'

type SignerBoxProps = {
  signer: Signer
  showWarning: boolean
  session: TSession
}

export const SignerBox = ({ signer, showWarning, session }: SignerBoxProps) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const navigation = useNavigation()

  const resolveScope = WalletConnectHelper.resolveScope(signer.scopes)

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate(wrapper.route.SignatureScopeModal.name, {
          data: signer,
          session,
        })
      }}
    >
      <LinearLayout
        bg={theme.colors.background[1]}
        orientation="horiz"
        borderRadius={6}
        mb="13px"
        pt="13px"
        pb="13px"
        justifyContent="space-between"
      >
        <TextView color={theme.colors.text[10]} weight={2} fontFamily="bold" fontSize={14} pl="18px">
          {i18n.t('modals.transactionRequest.signatureScope')}
        </TextView>
        <LinearLayout orientation="horiz">
          {showWarning && (
            <ImageView
              alignSelf="center"
              resizeMode="contain"
              width={7}
              height={12}
              pr="20px"
              source={require('~src/assets/images/red-alert.png')}
            />
          )}
          <TextView
            color={showWarning ? 'danger' : 'white'}
            alignSelf="flex-end"
            pb="3px"
            fontSize={12}
            fontFamily="bold"
          >
            {i18n.t(`modals.signatureScope.${resolveScope}.scope`)}
          </TextView>
          <ImageView
            alignSelf="center"
            resizeMode="contain"
            width={7}
            height={12}
            pr="35px"
            source={require('~src/assets/images/icon-arrow-right-green.png')}
          />
        </LinearLayout>
      </LinearLayout>
    </TouchableWithoutFeedback>
  )
}

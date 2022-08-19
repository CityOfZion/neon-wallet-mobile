import * as WebBrowser from 'expo-web-browser'
import i18n from 'i18n-js'
import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import { useSelector } from 'react-redux'

import WalletConnectBox from './WalletConnectBox'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Session } from '~/src/contexts/WalletConnectContext'
import { ContractInvocation } from '~/src/helpers/NeonWcAdapter'
import { WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { RootState } from '~/src/store/RootStore'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'

type Props = {
  withRightButton?: boolean
  onPressRightButton?: () => void
  session: Session
  contract: ContractInvocation
  title: string
}

const ContractDetailsBox = ({ onPressRightButton, withRightButton, session, contract, title }: Props) => {
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const handlePressDoraIcon = async () => {
    const accountInfos = WalletConnectHelper.getAccountInformationFromSession(session)

    const { namespace, reference } = accountInfos[0]

    await WebBrowser.openBrowserAsync(`https://dora.coz.io/contract/${namespace}/${reference}/${contract.scriptHash}`)
  }

  return (
    <WalletConnectBox
      title={title}
      rightButton={
        withRightButton ? (
          <TouchableWithoutFeedback onPress={onPressRightButton}>
            <ImageView
              alignSelf="center"
              resizeMode="contain"
              width={7}
              height={12}
              pr="40px"
              source={require('~src/assets/images/icon-arrow-right-green.png')}
            />
          </TouchableWithoutFeedback>
        ) : undefined
      }
    >
      <LinearLayout pt="13px" pb="13px">
        <LinearLayout pb="13px" orientation="horiz" justifyContent="space-between">
          <TextView color={theme.colors.text[10]} weight={2} fontFamily="bold" fontSize={14} pl="18px">
            {i18n.t('components.contractDetailsBox.hash')}
          </TextView>
          <LinearLayout width="65%" orientation="horiz" pr="30px">
            <TextView color="primary" ellipsizeMode="middle" numberOfLines={1} fontSize={16} pr="13px">
              {contract.scriptHash}
            </TextView>
            <TouchableWithoutFeedback onPress={() => handlePressDoraIcon()}>
              <ImageView
                alignSelf="center"
                resizeMode="contain"
                width={14}
                height={13}
                source={require('~src/assets/images/dora-link.png')}
              />
            </TouchableWithoutFeedback>
          </LinearLayout>
        </LinearLayout>
        <LinearLayout height="1px" ml="16px" mr="16px" bg={theme.colors.background[10]} />
        <LinearLayout orientation="horiz" justifyContent="space-between" mt="13px">
          <TextView color={theme.colors.text[10]} weight={2} fontFamily="bold" fontSize={14} pl="18px">
            {i18n.t('components.contractDetailsBox.method')}
          </TextView>
          <TextView pr="20px" color="white" alignSelf="flex-end" fontSize={16}>
            {contract.operation}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    </WalletConnectBox>
  )
}

export default ContractDetailsBox

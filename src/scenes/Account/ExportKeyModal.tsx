import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useCallback, useEffect, useState } from 'react'
import { showMessage } from 'react-native-flash-message'

import AccountSubTitle from '~/src/components/AccountSubTitle'
import NeonQRCode from '~/src/components/NeonQRCode'
import SwiperPanel, { CloseButton, useSwiperController } from '~/src/components/SwiperPanel'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import ThemedButton from '~/src/components/themed/ThemedButton'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { Account } from '~/src/store/account/Account'
import { LinearLayout, TextView } from '~/src/styles/styled-components'

export interface ExportKeyModalParams {
  account: Account
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & WalletStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'ExportKeyModal'>
}

export const ExportKeyModal = ({ navigation, route }: Props) => {
  const { account } = route.params

  const controller = useSwiperController(true)

  const [key, setKey] = useState<string>()

  const getKey = useCallback(async () => {
    try {
      const accountKey = await account.getKey()

      if (!accountKey) {
        showMessage({
          message: i18n.t('modals.ExportKeyModal.unexpectedError'),
          type: 'danger',
          duration: 5000,
        })

        navigation.goBack()
        return
      }

      setKey(accountKey)
    } catch {
      showMessage({
        message: i18n.t('modals.ExportKeyModal.unexpectedError'),
        type: 'danger',
        duration: 5000,
      })

      navigation.goBack()
    }
  }, [account])

  const copy = () => {
    UtilsHelper.copyToClipboard(key)
  }

  useEffect(() => {
    Await.run('getKey', getKey, 300)
  }, [getKey])

  return (
    <SwiperPanel
      controller={controller}
      title={i18n.t('modals.ExportKeyModal.title')}
      rightButton={<CloseButton onPress={controller.close} />}
      onClose={navigation.goBack}
      subheader={<AccountSubTitle account={account} />}
    >
      <AwaitActivity name="getKey" loadingView={<ScreenLoader transparent />}>
        <LinearLayout mt="44px" alignItems="center">
          {!!key && <NeonQRCode content={key} />}

          <TextView mt="36px" fontSize="14px" fontWeight="700" color="text.10">
            {i18n.t('modals.ExportKeyModal.details').toUpperCase()}
          </TextView>

          <LinearLayout p="14px" backgroundColor="background.15" borderRadius="8px" mt="16px">
            <TextView fontSize="16px" fontWeight="500" color="primary" textAlign="center">
              {key}
            </TextView>
          </LinearLayout>
          <LinearLayout width="100%" mt="36px">
            <ThemedButton
              label={i18n.t('app.copyToClipboard')}
              textColor="primary"
              fontSize="22px"
              iconSize={[28, 24]}
              srcIcon={require('~/src/assets/images/icon-copy-green.png')}
              onPress={copy}
            />
          </LinearLayout>
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}

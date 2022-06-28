import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useCallback, useEffect, useState } from 'react'
import { showMessage } from 'react-native-flash-message'

import AccountSubTitle from '~/src/components/AccountSubTitle'
import NeonQRCode from '~/src/components/QRCode'
import SwiperPanel, { useSwiperController } from '~/src/components/SwiperPanel'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import ThemedButton from '~/src/components/themed/ThemedButton'
import ThemedCloseButton from '~/src/components/themed/ThemedCloseButton'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { Account } from '~/src/models/redux/Account'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { LinearLayout, TextView } from '~/src/styles/styled-components'

export interface ExportWIFModalParams {
  account: Account
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & WalletStackParamList & ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'EditAccountModal'>
}

export const ExportWIFModal = ({ navigation, route }: Props) => {
  const { account } = route.params

  const controller = useSwiperController(true)

  const [WIF, setWIF] = useState<string>()

  const handleClose = () => {
    navigation.goBack()
  }

  const getWIF = useCallback(async () => {
    try {
      const accountWIF = await account.getWif()

      if (!accountWIF) {
        showMessage({
          message: i18n.t('modals.ExportWIFModal.unexpectedError'),
          type: 'danger',
          duration: 5000,
        })

        navigation.goBack()
        return
      }

      setWIF(accountWIF)
    } catch {
      showMessage({
        message: i18n.t('modals.ExportWIFModal.unexpectedError'),
        type: 'danger',
        duration: 5000,
      })

      navigation.goBack()
    }
  }, [account])

  const copy = () => {
    UtilsHelper.copyToClipboard(WIF)
  }

  useEffect(() => {
    Await.run('getWIF', getWIF, 300)
  }, [getWIF])

  return (
    <SwiperPanel
      controller={controller}
      fullSize
      paddingTop={0}
      title={i18n.t('modals.ExportWIFModal.title')}
      rightButton={<ThemedCloseButton />}
      onRightPress={controller.close}
      onClose={handleClose}
      solidColorBG
      subHeader={<AccountSubTitle account={account} />}
    >
      <AwaitActivity name="getWIF" loadingView={<ScreenLoader transparent />}>
        <LinearLayout mt="44px" alignItems="center">
          {!!WIF && <NeonQRCode content={WIF} />}

          <TextView mt="36px" fontSize="14px" fontWeight="700" color="text.10">
            {i18n.t('modals.ExportWIFModal.details').toUpperCase()}
          </TextView>

          <LinearLayout p="14px" backgroundColor="background.15" borderRadius="8px" mt="16px">
            <TextView fontSize="16px" fontWeight="500" color="primary" textAlign="center">
              {WIF}
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

import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import * as Print from 'expo-print'
import i18n from 'i18n-js'
import React, { useCallback, useEffect, useState } from 'react'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Alert } from '~/src/components/Alert'
import { Button } from '~/src/components/Button'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import { Wallet } from '~src/models/redux/Wallet'
import { TextView, LinearLayout } from '~src/styles/styled-components'

export interface Step1BackupWalletPageParams {
  wallet: Wallet
}

interface Props {
  route: RouteProp<WalletStackParamList, 'Step1BackupWallet'>
  navigation: StackNavigationProp<WalletStackParamList>
}

const Step1BackupWalletPage: React.FC<Props> = props => {
  const { wallet } = props.route.params

  props.navigation.setOptions({
    headerRight: () =>
      HeaderActionButton({
        actionTitle: i18n.t('app.cancel'),
        actionButtonStyle: 'highlight',
        actionOnPress: props.navigation.goBack,
      }),
  })

  const [mnemonic, setMnemonic] = useState<string>()
  const [modalIsVisible, setModalIsVisible] = useState(false)

  const words = mnemonic?.split(' ')

  const populate = useCallback(async () => {
    const walletMnemonic = await wallet.getMnemonic()

    setMnemonic(walletMnemonic ?? undefined)
  }, [wallet])

  const handlePressCopy = () => {
    UtilsHelper.copyToClipboard(mnemonic ?? '')
  }

  const handlePressPrint = () => {
    Print.printAsync({
      html: `<html><body><br><br>&emsp;&emsp;${mnemonic}</body></html>`,
    })
  }

  const handlePressContinue = () => {
    setModalIsVisible(true)
  }

  const handlePressConfirmation = () => {
    setModalIsVisible(false)

    if (!mnemonic) return

    props.navigation.navigate(wrapper.route.Step2BackupWallet.name, {
      wallet,
      mnemonic,
    })
  }

  useEffect(() => {
    Await.run('populateStep1', populate)
  }, [populate])

  return (
    <ScreenLayout alignX="center" darkerSolidColorBG>
      <AwaitActivity name="populateStep1" loadingView={<ScreenLoader />}>
        <TextView alignSelf="flex-start" color="text.0" fontSize="lg" fontFamily="semibold">
          {wallet.name}
        </TextView>

        <LinearLayout mt={5} weight={1}>
          <LinearLayout mb={6} width="100%">
            <LinearLayout width="100%" orientation="horiz">
              <TextView weight={1} color="text.0" fontSize="lg" fontFamily="semibold">
                {i18n.t('screens.step1BackupWallet.label_1')}
              </TextView>

              <TextView color="text.0" fontSize="lg" fontFamily="bold">
                {i18n.t('screens.step1BackupWallet.oneOfThree')}
              </TextView>
            </LinearLayout>

            <TextView fontFamily="light" color="text.0" fontSize="lg">
              {i18n.t('screens.step1BackupWallet.body_1')}
            </TextView>
          </LinearLayout>

          <LinearLayout
            backgroundColor="background.1"
            orientation="horiz"
            flexWrap="wrap"
            alignItems="center"
            justifyContent="center"
            mb={5}
            py="28px"
            borderRadius="8px"
          >
            {!!words &&
              words.map(word => (
                <TextView my={3} mx={4} color="text.0" fontSize="2xl" fontFamily="regular">
                  {word}
                </TextView>
              ))}
          </LinearLayout>

          <LinearLayout mb={5} orientation="horiz" justifyContent="flex-end">
            <Button
              label={i18n.t('app.copy')}
              onPress={handlePressCopy}
              icon={require('~/src/assets/images/icon-copy-green.png')}
              mr="18px"
            />

            <Button
              onPress={handlePressPrint}
              label={i18n.t('app.print')}
              icon={require('~/src/assets/images/icon-print-green.png')}
            />
          </LinearLayout>

          <TextView fontFamily="light" mb={4} color="text.0" fontSize="lg">
            {i18n.t('screens.step1BackupWallet.body_2')}
          </TextView>

          <TextView fontFamily="light" mb={5} color="text.0" fontSize="lg">
            {i18n.t('screens.step1BackupWallet.body_3')}
          </TextView>
        </LinearLayout>

        <LinearLayout mt={5} mb={6} px={5} width="100%">
          <Button
            onPress={handlePressContinue}
            label={i18n.t('app.continue')}
            variant="contained"
            py="12px"
            labelStyle={{ fontSize: '2xl' }}
          />
        </LinearLayout>
      </AwaitActivity>

      <Alert
        title={i18n.t('screens.step1BackupWallet.dialog_title')}
        subtitle={i18n.t('screens.step1BackupWallet.dialog_body')}
        buttonLabel={i18n.t('screens.step1BackupWallet.dialog_dismiss')}
        visible={modalIsVisible}
        onRequestClose={() => setModalIsVisible(false)}
        onPress={handlePressConfirmation}
      />
    </ScreenLayout>
  )
}

export default Step1BackupWalletPage

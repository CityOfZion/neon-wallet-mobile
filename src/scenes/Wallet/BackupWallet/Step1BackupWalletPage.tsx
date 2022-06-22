import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import * as Print from 'expo-print'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCard from '~src/components/themed/ThemedCard'
import { Wallet } from '~src/models/redux/Wallet'
import { TextView, LinearLayout } from '~src/styles/styled-components'

export interface StepsBackupWalletPageParams {
  wallet: Wallet
  accessByNotification?: boolean
}

interface Props {
  route: RouteProp<WalletStackParamList, 'Step1BackupWallet'>
  navigation: StackNavigationProp<WalletStackParamList>
}

const WordComponent = (props: { value: string }) => {
  return (
    <TextView my={3} mx={4} color="text.0" fontSize="2xl" fontFamily="regular">
      {props.value}
    </TextView>
  )
}

const Step1BackupWalletPage: React.FC<Props> = props => {
  const [words, setWords] = useState<string[]>([])

  const { wallet, accessByNotification } = props.route.params
  const seeds = words.join(' ')

  useEffect(() => {
    Await.run('populateStep1', populate)
  }, [wallet.id])

  const populate = async () => {
    const mnemonic = await wallet.getMnemonic()

    if (mnemonic) {
      setWords(mnemonic.split(' '))
    }
  }

  props.navigation.setOptions({
    headerRight: () =>
      HeaderActionButton({
        actionTitle: i18n.t('app.cancel'),
        actionButtonStyle: 'highlight',
        actionOnPress: () => {
          props.navigation.reset({
            index: 0,
            routes: accessByNotification ? [{ name: wrapper.route.Tab.name }] : [{ name: wrapper.route.More.name }],
          })
        },
      }),
  })

  const infoDialog = () => {
    Alert.alert(i18n.t('step1BackupWallet.dialog_title'), i18n.t('step1BackupWallet.dialog_body'), [
      {
        text: i18n.t('step1BackupWallet.dialog_dismiss'),
        onPress: () =>
          props.navigation.navigate(wrapper.route.Step2BackupWallet.name, {
            wallet,
            accessByNotification,
          }),
      },
    ])
  }

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
                {i18n.t('step1BackupWallet.label_1')}
              </TextView>

              <TextView color="text.0" fontSize="lg" fontFamily="bold">
                {i18n.t('step1BackupWallet.oneOfThree')}
              </TextView>
            </LinearLayout>

            <TextView fontFamily="light" color="text.0" fontSize="lg">
              {i18n.t('step1BackupWallet.body_1')}
            </TextView>
          </LinearLayout>

          <LinearLayout mb={5}>
            <ThemedCard
              rounded={false}
              contentStyle={{
                paddingTop: Normalize.scale(26),
                paddingBottom: Normalize.scale(26),
                paddingLeft: Normalize.scale(10),
                paddingRight: Normalize.scale(10),
              }}
            >
              <LinearLayout
                orientation="horiz"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
                width="100%"
              >
                {words.map(it => (
                  <WordComponent key={it} value={it} />
                ))}
              </LinearLayout>
            </ThemedCard>
          </LinearLayout>

          <LinearLayout mb={5} orientation="horiz" justifyContent="flex-end">
            <ThemedButton
              onPress={() => UtilsHelper.copyToClipboard(seeds ?? '')}
              label={i18n.t('app.copy')}
              srcIcon={require('~/src/assets/images/icon-copy-green.png')}
              iconSize={[Normalize.scale(25), Normalize.scale(25)]}
              fontSize={18}
              flat
            />

            <ThemedButton
              onPress={() =>
                Print.printAsync({
                  html: `<html><body><br><br>&emsp;&emsp;${seeds}</body></html>`,
                })
              }
              label={i18n.t('app.print')}
              srcIcon={require('~/src/assets/images/icon-print-green.png')}
              iconSize={[25, 25]}
              fontSize={18}
              flat
            />
          </LinearLayout>

          <TextView fontFamily="light" mb={4} color="text.0" fontSize="lg">
            {i18n.t('step1BackupWallet.body_2')}
          </TextView>

          <TextView fontFamily="light" mb={5} color="text.0" fontSize="lg">
            {i18n.t('step1BackupWallet.body_3')}
          </TextView>
        </LinearLayout>

        <LinearLayout mt={5} mb={6} px={5} width="100%">
          <ThemedButton onPress={() => infoDialog()} label={i18n.t('app.continue')} />
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

Step1BackupWalletPage.propTypes = {
  navigation: PropTypes.any,
  route: PropTypes.any,
}

export default Step1BackupWalletPage

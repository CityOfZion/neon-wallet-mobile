import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import * as Print from 'expo-print'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Normalize } from '~/src/app/Normalize'
import { Alert, AlertButton } from '~/src/components/Alert'
import { AsteroidHelper } from '~/src/helpers/AsteroidHelper'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCard from '~src/components/themed/ThemedCard'
import { MoreStackParamList } from '~src/navigation/MoreStackNavigation'
import { TextView, LinearLayout } from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<MoreStackParamList>
}

const WordComponent = (props: { value: string }) => {
  return (
    <TextView my={3} mx={4} color="text.0" fontSize="2xl" fontFamily="semibold">
      {props.value}
    </TextView>
  )
}

const Step2CreateWalletPage: React.FC<Props> = props => {
  const [words, setWords] = useState<string[]>([])
  const [modalIsVisible, setModalIsVisible] = useState(false)

  const seeds = words.join(' ')

  const populate = async () => {
    setWords(AsteroidHelper.generateMnemonic() ?? [])
  }

  const handlePressContinue = () => {
    setModalIsVisible(true)
  }

  const handlePressConfirmation = () => {
    setModalIsVisible(false)

    if (!words) return

    props.navigation.navigate(wrapper.route.Step3CreateWallet.name, {
      mnemonic: words,
    })
  }

  useEffect(() => {
    Await.run('populate', populate, 500)
  }, [])

  return (
    <ScreenLayout>
      <AwaitActivity
        name="populate"
        loadingView={
          <LinearLayout width="100%" height="100%">
            <ScreenLoader transparent />
          </LinearLayout>
        }
      >
        <LinearLayout mt={5} weight={1}>
          <LinearLayout mb={6} width="100%">
            <LinearLayout width="100%" orientation="horiz">
              <TextView weight={1} color="text.0" fontSize="lg" fontFamily="bold">
                {i18n.t('step2CreateWallet.label_1')}
              </TextView>

              <TextView color="text.0" fontSize="lg" fontFamily="bold">
                {i18n.t('step2CreateWallet.oneOfThree')}
              </TextView>
            </LinearLayout>

            <TextView fontFamily="light" color="text.0" fontSize="lg">
              {i18n.t('step2CreateWallet.body_1')}
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
              onPress={() => UtilsHelper.copyToClipboard(seeds)}
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
            {i18n.t('step2CreateWallet.body_2')}
          </TextView>

          <TextView fontFamily="light" mb={5} color="text.0" fontSize="lg">
            {i18n.t('step2CreateWallet.body_3')}
          </TextView>
        </LinearLayout>

        <LinearLayout mt={5} mb={7} px={5} width="100%">
          <ThemedButton onPress={handlePressContinue} label={i18n.t('app.continue')} />
        </LinearLayout>
      </AwaitActivity>

      <Alert
        title={i18n.t('step2CreateWallet.dialog_title')}
        subtitle={i18n.t('step2CreateWallet.dialog_body')}
        visible={modalIsVisible}
        onRequestClose={() => setModalIsVisible(false)}
      >
        <AlertButton label={i18n.t('step2CreateWallet.dialog_dismiss')} onPress={handlePressConfirmation} />
      </Alert>
    </ScreenLayout>
  )
}

Step2CreateWalletPage.propTypes = {
  navigation: PropTypes.any,
}

export default Step2CreateWalletPage

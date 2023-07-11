import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { useState, useCallback } from 'react'
import { FlatList } from 'react-native'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Alert, AlertButton } from '~/src/components/Alert'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import { MoreStackParamList } from '~src/navigation/MoreStackNavigation'
import { TextView, LinearLayout } from '~src/styles/styled-components'

export interface ParamsCreateWalletPage {
  mnemonic: string[]
}

interface Props {
  navigation: StackNavigationProp<MoreStackParamList>
  route: RouteProp<MoreStackParamList, 'Step3CreateWallet'>
}

const Step3CreateWalletPage: React.FC<Props> = props => {
  const words = props.route.params.mnemonic
  const [formedWords, setFormedWords] = useState<string[]>([])
  const [shuffledWords] = useState<string[]>(_.shuffle(words))
  const [skipModalIsVisible, setSkipModalIsVisible] = useState(false)
  const [incorrectOrderModalIsVisible, setIncorrectOrderModalIsVisible] = useState(false)

  const handlePressRetry = () => {
    setIncorrectOrderModalIsVisible(false)
    setFormedWords([])
  }

  const handlePressSkip = () => {
    setSkipModalIsVisible(false)

    props.navigation.navigate(wrapper.route.Step4CreateWallet.name, {
      hasBackup: false,
      mnemonic: words.join(' '),
    })
  }

  const skipDialog = useCallback(() => {
    setSkipModalIsVisible(true)
  }, [])

  const validateAndNext = useCallback(() => {
    if (formedWords.join(' ') === words.join(' ')) {
      props.navigation.navigate(wrapper.route.Step4CreateWallet.name, {
        hasBackup: true,
        mnemonic: words.join(' '),
      })
    } else {
      setIncorrectOrderModalIsVisible(true)
    }
  }, [formedWords, words])

  const isDisabled = useCallback(() => {
    return formedWords.length !== words.length
  }, [formedWords, words])

  const toggleWordEvent = useCallback(
    (word: string, active: boolean) => {
      if (active) {
        setFormedWords([...formedWords, word])
      } else {
        setFormedWords([])
      }
    },
    [formedWords]
  )

  const MemoThemedButton = useCallback(
    (item: string) => (
      <ThemedButton
        onPress={(_, active) => toggleWordEvent(String(item), Boolean(active))}
        label={item}
        toggleable
        rounded={false}
        active={formedWords.includes(item)}
      />
    ),
    [formedWords]
  )

  return (
    <ScreenLayout
      rightButton={
        <ThemedButton
          onPress={skipDialog}
          label={i18n.t('app.skip')}
          flat
          fontFamily="light"
          textColor="primary"
          fontSize="lg"
        />
      }
    >
      <LinearLayout mt={5} weight={1}>
        <LinearLayout mb={6} width="100%">
          <LinearLayout width="100%" orientation="horiz">
            <TextView weight={1} color="text.0" fontSize="lg" fontFamily="bold">
              {i18n.t('step3CreateWallet.label_1')}
            </TextView>

            <TextView color="text.0" fontSize="lg" fontFamily="bold">
              {i18n.t('step3CreateWallet.twoOfThree')}
            </TextView>
          </LinearLayout>

          <TextView fontFamily="light" color="text.0" fontSize="lg">
            {i18n.t('step3CreateWallet.body_1')}
          </TextView>
        </LinearLayout>

        <LinearLayout
          mb={6}
          orientation="horiz"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="center"
          width="100%"
        >
          <FlatList<string>
            data={shuffledWords}
            horizontal={false}
            scrollEnabled={false}
            numColumns={3}
            renderItem={({ item }) => (
              <LinearLayout weight={1} mx={2} my={5}>
                {MemoThemedButton(item)}
              </LinearLayout>
            )}
          />
        </LinearLayout>

        <TextView fontFamily="light" mb={4} color="text.0" fontSize="lg">
          {i18n.t('step3CreateWallet.body_2')}
        </TextView>
      </LinearLayout>

      <LinearLayout mt={5} mb={7} px={5} width="100%">
        <ThemedButton onPress={() => validateAndNext()} label={i18n.t('app.continue')} disabled={isDisabled()} />
      </LinearLayout>

      <Alert
        title={i18n.t('step3CreateWallet.dialog_1_title')}
        subtitle={i18n.t('step3CreateWallet.dialog_1_body')}
        visible={skipModalIsVisible}
        onRequestClose={() => setSkipModalIsVisible(false)}
      >
        <AlertButton label={i18n.t('boolean.true')} onPress={handlePressSkip} />
        <AlertButton label={i18n.t('boolean.false')} onPress={() => setSkipModalIsVisible(false)} />
      </Alert>

      <Alert
        title={i18n.t('step3CreateWallet.dialog_2_title')}
        subtitle={i18n.t('step3CreateWallet.dialog_2_body')}
        visible={incorrectOrderModalIsVisible}
        onRequestClose={() => setIncorrectOrderModalIsVisible(false)}
      >
        <AlertButton label={i18n.t('app.retry')} onPress={handlePressRetry} />
      </Alert>
    </ScreenLayout>
  )
}

Step3CreateWalletPage.propTypes = {
  navigation: PropTypes.any,
  route: PropTypes.any,
}

export default Step3CreateWalletPage

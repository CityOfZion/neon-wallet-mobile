import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import _ from 'lodash'
import PropTypes from 'prop-types'
import React, { useState, useCallback } from 'react'
import { Alert, FlatList } from 'react-native'

import { wrapper } from '~/src/app/ApplicationWrapper'
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

  const skipDialog = useCallback(() => {
    Alert.alert(i18n.t('step3CreateWallet.dialog_1_title'), i18n.t('step3CreateWallet.dialog_1_body'), [
      {
        text: i18n.t('boolean.true'),
        onPress: () =>
          props.navigation.navigate(wrapper.route.Step4CreateWallet.name, {
            hasBackup: false,
            mnemonic: words.join(' '),
          }),
      },
      {
        text: i18n.t('boolean.false'),
        style: 'cancel',
      },
    ])
  }, [])

  const validateAndNext = useCallback(() => {
    if (formedWords.join(' ') === words.join(' ')) {
      props.navigation.navigate(wrapper.route.Step4CreateWallet.name, {
        hasBackup: true,
        mnemonic: words.join(' '),
      })
    } else {
      Alert.alert(i18n.t('step3CreateWallet.dialog_2_title'), i18n.t('step3CreateWallet.dialog_2_body'), [
        {
          text: i18n.t('app.retry'),
          onPress: () => setFormedWords([]),
        },
      ])
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
    </ScreenLayout>
  )
}

Step3CreateWalletPage.propTypes = {
  navigation: PropTypes.any,
  route: PropTypes.any,
}

export default Step3CreateWalletPage

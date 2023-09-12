import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import _ from 'lodash'
import React, { useState, useMemo } from 'react'
import { FlatList } from 'react-native'
import { showMessage } from 'react-native-flash-message'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { Button } from '~/src/components/Button'
import ThemedButton from '~/src/components/themed/ThemedButton'
import { WalletStackParamList } from '~/src/navigation/WalletsStackNavigation'
import { Wallet } from '~/src/store/wallet/Wallet'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import { TextView, LinearLayout } from '~src/styles/styled-components'

export interface Step2BackupWalletPageParams {
  wallet: Wallet
  mnemonic: string
}

interface Props {
  route: RouteProp<WalletStackParamList, 'Step2BackupWallet'>
  navigation: StackNavigationProp<WalletStackParamList>
}

const Step2BackupWalletPage: React.FC<Props> = props => {
  const { wallet, mnemonic } = props.route.params

  const words = useMemo(() => mnemonic.split(' '), [mnemonic])
  const shuffledWords = useMemo(() => _.shuffle(words), [words])

  const [pressedWords, setPressedWords] = useState<string[]>([])

  const isActive = (word: string) => pressedWords.some(pressedWord => pressedWord === word)

  const isDisabled = () => pressedWords.length !== words.length

  const handlePress = (word: string) => {
    const exist = isActive(word)

    setPressedWords(prevState => (exist ? prevState.filter(state => state !== word) : [...prevState, word]))
  }

  const validateAndNext = async () => {
    if (pressedWords.join() !== words.join()) {
      showMessage({
        message: i18n.t('screens.step2BackupWallet.dialog_1_title'),
        description: i18n.t('screens.step2BackupWallet.dialog_1_body'),
      })
      setPressedWords([])
      return
    }

    props.navigation.navigate(wrapper.route.Step3BackupWallet.name, {
      wallet,
    })
  }

  const handlePressCancel = () => {
    props.navigation.goBack()
    props.navigation.goBack()
  }

  return (
    <ScreenLayout
      rightButton={
        <ThemedButton
          onPress={handlePressCancel}
          label={i18n.t('app.cancel')}
          flat
          fontFamily="light"
          textColor="primary"
          fontSize="lg"
        />
      }
    >
      <LinearLayout height="100%" justifyContent="space-between" width="100%">
        <LinearLayout width="100%">
          <TextView alignSelf="flex-start" color="text.0" fontSize="lg" fontFamily="semibold">
            {wallet.name}
          </TextView>

          <LinearLayout justifyContent="space-between" orientation="horiz" mt="28px">
            <TextView color="text.0" fontSize="lg" fontFamily="regular">
              {i18n.t('screens.step2BackupWallet.label_1')}
            </TextView>

            <TextView color="text.0" fontSize="lg" fontFamily="regular">
              {i18n.t('screens.step2BackupWallet.twoOfThree')}
            </TextView>
          </LinearLayout>

          <TextView fontFamily="light" color="text.0" fontSize="lg" mt="6px">
            {i18n.t('screens.step2BackupWallet.body_1')}
          </TextView>

          <LinearLayout orientation="horiz" width="100%">
            <FlatList
              data={shuffledWords}
              horizontal={false}
              scrollEnabled={false}
              numColumns={3}
              renderItem={({ item }) => (
                <Button
                  onPress={() => handlePress(item)}
                  flex={1}
                  label={item}
                  variant="contained"
                  backgroundColor="background.9"
                  labelStyle={{ color: 'primary', fontSize: '2xl' }}
                  width="3%"
                  height="52px"
                  mx="4px"
                  my="8px"
                  borderWidth="1px"
                  borderStyle="solid"
                  borderColor={isActive(item) ? 'primary' : 'transparent'}
                />
              )}
            />
          </LinearLayout>
        </LinearLayout>

        <Button
          variant="contained"
          label={i18n.t('app.continue')}
          py="12px"
          mx="18px"
          labelStyle={{ fontSize: '2xl' }}
          mb="36px"
          disabled={isDisabled()}
          onPress={validateAndNext}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}

export default Step2BackupWalletPage

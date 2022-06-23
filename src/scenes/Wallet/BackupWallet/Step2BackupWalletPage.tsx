import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import _ from 'lodash'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, { useEffect, useState, useCallback } from 'react'
import { Alert, FlatList } from 'react-native'
import { useDispatch } from 'react-redux'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {WalletStackParamList} from '~/src/navigation/WalletsStackNavigation'
import {AsyncDispatch} from '~/src/types/reducers/root'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import { RootStore } from '~src/store/RootStore'
import { TextView, LinearLayout } from '~src/styles/styled-components'

interface Props {
  route: RouteProp<WalletStackParamList, 'Step2BackupWallet'>
  navigation: StackNavigationProp<WalletStackParamList>
}

const Step2BackupWalletPage: React.FC<Props> = props => {
  const { wallet, accessByNotification } = props.route.params
  const dispatch = useDispatch()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const [words, setWords] = useState<string[]>([])
  const [formedWords, setFormedWords] = useState<string[]>([])
  const [shuffledWords, setShuffledWords] = useState<string[]>([])
  const [indexesPressedWords, setIndexesPressedWords] = useState<number[]>([])

  useEffect(() => {
    Await.run('populateStep2', populate)
  }, [wallet.id])

  const populate = useCallback(async () => {
    const mnemonic = await wallet.getMnemonic()

    if (mnemonic) {
      const words = mnemonic.split(' ')
      setWords(words)
      setShuffledWords(_.shuffle(words))
    }
  }, [wallet.id])

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

  const validateAndNext = async () => {
    if (formedWords.join() === words.join()) {
      wallet.lastBackup = moment().format()
      wallet.showBackupAlert = false
      dispatch(RootStore.app.actions.updateAndSaveWallet(wallet))
      await dispatchAsync(RootStore.app.actions.syncWallets())

      props.navigation.navigate(wrapper.route.Step3BackupWallet.name, {
        wallet,
        accessByNotification,
      })
    } else {
      Alert.alert(i18n.t('step2BackupWallet.dialog_1_title'), i18n.t('step2BackupWallet.dialog_1_body'), [
        {
          text: i18n.t('app.retry'),
          onPress: () => setFormedWords([]),
        },
      ])
    }
  }

  const isDisabled = () => {
    return formedWords.length !== words.length
  }

  const toggleWordEvent = (word: string, active: boolean, indexWord: number) => {
    if (active) {
      const words = [...formedWords, word]
      setFormedWords(words)
      setIndexesPressedWords([...indexesPressedWords, indexWord])
    } else {
      setFormedWords([])
      setIndexesPressedWords([])
    }
  }

  return (
    <ScreenLayout alignX="center" darkerSolidColorBG>
      <AwaitActivity name="populateStep2" loadingView={<ScreenLoader />}>
        <TextView alignSelf="flex-start" color="text.0" fontSize="lg" fontFamily="semibold">
          {wallet.name}
        </TextView>

        <LinearLayout mt={5} weight={1}>
          <LinearLayout mb={6} width="100%">
            <LinearLayout width="100%" orientation="horiz">
              <TextView weight={1} color="text.0" fontSize="lg" fontFamily="semibold">
                {i18n.t('step2BackupWallet.label_1')}
              </TextView>

              <TextView color="text.0" fontSize="lg" fontFamily="bold">
                {i18n.t('step2BackupWallet.twoOfThree')}
              </TextView>
            </LinearLayout>

            <TextView fontFamily="light" color="text.0" fontSize="lg">
              {i18n.t('step2BackupWallet.body_1')}
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
            <FlatList
              data={shuffledWords}
              horizontal={false}
              scrollEnabled={false}
              numColumns={3}
              renderItem={({ item, index }) => (
                <LinearLayout weight={1} mx={2} my={5}>
                  <ThemedButton
                    onPress={(event, active) => toggleWordEvent(String(item), Boolean(active), index)}
                    label={item}
                    toggleable
                    rounded={false}
                    active={indexesPressedWords.includes(index)}
                  />
                </LinearLayout>
              )}
            />
          </LinearLayout>
        </LinearLayout>

        <LinearLayout mt={5} mb={6} px={5} width="100%">
          <ThemedButton onPress={() => validateAndNext()} label={i18n.t('app.continue')} disabled={isDisabled()} />
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

Step2BackupWalletPage.propTypes = {
  navigation: PropTypes.any,
  route: PropTypes.any,
}

export default Step2BackupWalletPage

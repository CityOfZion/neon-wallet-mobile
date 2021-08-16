import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import moment from 'moment'
import PropTypes from 'prop-types'
import React, {useEffect, useState} from 'react'
import {Alert, FlatList} from 'react-native'
import {useDispatch} from 'react-redux'

import {Facade} from '~src/app/Facade'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'
import {RootStore} from '~src/store/RootStore'
import {TextView, LinearLayout} from '~src/styles/styled-components'

interface Props {
  route: RouteProp<SettingsStackParamList, 'Step2BackupWallet'>
  navigation: StackNavigationProp<SettingsStackParamList>
}

const Step2BackupWalletPage: React.FC<Props> = (props) => {
  const {wallet} = props.route.params
  const dispatch = useDispatch()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()
  const [words, setWords] = useState<string[]>([])
  const [formedWords, setFormedWords] = useState<string[]>([])
  const [shuffledWords, setShuffledWords] = useState<string[]>([])
  const [indexesPressedWords, setIndexesPressedWords] = useState<number[]>([])

  useEffect(() => {
    Facade.await.run('populateStep2', populate)
  }, [wallet.id])

  const populate = async () => {
    const mnemonic = await wallet.getMnemonic()

    if (mnemonic) {
      const words = mnemonic.split(' ')
      setWords(words)
      setShuffledWords(Facade.lodash.shuffle(words))
    }
  }

  props.navigation.setOptions({
    headerRight: () =>
      HeaderActionButton({
        actionTitle: Facade.t('app.cancel'),
        actionButtonStyle: 'highlight',
        actionOnPress: () => {
          props.navigation.reset({
            index: 2,
            routes: [{name: Facade.route.SettingsPage.name}],
          })
          props.navigation.navigate(Facade.route.MyWalletOptions.name, {
            wallet,
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

      props.navigation.reset({
        index: 0,
        routes: [{name: Facade.route.Step3BackupWallet.name, params: {wallet}}],
      })
    } else {
      Alert.alert(
        Facade.t('step2BackupWallet.dialog_1_title'),
        Facade.t('step2BackupWallet.dialog_1_body'),
        [
          {
            text: Facade.t('app.retry'),
            onPress: () => setFormedWords([]),
          },
        ]
      )
    }
  }

  const isDisabled = () => {
    return formedWords.length !== words.length
  }

  const toggleWordEvent = (
    word: string,
    active: boolean,
    indexWord: number
  ) => {
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
    <ScreenLayout alignX={'center'}>
      <AwaitActivity name={'populateStep2'} loadingView={<ScreenLoader />}>
        <TextView
          alignSelf={'flex-start'}
          color={'text.0'}
          fontSize={'lg'}
          fontFamily={'semibold'}
        >
          {wallet.name}
        </TextView>

        <LinearLayout mt={5} weight={1}>
          <LinearLayout mb={6} width={'100%'}>
            <LinearLayout width={'100%'} orientation={'horiz'}>
              <TextView
                weight={1}
                color={'text.0'}
                fontSize={'lg'}
                fontFamily={'semibold'}
              >
                {Facade.t('step2BackupWallet.label_1')}
              </TextView>

              <TextView color={'text.0'} fontSize={'lg'} fontFamily={'bold'}>
                {Facade.t('step2BackupWallet.twoOfThree')}
              </TextView>
            </LinearLayout>

            <TextView fontFamily={'light'} color={'text.0'} fontSize={'lg'}>
              {Facade.t('step2BackupWallet.body_1')}
            </TextView>
          </LinearLayout>

          <LinearLayout
            mb={6}
            orientation={'horiz'}
            flexWrap={'wrap'}
            alignItems={'center'}
            justifyContent={'center'}
            width={'100%'}
          >
            <FlatList
              data={shuffledWords}
              horizontal={false}
              scrollEnabled={false}
              numColumns={3}
              renderItem={({item, index}) => (
                <LinearLayout weight={1} mx={2} my={5}>
                  <ThemedButton
                    onPress={(event, active) =>
                      toggleWordEvent(String(item), Boolean(active), index)
                    }
                    label={item}
                    toggleable={true}
                    rounded={false}
                    active={indexesPressedWords.includes(index)}
                  />
                </LinearLayout>
              )}
            />
          </LinearLayout>
        </LinearLayout>

        <LinearLayout mt={5} mb={6} px={5} width={'100%'}>
          <ThemedButton
            onPress={() => validateAndNext()}
            label={Facade.t('app.continue')}
            disabled={isDisabled()}
          />
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

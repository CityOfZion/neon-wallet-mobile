import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {Alert, FlatList} from 'react-native'

import {Facade} from '~src/app/Facade'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'
import {TextView, LinearLayout} from '~src/styles/styled-components'

interface Props {
  route: RouteProp<SettingsStackParamList, 'Step2BackupWallet'>
  navigation: StackNavigationProp<SettingsStackParamList>
}

const Step2BackupWalletPage: React.FC<Props> = (props) => {
  const {wallet} = props.route.params

  const words = wallet.securityWords
  const [formedWords, setFormedWords] = useState<string[]>([])
  const [shuffledWords] = useState<string[]>(Facade.lodash.shuffle(words))

  props.navigation.setOptions({
    headerRight: () =>
      HeaderActionButton({
        actionTitle: Facade.t('app.cancel'),
        actionButtonStyle: 'highlight',
        actionOnPress: () => {
          props.navigation.reset({
            index: 2,
            routes: [{name: Facade.route.Settings.name}],
          })
          props.navigation.navigate(Facade.route.MyWalletOptions.name, {
            wallet,
          })
        },
      }),
  })

  const validateAndNext = () => {
    if (formedWords.join() === words.join()) {
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

  const toggleWordEvent = (word: string, active: boolean) => {
    if (active) {
      const words = [...formedWords, word]
      setFormedWords(words)
    } else {
      setFormedWords([])
    }
  }

  return (
    <ScreenLayout alignX={'center'}>
      <TextView
        alignSelf={'flex-start'}
        color={'text.0'}
        fontSize={'lg'}
        fontFamily={'bold'}
      >
        {wallet.name}
      </TextView>

      <LinearLayout mt={5} weight={1}>
        <LinearLayout mb={6} width={'100%'}>
          <LinearLayout width={'100%'} orientation={'horiz'}>
            <TextView
              weight={1}
              color={'primary'}
              fontSize={'lg'}
              fontFamily={'bold'}
            >
              {Facade.t('step2BackupWallet.label_1')}
            </TextView>

            <TextView color={'primary'} fontSize={'lg'} fontFamily={'bold'}>
              {Facade.t('step2BackupWallet.twoOfThree')}
            </TextView>
          </LinearLayout>

          <TextView color={'text.0'} fontSize={'lg'}>
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
            renderItem={({item}) => (
              <LinearLayout weight={1} mx={2} my={5}>
                <ThemedButton
                  onPress={(event, active) =>
                    toggleWordEvent(String(item), Boolean(active))
                  }
                  label={item}
                  toggleable={true}
                  rounded={false}
                  active={formedWords.includes(item)}
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
    </ScreenLayout>
  )
}

Step2BackupWalletPage.propTypes = {
  navigation: PropTypes.any,
  route: PropTypes.any,
}

export default Step2BackupWalletPage

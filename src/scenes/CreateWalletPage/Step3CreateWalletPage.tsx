import {StackNavigationProp} from '@react-navigation/stack'
import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {Alert, FlatList} from 'react-native'

import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {TextView, LinearLayout} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<MoreStackParamList>
}

const Step3CreateWalletPage: React.FC<Props> = (props) => {
  const words = [
    'jack',
    'phone',
    'burn',
    'tab',
    'cone',
    'kilo',
    'roach',
    'key',
    'gate',
    'forest',
    'mirror',
    'stone',
  ]

  const [formedWords, setFormedWords] = useState<string[]>([])
  const [shuffledWords] = useState<string[]>(Facade.lodash.shuffle(words))

  const validateAndNext = () => {
    if (formedWords.join() === words.join()) {
      props.navigation.navigate(Facade.path.Step4CreateWallet.name)
    } else {
      Alert.alert(
        Facade.t('step3CreateWallet.dialog_2_title'),
        Facade.t('step3CreateWallet.dialog_2_body'),
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
      <LinearLayout mt={5} weight={1}>
        <LinearLayout mb={6} width={'100%'}>
          <LinearLayout width={'100%'} orientation={'horiz'}>
            <TextView
              weight={1}
              color={'primary'}
              fontSize={'lg'}
              fontFamily={'bold'}
            >
              {Facade.t('step3CreateWallet.label_1')}
            </TextView>

            <TextView color={'primary'} fontSize={'lg'} fontFamily={'bold'}>
              {Facade.t('step3CreateWallet.twoOfThree')}
            </TextView>
          </LinearLayout>

          <TextView color={'text.0'} fontSize={'lg'}>
            {Facade.t('step3CreateWallet.body_1')}
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

        <TextView mb={4} color={'text.0'} fontSize={'lg'}>
          {Facade.t('step3CreateWallet.body_2')}
        </TextView>
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

Step3CreateWalletPage.propTypes = {
  navigation: PropTypes.any,
}

export default Step3CreateWalletPage

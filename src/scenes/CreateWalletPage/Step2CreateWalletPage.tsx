import {StackNavigationProp} from '@react-navigation/stack'
import PropTypes from 'prop-types'
import React from 'react'
import {Alert} from 'react-native'

import {Facade} from '~src/app/Facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCard from '~src/components/themed/ThemedCard'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {TextView, LinearLayout} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<MoreStackParamList>
}

const Step2CreateWalletPage: React.FC<Props> = (props) => {
  // TODO: Use asteroid js to create the words
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

  const infoDialog = () => {
    Alert.alert(
      Facade.t('step2CreateWallet.dialog_title'),
      Facade.t('step2CreateWallet.dialog_body'),
      [
        {
          text: Facade.t('step2CreateWallet.dialog_dismiss'),
          onPress: () =>
            props.navigation.navigate(Facade.path.Step3CreateWallet.name, {
              actionTitle: Facade.t('app.skip'),
              actionButtonStyle: 'highlight',
              actionOnPress: () => skipDialog(),
            }),
        },
      ]
    )
  }

  const skipDialog = () => {
    Alert.alert(
      Facade.t('step3CreateWallet.dialog_1_title'),
      Facade.t('step3CreateWallet.dialog_1_body'),
      [
        {
          text: Facade.t('boolean.true'),
          onPress: () =>
            props.navigation.navigate(Facade.path.Step4CreateWallet.name),
        },
        {
          text: Facade.t('boolean.false'),
          style: 'cancel',
        },
      ]
    )
  }

  const _renderWord = (value: string) => {
    return (
      <TextView
        my={3}
        mx={4}
        color={'text.0'}
        fontSize={'2xl'}
        fontFamily={'semibold'}
      >
        {value}
      </TextView>
    )
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
              {Facade.t('step2CreateWallet.label_1')}
            </TextView>

            <TextView color={'primary'} fontSize={'lg'} fontFamily={'bold'}>
              {Facade.t('step2CreateWallet.oneOfThree')}
            </TextView>
          </LinearLayout>

          <TextView color={'text.0'} fontSize={'lg'}>
            {Facade.t('step2CreateWallet.body_1')}
          </TextView>
        </LinearLayout>

        <LinearLayout mb={5}>
          <ThemedCard
            rounded={false}
            contentStyle={{
              paddingTop: Facade.space(26),
              paddingBottom: Facade.space(26),
              paddingLeft: Facade.space(10),
              paddingRight: Facade.space(10),
            }}
          >
            <LinearLayout
              orientation={'horiz'}
              flexWrap={'wrap'}
              alignItems={'center'}
              justifyContent={'center'}
              width={'100%'}
            >
              {words.map((it) => _renderWord(it))}
            </LinearLayout>
          </ThemedCard>
        </LinearLayout>

        <LinearLayout mb={5} orientation={'horiz'} justifyContent={'flex-end'}>
          <ThemedButton
            onPress={() => Facade.utils.copyToClipboard(words.join(' '))}
            label={Facade.t('app.copy')}
            srcIcon={require('~/src/assets/images/icon-copy-green.png')}
            iconSize={[Facade.space(25), Facade.space(25)]}
            fontSize={18}
            flat={true}
          />

          <ThemedButton
            label={Facade.t('app.print')}
            srcIcon={require('~/src/assets/images/icon-print-green.png')}
            iconSize={[25, 25]}
            fontSize={18}
            flat={true}
          />
        </LinearLayout>

        <TextView mb={4} color={'text.0'} fontSize={'lg'}>
          {Facade.t('step2CreateWallet.body_2')}
        </TextView>

        <TextView mb={5} color={'text.0'} fontSize={'lg'}>
          {Facade.t('step2CreateWallet.body_3')}
        </TextView>
      </LinearLayout>

      <LinearLayout mt={5} mb={6} px={5} width={'100%'}>
        <ThemedButton
          onPress={() => infoDialog()}
          label={Facade.t('app.continue')}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}

Step2CreateWalletPage.propTypes = {
  navigation: PropTypes.any,
}

export default Step2CreateWalletPage

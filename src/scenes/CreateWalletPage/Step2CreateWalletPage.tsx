import {StackNavigationProp} from '@react-navigation/stack'
import PropTypes from 'prop-types'
import React from 'react'
import {Alert} from 'react-native'

import {$} from '~/facade'
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
      $.t('step2CreateWallet.dialog_title'),
      $.t('step2CreateWallet.dialog_body'),
      [
        {
          text: $.t('step2CreateWallet.dialog_dismiss'),
          onPress: () =>
            props.navigation.navigate($.path.Step3CreateWallet.name, {
              actionTitle: $.t('app.skip'),
              actionOnPress: () => skipDialog(),
            }),
        },
      ]
    )
  }

  const skipDialog = () => {
    Alert.alert(
      $.t('step3CreateWallet.dialog_1_title'),
      $.t('step3CreateWallet.dialog_1_body'),
      [
        {
          text: $.t('boolean.true'),
          onPress: () =>
            props.navigation.navigate($.path.Step4CreateWallet.name),
        },
        {
          text: $.t('boolean.false'),
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
              {$.t('step2CreateWallet.label_1')}
            </TextView>

            <TextView color={'primary'} fontSize={'lg'} fontFamily={'bold'}>
              {$.t('step2CreateWallet.oneOfThree')}
            </TextView>
          </LinearLayout>

          <TextView color={'text.0'} fontSize={'lg'}>
            {$.t('step2CreateWallet.body_1')}
          </TextView>
        </LinearLayout>

        <LinearLayout mb={5}>
          <ThemedCard
            rounded={false}
            contentStyle={{
              paddingTop: $.space(26),
              paddingBottom: $.space(26),
              paddingLeft: $.space(10),
              paddingRight: $.space(10),
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
            onPress={() => $.utils.copyToClipboard(words.join(' '))}
            label={$.t('app.copy')}
            srcIcon={require('~/src/assets/images/icon-copy-green.png')}
            iconSize={[$.space(25), $.space(25)]}
            fontSize={18}
            flat={true}
          />

          <ThemedButton
            label={$.t('app.print')}
            srcIcon={require('~/src/assets/images/icon-print-green.png')}
            iconSize={[25, 25]}
            fontSize={18}
            flat={true}
          />
        </LinearLayout>

        <TextView mb={4} color={'text.0'} fontSize={'lg'}>
          {$.t('step2CreateWallet.body_2')}
        </TextView>

        <TextView mb={5} color={'text.0'} fontSize={'lg'}>
          {$.t('step2CreateWallet.body_3')}
        </TextView>
      </LinearLayout>

      <LinearLayout mt={5} mb={6} px={5} width={'100%'}>
        <ThemedButton
          onPress={() => infoDialog()}
          label={$.t('app.continue')}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}

Step2CreateWalletPage.propTypes = {
  navigation: PropTypes.any,
}

export default Step2CreateWalletPage

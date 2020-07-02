import {StackNavigationProp} from '@react-navigation/stack'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React from 'react'
import {Alert} from 'react-native'

import {useRoutePath} from '~src/app/RouteUtils'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCard from '~src/components/themed/ThemedCard'
import {UtilsHelper} from '~src/helpers/UtilsHelper'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {TextView, LinearLayout, normalize} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<MoreStackParamList>
}

const Step2CreateWalletPage: React.FC<Props> = (props) => {
  const path = useRoutePath()

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
      i18n.t('step2CreateWallet.dialog_title'),
      i18n.t('step2CreateWallet.dialog_body'),
      [
        {
          text: i18n.t('step2CreateWallet.dialog_dismiss'),
          onPress: () =>
            props.navigation.navigate(path.Step3CreateWallet.name, {
              actionTitle: i18n.t('app.skip'),
              actionOnPress: () => skipDialog(),
            }),
        },
      ]
    )
  }

  const skipDialog = () => {
    Alert.alert(
      i18n.t('step3CreateWallet.dialog_1_title'),
      i18n.t('step3CreateWallet.dialog_1_body'),
      [
        {
          text: i18n.t('boolean.true'),
          onPress: () => props.navigation.navigate(path.Step4CreateWallet.name),
        },
        {
          text: i18n.t('boolean.false'),
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
              {i18n.t('step2CreateWallet.label_1')}
            </TextView>

            <TextView color={'primary'} fontSize={'lg'} fontFamily={'bold'}>
              {i18n.t('step2CreateWallet.oneOfThree')}
            </TextView>
          </LinearLayout>

          <TextView color={'text.0'} fontSize={'lg'}>
            {i18n.t('step2CreateWallet.body_1')}
          </TextView>
        </LinearLayout>

        <LinearLayout mb={5}>
          <ThemedCard
            rounded={false}
            contentStyle={{
              paddingTop: normalize(26),
              paddingBottom: normalize(26),
              paddingLeft: normalize(10),
              paddingRight: normalize(10),
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
            onPress={() => UtilsHelper.copyToClipboard(words.join(' '))}
            label={i18n.t('app.copy')}
            srcIcon={require('~/src/assets/images/icon-copy-green.png')}
            iconSize={[normalize(25), normalize(25)]}
            fontSize={18}
            flat={true}
          />

          <ThemedButton
            label={i18n.t('app.print')}
            srcIcon={require('~/src/assets/images/icon-print-green.png')}
            iconSize={[25, 25]}
            fontSize={18}
            flat={true}
          />
        </LinearLayout>

        <TextView mb={4} color={'text.0'} fontSize={'lg'}>
          {i18n.t('step2CreateWallet.body_2')}
        </TextView>

        <TextView mb={5} color={'text.0'} fontSize={'lg'}>
          {i18n.t('step2CreateWallet.body_3')}
        </TextView>
      </LinearLayout>

      <LinearLayout mt={5} mb={6} px={5} width={'100%'}>
        <ThemedButton
          onPress={() => infoDialog()}
          label={i18n.t('app.continue')}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}

Step2CreateWalletPage.propTypes = {
  navigation: PropTypes.any,
}

export default Step2CreateWalletPage

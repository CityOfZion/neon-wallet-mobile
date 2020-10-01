import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import * as Print from 'expo-print'
import PropTypes from 'prop-types'
import React, {useEffect, useState} from 'react'
import {Alert} from 'react-native'

import {Facade} from '~src/app/Facade'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCard from '~src/components/themed/ThemedCard'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'
import {TextView, LinearLayout} from '~src/styles/styled-components'

interface Props {
  route: RouteProp<SettingsStackParamList, 'Step1BackupWallet'>
  navigation: StackNavigationProp<SettingsStackParamList>
}

const WordComponent = (props: {value: string}) => {
  return (
    <TextView
      my={3}
      mx={4}
      color={'text.0'}
      fontSize={'2xl'}
      fontFamily={'regular'}
    >
      {props.value}
    </TextView>
  )
}

const Step1BackupWalletPage: React.FC<Props> = (props) => {
  const [words, setWords] = useState<string[]>([])

  const {wallet} = props.route.params
  const seeds = words.join(' ')

  useEffect(() => {
    Facade.await.run('populateStep1', populate)
  }, [wallet.id])

  const populate = async () => {
    const mnemonic = await wallet.getMnemonic()

    if (mnemonic) {
      setWords(mnemonic.split(' '))
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

  const infoDialog = () => {
    Alert.alert(
      Facade.t('step1BackupWallet.dialog_title'),
      Facade.t('step1BackupWallet.dialog_body'),
      [
        {
          text: Facade.t('step1BackupWallet.dialog_dismiss'),
          onPress: () =>
            props.navigation.navigate(Facade.route.Step2BackupWallet.name, {
              wallet,
            }),
        },
      ]
    )
  }

  return (
    <ScreenLayout alignX={'center'}>
      <AwaitActivity name={'populateStep1'} loadingView={<ScreenLoader />}>
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
                {Facade.t('step1BackupWallet.label_1')}
              </TextView>

              <TextView color={'text.0'} fontSize={'lg'} fontFamily={'bold'}>
                {Facade.t('step1BackupWallet.oneOfThree')}
              </TextView>
            </LinearLayout>

            <TextView fontFamily={'light'} color={'text.0'} fontSize={'lg'}>
              {Facade.t('step1BackupWallet.body_1')}
            </TextView>
          </LinearLayout>

          <LinearLayout mb={5}>
            <ThemedCard
              rounded={false}
              contentStyle={{
                paddingTop: Facade.scale(26),
                paddingBottom: Facade.scale(26),
                paddingLeft: Facade.scale(10),
                paddingRight: Facade.scale(10),
              }}
            >
              <LinearLayout
                orientation={'horiz'}
                flexWrap={'wrap'}
                alignItems={'center'}
                justifyContent={'center'}
                width={'100%'}
              >
                {words.map((it) => (
                  <WordComponent key={it} value={it} />
                ))}
              </LinearLayout>
            </ThemedCard>
          </LinearLayout>

          <LinearLayout
            mb={5}
            orientation={'horiz'}
            justifyContent={'flex-end'}
          >
            <ThemedButton
              onPress={() => Facade.utils.copyToClipboard(seeds ?? '')}
              label={Facade.t('app.copy')}
              srcIcon={require('~/src/assets/images/icon-copy-green.png')}
              iconSize={[Facade.scale(25), Facade.scale(25)]}
              fontSize={18}
              flat={true}
            />

            <ThemedButton
              onPress={() =>
                Print.printAsync({
                  html: `<html><body>${seeds}</body></html>`,
                })
              }
              label={Facade.t('app.print')}
              srcIcon={require('~/src/assets/images/icon-print-green.png')}
              iconSize={[25, 25]}
              fontSize={18}
              flat={true}
            />
          </LinearLayout>

          <TextView
            fontFamily={'light'}
            mb={4}
            color={'text.0'}
            fontSize={'lg'}
          >
            {Facade.t('step1BackupWallet.body_2')}
          </TextView>

          <TextView
            fontFamily={'light'}
            mb={5}
            color={'text.0'}
            fontSize={'lg'}
          >
            {Facade.t('step1BackupWallet.body_3')}
          </TextView>
        </LinearLayout>

        <LinearLayout mt={5} mb={6} px={5} width={'100%'}>
          <ThemedButton
            onPress={() => infoDialog()}
            label={Facade.t('app.continue')}
          />
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

Step1BackupWalletPage.propTypes = {
  navigation: PropTypes.any,
  route: PropTypes.any,
}

export default Step1BackupWalletPage

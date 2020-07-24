import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import PropTypes from 'prop-types'
import React from 'react'
import {Alert} from 'react-native'

import {Facade} from '~src/app/Facade'
import HeaderActionButton from '~src/components/layout/HeaderActionButton'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedCard from '~src/components/themed/ThemedCard'
import {SettingsStackParamList} from '~src/navigation/SettingsStackNavigation'
import {TextView, LinearLayout} from '~src/styles/styled-components'

interface Props {
  route: RouteProp<SettingsStackParamList, 'Step1BackupWallet'>
  navigation: StackNavigationProp<SettingsStackParamList>
}

const Step1BackupWalletPage: React.FC<Props> = (props) => {
  const {wallet} = props.route.params

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

  const _renderWord = (value: string) => {
    return (
      <TextView
        my={3}
        mx={4}
        color={'text.0'}
        fontSize={'2xl'}
        fontFamily={'semibold'}
        key={value}
      >
        {value}
      </TextView>
    )
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
              {Facade.t('step1BackupWallet.label_1')}
            </TextView>

            <TextView color={'primary'} fontSize={'lg'} fontFamily={'bold'}>
              {Facade.t('step1BackupWallet.oneOfThree')}
            </TextView>
          </LinearLayout>

          <TextView color={'text.0'} fontSize={'lg'}>
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
              {wallet.securityWords.map((it) => _renderWord(it))}
            </LinearLayout>
          </ThemedCard>
        </LinearLayout>

        <LinearLayout mb={5} orientation={'horiz'} justifyContent={'flex-end'}>
          <ThemedButton
            onPress={() =>
              Facade.utils.copyToClipboard(wallet.securityPhrase ?? '')
            }
            label={Facade.t('app.copy')}
            srcIcon={require('~/src/assets/images/icon-copy-green.png')}
            iconSize={[Facade.scale(25), Facade.scale(25)]}
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
          {Facade.t('step1BackupWallet.body_2')}
        </TextView>

        <TextView mb={5} color={'text.0'} fontSize={'lg'}>
          {Facade.t('step1BackupWallet.body_3')}
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

Step1BackupWalletPage.propTypes = {
  navigation: PropTypes.any,
  route: PropTypes.any,
}

export default Step1BackupWalletPage

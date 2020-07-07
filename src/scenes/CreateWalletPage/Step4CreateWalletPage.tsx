import {StackNavigationProp} from '@react-navigation/stack'
import PropTypes from 'prop-types'
import React, {useState} from 'react'

import {$} from '~/facade'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedInputText from '~src/components/themed/ThemedInputText'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {TextView, LinearLayout} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<MoreStackParamList>
}

const Step4CreateWalletPage: React.FC<Props> = (props) => {
  const [walletName, setWalletName] = useState<string>()
  const [passphrase, setPassphrase] = useState<string>()
  const [confirmPassphrase, setConfirmPassphrase] = useState<string>()

  const isValid = () => {
    const conditions = [
      Boolean(walletName),
      (passphrase?.length ?? 0) >= 6,
      passphrase === confirmPassphrase,
    ]

    return conditions.every((it) => it)
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
              {$.t('step4CreateWallet.label_1')}
            </TextView>

            <TextView color={'primary'} fontSize={'lg'} fontFamily={'bold'}>
              {$.t('step4CreateWallet.threeOfThree')}
            </TextView>
          </LinearLayout>

          <TextView mb={6} color={'text.0'} fontSize={'lg'}>
            {$.t('step4CreateWallet.body_1')}
          </TextView>

          <ThemedInputText
            mb={6}
            label={$.t('step4CreateWallet.label_walletName')}
            placeholder={$.t('step4CreateWallet.placeholder_walletName')}
            onChangeText={(value) => setWalletName(value)}
            value={walletName}
          />

          <ThemedInputText
            mb={6}
            autoCompleteType={'password'}
            secureTextEntry={true}
            label={$.t('step4CreateWallet.label_createPassphrase')}
            placeholder={$.t('step4CreateWallet.placeholder_createPassphrase')}
            onChangeText={(value) => setPassphrase(value)}
            value={passphrase}
          />

          <ThemedInputText
            autoCompleteType={'password'}
            secureTextEntry={true}
            label={$.t('step4CreateWallet.label_confirmPassphrase')}
            placeholder={$.t('step4CreateWallet.placeholder_confirmPassphrase')}
            onChangeText={(value) => setConfirmPassphrase(value)}
            value={confirmPassphrase}
          />
        </LinearLayout>
      </LinearLayout>

      <LinearLayout mt={5} mb={6} px={5} width={'100%'}>
        <ThemedButton
          onPress={() => {
            props.navigation.reset({
              index: 0,
              routes: [{name: $.path.Step5CreateWallet.name}],
            })
          }}
          label={$.t('app.continue')}
          disabled={!isValid()}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}

Step4CreateWalletPage.propTypes = {
  navigation: PropTypes.any,
}

export default Step4CreateWalletPage

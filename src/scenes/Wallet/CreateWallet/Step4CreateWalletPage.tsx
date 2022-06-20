import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { Alert } from 'react-native'
import { useDispatch } from 'react-redux'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {BlockchainServiceKey} from '~/src/blockchain'
import {AsyncDispatch, DispatchResult} from '~/src/types/reducers/root'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ThemedButton from '~src/components/themed/ThemedButton'
import ThemedInputText from '~src/components/themed/ThemedInputText'
import { MoreStackParamList } from '~src/navigation/MoreStackNavigation'
import { RootStore } from '~src/store/RootStore'
import { TextView, LinearLayout } from '~src/styles/styled-components'

export interface Step4CreateWalletParams {
  hasBackup?: boolean
  blockchain?: BlockchainServiceKey
}

interface Props {
  navigation: StackNavigationProp<MoreStackParamList>
  route: RouteProp<MoreStackParamList, 'Step4CreateWallet'>
}

const Step4CreateWalletPage: React.FC<Props> = props => {
  const [walletName, setWalletName] = useState<string>()

  const dispatch = useDispatch<DispatchResult>()

  const next = async () => {
    if (!walletName) {
      Alert.alert(i18n.t('step4CreateWallet.setName'))
      return
    }

    dispatch(RootStore.wallet.actions.setName(walletName))
    dispatch(RootStore.wallet.actions.setType('standard'))

    props.navigation.navigate(wrapper.route.BlockchainListPage.name)
  }

  return (
    <ScreenLayout alignX="center">
      <LinearLayout mt="15px" weight={1} mr="5px" ml="5px">
        <LinearLayout mb="15px" width="100%">
          <LinearLayout width="100%" orientation="horiz">
            <TextView weight={1} color="text.0" fontSize="lg" fontFamily="bold" mb={4}>
              {i18n.t('step4CreateWallet.label_1')}
            </TextView>

            <TextView color="text.0" fontSize="lg" fontFamily="bold">
              {i18n.t('step4CreateWallet.threeOfThree')}
            </TextView>
          </LinearLayout>

          <TextView mb="25px" color="text.0" fontSize="lg">
            {i18n.t('step4CreateWallet.body_1')}
          </TextView>

          <ThemedInputText
            label={i18n.t('step4CreateWallet.label_walletName')}
            placeholder={i18n.t('step4CreateWallet.placeholder_walletName')}
            onChangeText={(value: string) => setWalletName(value)}
            value={walletName}
            maxLength={32}
          />
        </LinearLayout>
      </LinearLayout>

      <LinearLayout mt={5} mb={7} px={5} width="100%">
        <AwaitActivity name="submit" size="large">
          <ThemedButton onPress={next} label={i18n.t('app.continue')} />
        </AwaitActivity>
      </LinearLayout>
    </ScreenLayout>
  )
}

Step4CreateWalletPage.propTypes = {
  navigation: PropTypes.any,
  route: PropTypes.any,
}

export default Step4CreateWalletPage

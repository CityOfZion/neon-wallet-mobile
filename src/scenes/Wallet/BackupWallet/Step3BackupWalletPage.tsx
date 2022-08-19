import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Button } from '~/src/components/Button'
import { Wallet } from '~/src/models/redux/Wallet'
import { SettingsStackParamList } from '~/src/navigation/SettingsStackNavigation'
import { walletReducerActions } from '~/src/store/wallet/WalletReducer'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import { TextView, LinearLayout, ImageView } from '~src/styles/styled-components'

export interface Step3BackupWalletPageParams {
  wallet: Wallet
}
interface Props {
  navigation: StackNavigationProp<SettingsStackParamList>
  route: RouteProp<SettingsStackParamList, 'Step3BackupWallet'>
}

const Step3BackupWalletPage: React.FC<Props> = props => {
  const { wallet } = props.route.params

  const dispatch = useDispatch()

  const handlePress = () => {
    props.navigation.goBack()
    props.navigation.goBack()
    props.navigation.goBack()
  }

  useEffect(() => {
    wallet.backupStatus = 'successful'

    dispatch(walletReducerActions.saveWallet(wallet))
  }, [wallet])

  return (
    <ScreenLayout alignX="center" alignY="center" darkerSolidColorBG>
      <LinearLayout px="34px" flex={1}>
        <LinearLayout alignItems="center" justifyContent="center" flex={1}>
          <ImageView source={require('~/src/assets/images/logo-3d.png')} />

          <TextView color="text.0" fontSize="2xl" fontFamily="medium" textAlign="center">
            {i18n.t('screens.step3BackupWallet.label_1')}
          </TextView>
        </LinearLayout>

        <Button
          variant="contained"
          label={i18n.t('app.continue')}
          py="12px"
          labelStyle={{ fontSize: '2xl' }}
          mb="36px"
          onPress={handlePress}
        />
      </LinearLayout>
    </ScreenLayout>
  )
}

export default Step3BackupWalletPage

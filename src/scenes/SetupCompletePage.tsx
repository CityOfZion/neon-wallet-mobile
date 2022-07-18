import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { Dimensions, Platform } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

import { wrapper } from '../app/ApplicationWrapper'
import { getBlockchainLogo } from '../blockchain'
import WalletCard from '../components/WalletCard'
import ThemedButton from '../components/themed/ThemedButton'
import { UtilsHelper } from '../helpers/UtilsHelper'
import { useExchange } from '../hooks/useExchange'
import { RootStackParamList } from '../navigation/AppNavigation'
import { RootState } from '../store/RootStore'
import { ImageView, LinearLayout, TextView } from '../styles/styled-components'

export interface SetupCompleteParamList {}

interface Props {
  navigation: StackNavigationProp<RootStackParamList>
  route: RouteProp<RootStackParamList, 'SetupCompletePage'>
}

const SetupCompletePage = (props: Props) => {
  const currency = useSelector((state: RootState) => state.settings.currency)
  const { exchange } = useExchange({ filter: { currencies: currency } })
  const wallets = useSelector((state: RootState) => state.app.wallets)
  const accountsPool = useSelector((state: RootState) => state.app.accounts)
  const wallet = wallets[0]

  const handleViewWallet = useCallback(() => {
    props.navigation.replace(wrapper.route.Tab.name, { screen: wrapper.route.ListWalletsPage.name })
  }, [])
  return (
    <LinearLayout bg="background.14">
      <SafeAreaView style={{ height: '100%' }}>
        <LinearLayout mt={Dimensions.get('window').height * (Platform.OS === 'ios' ? 0.1 : 0.15)}>
          <LinearLayout alignItems="center">
            <WalletCard sizeCard={Platform.OS === 'ios' ? 244 : 290} exchange={exchange} width={210} wallet={wallet} />
            <LinearLayout mt={Dimensions.get('window').height * 0.05}>
              <LinearLayout width="60%" justifyContent="center" alignItems="center">
                <TextView color="primary" fontSize="3xl">
                  Setup Complete!
                </TextView>
                <TextView color="text.0" textAlign="center" fontSize="lg">
                  Your new wallet and account are ready to go.
                </TextView>
              </LinearLayout>
            </LinearLayout>
            <LinearLayout mt={Dimensions.get('window').height * 0.04} borderRadius="7px" bg="#282F35" width="80%" p={4}>
              <TextView color="text.2" fontSize="md">
                Account Addresses
              </TextView>
              <LinearLayout>
                {accountsPool.map(acc => {
                  return (
                    <LinearLayout mt={5} orientation="horiz" justifyContent="space-between">
                      <LinearLayout orientation="horiz">
                        <ImageView
                          style={{
                            width: Dimensions.get('screen').width * 0.04,
                            height: Dimensions.get('screen').height * 0.02,
                          }}
                          source={getBlockchainLogo(acc.blockchain)}
                        />
                        <TextView ml={3} color="primary" fontSize="xs">
                          {acc.address}
                        </TextView>
                      </LinearLayout>
                      <LinearLayout alignSelf="stretch">
                        <TouchableOpacity onPress={() => UtilsHelper.copyToClipboard(acc.address ?? undefined)}>
                          <ImageView
                            style={{ width: 12, height: 14 }}
                            source={require('~src/assets/images/icon-copy-green.png')}
                          />
                        </TouchableOpacity>
                      </LinearLayout>
                    </LinearLayout>
                  )
                })}
              </LinearLayout>
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>
        <LinearLayout mt={Dimensions.get('window').height * 0.05} height="100%" alignItems="center">
          <ThemedButton
            onPress={handleViewWallet}
            width="85%"
            bgColor="#4CFFB3"
            textColor="#23272A"
            label="View Wallet"
          />
        </LinearLayout>
      </SafeAreaView>
    </LinearLayout>
  )
}

export default SetupCompletePage

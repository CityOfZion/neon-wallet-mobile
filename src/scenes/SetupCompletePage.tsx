import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useCallback } from 'react'
import { Dimensions, Platform } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

import { wrapper } from '../app/ApplicationWrapper'
import { getBlockchainLogo } from '../blockchain'
import { WalletCard } from '../components/WalletCard/WalletCard'
import ThemedButton from '../components/themed/ThemedButton'
import { UtilsHelper } from '../helpers/UtilsHelper'
import { RootStackParamList } from '../navigation/AppNavigation'
import { RootState } from '../store/RootStore'
import { ImageView, LinearLayout, TextView } from '../styles/styled-components'

export interface SetupCompleteParamList {}

interface Props {
  navigation: StackNavigationProp<RootStackParamList>
  route: RouteProp<RootStackParamList, 'SetupCompletePage'>
}

const SetupCompletePage = (props: Props) => {
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
            <WalletCard wallet={wallet} withBalanceBar={false} animationType="in" width={178} height={244} />
            <LinearLayout mt={Dimensions.get('window').height * 0.03}>
              <LinearLayout width="60%" justifyContent="center" alignItems="center">
                <TextView color="primary" fontSize="3xl">
                  {i18n.t('setupComplete.title')}
                </TextView>
                <TextView color="text.0" textAlign="center" fontSize="lg">
                  {i18n.t('setupComplete.subtitle')}
                </TextView>
              </LinearLayout>
            </LinearLayout>
            <LinearLayout mt={Dimensions.get('window').height * 0.04} borderRadius="7px" bg="#282F35" width="95%" p={4}>
              <TextView color="text.2" fontSize="sm">
                {i18n.t('setupComplete.titleAddressList')}
              </TextView>
              <LinearLayout>
                {accountsPool.map(acc => {
                  return (
                    <TouchableOpacity onPress={() => UtilsHelper.copyToClipboard(acc.address ?? undefined)}>
                      <LinearLayout mt="1%" orientation="horiz" justifyContent="space-between">
                        <LinearLayout orientation="horiz">
                          <ImageView
                            style={{
                              width: Dimensions.get('screen').width * 0.04,
                              height: Dimensions.get('screen').height * 0.02,
                            }}
                            source={getBlockchainLogo(acc.blockchain)}
                          />
                          <LinearLayout>
                            <TextView ml={3} color="primary" fontSize="md">
                              {acc.address}
                            </TextView>
                          </LinearLayout>
                        </LinearLayout>
                        <LinearLayout alignSelf="center">
                          <ImageView
                            style={{ width: 12, height: 14 }}
                            source={require('~src/assets/images/icon-copy-green.png')}
                          />
                        </LinearLayout>
                      </LinearLayout>
                    </TouchableOpacity>
                  )
                })}
              </LinearLayout>
            </LinearLayout>
          </LinearLayout>
        </LinearLayout>
        <LinearLayout mt={Dimensions.get('window').height * 0.15} height="100%" alignItems="center">
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

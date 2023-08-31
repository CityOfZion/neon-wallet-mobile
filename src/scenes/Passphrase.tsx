import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useState } from 'react'
import { View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import { selectAccounts } from '../store/account/SelectorAccount'
import { TBlockchainServiceKey } from '../types/blockchain'

import { wrapper } from '~src/app/ApplicationWrapper'
import InputWithValidation from '~src/components/InputWithValidation'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import { useBlockchainActions } from '~src/hooks/useBlockchainActions'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { MoreStackParamList } from '~src/navigation/MoreStackNavigation'
import { RootState } from '~src/store/RootStore'
import { LinearLayout, TextView } from '~src/styles/styled-components'
export interface PassphraseParams {
  encrypted: string
  blockchain: TBlockchainServiceKey
}

interface PassphraseProps {
  navigation: StackNavigationProp<MoreStackParamList & RootStackParamList>
  route: RouteProp<MoreStackParamList, 'Passphrase'>
}

const Passphrase = (props: PassphraseProps) => {
  const { blockchain, encrypted } = props.route.params

  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const accounts = useSelector(selectAccounts)
  const blockchainService = useSelector(
    (state: RootState) => state.blockchain.bsAggregator.blockchainServicesByName[blockchain]
  )

  const blockchainActions = useBlockchainActions()

  const [password, setPassword] = useState('')

  const persist = async () => {
    Await.init('importEncryptedKey')

    try {
      const { address, key } = await blockchainService.decrypt(encrypted, password)
      const addressAlreadyExist = accounts.some(acc => acc.address === address)

      if (addressAlreadyExist) {
        showMessage({
          message: i18n.t('blockchainServices.errorMessages.keyWrongOrAddressesImported'),
          type: 'danger',
          duration: 4000,
        })
        return
      }

      const wallet = await blockchainActions.createWallet(
        i18n.t('modals.blockchainList.encryptedWallet'),
        'legacy',
        undefined,
        true
      )
      await blockchainActions.importAccount({ address, blockchain, wallet, key, type: 'legacy' })

      props.navigation.replace(wrapper.route.Tab.name, {
        screen: wrapper.route.ListWallets.name,
        params: {
          screen: wrapper.route.ListWalletsPage.name,
          params: { wallet },
        },
      })
    } catch {
      showMessage({
        message: i18n.t('messages.problemToGenerateWallet'),
        type: 'danger',
      })
    } finally {
      setPassword('')
      Await.done('importEncryptedKey')
    }
  }

  return (
    <ScreenLayout>
      <AwaitActivity name="importEncryptedKey" loadingView={<ScreenLoader />}>
        <LinearLayout orientation="verti" width="100%">
          <TextView
            textAlign="center"
            fontSize={18}
            fontFamily="medium"
            color={theme.colors.text[0]}
            alignSelf="center"
            flexWrap="wrap"
            m={40}
          >
            {i18n.t('passphrase.enterPassphrase')}
          </TextView>

          <View style={{ minHeight: 100 }}>
            <InputWithValidation
              value={password}
              onChangeText={setPassword}
              validator={() => true}
              color={theme.colors.primary}
              invalidColor={theme.colors.primary}
              separatorColor={theme.colors.background[4]}
              invalidSeparatorColor={theme.colors.background[5]}
              placeholder={i18n.t('passphrase.inputPlaceholder')}
              secure
              hideScan
            />
          </View>

          <LinearLayout mt={80} width="90%" alignSelf="center">
            <ThemedButton disabled={password.length <= 0} label={i18n.t('routes.ImportKey')} onPress={persist} />
          </LinearLayout>
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default Passphrase

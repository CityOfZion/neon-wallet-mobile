import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useState, useCallback } from 'react'
import { View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import { BlockchainServiceKey } from '../blockchain'
import { useBlockchainServiceUtils } from '../hooks/useBlockchainServices'
import { selectAccounts } from '../store/account/SelectorAccount'

import { wrapper } from '~src/app/ApplicationWrapper'
import { AddressInfo } from '~src/components/AddressesImportList'
import InputWithValidation from '~src/components/InputWithValidation'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import { useBlockchainActions, AccountToImport } from '~src/hooks/useBlockchainActions'
import { RootStackParamList } from '~src/navigation/AppNavigation'
import { MoreStackParamList } from '~src/navigation/MoreStackNavigation'
import { RootState } from '~src/store/RootStore'
import { LinearLayout, TextView } from '~src/styles/styled-components'
export interface PassphraseParams {
  encryptedKey: string
  blockchain: BlockchainServiceKey
}

interface PassphraseProps {
  navigation: StackNavigationProp<MoreStackParamList & RootStackParamList>
  route: RouteProp<MoreStackParamList, 'Passphrase'>
}

type AddressInfoWithWif = AddressInfo & { wif: string }

const Passphrase = (props: PassphraseProps) => {
  const encryptedKey = props.route.params.encryptedKey
  const blockchain = props.route.params.blockchain
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])
  const accounts = useSelector(selectAccounts)
  const blockchainActions = useBlockchainActions()
  const { getBlockchainService } = useBlockchainServiceUtils()

  const [inputValue, setInputValue] = useState('')

  const validatePassword = useCallback(async () => {
    try {
      const service = getBlockchainService(blockchain)

      const isEncryptedKey = service.validatePrivateKeyWithPassword(encryptedKey)

      if (!isEncryptedKey) {
        showMessage({
          message: i18n.t('blockchainServices.errorMessages.keyWrongOrAddressesImported'),
          type: 'danger',
          duration: 4000,
        })
        return false
      }
      return true
    } catch {
      showMessage({
        message: i18n.t('blockchainServices.errorMessages.keyWrongOrAddressesImported'),
        type: 'danger',
        duration: 4000,
      })
    }
  }, [inputValue, getBlockchainService, blockchain])

  const persist = useCallback(async () => {
    Await.init('importEncryptedKey')
    const passwordIsValid = await validatePassword()
    if (!passwordIsValid) return
    try {
      const service = getBlockchainService(blockchain)
      const newAddressesInfo: AddressInfoWithWif[] = []
      const { address, wif } = await service.decryptKey(encryptedKey, inputValue)
      const addressExist = accounts.some(acc => acc.address === address)

      if (addressExist) {
        showMessage({
          message: i18n.t('blockchainServices.errorMessages.keyWrongOrAddressesImported'),
          type: 'danger',
          duration: 4000,
        })
        throw new Error('Address already exists')
      }

      newAddressesInfo.push({ address, blockchain, wif })

      if (newAddressesInfo.length < 1) throw new Error("Can't decrypt key")

      setInputValue('')

      const wallet = await blockchainActions.createWallet(
        i18n.t('modals.blockchainList.encryptedWallet'),
        'legacy',
        undefined,
        true
      )

      const accountsToImport = newAddressesInfo.map(
        ({ address, blockchain, wif }): AccountToImport => ({
          address,
          blockchain,
          wallet,
          wif,
          type: 'legacy',
        })
      )

      await blockchainActions.importAccounts(accountsToImport)

      props.navigation.replace(wrapper.route.Tab.name, {
        screen: wrapper.route.ListWallets.name,
        params: {
          screen: wrapper.route.ListWalletsPage.name,
          params: { wallet },
        },
      })
    } catch (e) {
      console.log(e)
      showMessage({
        message: i18n.t('messages.problemToGenerateWallet'),
        type: 'danger',
      })
    } finally {
      Await.done('importEncryptedKey')
    }
  }, [inputValue, encryptedKey])

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
              value={inputValue}
              onChangeText={setInputValue}
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
            <ThemedButton disabled={inputValue.length <= 0} label={i18n.t('routes.ImportKey')} onPress={persist} />
          </LinearLayout>
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default Passphrase

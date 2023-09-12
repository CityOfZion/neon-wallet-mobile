import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useCallback, useState } from 'react'
import { View } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { useDispatch } from 'react-redux'

import { useBlockchainActions } from '../hooks/useBlockchainActions'
import { TBlockchainServiceKey } from '../types/blockchain'
import { WalletType } from '../types/store'

import { walletReducerActions } from '~/src/store/wallet/WalletReducer'
import { wrapper } from '~src/app/ApplicationWrapper'
import BlockchainList from '~src/components/BlockchainList'
import ScreenLayout from '~src/components/layout/ScreenLayout'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import { MoreStackParamList } from '~src/navigation/MoreStackNavigation'
import { LinearLayout, TextView } from '~src/styles/styled-components'

export interface BlockchainListPageParams {
  config?: {
    creatingWallet?: {
      mnemonic: string
      walletName: string
      walletType: WalletType
      hasBackup?: boolean
    }
    importingNep2?: {
      encryptedKey: string
    }
    custom?: {
      btnLabel?: string
      btnOnPress?: (blockchain: TBlockchainServiceKey) => Promise<void>
      hideIsMulti?: boolean
    }
  }
}

interface Props {
  navigation: StackNavigationProp<MoreStackParamList>
  route: RouteProp<MoreStackParamList, 'BlockchainListPage'>
}

const BlockchainListPage = (props: Props) => {
  const dispatch = useDispatch()
  const blockchainActions = useBlockchainActions()
  const [blockchainsSelected, setBlockchainsSelected] = useState<TBlockchainServiceKey[]>([])

  const handlePress = async () => {
    if (props.route.params.config?.custom?.btnOnPress) {
      await props.route.params.config?.custom?.btnOnPress(blockchainsSelected[0])
    } else {
      await createWallet()
    }
  }

  const createWallet = useCallback(async () => {
    let id: string | undefined

    try {
      if (!props.route.params.config?.creatingWallet) {
        throw new Error('modals.blockchainList.errorCreateWallet')
      }
      const { mnemonic, walletName, walletType, hasBackup } = props.route.params.config.creatingWallet

      const wallet = await blockchainActions.createWallet(walletName, walletType, mnemonic, hasBackup)

      for (const blockchain of blockchainsSelected) {
        await blockchainActions.createAccount(wallet, walletName, blockchain, undefined)
      }

      props.navigation.reset({
        index: 0,
        routes: [
          {
            name: wrapper.route.Step5CreateWallet.name,
            params: { wallet },
          },
        ],
      })
    } catch {
      if (id) {
        dispatch(walletReducerActions.deleteWallet(id))
      }

      showMessage({
        message: i18n.t('modals.blockchainList.errorCreateWallet'),
        type: 'danger',
        duration: 5000,
      })
    }
  }, [blockchainsSelected])

  return (
    <ScreenLayout>
      <AwaitActivity name="createWallet" size="large" loadingView={<ScreenLoader />}>
        <LinearLayout mt="15px" weight={1}>
          <View style={{ alignContent: 'center' }}>
            <TextView textAlign="center" fontFamily="medium" fontSize={18} color="text.0">
              {i18n.t('modals.blockchainList.subtitle')}
            </TextView>
          </View>

          <BlockchainList isMulti={!props.route.params.config?.custom?.hideIsMulti} onSelect={setBlockchainsSelected} />
        </LinearLayout>

        <LinearLayout mt={5} mb={7} px={5} width="100%">
          <ThemedButton
            disabled={blockchainsSelected.length < 1}
            onPress={() => {
              Await.run('createWallet', handlePress, 1000)
            }}
            label={props.route.params.config?.custom?.btnLabel ?? i18n.t('app.createNow')}
          />
        </LinearLayout>
      </AwaitActivity>
    </ScreenLayout>
  )
}

export default BlockchainListPage

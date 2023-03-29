import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Await, AwaitActivity } from '@simpli/react-native-await'
import i18n from 'i18n-js'
import React, { useState, useCallback } from 'react'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import { selectAccounts } from '../store/account/SelectorAccount'

import { BlockchainServiceKey } from '~src/blockchain'
import BlockchainList from '~src/components/BlockchainList'
import SwiperPanel, { CloseButton, useSwiperController } from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import ThemedButton from '~src/components/themed/ThemedButton'
import { useBlockchainActions } from '~src/hooks/useBlockchainActions'
import { Wallet } from '~src/models/redux/Wallet'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { LinearLayout, TextView } from '~src/styles/styled-components'
export interface BlockchainListModalParams {
  wallet: Wallet
}

interface IBlockchainListModal {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'BlockchainListModal'>
}

const BlockchainListModal = (props: IBlockchainListModal) => {
  const { wallet } = props.route.params

  const controller = useSwiperController(true)
  const blockchainActions = useBlockchainActions()
  const accounts = useSelector(selectAccounts)

  const [blockchainSelected, setBlockchainSelected] = useState<BlockchainServiceKey>()

  const handleSelect = (blockchains: BlockchainServiceKey[]) => {
    setBlockchainSelected(blockchains[0])
  }

  const createAccount = useCallback(async () => {
    if (!blockchainSelected || !wallet.id) {
      showMessage({
        message: i18n.t('blockchainServices.errorMessages.blockchainNotFound'),
        type: 'danger',
      })
      return
    }

    const indexAccount = wallet
      .getAccounts(accounts)
      .filter(account => account.blockchain === blockchainSelected).length

    await blockchainActions.createAccount(
      wallet,
      `${i18n.t(`blockchainServices.${blockchainSelected}.label`)} ${i18n.t('modals.blockchainList.countAccount', {
        count: indexAccount + 1,
      })}`,
      blockchainSelected,
      indexAccount
    )

    controller.close()
  }, [accounts, wallet, blockchainSelected])

  return (
    <SwiperPanel
      controller={controller}
      rightButton={<CloseButton onPress={controller.close} />}
      title={i18n.t(`modals.blockchainList.title`)}
      onClose={props.navigation.goBack}
    >
      <AwaitActivity name="createAccount" loadingView={<ScreenLoader transparent />}>
        <LinearLayout height="100%" justifyContent="space-between">
          <LinearLayout>
            <LinearLayout width="100%">
              <TextView textAlign="center" fontFamily="medium" fontSize={18} color="text.0">
                {i18n.t(`modals.blockchainList.subtitle`)}
              </TextView>
            </LinearLayout>

            <BlockchainList onSelect={handleSelect} wallet={wallet} />
          </LinearLayout>

          <ThemedButton
            label={i18n.t('app.add')}
            disabled={!blockchainSelected}
            onPress={() => Await.run('createAccount', createAccount)}
          />
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}

export default BlockchainListModal

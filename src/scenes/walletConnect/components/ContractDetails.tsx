import { ContractResponse } from '@cityofzion/blockchain-service'
import { ContractInvocation, TSession } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import ContractDetailsBox from './ContractDetailsBox'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { WalletConnectHelper } from '~/src/helpers/WalletConnectHelper'
import { RootState } from '~/src/store/RootStore'
import { TBlockchainServiceKey } from '~/src/types/blockchain'

type ContractDetailsProps = {
  session: TSession
  contract: ContractInvocation
}

export const ContractDetails = ({ contract, session }: ContractDetailsProps) => {
  const navigation = useNavigation()
  const blockchain = useMemo<TBlockchainServiceKey>(
    () => WalletConnectHelper.getAccountInformationFromSession(session)[0].blockchain,
    [session]
  )
  const blockchainService = useSelector(
    (state: RootState) => state.blockchain.bsAggregator.blockchainServicesByName[blockchain]
  )
  const [contractInfo, setContractInfo] = useState<ContractResponse>()

  const handlePressRightButton = () => {
    if (!contractInfo) return

    navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.WCInvocationDetailsModal.name,
      params: {
        session,
        contract,
        contractInfo,
      },
    })
  }

  useEffect(() => {
    blockchainService.blockchainDataService.getContract(contract.scriptHash).then(setContractInfo)
  }, [blockchainService])

  return (
    <ContractDetailsBox
      session={session}
      contract={contract}
      title={contractInfo?.name ?? ''}
      withRightButton
      onPressRightButton={handlePressRightButton}
    />
  )
}

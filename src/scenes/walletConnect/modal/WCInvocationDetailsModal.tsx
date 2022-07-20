import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { SessionTypes } from '@walletconnect/types'
import i18n from 'i18n-js'
import React, { useCallback, useState, useEffect } from 'react'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import ConnectionHeader from '../components/ConnectionHeader'
import ContractDetailsBox from '../components/ContractDetailsBox'
import InvocationDetailsParametersBox from '../components/InvocationDetailsParametersBox'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { blockchainServices, getBlockchainByWCChain } from '~/src/blockchain'
import SwiperPanel, { CloseButton, useSwiperController } from '~/src/components/SwiperPanel'
import { useTreatNetworkOnWalletConnectFlow } from '~/src/hooks/useTreatNetworkOnWalletConnectFlow'
import { ContractResponse } from '~/src/models/response/ContractResponse'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { TextView, LinearLayout } from '~/src/styles/styled-components'
import { ContractInvocation } from '~src/helpers/NeonWcAdapter'

export interface WCInvocationDetailsModalParams {
  session: SessionTypes.Settled
  contract: ContractInvocation
}
interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'WCInvocationDetailsModal'>
}

export type ParamValue = string | number | any[] | null

export type Param = {
  value: ParamValue
  name: string | null
  type: string | null
}

const WCInvocationDetailsModal = ({ navigation, route }: Props) => {
  const { session, contract } = route.params
  useTreatNetworkOnWalletConnectFlow()
  const swipperController = useSwiperController(true)
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const [contractInfo, setContractInfo] = useState<ContractResponse>()
  const [paramsWithValue, setParamsWithValue] = useState<Param[]>()

  const infos = {
    dAppName: session.peer.metadata.name,
    dAppIcon: session.peer.metadata.icons[0],
  }

  const handleGetContractInfo = useCallback(async () => {
    if (!session) {
      return
    }

    const blockchain = getBlockchainByWCChain(session.permissions.blockchain.chains ?? [])

    if (!blockchain) {
      return
    }

    const contractInfo = await blockchainServices[blockchain].provider.getContract(contract.scriptHash)

    setContractInfo(contractInfo)
  }, [session])

  const sanitizeValue = (value: ParamValue) => {
    if (!value) {
      return null
    }

    if (Array.isArray(value) && value.length === 0) {
      return null
    }

    return value
  }

  const populateParamsWithValues = () => {
    const method = contractInfo?.methods.find(item => item.name === contract.operation)

    if (!method) {
      showMessage({
        message: i18n.t('modals.invocationDetails.methodDoesNotExist'),
        type: 'danger',
      })
      return
    }

    const paramsWithValue = method.parameters.map((parameter, index) => ({
      value: sanitizeValue(contract.args[index].value),
      type: parameter.type,
      name: parameter.name,
    }))

    setParamsWithValue(paramsWithValue)
  }

  useEffect(() => {
    handleGetContractInfo()
  }, [handleGetContractInfo])

  useEffect(() => {
    if (contractInfo) {
      populateParamsWithValues()
    }
  }, [contractInfo])

  return (
    <SwiperPanel
      controller={swipperController}
      title={i18n.t('modals.invocationDetails.title')}
      rightButton={<CloseButton mr="20px" />}
      onClose={navigation.goBack}
      onRightPress={swipperController.close}
      smallerSize
      padding={20}
      solidColorBG
    >
      <ConnectionHeader title={infos.dAppName} imageUri={infos.dAppIcon} />

      <LinearLayout>
        <TextView fontFamily="regular" fontSize="18px" fontWeight="500" mb="6px" color={theme.colors.text[10]}>
          {i18n.t('modals.invocationDetails.detailsTitle')}
        </TextView>
        <ContractDetailsBox session={route.params.session} contract={contract} />
        <TextView fontFamily="regular" fontSize="18px" fontWeight="500" color={theme.colors.text[10]} mb="6px">
          {i18n.t('modals.invocationDetails.parametersTitle')}
        </TextView>
        {paramsWithValue && paramsWithValue.length > 0 ? (
          paramsWithValue.map((param, index) => (
            <InvocationDetailsParametersBox
              key={param.name}
              count={index}
              data={{
                name: param.name,
                type: param.type,
                value: param.value,
              }}
            />
          ))
        ) : (
          <TextView
            fontFamily="regular"
            textAlign="center"
            mt={18}
            fontSize="18px"
            fontWeight="400"
            color={theme.colors.text[12]}
          >
            {i18n.t('modals.invocationDetails.noParameters')}
          </TextView>
        )}
      </LinearLayout>
    </SwiperPanel>
  )
}

export default WCInvocationDetailsModal

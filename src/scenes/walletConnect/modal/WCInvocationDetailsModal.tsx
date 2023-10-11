import { ContractResponse } from '@cityofzion/blockchain-service'
import { ContractInvocation } from '@cityofzion/neon-dappkit-types'
import { TSession } from '@cityofzion/wallet-connect-sdk-wallet-react'
import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useCallback, useMemo } from 'react'
import { showMessage } from 'react-native-flash-message'
import { useSelector } from 'react-redux'

import ConnectionHeader from '../components/ConnectionHeader'
import ContractDetailsBox from '../components/ContractDetailsBox'
import InvocationDetailsParametersBox from '../components/InvocationDetailsParametersBox'

import { wrapper } from '~/src/app/ApplicationWrapper'
import SwiperPanel, { CloseButton, useSwiperController } from '~/src/components/SwiperPanel'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { RootState } from '~/src/store/RootStore'
import { TextView } from '~/src/styles/styled-components'

export interface WCInvocationDetailsModalParams {
  session: TSession
  contract: ContractInvocation
  contractInfo: ContractResponse
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
  const { session, contract, contractInfo } = route.params
  const swipperController = useSwiperController(true)
  const theme = useSelector((state: RootState) => wrapper.theme[state.settings.theme])

  const sanitizeValue = useCallback((value?: ParamValue) => {
    if (!value) {
      return null
    }

    if (Array.isArray(value) && value.length === 0) {
      return null
    }

    return value
  }, [])

  const paramsWithValue = useMemo<Param[] | undefined>(() => {
    const method = contractInfo.methods.find(item => item.name === contract.operation)

    if (!method) {
      showMessage({
        message: i18n.t('modals.invocationDetails.methodDoesNotExist'),
        type: 'danger',
      })
      return
    }

    return method.parameters.map((parameter, index) => {
      return {
        value: sanitizeValue(contract.args ? contract.args[index].value : undefined),
        type: parameter.type,
        name: parameter.name,
      }
    })
  }, [contractInfo, sanitizeValue])

  const infos = {
    dAppName: session.peer.metadata.name,
    dAppIcon: session.peer.metadata.icons[0],
  }

  return (
    <SwiperPanel
      controller={swipperController}
      title={i18n.t('modals.invocationDetails.title')}
      rightButton={<CloseButton onPress={swipperController.close} />}
      onClose={navigation.goBack}
    >
      <ConnectionHeader title={infos.dAppName} imageUri={infos.dAppIcon} />

      <TextView fontFamily="regular" fontSize="18px" fontWeight="500" mb="6px" color={theme.colors.text[10]}>
        {i18n.t('modals.invocationDetails.detailsTitle')}
      </TextView>

      <ContractDetailsBox title={contractInfo.name ?? ''} session={route.params.session} contract={contract} />

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
    </SwiperPanel>
  )
}

export default WCInvocationDetailsModal

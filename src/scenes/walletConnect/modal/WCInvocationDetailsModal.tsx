import {ContractResponse} from '@cityofzion/dora-ts/dist/interfaces/api/neo_legacy'
import {RouteProp} from '@react-navigation/native'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity, Await} from '@simpli/react-native-await'
import {AppMetadata, SessionTypes} from '@walletconnect/types'
import i18n from 'i18n-js'
import React, {useCallback, useEffect, useState} from 'react'
import {showMessage} from 'react-native-flash-message'
import {useSelector} from 'react-redux'

import ContractDetailsBox from '../components/ContractDetailsBox'
import InvocationDetailsParametersBox from '../components/InvocationDetailsParametersBox'
import {WCRequestParams} from './TransactionRequestModal'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {blockchainServices, hasWCIntegration} from '~/src/blockchain'
import SwiperPanel, {
  CloseButton,
  useSwiperController,
} from '~/src/components/SwiperPanel'
import ScreenLoader from '~/src/components/loader/ScreenLoader'
import {ContractInvocation} from '~/src/helpers/WCN3Helper'
import {ModalStackParamList} from '~/src/navigation/ModalStackNavigation'
import {TextView, LinearLayout, ImageView} from '~/src/styles/styled-components'

export interface WCInvocationDetailsModalParams {
  request: SessionTypes.RequestEvent
  session: SessionTypes.Settled
  contract: ContractResponse
}
interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'WCInvocationDetailsModal'>
}

export type Param = {value: string | number | null; name: string; type: string}

type Contract = {
  name: string
  params: Param[]
}

const WCInvocationDetailsModal = ({navigation, route}: Props) => {
  const activityName = 'getContractParamsInvocationDetails'
  const contract = route.params.contract
  const requestParams = route.params.request.request
    .params[0] as WCRequestParams

  const infos = {
    dAppName: route.params.session.peer.metadata.name,
    contractHash: requestParams.scriptHash,
    contractMethod: requestParams.operation,
    dAppIcon: route.params.session.peer.metadata.icons[0],
    contractParams: requestParams.args,
  }

  const swipperController = useSwiperController(true)

  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  return (
    <SwiperPanel
      controller={swipperController}
      title={i18n.t('modals.invocationDetails.title')}
      rightButton={<CloseButton mr={'20px'} />}
      onClose={navigation.goBack}
      onRightPress={swipperController.close}
      smallerSize
      padding={20}
      solidColorBG
    >
      <AwaitActivity
        name={activityName}
        loadingView={
          <LinearLayout>
            <ScreenLoader solidColorBG />
          </LinearLayout>
        }
      >
        <>
          <LinearLayout alignItems="center">
            <LinearLayout
              backgroundColor={'#1c2228'}
              padding={20}
              borderRadius={4}
            >
              <ImageView
                resizeMode="contain"
                source={{uri: infos.dAppIcon}}
                height="40px"
                width="40px"
              />
            </LinearLayout>
            <TextView
              mt={'14px'}
              fontFamily={'regular'}
              fontSize={'18px'}
              fontWeight={'500'}
              color={theme.colors.text[0]}
              textAlign={'center'}
            >
              {infos.dAppName}
            </TextView>
          </LinearLayout>

          <LinearLayout mt="20px">
            <TextView
              fontFamily={'regular'}
              fontSize={'18px'}
              fontWeight={'500'}
              mb={'6px'}
              color={theme.colors.text[10]}
            >
              {i18n.t('modals.invocationDetails.detailsTitle')}
            </TextView>
            <ContractDetailsBox
              session={route.params.session}
              title={contract.name}
              hash={infos.contractHash}
              method={infos.contractMethod}
            />
            <TextView
              fontFamily={'regular'}
              fontSize={'18px'}
              fontWeight={'500'}
              color={theme.colors.text[10]}
              mb={'6px'}
            >
              {i18n.t('modals.invocationDetails.parametersTitle')}
            </TextView>
            {contract.parameters.length > 0 ? (
              contract.parameters.map((param, index) => (
                <InvocationDetailsParametersBox
                  key={param}
                  count={index}
                  data={{
                    name: contract.name,
                    type: contract.returntype[index],
                    value: param,
                  }}
                />
              ))
            ) : (
              <TextView
                fontFamily={'regular'}
                textAlign={'center'}
                mt={18}
                fontSize={'18px'}
                fontWeight={'400'}
                color={theme.colors.text[12]}
              >
                {i18n.t('modals.invocationDetails.noParameters')}
              </TextView>
            )}
          </LinearLayout>
        </>
      </AwaitActivity>
    </SwiperPanel>
  )
}

export default WCInvocationDetailsModal

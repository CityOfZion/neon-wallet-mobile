import {SessionTypes} from '@walletconnect/types'
import * as WebBrowser from 'expo-web-browser'
import i18n from 'i18n-js'
import React, {useState, useEffect, useCallback} from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import WalletConnectBox from './WalletConnectBox'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {blockchainServices, getBlockchainByWCChain} from '~/src/blockchain'
import {ContractInvocation} from '~/src/helpers/NeonWcAdapter'
import {RootStore} from '~/src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~/src/styles/styled-components'

type Props = {
  rightButton?: React.ReactNode
  session: SessionTypes.Settled
  contract: ContractInvocation
}

const ContractDetailsBox = ({rightButton, session, contract}: Props) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  const [title, setTitle] = useState<string>('')

  const handlePressDoraIcon = async () => {
    const [blockchain, network] = session.state.accounts[0].split(':')
    const result = await WebBrowser.openBrowserAsync(
      `https://dora.coz.io/contract/${blockchain}/${network}/${contract.scriptHash}`
    )

    return result
  }

  const handleGetContractInfo = useCallback(async () => {
    const blockchain = getBlockchainByWCChain(
      session.permissions.blockchain.chains ?? []
    )

    if (blockchain && session) {
      const contractInfo = await blockchainServices[
        blockchain
      ].provider.getContract(contract.scriptHash)
      setTitle(contractInfo.name ?? '')
    }
  }, [session])

  useEffect(() => {
    handleGetContractInfo()
  }, [handleGetContractInfo])

  return (
    <WalletConnectBox rightButton={rightButton} title={title}>
      <LinearLayout pt={'13px'} pb={'13px'}>
        <LinearLayout
          pb={'13px'}
          orientation={'horiz'}
          justifyContent={'space-between'}
        >
          <TextView
            color={theme.colors.text[10]}
            weight={2}
            fontFamily={'bold'}
            fontSize={14}
            pl={'18px'}
          >
            {i18n.t('components.contractDetailsBox.hash')}
          </TextView>
          <LinearLayout width={'65%'} orientation={'horiz'} pr={'30px'}>
            <TextView
              color={'primary'}
              ellipsizeMode={'middle'}
              numberOfLines={1}
              fontSize={16}
              pr={'13px'}
            >
              {contract.scriptHash}
            </TextView>
            <TouchableWithoutFeedback onPress={() => handlePressDoraIcon()}>
              <ImageView
                alignSelf={'center'}
                resizeMode={'contain'}
                width={14}
                height={13}
                source={require('~src/assets/images/dora-link.png')}
              />
            </TouchableWithoutFeedback>
          </LinearLayout>
        </LinearLayout>
        <LinearLayout
          height={'1px'}
          ml={'16px'}
          mr={'16px'}
          bg={theme.colors.background[10]}
        />
        <LinearLayout
          orientation={'horiz'}
          justifyContent={'space-between'}
          mt={'13px'}
        >
          <TextView
            color={theme.colors.text[10]}
            weight={2}
            fontFamily={'bold'}
            fontSize={14}
            pl={'18px'}
          >
            {i18n.t('components.contractDetailsBox.method')}
          </TextView>
          <TextView
            pr={'20px'}
            color={'white'}
            alignSelf={'flex-end'}
            fontSize={16}
          >
            {contract.operation}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    </WalletConnectBox>
  )
}

export default ContractDetailsBox

import {SessionTypes} from '@walletconnect/types'
import * as WebBrowser from 'expo-web-browser'
import i18n from 'i18n-js'
import React from 'react'
import {TouchableWithoutFeedback} from 'react-native'
import {useSelector} from 'react-redux'

import WalletConnectBox from './WalletConnectBox'

import {wrapper} from '~/src/app/ApplicationWrapper'
import {RootStore} from '~/src/store/RootStore'
import {ImageView, LinearLayout, TextView} from '~/src/styles/styled-components'

type Props = {
  rightButton?: React.ReactNode
  title: string
  hash: string
  method: string
  session: SessionTypes.Settled
}

const ContractDetailsBox = ({
  rightButton,
  title,
  hash,
  method,
  session,
}: Props) => {
  const theme = useSelector(
    (state: RootState) => wrapper.theme[state.settings.theme]
  )

  const handlePressHash = async () => {
    const [blockchain, network] = session.state.accounts[0].split(':')

    const result = await WebBrowser.openBrowserAsync(
      `https://dora.coz.io/contract/${blockchain}/${network}/${hash}`
    )

    return result
  }

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
          <TouchableWithoutFeedback onPress={() => handlePressHash()}>
            <LinearLayout width={'65%'} orientation={'horiz'} pr={'30px'}>
              <TextView
                color={'primary'}
                ellipsizeMode={'middle'}
                numberOfLines={1}
                fontSize={16}
                pr={'13px'}
              >
                {hash}
              </TextView>
              <ImageView
                alignSelf={'center'}
                resizeMode={'contain'}
                width={14}
                height={13}
                source={require('~src/assets/images/dora-link.png')}
              />
            </LinearLayout>
          </TouchableWithoutFeedback>
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
            {method}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    </WalletConnectBox>
  )
}

export default ContractDetailsBox

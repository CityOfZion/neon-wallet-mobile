import i18n from 'i18n-js'
import React from 'react'
import { useSelector } from 'react-redux'

import { blockchainConfig } from '../config/BlockchainConfig'
import { FilterHelper } from '../helpers/FilterHelper'
import { RootState } from '../store/RootStore'
import { Account } from '../store/account/Account'
import { LinearLayout, TextView } from '../styles/styled-components'
import { HeaderColumn } from './HeaderColumn'
import { TokenIcon } from './TokenIcon'

interface Props {
  tip: string
  account: Account
  ratio?: number
}

export const TransactionTipCard = ({ account, tip, ratio }: Props) => {
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)
  const selectedNetwork = useSelector(
    (state: RootState) => state.settings.selectedBlockchainNetworks[account.blockchain]
  )

  const tipFiat = ratio ? FilterHelper.currency(ratio * Number(tip), currency, language) : undefined
  const blockchainTip = blockchainConfig.mainnetTipByBlockchain[account.blockchain]

  if (selectedNetwork.type !== 'mainnet' || !blockchainTip) {
    return <></>
  }

  return (
    <LinearLayout
      orientation="verti"
      borderRadius="7px"
      bg="background.14"
      pt="12px"
      pb="12px"
      pl="16px"
      pr="16px"
      mt={4}
    >
      <TextView mb="5px" color="text.10">
        Tip
      </TextView>
      <LinearLayout orientation="horiz">
        <TokenIcon blockchain={account.blockchain} width={18} height={18} {...blockchainTip.token} />

        <TextView ml="4px" fontFamily="medium" color="text.0" fontSize="16px">
          {blockchainTip.token.symbol}
        </TextView>
      </LinearLayout>

      <LinearLayout orientation="horiz">
        <HeaderColumn weight={2} title={i18n.t('components.transactionTipCard.qty')} value={tip} />
        {tipFiat && <HeaderColumn weight={1.6} title={i18n.t('components.transactionTipCard.value')} value={tipFiat} />}
      </LinearLayout>
    </LinearLayout>
  )
}

import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { FilterHelper } from '../helpers/FilterHelper'
import { useBlockchainService } from '../hooks/useBlockchainServices'
import { Account } from '../models/redux/Account'
import { RootState } from '../store/RootStore'
import { LinearLayout, TextView } from '../styles/styled-components'
import { HeaderColumn } from './HeaderColumn'
import { TokenIcon } from './TokenIcon'

interface Props {
  tip: number
  account: Account
  ratio?: number
}

export const TransactionTipCard = ({ account, tip, ratio }: Props) => {
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)
  const { blockchainService } = useBlockchainService(account.blockchain)

  const tipFiat = useMemo(() => {
    if (!ratio) return

    const price = ratio * tip

    return FilterHelper.currency(price, currency, language)
  }, [ratio, currency, language, tip])

  return blockchainService.cozTip ? (
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
        <TokenIcon
          blockchain={account.blockchain}
          hash={blockchainService.cozTip.hash}
          symbol={blockchainService.cozTip.symbol}
          width={18}
          height={18}
          resizeMode="contain"
        />

        <TextView ml="4px" fontFamily="medium" color="text.0" fontSize="16px">
          {blockchainService.cozTip.symbol}
        </TextView>
      </LinearLayout>

      <LinearLayout orientation="horiz">
        <HeaderColumn
          weight={2}
          title={i18n.t('components.transactionTipCard.qty')}
          value={tip.toFixed(blockchainService.cozTip.decimals)}
        />
        {tipFiat && <HeaderColumn weight={1.6} title={i18n.t('components.transactionTipCard.value')} value={tipFiat} />}
      </LinearLayout>
    </LinearLayout>
  ) : (
    <></>
  )
}

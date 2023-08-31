import { Token } from '@cityofzion/blockchain-service'
import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../store/RootStore'
import { Account } from '../store/account/Account'
import { TokenIcon } from './TokenIcon'

import { HeaderColumn } from '~src/components/HeaderColumn'
import { FilterHelper } from '~src/helpers/FilterHelper'
import { LinearLayout, TextView } from '~src/styles/styled-components'

interface Props {
  account: Account
  token: Token
  amount: string
  fiat?: string
  fee: string
  hideSingleTokenPrice?: boolean
  hideFee?: boolean
  ratio?: number
}

export const TransactionTokenCard = ({
  amount,
  account,
  fee,
  fiat,
  token,
  hideFee,
  hideSingleTokenPrice,
  ratio,
}: Props) => {
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)

  const singlePrice = useMemo(() => {
    if (!ratio) return

    const price = 1 * ratio

    return FilterHelper.currency(price, currency, language)
  }, [ratio, currency, language])

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
      <LinearLayout orientation="horiz" justifyContent="space-between">
        <LinearLayout orientation="horiz" alignItems="center">
          <TokenIcon width={18} height={18} resizeMode="contain" blockchain={account.blockchain} {...token} />

          <TextView ml="4px" color="text.0" fontFamily="medium" fontSize="16px">
            {token.symbol}
          </TextView>
        </LinearLayout>

        {!hideSingleTokenPrice && singlePrice && (
          <LinearLayout justifyContent="center">
            <TextView fontFamily="medium" fontSize="16px" color="text.0" mr={2}>
              {singlePrice}
            </TextView>
            <TextView ml={2} fontFamily="medium" color="text.10" fontSize="12px">
              1 {token.symbol}
            </TextView>
          </LinearLayout>
        )}
      </LinearLayout>

      <LinearLayout orientation="horiz">
        <HeaderColumn weight={2} title={i18n.t('components.transactionTokenCard.qty')} value={amount} />

        {fiat && (
          <HeaderColumn
            weight={1.6}
            title={i18n.t('components.transactionTokenCard.value')}
            value={fiat}
            valueTextColor="primary"
          />
        )}
      </LinearLayout>

      {!hideFee && (
        <LinearLayout orientation="horiz">
          <HeaderColumn
            weight={2.75}
            title={i18n.t('components.transactionTokenCard.fee')}
            value={[
              {
                value: String(fee),
                color: 'primary',
              },
              {
                value: 'GAS',
                color: 'primary',
              },
            ]}
          />
        </LinearLayout>
      )}
    </LinearLayout>
  )
}

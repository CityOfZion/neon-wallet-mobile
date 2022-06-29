import i18n from 'i18n-js'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Normalize } from '../app/Normalize'
import { TokenAsset } from '../models/TokenAsset'
import { RootState } from '../store/RootStore'
import { Exchange } from '../types/exchange'

import { HeaderColumn } from '~src/components/HeaderColumn'
import { FilterHelper } from '~src/helpers/FilterHelper'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

interface Props {
  token: TokenAsset
  amount: string
  fiat?: string
  fee: number
  hideSingleTokenPrice?: boolean
  hideFee?: boolean
  exchange?: Exchange
}

export const TransactionTokenCard = ({ amount, fee, fiat, token, hideFee, hideSingleTokenPrice, exchange }: Props) => {
  const currency = useSelector((state: RootState) => state.settings.currency)
  const language = useSelector((state: RootState) => state.settings.language)

  const singlePrice = useMemo(() => {
    if (!exchange) {
      return
    }
    const ratio = exchange[token.symbol]?.to[currency]

    if (!ratio) {
      return
    }

    const price = 1 * ratio

    return FilterHelper.currency(price, currency, language)
  }, [exchange, currency, token])

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
          <ImageView
            source={token.srcIcon}
            width={Normalize.scale(18)}
            height={Normalize.scale(18)}
            resizeMode="contain"
            alignSelf="center"
          />
          <TextView ml="4px" color="text.0" fontFamily="medium" fontSize="16px">
            {token.symbol}
          </TextView>
        </LinearLayout>

        {!hideSingleTokenPrice && singlePrice && (
          <LinearLayout justifyContent="center">
            <TextView fontFamily="medium" fontSize="16px" color="text.0" mr={2}>
              {singlePrice} {/** TODO SkeletonContainer */}
            </TextView>
            <TextView ml={2} fontFamily="medium" color="text.10" fontSize="12px">
              1 {token.symbol}
            </TextView>
          </LinearLayout>
        )}
      </LinearLayout>

      <LinearLayout orientation="horiz">
        <HeaderColumn
          weight={2}
          title={i18n.t('components.transactionTokenCard.qty')}
          value={token.decimals ? Number(amount).toFixed(8) : amount}
        />

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

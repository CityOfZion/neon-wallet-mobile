import React, {useState} from 'react'
import {useSelector} from 'react-redux'

import {TokenAsset} from '../models/TokenAsset'

import {Facade} from '~src/app/Facade'
import {HeaderColumn} from '~src/components/HeaderColumn'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  transaction: SenderTransactionState
  hideSingleTokenPrice?: boolean
  widthIcon?: string
  heightIcon?: string
}

export const TokenView = (props: Props) => {
  const {currency, language} = useSelector((state: RootState) => state.settings)
  const {exchange, accounts} = useSelector((state: RootState) => state.app)

  const getRatio = () => {
    if (props.transaction.token?.symbol) {
      return exchange[props.transaction.token?.symbol]?.to[currency] ?? null
    }
    return null
  }
  const getBalanceToken = () => {
    const account = accounts.find(
      (acc) => acc.address === props.transaction.senderAddress
    )
    if (account && props.transaction.token?.symbol) {
      return account.getBalanceAmountByAsset(props.transaction.token.symbol)
    } else {
      return 0
    }
  }
  const [ratio, setRatio] = useState<number | null>(getRatio())
  return (
    <LinearLayout
      orientation={'verti'}
      borderRadius={'7px'}
      bg={'background.14'}
      pt={'12px'}
      pb={'12px'}
      pl={'16px'}
      pr={'16px'}
      mt={4}
    >
      <LinearLayout orientation={'horiz'} justifyContent="space-between">
        <LinearLayout orientation={'horiz'}>
          <ImageView
            source={props.transaction.token?.srcIcon}
            width={props.widthIcon ?? '14px'}
            height={props.heightIcon ?? '14px'}
            alignSelf={'center'}
          />
          <TextView
            fontSize="lg"
            ml={'8px'}
            color={'text.0'}
            fontFamily={'medium'}
          >
            {props.transaction.token?.symbol}
          </TextView>
        </LinearLayout>

        {!props.hideSingleTokenPrice && (
          <>
            <TextView fontFamily={'medium'} color={'text.0'}>
              {Facade.filter.currency(
                (props.transaction.token?.exchangeToken(currency) ?? 1) /
                  (props.transaction.token?.amount ?? 1),
                currency,
                language
              )}
            </TextView>
            <TextView
              ml={2}
              fontFamily={'medium'}
              color={'text.10'}
              fontSize={'12px'}
              textAlignVertical={'bottom'}
              includeFontPadding={false}
              mt={1}
            >
              1 {props.transaction.token?.symbol}
            </TextView>
          </>
        )}
        <TextView color={'text.10'}>{`${getBalanceToken()} ${
          props.transaction.token?.symbol
        } in wallet`}</TextView>
      </LinearLayout>
      <LinearLayout orientation={'horiz'}>
        <HeaderColumn
          weight={2}
          title={Facade.t('transactionDetails.qty')}
          value={props.transaction.token?.amount.toFixed(8) ?? ''}
        />
        <HeaderColumn
          weight={1.6}
          title={Facade.t('transactionDetails.value')}
          value={String(props.transaction.fiat) || ''}
          valueTextColor={'primary'}
        />
      </LinearLayout>
      <LinearLayout orientation={'horiz'}>
        <HeaderColumn
          weight={1.6}
          title={Facade.t('transactionDetails.priorityFee')}
          value={[
            {
              value: `${props.transaction.feeAmount?.name.toLocaleUpperCase()} `,
              color: 'primary',
            },
            {
              value: `${props.transaction.feeAmount?.fee} GAS`,
              color: 'text.0',
            },
          ]}
          valueTextColor={'primary'}
        />
        <HeaderColumn
          weight={1.25}
          title="Price"
          value={[
            {
              value: `$${ratio} `,
              color: 'text.0',
            },
            {
              value: `1 ${props.transaction.token?.symbol}`,
              color: 'text.10',
              size: 12,
              align: 'auto',
            },
          ]}
        />
      </LinearLayout>
    </LinearLayout>
  )
}

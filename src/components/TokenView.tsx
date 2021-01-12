import React from 'react'
import {useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import {HeaderColumn} from '~src/components/HeaderColumn'
import {SenderTransaction} from '~src/models/redux/SenderTransaction'
import {ImageView, LinearLayout, TextView} from '~src/styles/styled-components'

interface Props {
  transaction: SenderTransactionState
  hideSingleTokenPrice?: boolean
  widthIcon?: string
  heightIcon?: string
  hideTokenInWallet?: boolean
}

export const TokenView = (props: Props) => {
  const {currency, language} = useSelector((state: RootState) => state.settings)
  const {exchange} = useSelector((state: RootState) => state.app)

  const getValueToken = () => {
    if (props.transaction.token) {
      const ratio =
        exchange[props.transaction.token?.symbol]?.to[currency] ?? null
      if (ratio && props.transaction.fiat) {
        return (props.transaction.fiat / ratio).toFixed(2)
      } else {
        return ''
      }
    } else {
      return ''
    }
  }

  const renderTokenValues = () => {
    return props.transaction.tokens.length > 0 ? (
      props.transaction.tokens.map((token, index) => (
        <>
          <LinearLayout orientation={'horiz'} justifyContent={'space-between'}>
            <LinearLayout orientation={'horiz'}>
              <ImageView
                source={token?.srcIcon}
                width={props.widthIcon ?? '14px'}
                height={props.heightIcon ?? '14px'}
                alignSelf={'center'}
              />
              <TextView ml={'8px'} color={'text.0'} fontFamily={'medium'}>
                {token?.symbol}
              </TextView>
            </LinearLayout>
            {!props.hideTokenInWallet && (
              <TextView color="text.10">
                {`${token?.amount} ${token?.name} in Wallet`}
              </TextView>
            )}

            {!props.hideSingleTokenPrice && (
              <>
                <TextView fontFamily={'medium'} color={'text.0'}>
                  {Facade.filter.currency(
                    (token?.exchangeToken(currency) ?? 1) /
                      (token?.amount ?? 1),
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
                  1 {token?.symbol}
                </TextView>
              </>
            )}
          </LinearLayout>
          <LinearLayout orientation={'horiz'}>
            <HeaderColumn
              weight={2}
              title={Facade.t('transactionDetails.qty')}
              value={token?.amount.toFixed(8) ?? ''}
            />
            <HeaderColumn
              weight={1.6}
              title={Facade.t('transactionDetails.value')}
              value={Facade.filter.currency(
                props.transaction.fiat ??
                  (exchange[token.symbol].to[currency] * token.amount).toFixed(
                    8
                  ),
                currency,
                language
              )}
              valueTextColor={'primary'}
            />
          </LinearLayout>
          {index < props.transaction.tokens.length - 1 && (
            <LinearLayout
              opacity={0.5}
              borderColor={'text.2'}
              borderWidth={'0.5px'}
              borderStyle={'dashed'}
              height={'1px'}
              style={{marginVertical: 5}}
            />
          )}
        </>
      ))
    ) : (
      <>
        <LinearLayout orientation={'horiz'} justifyContent={'space-between'}>
          <LinearLayout orientation={'horiz'}>
            <ImageView
              source={props.transaction.token?.srcIcon}
              width={props.widthIcon ?? '14px'}
              height={props.heightIcon ?? '14px'}
              alignSelf={'center'}
            />
            <TextView ml={'8px'} color={'text.0'} fontFamily={'medium'}>
              {props.transaction.token?.symbol}
            </TextView>
          </LinearLayout>
          {!props.hideTokenInWallet && (
            <TextView color="text.10">
              {`${props.transaction.token?.amount} ${props.transaction.token?.name} in Wallet`}
            </TextView>
          )}

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
            value={Facade.filter.currency(
              props.transaction.fiat ??
                (
                  exchange[props.transaction.tokens[0].symbol].to[currency] *
                  props.transaction.tokens[0].amount
                ).toFixed(8),
              currency,
              language
            )}
            valueTextColor={'primary'}
          />
        </LinearLayout>
      </>
    )
  }

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
      {renderTokenValues()}
      <LinearLayout orientation={'horiz'}>
        <HeaderColumn
          weight={2.75}
          title={Facade.t('transactionDetails.priorityFee')}
          value={[
            {
              value: props.transaction.feeAmount?.name.toUpperCase(),
              color: 'primary',
            },
            {
              value: props.transaction.feeAmount?.fee.toString(),
              color: 'text.10',
            },
            {
              value: 'GAS',
              color: 'text.10',
            },
          ]}
        />
        <HeaderColumn
          weight={2.2}
          title={Facade.t('transactionDetails.amount')}
          value={[
            {
              value: `${getValueToken()}`,
            },
            {
              value: `1${props.transaction.token?.symbol}`,
              color: 'text.0',
              size: 12,
            },
          ]}
        />
      </LinearLayout>
    </LinearLayout>
  )
}

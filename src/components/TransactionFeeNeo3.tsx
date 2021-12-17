import React, {useEffect, useCallback, useState} from 'react'
import {View} from 'react-native'
import {useSelector} from 'react-redux'

import {Normalize} from '~src/app/Normalize'
import {
  BlockchainServiceKey,
  blockchainServices,
  SenderTransactionInfo,
} from '~src/blockchain'
import {TokenAsset} from '~src/models/TokenAsset'
import {Account} from '~src/models/redux/Account'
import {ImageView, TextView, ButtonView} from '~src/styles/styled-components'
interface Props {
  receiverAddress: string
  account: Account
  amount: number
  token: TokenAsset | null | undefined
  blockchain: BlockchainServiceKey
  onInsuficientFunds?: (isInsuficient: boolean) => void
  onChangeAmountFee?: (feeAmount: number) => void
}

type ITransaction = Omit<SenderTransactionInfo, 'feeAmount'>

export const TransactionFeeNeo3 = (props: Props) => {
  const {currency} = useSelector((state: RootState) => state.settings)
  const {exchange} = useSelector((state: RootState) => state.app)
  const [feeAmount, setFeeAmount] = useState<number>(0)
  const [fiatAmount, setFiatAmount] = useState<number>(0)
  const [transaction, setTransaction] = useState<ITransaction>()
  const [isInsuficientFunds, setIsInsuficientFounds] = useState<boolean>(false)
  const calcFiatFee = async () => {
    if (props.token && props.amount > 0) {
      const ratio =
        exchange[props.blockchain][props.token.symbol]?.to[currency] ?? null
      const fiatResult = ratio * feeAmount
      setFiatAmount(fiatResult)
    }
  }

  const handleCalcFee = async () => {
    if (transaction) {
      const result = await blockchainServices[props.blockchain].calculateFee(
        transaction
      )
      setFeeAmount(result)
    } else {
      setFeeAmount(0)
      setFiatAmount(0)
    }
  }

  const handleInsuficientFunds = async () => {
    if (props.token && props.amount > 0) {
      const feeToken = props.account.tokenAssets.find(
        (token) =>
          token.symbol === blockchainServices[props.blockchain].feeToken.token
      )
      if (!feeToken) return

      const amountFeeToken =
        feeToken.symbol === props.token.symbol
          ? feeToken.amount - props.amount - feeAmount
          : feeToken.amount - feeAmount

      if (amountFeeToken <= 0) {
        setIsInsuficientFounds(true)
      } else {
        setIsInsuficientFounds(false)
      }
    } else {
      setIsInsuficientFounds(false)
    }
  }

  useEffect(() => {
    const {account, amount, receiverAddress, token} = props
    if (token && amount > 0) {
      const transactionToken = new TokenAsset(
        token.name,
        token.symbol,
        token.hash,
        token.blockchain
      )
      transactionToken.amount = amount
      setTransaction({
        receiverAddress,
        token: transactionToken,
        senderAddress: account.address,
      })
    } else {
      setTransaction(undefined)
    }
  }, [props.amount, props.receiverAddress, props.token])

  useEffect(() => {
    handleCalcFee()
    handleInsuficientFunds()
  }, [transaction])

  useEffect(() => {
    calcFiatFee()
    if (props.onChangeAmountFee) {
      props.onChangeAmountFee(feeAmount)
    }
  }, [feeAmount])

  useEffect(() => {
    if (props.onInsuficientFunds) {
      props.onInsuficientFunds(isInsuficientFunds)
    }
  }, [isInsuficientFunds])

  return (
    <View style={{marginBottom: 20}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 20,
        }}
      >
        <TextView
          fontWeight={700}
          color="#fff"
          fontFamily={'bold'}
          fontSize={'14px'}
        >
          TOTAL GAS FEE
        </TextView>
        {isInsuficientFunds && (
          <View style={{flexDirection: 'row'}}>
            <ImageView
              width={'14px'}
              height={'14px'}
              source={require('~/src/assets/images/icon-alert-purple.png')}
              mr={2}
            />
            <TextView fontFamily={'bold'} fontSize={'13px'} color="#d355e7">
              INSUFICIENT GAS FOR TRANSACTION
            </TextView>
          </View>
        )}
      </View>
      <View
        style={{
          borderRadius: 4,
          flexDirection: 'row',
          backgroundColor: '#273037',
          justifyContent: 'space-around',
          paddingVertical: 8,
        }}
      >
        <View
          style={{
            width: '48%',
            height: '100%',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{flexDirection: 'row', paddingHorizontal: 7}}>
            <ImageView
              mr={4}
              mt={1}
              width={Normalize.scale(19)}
              height={Normalize.scale(21)}
              resizeMode={'contain'}
              source={blockchainServices[props.blockchain].feeToken.img}
            />
            <TextView color={'#fff'} fontFamily={'semibold'} fontSize={'18px'}>
              {feeAmount.toFixed(8)}
            </TextView>
          </View>
        </View>
        <View style={{backgroundColor: '#ffffff99', height: 50, width: 1}} />
        <View
          style={{
            width: '48%',
            height: '100%',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{flexDirection: 'row', paddingHorizontal: 7}}>
            <TextView color={'#4cffb3'} fontFamily={'bold'} fontSize={'18px'}>
              {currency}
            </TextView>
            <TextView
              color={'#fff'}
              fontFamily={'semibold'}
              fontSize={'18px'}
              pl={3}
            >
              {fiatAmount.toFixed(2)}
            </TextView>
          </View>
        </View>
      </View>
    </View>
  )
}

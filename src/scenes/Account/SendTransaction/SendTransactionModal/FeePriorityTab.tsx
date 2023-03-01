import i18n from 'i18n-js'
import React, { useEffect, useState } from 'react'

import { BlockchainServiceKey } from '~/src/blockchain'
import { useBlockchainService } from '~/src/hooks/useBlockchainServices'
import { Account } from '~/src/models/redux/Account'
import { ButtonView, ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'
import { ButtonViewProps } from '~/src/types/styled-components'

type ButtonProps = {
  name: string
  fee: number
  isSelected: boolean
  blockchain: BlockchainServiceKey
  onPress(): void
} & ButtonViewProps

type Props = {
  onFeeChange(fee: number): void
  account: Account
}

type PriorityName = 'none' | 'fast' | 'faster' | 'fastest'

const feeByPriority: Record<PriorityName, number> = {
  fast: 0.001,
  faster: 0.05,
  fastest: 0.1,
  none: 0,
}

const Button = ({ fee, name, isSelected, onPress, blockchain, ...props }: ButtonProps) => {
  const { blockchainService } = useBlockchainService(blockchain)
  return (
    <ButtonView
      weight={1}
      bg={isSelected ? 'background.0' : 'background.1'}
      p="16px"
      justifyContent="center"
      onPress={onPress}
      {...props}
    >
      <LinearLayout orientation="horiz" alignItems="center">
        <ImageView
          source={
            isSelected
              ? require('~src/assets/images/icon-flash-primary.png')
              : require('~src/assets/images/icon-flash-grey.png')
          }
        />
        <LinearLayout ml="8px">
          <TextView color={isSelected ? 'primary' : 'text.3'} fontSize="16px" fontFamily="semibold">
            {name}
          </TextView>
          <TextView color={isSelected ? 'primary' : 'text.3'} fontSize="12px">
            {fee}
            {blockchainService.feeToken.token}
          </TextView>
        </LinearLayout>
      </LinearLayout>
    </ButtonView>
  )
}

export const FeePriorityTab = ({ onFeeChange, account }: Props) => {
  const [selectedPriority, setSelectedPriority] = useState<PriorityName>('fast')

  const handleOnPress = (priority: PriorityName) => {
    setSelectedPriority(priority === selectedPriority ? 'none' : priority)
  }

  useEffect(() => {
    onFeeChange(feeByPriority[selectedPriority])
  }, [selectedPriority])

  return (
    <LinearLayout>
      <TextView mt={30} mb={20} fontFamily="semibold" color="text.0" alignSelf="center" fontSize="14px">
        {i18n.t('modals.sendTransactionModal.prioritiseTransfer').toUpperCase()}
      </TextView>

      <LinearLayout orientation="horiz" bg="background.1" borderRadius={8} height="75px">
        <Button
          name={i18n.t('priorityFee.priorityFast')}
          fee={feeByPriority.fast}
          isSelected={selectedPriority === 'fast'}
          onPress={() => handleOnPress('fast')}
          blockchain={account.blockchain}
          borderBottomLeftRadius={8}
          borderTopLeftRadius={8}
        />

        <Button
          name={i18n.t('priorityFee.priorityFaster')}
          fee={feeByPriority.faster}
          isSelected={selectedPriority === 'faster'}
          onPress={() => handleOnPress('faster')}
          blockchain={account.blockchain}
          borderStyle="solid"
          borderLeftWidth={1}
          borderRightWidth={1}
          borderColor="black"
        />

        <Button
          name={i18n.t('priorityFee.priorityFastest')}
          fee={feeByPriority.fastest}
          isSelected={selectedPriority === 'fastest'}
          onPress={() => handleOnPress('fastest')}
          blockchain={account.blockchain}
          borderBottomRightRadius={8}
          borderTopRightRadius={8}
        />
      </LinearLayout>
    </LinearLayout>
  )
}

import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import React, { useEffect } from 'react'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { blockchainServices } from '~/src/blockchain'
import { Account } from '~/src/models/redux/Account'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { ModalStackParamList } from '~/src/navigation/ModalStackNavigation'
import { LinearLayout } from '~/src/styles/styled-components'
import ThemedCheckBox from '~src/components/themed/ThemedCheckbox'

type Props = {
  tip?: number
  fee?: number
  amount?: number
  disabled: boolean
  checked: boolean
  onTipChange: (tip?: number) => void
  onDisableChange: (value: boolean) => void
  onCheckChange: (value: boolean) => void
  token?: TokenAsset
  account: Account
}

const PERCENTAGE = 1

export const TipCheckbox = ({
  tip,
  amount,
  fee,
  disabled,
  checked,
  onCheckChange,
  onDisableChange,
  onTipChange,
  token,
  account,
}: Props) => {
  const cozTip = blockchainServices[account.blockchain].cozTip

  const navigation = useNavigation<StackNavigationProp<RootStackParamList & ModalStackParamList>>()

  const handleOnPress = () => {
    if (checked) {
      navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.TipConfirmationModal.name,
        params: {
          onConfirmation: onCheckChange,
        },
      })
      return
    }

    onCheckChange(true)
  }

  useEffect(() => {
    if (!amount) {
      onTipChange()
      return
    }

    const newTip = (amount / 100) * PERCENTAGE

    if (onTipChange) {
      onTipChange(newTip)
    }
  }, [amount])

  useEffect(() => {
    if (!token || !cozTip || !amount || fee === undefined || !tip) {
      onDisableChange(true)
      return
    }

    const accountBalance = account.getBalanceAmountByAsset(cozTip.token)

    if (!accountBalance) {
      onDisableChange(true)
      return
    }

    if (accountBalance && token.symbol === cozTip.token) {
      if (accountBalance >= tip + amount + fee) {
        onDisableChange(false)
        return
      }

      onDisableChange(true)
      return
    }

    if (accountBalance - fee >= tip) {
      onDisableChange(false)
      return
    }

    onDisableChange(true)
  }, [token, account, tip, amount, fee])

  return (
    <LinearLayout mt={30}>
      <ThemedCheckBox
        label={i18n.t('modals.sendTransactionModal.tipCheckboxLabel', {
          tipValue: tip ? tip.toFixed(8) : '0',
        })}
        checked={disabled ? false : checked}
        onPress={handleOnPress}
        disabled={disabled}
      />
    </LinearLayout>
  )
}

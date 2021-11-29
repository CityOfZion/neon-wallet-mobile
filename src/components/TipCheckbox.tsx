import {StackNavigationProp} from '@react-navigation/stack/lib/typescript/src/types'
import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

import {wrapper} from '../app/ApplicationWrapper'
import {BlockchainServiceKey} from '../blockchain'
import {WalletStackParamList} from '../navigation/WalletsStackNavigation'

import ThemedCheckBox from '~src/components/themed/ThemedCheckbox'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {SendModalStackParamList} from '~src/navigation/SendModalStackNavigation'

interface ITipCheckbox {
  tokenTipAmount: number
  label: string
  tokenTip: string
  fiat: number
  dispatchTip: React.Dispatch<
    React.SetStateAction<{amount: number; address: string} | undefined>
  >
  percentage?: number
  address: string
  mainAsset?: string
  feeAmount?: number
  navigation: StackNavigationProp<
    ModalStackParamList & SendModalStackParamList & WalletStackParamList
  >
  blockchain: BlockchainServiceKey
}

export const TipCheckbox: React.FC<ITipCheckbox> = ({
  tokenTipAmount,
  blockchain,
  tokenTip,
  fiat,
  label,
  percentage,
  address,
  mainAsset,
  feeAmount,
  dispatchTip,
  navigation,
}) => {
  const [visible, setVisible] = useState(false)
  const [tip, setTip] = useState<{amount: number; address: string} | undefined>(
    undefined
  )
  const [checked, setChecked] = useState<boolean>(true)

  const {exchange} = useSelector((state: RootState) => state.app)
  const {currency} = useSelector((state: RootState) => state.settings)
  const isVisible = () => {
    const tipValue = (fiat / 100) * (percentage ?? 1) //by pattern, the value is 1%
    const gasValue =
      exchange[blockchain][tokenTip].to[currency] *
      (tokenTipAmount ? tokenTipAmount : 0)
    const feeValue =
      exchange[blockchain][tokenTip].to[currency] * (feeAmount ? feeAmount : 0)
    if (
      (gasValue >= tipValue && fiat > 0 && mainAsset !== tokenTip) ||
      (mainAsset === tokenTip && gasValue >= fiat + tipValue + feeValue)
    ) {
      setVisible(true)
    } else {
      setVisible(false)
      setTip(undefined)
    }
  }
  const calcTip = (checked: boolean) => {
    if (!checked) {
      uncheckTip()
    } else {
      checkTip()
    }
  }

  const uncheckTip = () => {
    setTip(undefined)
  }

  const checkTip = () => {
    const tipValue =
      ((fiat / 100) * (percentage ?? 1)) /
      exchange[blockchain][tokenTip].to[currency]
    if (tip === undefined) {
      setTip({address, amount: tipValue})
    } else if (tip) {
      tip.amount !== tipValue && setTip({address, amount: tipValue})
    }
  }

  const openTipModal = () => {
    if (checked) {
      navigation.navigate(wrapper.route.Modal.name, {
        screen: wrapper.route.TipConfirmationModal.name,
        params: {
          callback: (value: boolean) => {
            setChecked(value)
          },
        },
      })
    } else {
      setChecked(true)
    }
  }
  useEffect(() => {
    isVisible()
  }, [fiat])
  useEffect(() => {
    dispatchTip(tip)
  }, [tip])
  useEffect(() => {
    if (visible) {
      calcTip(checked)
    }
  }, [checked, visible])
  return visible ? (
    <ThemedCheckBox
      label={label}
      checked={checked}
      onClick={() => {
        openTipModal()
      }}
      labelStyle={{
        color: 'primary',
        size: 14,
        numberOfLines: 3,
        marginVertical: 8,
        marginHorizontal: 4,
      }}
    />
  ) : (
    <></>
  )
}
TipCheckbox.propTypes = {
  fiat: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  percentage: PropTypes.number,
  address: PropTypes.string.isRequired,
  mainAsset: PropTypes.string,
  feeAmount: PropTypes.number,
  dispatchTip: PropTypes.func.isRequired,
  navigation: PropTypes.any.isRequired,
  tokenTipAmount: PropTypes.any.isRequired,
  blockchain: PropTypes.any.isRequired,
  tokenTip: PropTypes.any.isRequired,
}

import i18n from 'i18n-js'
import PropTypes from 'prop-types'
import React, { useState, useEffect, useCallback } from 'react'
import { GestureResponderEvent, ImageLoadEventData, Dimensions } from 'react-native'
import { useSelector } from 'react-redux'

import ThemedButton from './ThemedButton'

import { FilterHelper } from '~/src/helpers/FilterHelper'

interface Props {
  onPress: (evt: GestureResponderEvent) => void
  isClaimAvailable: boolean
  unclaimedGasAmount: number
  fee: number | null
  isDark?: boolean
}

const ThemedClaimButton: React.FC<Props> = props => {
  const { language } = useSelector((state: RootState) => state.settings)
  const [infoClaim, setInfoClaim] = useState<{
    textColor: string
    text: string
    opacity: number
    icon?: ImageLoadEventData
  }>()

  const handleInfoClaim = useCallback(() => {
    if (props.unclaimedGasAmount <= 0 || props.fee === null) {
      setInfoClaim({
        text: i18n.t('screens.getAccount.gasUnavailable'),
        textColor: 'text.2',
        opacity: 0.6,
      })
    } else if (props.fee < props.unclaimedGasAmount) {
      setInfoClaim({
        text: i18n.t('screens.getAccount.claimAsset', {
          amount: FilterHelper.decimal(props.unclaimedGasAmount, language, 8),
        }),
        textColor: 'primary',
        opacity: 1,
      })
    } else {
      setInfoClaim({
        text: i18n.t('screens.getAccount.claimAsset', {
          amount: FilterHelper.decimal(props.unclaimedGasAmount, language, 8),
        }),
        textColor: '#d355e7',
        opacity: 1,
        icon: require('~src/assets/images/icon-warning-purple.png'),
      })
    }
  }, [props.unclaimedGasAmount, props.fee, props.isClaimAvailable])

  useEffect(() => {
    handleInfoClaim()
  }, [props.isClaimAvailable])
  return (
    <ThemedButton
      height={45}
      onPress={props.onPress}
      srcIcon={infoClaim?.icon}
      label={infoClaim?.text}
      width={Dimensions.get('window').width * 0.6}
      fontSize="15px"
      labelPx={0}
      adjustsFontSizeToFit={false}
      iconSize={[15, 15]}
      textColor={infoClaim?.icon ? (props.isClaimAvailable ? infoClaim.textColor : undefined) : '#ffffff99'}
      iconAlignX="flex-end"
      labelWidth="100%"
      disabled={!props.isClaimAvailable}
    />
  )
}

ThemedClaimButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  isClaimAvailable: PropTypes.bool.isRequired,
  unclaimedGasAmount: PropTypes.number.isRequired,
  fee: PropTypes.number.isRequired,
  isDark: PropTypes.bool,
}

export { ThemedClaimButton }

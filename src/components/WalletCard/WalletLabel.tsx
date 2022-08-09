import i18n from 'i18n-js'
import React from 'react'
import { ImageSourcePropType } from 'react-native'

import { TANimationType } from './WalletCard'

import { Wallet } from '~/src/models/redux/Wallet'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'
import { WalletType } from '~/src/types/reducers/wallet'

type Props = {
  wallet: Wallet
  isInactive?: boolean
  animationType?: TANimationType
  width: number
  height: number
}

const walletIconSources: Record<WalletType, ImageSourcePropType> = {
  legacy: require('~src/assets/images/wallet-icon-legacy.png'),
  standard: require('~src/assets/images/wallet-icon-standard.png'),
  watch: require('~src/assets/images/wallet-icon-watch.png'),
}

export const WalletLabel = ({ wallet, isInactive, width, height }: Props) => {
  const viewWidth = width * 0.85
  const viewHeight = height * 0.15

  return (
    <LinearLayout position="absolute" bottom={height * 0.18} width={viewWidth} height={viewHeight}>
      <LinearLayout width="100%" height="100%" justifyContent="center">
        <ImageView
          position="absolute"
          left={0}
          bottom="50%"
          resizeMode="contain"
          source={require('~src/assets/images/wallet-card-label.png')}
          style={{
            height: '100%',
            width: '100%',
            transform: [{ translateY: viewHeight / 2 }],
          }}
        />
        {wallet.walletType && (
          <LinearLayout orientation="horiz" alignItems="center" px={width * 0.08}>
            <ImageView
              source={walletIconSources[wallet.walletType]}
              resizeMode="contain"
              style={{
                height: viewHeight * 0.5,
                width: viewWidth * 0.15,
              }}
            />

            <LinearLayout>
              <TextView
                fontFamily="bold"
                fontSize={width * 0.05}
                color={isInactive ? 'text.2' : 'text.0'}
                lineHeight={width * 0.06}
                numberOfLines={1}
                ml="6px"
              >
                {wallet.name?.toUpperCase()}
              </TextView>
              <TextView
                fontFamily="bold"
                fontSize={width * 0.04}
                lineHeight={width * 0.05}
                color={isInactive ? 'text.2' : 'text.10'}
                numberOfLines={1}
                ml="6px"
              >
                {i18n.t(`components.walletCard.walletLabel.${wallet.walletType}`).toUpperCase()}
              </TextView>
            </LinearLayout>
          </LinearLayout>
        )}
      </LinearLayout>
    </LinearLayout>
  )
}

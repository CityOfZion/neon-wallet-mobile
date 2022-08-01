import i18n from 'i18n-js'
import React from 'react'
import { ImageSourcePropType } from 'react-native'

import { Wallet } from '~/src/models/redux/Wallet'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'
import { WalletType } from '~/src/types/reducers/wallet'

type Props = {
  wallet: Wallet
  isInactive?: boolean
}

const walletIconSources: Record<WalletType, ImageSourcePropType> = {
  legacy: require('~src/assets/images/wallet-icon-legacy.png'),
  standard: require('~src/assets/images/wallet-icon-standard.png'),
  watch: require('~src/assets/images/wallet-icon-watch.png'),
}

export const WalletLabel = ({ wallet, isInactive }: Props) => {
  return (
    <LinearLayout position="absolute" bottom="20%" width="100%">
      <LinearLayout width="100%" height="58px" justifyContent="center">
        <ImageView
          position="absolute"
          left={0}
          bottom="50%"
          resizeMode="contain"
          source={require('~src/assets/images/wallet-card-label.png')}
          style={{
            height: '100%',
            width: '85%',
            transform: [{ translateY: 29 }],
          }}
        />
        {wallet.walletType && (
          <LinearLayout orientation="horiz" alignItems="center" py="12px" pl="20px" pr="38px">
            <ImageView
              source={walletIconSources[wallet.walletType]}
              resizeMode="contain"
              style={{
                height: 34,
                width: 34,
              }}
            />

            <LinearLayout>
              <TextView
                fontFamily="bold"
                fontSize="md"
                color={isInactive ? 'text.2' : 'text.0'}
                numberOfLines={1}
                ml="6px"
              >
                {wallet.name?.toUpperCase()}
              </TextView>
              <TextView
                fontFamily="bold"
                fontSize="xs"
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

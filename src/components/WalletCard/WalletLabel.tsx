import React from 'react'

import { Wallet } from '~/src/models/redux/Wallet'
import { ImageView, LinearLayout, TextView } from '~/src/styles/styled-components'

type Props = {
  wallet: Wallet
  isInactive?: boolean
}

const StandardLabel = ({ isInactive, wallet }: Props) => {
  return (
    <LinearLayout>
      <ImageView
        position="absolute"
        left={0}
        bottom="50%"
        resizeMode="contain"
        source={require('~src/assets/images/wallet-card-label.png')}
        style={{
          height: 50,
          width: '100%',
          transform: [{ translateY: 25 }],
        }}
      />
      <LinearLayout orientation="horiz" alignItems="center" px="12px">
        {isInactive ? (
          <ImageView
            width={24}
            height={24}
            resizeMode="contain"
            source={require('~src/assets/images/wallet-icon-inactive.png')}
          />
        ) : (
          <ImageView
            width={24}
            height={24}
            resizeMode="contain"
            source={require('~src/assets/images/wallet-icon.png')}
          />
        )}

        <TextView fontFamily="bold" color={isInactive ? 'text.2' : 'text.0'} numberOfLines={1} ml="8px">
          {wallet.name?.toUpperCase()}
        </TextView>
      </LinearLayout>
    </LinearLayout>
  )
}

const WatchLabel = () => {
  return (
    <LinearLayout>
      <ImageView
        position="absolute"
        left={0}
        bottom="50%"
        source={require('~src/assets/images/wallet-icon-label.png')}
        resizeMode="contain"
        style={{
          height: 50,
          width: '100%',
          transform: [{ translateY: 25 }],
        }}
      />
      <LinearLayout px="12px">
        <ImageView
          resizeMode="contain"
          source={require('~src/assets/images/icon-watch-green.png')}
          style={{
            width: 24,
            height: 24,
          }}
        />
      </LinearLayout>
    </LinearLayout>
  )
}

const LegacyLabel = () => {
  return (
    <LinearLayout>
      <ImageView
        position="absolute"
        left={0}
        bottom="50%"
        source={require('~src/assets/images/wallet-icon-label.png')}
        resizeMode="contain"
        style={{
          height: 50,
          width: '100%',
          transform: [{ translateY: 25 }],
        }}
      />
      <LinearLayout px="12px">
        <ImageView
          resizeMode="contain"
          source={require('~src/assets/images/icon-legacy-grey.png')}
          style={{
            width: 24,
            height: 24,
          }}
        />
      </LinearLayout>
    </LinearLayout>
  )
}

export const WalletLabel = ({ wallet, isInactive }: Props) => {
  return (
    <LinearLayout position="absolute" bottom="20%">
      {wallet.walletType === 'standard' ? (
        <StandardLabel isInactive={isInactive} wallet={wallet} />
      ) : wallet.walletType === 'watch' ? (
        <WatchLabel />
      ) : (
        <LegacyLabel />
      )}
    </LinearLayout>
  )
}

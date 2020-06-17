import styled, {ImageView, LinearLayout, RelativeLayout, TextView} from '~src/styles/styled-components'
import React from 'react'
import {Wallet} from '~src/models/Wallet'

interface WalletCardProps {
  wallet: Wallet
}

const WalletCard = (props: WalletCardProps) => {
  const _renderAccountCard = (i: number) => {
    if (!props.wallet.currentAssets.assets[i] || i > 2) return null
    const bottomOffset = 28 - (6 * i)

    return (
      <AccountCard
        bottom={`${bottomOffset}px`}
        right={'6px'}
        height={'90%'}
        width={'90%'}
        bg={props.wallet.currentAssets.assets[i].color}
        key={i}
      />
    )
  }

  const _renderAssetsBarFills = () => {
    return props.wallet.currentAssets.assets.map((asset, i) => {
      const percentageOfTotal = ((asset.value * asset.holding) / props.wallet.currentValue) * 100

      return (
        <LinearLayout
          height={'100%'}
          width={`${percentageOfTotal}%`}
          minWidth={'1px'}
          mx={'1px'}
          borderRadius={1}
          bg={asset.color}
          key={i}
        />
      )
    })
  }

  return (
    <WalletCardRelativeContainer height={350} m='12px' bg={'#364046'}>
      { props.wallet.currentAssets.assets.map((a, i) => _renderAccountCard(i)) }
      <WalletFrontImage source={require('~src/assets/images/wallet-card-front.png')} />
      <RelativeLayout
        bottom={130}
        height={58}
        width={4/5}
      >
        <WalletNameContainer
          source={require('~src/assets/images/wallet-card-label.png')}
        />
        <LinearLayout bottom={30} orientation='horiz' my={'auto'}>
          <ImageView
            ml='12px'
            width={28}
            height={24}
            source={require('~src/assets/images/wallet-icon.png')}
          />
          <TextView ml='8px' fontSize='16px' fontFamily='bold' color='text.0'>
            {props.wallet.title.toUpperCase()}
          </TextView>
        </LinearLayout>
      </RelativeLayout>
      <RelativeLayout bottom={110} height={12} width={4/5}>
        <WalletAssetsBar
          source={require('~src/assets/images/wallet-card-label.png')}
        />
        <AssetsBar
          bottom={'4%'}
          width={'97%'}
          height={'40%'}
          px={'2px'}
          orientation={'horiz'}
        >
          { _renderAssetsBarFills() }
        </AssetsBar>
      </RelativeLayout>
    </WalletCardRelativeContainer>
  )
}

const WalletFrontImage = styled(ImageView)`
  height: 100%;
  width: 100%;
  resize-mode: stretch;
`

const WalletNameContainer = styled(ImageView)`
  height: 100%;
  width: 100%;
  resize-mode: contain;
`

const WalletAssetsBar = styled(ImageView)`
  height: 80%;
  width: 100%;
  resize-mode: cover;
  border-top-right-radius: 9999px;
  border-bottom-right-radius: 9999px;
`

const WalletCardRelativeContainer = styled(RelativeLayout)`
  border-radius: 18px;
  shadow-color: #fff;
  shadow-offset: { width: 0, height: 6 };
  shadow-opacity: 0.39;
  shadow-radius: 8.3px;
  elevation: 13;
`

const AccountCard = styled(LinearLayout)`
  position: absolute;
  border-radius: 18px;
`

const AssetsBar = styled(LinearLayout)`
  overflow: hidden;
`

export default WalletCard

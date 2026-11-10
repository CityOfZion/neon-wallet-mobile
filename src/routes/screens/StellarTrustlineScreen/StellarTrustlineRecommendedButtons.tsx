import { useMemo } from 'react'

import type { TBSToken } from '@cityofzion/blockchain-service'
import type { TBSStellarName, TTrustlineServiceStellarGetTrustlinesResponse } from '@cityofzion/bs-stellar'
import { View } from 'react-native'

import { TwButton } from '@/components/TwButton'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { ConstantsHelper } from '@/helpers/ConstantsHelper'

import { useSelectedNetworkByBlockchainSelector } from '@/hooks/useSettingsSelector'

import TbShieldCheck from '@/assets/images/tb-shield-check.svg'

import type { TAccount } from '@/types/store'

type TProps = {
  stellarAccount: TAccount<TBSStellarName>
  trustlines?: TTrustlineServiceStellarGetTrustlinesResponse[]
  onAddToken: (token: TBSToken) => void
}

export const StellarTrustlineRecommendedButtons = ({ stellarAccount, trustlines, onAddToken }: TProps) => {
  const {
    selectedNetworkByBlockchain: { stellar: stellarNetwork },
  } = useSelectedNetworkByBlockchainSelector()

  const missingTokens = useMemo(() => {
    const recommendedTokens = ConstantsHelper.stellarRecommendedTrustlineTokensByNetworkType[stellarNetwork.type]
    if (!recommendedTokens || !trustlines) return []

    const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName.stellar

    return recommendedTokens.filter(
      recommendedToken =>
        !trustlines.some(trustline => service.tokenService.predicateByHash(trustline.token, recommendedToken))
    )
  }, [stellarNetwork.type, trustlines])

  if (missingTokens.length === 0) return null

  const isWatchAccount = stellarAccount.type === 'watch'

  return (
    <View className="mt-4 w-full flex-row gap-x-2">
      {missingTokens.map(token => (
        <TwButton
          key={`recommended-trustline-${token.hash}`}
          label={token.symbol}
          variant="outline"
          className="flex-1"
          disabled={isWatchAccount}
          leftElement={<TbShieldCheck aria-hidden />}
          onPress={() => onAddToken(token)}
        />
      ))}
    </View>
  )
}

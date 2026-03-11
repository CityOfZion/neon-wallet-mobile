import { useAppSelector } from './useRedux'

import type { TBlockchainServiceKey } from '@/types/blockchain'

export const useSelectedNetworkByBlockchainSelector = () => {
  const { ref, value } = useAppSelector(state => state.settings.data.selectedNetworkByBlockchain)
  return {
    selectedNetworkByBlockchain: value,
    selectedNetworkByBlockchainRef: ref,
  }
}

export const useSelectedNetworkSelector = <T extends TBlockchainServiceKey>(blockchain: T) => {
  const { ref, value } = useAppSelector(state => state.settings.data.selectedNetworkByBlockchain[blockchain])

  return {
    selectedNetwork: value,
    selectedNetworkRef: ref,
  }
}

export const useIsFirstTimeSelector = () => {
  const { ref, value } = useAppSelector(state => state.settings.data.isFirstTime)
  return {
    isFirstTime: value,
    isFirstTimeRef: ref,
  }
}

export const useIsOnboardingCompletedSelector = () => {
  const { ref, value } = useAppSelector(state => state.settings.data.isOnboardingCompleted)
  return {
    isOnboardingCompleted: value,
    isOnboardingCompletedRef: ref,
  }
}

export const useCustomNetworksSelector = (blockchain: TBlockchainServiceKey) => {
  const { ref, value } = useAppSelector(state => state.settings.data.customNetworksByBlockchain[blockchain])
  return {
    customNetworks: value,
    customNetworksRef: ref,
  }
}

export const useCurrencySelector = () => {
  const { ref, value } = useAppSelector(state => state.settings.data.currency)
  return {
    currency: value,
    currencyRef: ref,
  }
}

export const useLanguageSelector = () => {
  const { ref, value } = useAppSelector(state => state.settings.data.language)
  return {
    language: value,
    languageRef: ref,
  }
}

export const useSecuritySelector = () => {
  const { ref, value } = useAppSelector(state => state.settings.data.security)
  return {
    security: value,
    securityRef: ref,
  }
}

export const useCanShowVoteNeo3SupportUsModalSelector = () => {
  const { value: canShowVoteNeo3SupportUsModal, ref: canShowVoteNeo3SupportUsModalRef } = useAppSelector(
    ({ settings }) => settings.data.canShowVoteNeo3SupportUsModal
  )

  return { canShowVoteNeo3SupportUsModal, canShowVoteNeo3SupportUsModalRef }
}

export const useSurveyInfoSelector = () => {
  const { ref, value } = useAppSelector(({ settings }) => settings.data.surveyInfo)

  return { surveyInfo: value, surveyInfoRef: ref }
}

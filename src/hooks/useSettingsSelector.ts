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
  const { value, ref } = useAppSelector(state => state.settings.data.isFirstTime)

  return {
    isFirstTime: value,
    isFirstTimeRef: ref,
  }
}

export const useIsOnboardingCompletedSelector = () => {
  const { value, ref } = useAppSelector(state => state.settings.data.isOnboardingCompleted)

  return {
    isOnboardingCompleted: value,
    isOnboardingCompletedRef: ref,
  }
}

export const useCustomNetworksSelector = (blockchain: TBlockchainServiceKey) => {
  const { value, ref } = useAppSelector(state => state.settings.data.customNetworksByBlockchain[blockchain])

  return {
    customNetworks: value,
    customNetworksRef: ref,
  }
}

export const useCurrencySelector = () => {
  const { value, ref } = useAppSelector(state => state.settings.data.currency)

  return {
    currency: value,
    currencyRef: ref,
  }
}

export const useLanguageSelector = () => {
  const { value, ref } = useAppSelector(state => state.settings.data.language)

  return {
    language: value,
    languageRef: ref,
  }
}

export const useSecuritySelector = () => {
  const { value, ref } = useAppSelector(state => state.settings.data.security)

  return {
    security: value,
    securityRef: ref,
  }
}

export const useCanShowNeo3VoteSupportUsModalSelector = () => {
  const { value: canShowNeo3VoteSupportUsModal, ref: canShowNeo3VoteSupportUsModalRef } = useAppSelector(
    ({ settings }) => settings.data.canShowNeo3VoteSupportUsModal
  )

  return { canShowNeo3VoteSupportUsModal, canShowNeo3VoteSupportUsModalRef }
}

export const useSurveyInfoSelector = () => {
  const { value, ref } = useAppSelector(({ settings }) => settings.data.surveyInfo)

  return { surveyInfo: value, surveyInfoRef: ref }
}

export const useShouldConfirmActionSelector = () => {
  const { value: shouldConfirmAction, ref: shouldConfirmActionRef } = useAppSelector(
    ({ settings }) => settings.data.shouldConfirmAction
  )

  return { shouldConfirmAction, shouldConfirmActionRef }
}

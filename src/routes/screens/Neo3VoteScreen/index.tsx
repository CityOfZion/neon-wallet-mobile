import React, { useMemo, useRef } from 'react'

import type { TBSNeo3Name } from '@cityofzion/bs-neo3'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { match, P } from 'ts-pattern'

import { TwAlertErrorBanner } from '@/components/TwAlertErrorBanner'
import { TwIconButton } from '@/components/TwIconButton'
import { TwInput } from '@/components/TwInput'
import { TwSeparator } from '@/components/TwSeparator'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'

import { useAccountsByBlockchainsSelector } from '@/hooks/useAccountSelector'
import { useActions } from '@/hooks/useActions'
import { useBalance } from '@/hooks/useBalances'
import { useMount } from '@/hooks/useMount'
import {
  useNeo3VoteCalculateVoteFee,
  useNeo3VoteGetCandidatesToVote,
  useNeo3VoteGetVoteDetailsByAddress,
  useNeo3VoteValidations,
} from '@/hooks/useNeo3Vote'
import {
  useCanShowNeo3VoteSupportUsModalSelector,
  useSelectedNetworkByBlockchainSelector,
} from '@/hooks/useSettingsSelector'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import MdInfoOutline from '@/assets/images/md-info-outline.svg'
import TbSearch from '@/assets/images/tb-search.svg'

import { Neo3VoteAccount } from './Neo3VoteAccount'
import { Neo3VoteAvailableVotes } from './Neo3VoteAvailableVotes'
import { Neo3VoteList } from './Neo3VoteList'

import type { TWalletsStackScreenProps } from '@/types/stacks'
import type { TAccount } from '@/types/store'

type TActionsData = {
  neo3Account?: TAccount<TBSNeo3Name>
  search: string
}

export const Neo3VoteScreen = ({ navigation, route }: TWalletsStackScreenProps<'Neo3VoteScreen'>) => {
  const { defaultNeo3Account } = route.params

  const { t } = useTranslation('screens', { keyPrefix: 'neo3Vote' })
  const { selectedNetworkByBlockchain } = useSelectedNetworkByBlockchainSelector()
  const { accountsByBlockchains } = useAccountsByBlockchainsSelector(['neo3'])
  const { canShowNeo3VoteSupportUsModalRef } = useCanShowNeo3VoteSupportUsModalSelector()
  const canScrollToCandidateRef = useRef(true)
  const shouldOpenNeo3VoteSupportUsModalRef = useRef(true)

  const {
    actionData: { neo3Account, search },
    setData,
    setDataWrapper,
  } = useActions<TActionsData>({ neo3Account: defaultNeo3Account, search: '' })

  // We are using VOTE_NEO3_COZ_PUB_KEY only to calculate the fee
  const calculateVoteFeeQuery = useNeo3VoteCalculateVoteFee({
    neo3Account,
    candidatePubKey: ConstantsHelper.neo3VoteCozPubKey,
  })

  const candidatesToVoteQuery = useNeo3VoteGetCandidatesToVote()
  const voteDetailsByAddressQuery = useNeo3VoteGetVoteDetailsByAddress(neo3Account?.address)
  const balanceQuery = useBalance(neo3Account)
  const { hasEnoughGasToPayFee } = useNeo3VoteValidations({ balanceQuery, gasFee: calculateVoteFeeQuery.data })

  const cozCandidate = useMemo(
    () => candidatesToVoteQuery.data?.find(candidate => candidate.pubKey === ConstantsHelper.neo3VoteCozPubKey),
    [candidatesToVoteQuery.data]
  )

  const neo3Accounts = useMemo(
    () => accountsByBlockchains.filter(({ type }) => type !== 'watch'),
    [accountsByBlockchains]
  )

  const isLoading =
    calculateVoteFeeQuery.isLoading ||
    candidatesToVoteQuery.isLoading ||
    voteDetailsByAddressQuery.isLoading ||
    balanceQuery.isLoading

  const isMainnet = selectedNetworkByBlockchain.neo3.type === 'mainnet'
  const hasNeo3Accounts = neo3Accounts.length > 0
  const isSearchDisabled = candidatesToVoteQuery.isLoading || !hasNeo3Accounts || !isMainnet
  const isWatchAccount = neo3Account?.type === 'watch'
  const neoAmount = voteDetailsByAddressQuery.data?.neoBalance || 0
  const hasNeoAmount = !!neo3Account && neoAmount > 0
  const canVote = !isLoading && isMainnet && !isWatchAccount && hasNeoAmount && !!hasEnoughGasToPayFee

  const voteErrorMessage = match({
    hasNeo3Accounts,
    neo3Account,
    hasNeoAmount,
    isMainnet,
    isWatchAccount,
    hasEnoughGasToPayFee,
  })
    .with({ hasNeo3Accounts: false }, () => t('voteErrorMessages.noNeo3AccountsLabel'))
    .with({ neo3Account: P.when(value => !value) }, () => t('voteErrorMessages.selectNeo3AccountLabel'))
    .with({ isMainnet: false }, () => t('voteErrorMessages.shouldUseMainnetLabel'))
    .with({ hasNeoAmount: false }, () => t('voteErrorMessages.thereIsNoNeoLabel'))
    .with({ isWatchAccount: true }, () => t('voteErrorMessages.accountCanNotBeWatchLabel'))
    .with({ hasEnoughGasToPayFee: false }, () => t('voteErrorMessages.shouldHaveEnoughGasToPayFeeLabel'))
    .otherwise(() => undefined)

  const handleGoToNeo3VoteHowItWorksModal = () => {
    navigation.navigate('Neo3VoteHowItWorksModal')
  }

  const handleSelectNeo3Account = (neo3Account: TAccount<TBSNeo3Name>) => {
    shouldOpenNeo3VoteSupportUsModalRef.current = false
    canScrollToCandidateRef.current = true

    setData({ neo3Account })
  }

  useMount(() => {
    if (
      !cozCandidate ||
      !shouldOpenNeo3VoteSupportUsModalRef.current ||
      !canShowNeo3VoteSupportUsModalRef.current ||
      voteDetailsByAddressQuery.isLoading ||
      ConstantsHelper.neo3VoteCozPubKey === voteDetailsByAddressQuery.data?.candidatePubKey ||
      !defaultNeo3Account
    )
      return

    shouldOpenNeo3VoteSupportUsModalRef.current = false

    navigation.navigate('Neo3VoteSupportUsModal', { neo3Account: defaultNeo3Account, cozCandidate })
  }, [voteDetailsByAddressQuery.isLoading, voteDetailsByAddressQuery.data, cozCandidate, defaultNeo3Account])

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header className="mt-2 h-[36px]">
        <ScreenLayout.BackButton />
        <View className="-mt-2 flex max-w-[50%] flex-1 flex-row items-center justify-center">
          <Text className="line-clamp-1 font-sans-medium text-xl text-white">{t('title')}</Text>
          <TwIconButton
            aria-label={t('howItWorksButtonLabel')}
            size="md"
            className="mt-3"
            icon={<MdInfoOutline className="text-neon" aria-hidden />}
            onPress={handleGoToNeo3VoteHowItWorksModal}
          />
        </View>
      </ScreenLayout.Header>
      <ScreenLayout.ViewContent className="w-full gap-y-6">
        {!isLoading && !!voteErrorMessage && (
          <TwAlertErrorBanner
            className="w-full gap-x-2 px-3"
            iconClassName="size-5"
            messageClassName="text-base"
            message={voteErrorMessage}
          />
        )}

        <Neo3VoteAccount
          neo3Account={neo3Account}
          isDisabled={isLoading || !hasNeo3Accounts || !isMainnet}
          onSelect={handleSelectNeo3Account}
        />

        <TwSeparator />

        <TwInput
          className="h-11 w-full text-sm placeholder:text-neon"
          aria-label={t('searchLabel')}
          placeholder={t('searchPlaceholder')}
          value={search}
          maxLength={100}
          inputContainerProps={{ className: 'bg-gray-300/15 w-full px-3 rounded' }}
          clearable
          disabled={isSearchDisabled}
          onChangeText={setDataWrapper('search')}
          leftElement={<TbSearch aria-hidden className="h-4 max-h-4 min-h-4 w-4 min-w-4 max-w-4 text-neon" />}
        />

        <Neo3VoteAvailableVotes
          neoAmount={neoAmount}
          hasNeoAmount={hasNeoAmount}
          isLoading={voteDetailsByAddressQuery.isLoading}
        />

        <Neo3VoteList
          neo3Account={neo3Account}
          search={search}
          voteErrorMessage={voteErrorMessage}
          canVote={canVote}
          canScrollToCandidateRef={canScrollToCandidateRef}
        />
      </ScreenLayout.ViewContent>
    </ScreenLayout.Root>
  )
}

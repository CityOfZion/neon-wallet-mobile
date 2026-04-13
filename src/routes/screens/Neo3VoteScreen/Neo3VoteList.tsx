import { cloneElement, type RefObject, useMemo, useRef } from 'react'

import type { TBSNeo3Name, TVoteServiceCandidate } from '@cityofzion/bs-neo3'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import type { DimensionValue, ListRenderItem } from 'react-native'
import { FlatList, Text, TouchableWithoutFeedback, View } from 'react-native'
import { match } from 'ts-pattern'

import { Skeleton } from '@/components/Skeleton'
import { TwButton } from '@/components/TwButton'
import { TwDashedSeparator } from '@/components/TwDashedSeparator'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { I18nextHelper } from '@/helpers/I18nextHelper'
import { StringHelper } from '@/helpers/StringHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useMount } from '@/hooks/useMount'
import { useNeo3VoteGetCandidatesToVote, useNeo3VoteGetVoteDetailsByAddress } from '@/hooks/useNeo3Vote'

import MdCircle from '@/assets/images/md-circle.svg'
import PiSealCheckFill from '@/assets/images/pi-seal-check-fill.svg'
import TbAlertTriangleFilled from '@/assets/images/tb-filled-alert-triangle.svg'
import TbPackages from '@/assets/images/tb-packages.svg'

import { Neo3VoteListNotFound } from './Neo3VoteListNotFound'

import type { TAccount } from '@/types/store'

type TItem = {
  candidate: TVoteServiceCandidate
  candidateVotePercentage: string
  canVote: boolean
  isCurrentVote: boolean
  isVoteDisabled: boolean
  candidatesLength: number
  onGoToDetails: () => void
  onGoToConfirmation: () => void
}

type TProps = {
  neo3Account?: TAccount<TBSNeo3Name>
  search: string
  voteErrorMessage?: string
  canVote: boolean
  canScrollToCandidateRef: RefObject<boolean>
}

const { t } = I18nextHelper.get()

const renderItem: ListRenderItem<TItem> = ({
  index,
  item: {
    candidate,
    candidateVotePercentage,
    canVote,
    isVoteDisabled,
    isCurrentVote,
    candidatesLength,
    onGoToDetails,
    onGoToConfirmation,
  },
}) => {
  const tPrefix = 'screens:neo3VoteScreen.listItem'
  const { position } = candidate

  const icon = match({ isCurrentVote, type: candidate.type })
    .with({ isCurrentVote: true }, () => <PiSealCheckFill className="size-5 text-blue" />)
    .with({ type: 'consensus' }, () => <TbPackages className="size-5" />)
    .otherwise(() => <MdCircle className="size-2" />)

  return (
    <View className="flex w-full flex-col" role="listitem">
      <TouchableWithoutFeedback
        role="button"
        className="w-full"
        aria-label={t(`${tPrefix}.detailsButtonLabel`)}
        onPress={onGoToDetails}
      >
        <View className="relative flex h-12 max-h-12 min-h-12 w-full flex-row items-center">
          <View
            className="pointer-events-none absolute bottom-0 left-0 top-0 h-full select-none"
            style={{ width: candidateVotePercentage as DimensionValue }}
          >
            <View
              className={StyleHelper.mergeStyles('h-full w-full bg-lemon opacity-5', {
                'bg-neon': position === 1,
                'bg-green-100': position === 2,
                'bg-green': position === 3,
                'bg-blue': position === 4,
                'bg-magenta-700': position === 5,
                'bg-purple': position === 6,
                'bg-magenta': position === 7,
                'bg-pink': position === 8,
                'bg-orange': position === 9,
                'bg-yellow': position === 10,
              })}
            />

            <View
              className={StyleHelper.mergeStyles('absolute bottom-0 left-0 h-auto w-full border-b-2 border-lemon', {
                'border-neon': position === 1,
                'border-green-100': position === 2,
                'border-green': position === 3,
                'border-blue': position === 4,
                'border-magenta-700': position === 5,
                'border-purple': position === 6,
                'border-magenta': position === 7,
                'border-pink': position === 8,
                'border-orange': position === 9,
                'border-yellow': position === 10,
              })}
            />
          </View>

          <View
            className="flex h-full w-16 min-w-16 max-w-16 flex-row items-center gap-x-2 border-b-2 border-gray-300/15 px-1"
            role="cell"
            aria-labelledby="column-positon"
          >
            <View className="flex w-5 min-w-5 max-w-5 items-center justify-center">
              {cloneElement(icon, {
                'aria-hidden': true,
                className: StyleHelper.mergeStyles(
                  'text-lemon',
                  {
                    'text-neon': position === 1,
                    'text-green-100': position === 2,
                    'text-green': position === 3,
                    'text-blue': position === 4,
                    'text-magenta-700': position === 5,
                    'text-purple': position === 6,
                    'text-magenta': position === 7,
                    'text-pink': position === 8,
                    'text-orange': position === 9,
                    'text-yellow': position === 10,
                  },
                  icon.props.className
                ),
              })}
            </View>

            <Text className="font-sans-regular text-sm text-white">{position}.</Text>
          </View>

          <View
            role="cell"
            aria-labelledby="column-name"
            className="flex h-full flex-shrink flex-grow flex-row items-center border-b-2 border-gray-300/15"
          >
            <Text
              numberOfLines={1}
              className="flex flex-shrink flex-grow flex-row font-sans-regular text-sm text-white"
            >
              {candidate.name}
            </Text>
          </View>

          <View
            role="cell"
            aria-labelledby="column-vote"
            className="flex w-20 min-w-20 max-w-20 flex-row items-center pl-1"
          >
            <TwButton
              label={isCurrentVote ? t(`${tPrefix}.votedButtonLabel`) : t(`${tPrefix}.castVoteButtonLabel`)}
              variant={isCurrentVote ? 'card' : 'text'}
              disabled={isVoteDisabled}
              className="m-0 h-10 w-full rounded p-0"
              contentProps={{ className: 'w-full p-0 m-0' }}
              labelProps={{
                className: StyleHelper.mergeStyles(
                  'text-sm p-0 m-0',
                  isCurrentVote || canVote ? 'text-neon' : 'text-pink'
                ),
              }}
              onPress={onGoToConfirmation}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>

      {index === 0 && candidatesLength > 1 && <TwDashedSeparator className="my-4" />}
    </View>
  )
}

export const Neo3VoteList = ({ neo3Account, search, voteErrorMessage, canVote, canScrollToCandidateRef }: TProps) => {
  const { t } = useTranslation('screens', { keyPrefix: 'neo3VoteScreen.list' })
  const { data, isLoading } = useNeo3VoteGetCandidatesToVote()
  const voteDetailsByAddressQuery = useNeo3VoteGetVoteDetailsByAddress(neo3Account?.address)
  const navigation = useNavigation()
  const listRef = useRef<FlatList>(null)

  const currentCandidatePubKey = voteDetailsByAddressQuery.data?.candidatePubKey

  const { filteredCandidates, votesTotal } = useMemo(() => {
    const filteredCandidates: TVoteServiceCandidate[] = []
    let votesTotal = 0

    if (!data || data.length === 0) return { filteredCandidates, votesTotal }

    const normalizedSearch = StringHelper.normalizeText(search)

    data.forEach(candidate => {
      votesTotal += candidate.votes

      if (
        normalizedSearch.length === 0 ||
        candidate.pubKey === ConstantsHelper.neo3VoteCozPubKey ||
        StringHelper.normalizeText(candidate.name).includes(normalizedSearch) ||
        StringHelper.normalizeText(candidate.pubKey).includes(normalizedSearch) ||
        StringHelper.normalizeText(candidate.hash).includes(normalizedSearch) ||
        StringHelper.normalizeText(candidate.location).includes(normalizedSearch)
      )
        filteredCandidates.push(candidate)
    })

    return { filteredCandidates, votesTotal }
  }, [data, search])

  const items = useMemo<TItem[]>(
    () =>
      filteredCandidates.map<TItem>(candidate => {
        const votePercentage = Math.min(100, Number(((candidate.votes * 100) / votesTotal).toFixed(2)))
        const candidateVotePercentage = `${votePercentage >= 0 ? votePercentage : 0}%`
        const isCurrentVote = candidate.pubKey === currentCandidatePubKey
        const isVoteDisabled = isCurrentVote || !canVote || voteDetailsByAddressQuery.isLoading

        return {
          candidate,
          candidateVotePercentage,
          canVote,
          isCurrentVote,
          isVoteDisabled,
          candidatesLength: filteredCandidates.length,
          onGoToDetails: () => {
            navigation.navigate('Neo3VoteCandidateDetailsModal', {
              neo3Account,
              candidate,
              candidateVotePercentage,
            })
          },
          onGoToConfirmation: () => {
            if (isVoteDisabled) return

            navigation.navigate('Neo3VoteConfirmationModal', { neo3Account: neo3Account!, candidate })
          },
        }
      }),
    [
      canVote,
      currentCandidatePubKey,
      filteredCandidates,
      navigation,
      neo3Account,
      voteDetailsByAddressQuery.isLoading,
      votesTotal,
    ]
  )

  useMount(() => {
    const listElement = listRef.current

    if (
      !canScrollToCandidateRef.current ||
      !listElement ||
      !currentCandidatePubKey ||
      !neo3Account ||
      filteredCandidates.length === 0
    )
      return

    canScrollToCandidateRef.current = false

    const isCozCandidate = ConstantsHelper.neo3VoteCozPubKey === currentCandidatePubKey
    const index = isCozCandidate ? 0 : filteredCandidates.findIndex(({ pubKey }) => pubKey === currentCandidatePubKey)

    if (index !== -1) listElement.scrollToIndex({ index, animated: true, viewOffset: isCozCandidate ? 50 : 0 })
  }, [neo3Account, currentCandidatePubKey, filteredCandidates])

  return (
    <Skeleton.Root loading={isLoading} className="w-full">
      <Skeleton.Group>
        <Skeleton.Item className="h-7 w-full" />
        <Skeleton.Item className="h-10 w-full" />

        <TwDashedSeparator className="my-2" />

        {Array.from({ length: 16 }).map((_, index) => (
          <Skeleton.Item key={`neo3-vote-list-skeleton-${index}`} className="h-10 w-full" />
        ))}
      </Skeleton.Group>

      <Skeleton.Content>
        <FlatList
          ref={listRef}
          role="list"
          className="mb-2 flex w-full flex-col"
          data={items}
          keyExtractor={({ candidate }) => candidate.pubKey}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          ListEmptyComponent={Neo3VoteListNotFound}
          ListHeaderComponent={
            items.length > 0 ? (
              <View aria-hidden className="mb-2 flex w-full flex-row items-center">
                <Text
                  className="flex w-16 min-w-16 max-w-16 flex-row items-center pr-1 font-sans-bold text-xs uppercase text-gray-100"
                  role="columnheader"
                  id="column-position"
                >
                  {t('positionColumnLabel')}
                </Text>

                <Text
                  className="flex flex-grow flex-row items-center font-sans-bold text-xs uppercase text-gray-100"
                  role="columnheader"
                  id="column-name"
                >
                  {t('nameColumnLabel')}
                </Text>

                <View
                  className="flex w-20 min-w-20 max-w-20 flex-row items-center gap-x-2 pl-1"
                  role="columnheader"
                  id="column-vote"
                >
                  <Text className="font-sans-bold text-xs uppercase text-gray-100">{t('voteColumnLabel')}</Text>

                  {!!voteErrorMessage && <TbAlertTriangleFilled aria-hidden className="size-4 text-pink" />}
                </View>
              </View>
            ) : null
          }
        />
      </Skeleton.Content>
    </Skeleton.Root>
  )
}

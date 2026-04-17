import { Fragment, useCallback, useMemo } from 'react'

import { search } from 'fast-fuzzy'
import { debounce, orderBy } from 'lodash'
import { useTranslation } from 'react-i18next'
import type { ListRenderItem } from 'react-native'
import { FlatList, Text, View } from 'react-native'
import { removeStopwords } from 'stopword'
import { match } from 'ts-pattern'
import winkWebModel from 'wink-eng-lite-web-model'
import WinkNLP from 'wink-nlp'

import { ScreenLoader } from '@/components/ScreenLoader'
import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'
import { TwSeparator } from '@/components/TwSeparator'

import { AppError } from '@/helpers/ErrorHelper'
import { LoggerHelper } from '@/helpers/LoggerHelper'
import { SynonymsHelper } from '@/helpers/SynomymsHelper'
import { ToastHelper } from '@/helpers/ToastHelper'

import { useActions } from '@/hooks/useActions'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import MdChevronRight from '@/assets/images/md-chevron-right.svg'
import TbHelp from '@/assets/images/tb-help.svg'
import TbSearch from '@/assets/images/tb-search.svg'

import { functionsByActionId } from './functionsByActionId'

import type { TSearchStackScreenProps } from '@/types/stacks'

type TItem = {
  action: TSearchAction
  verbsMatchedQuantity: number
  nonVerbsMatchedQuantity: number
}

type TActionData = {
  isSearching: boolean
  foundActions?: TSearchAction[]
  search: string
}

type TSearchAction = {
  label: string
  verbs: string[]
  nonVerbs: string[]
  id: string
  onPress(): Promise<void>
}

const nlp = WinkNLP(winkWebModel)

const renderItem: ListRenderItem<TSearchAction> = ({ item }) => {
  return (
    <TwButton
      variant="text"
      onPress={item.onPress}
      label={item.label}
      iconsOnEdge
      className="h-15"
      labelProps={{
        className: 'text-left text-white',
      }}
      contentProps={{
        className: 'px-0',
      }}
      leftElement={<TbHelp aria-hidden />}
      rightElement={<MdChevronRight aria-hidden />}
    />
  )
}

export const SearchScreen = ({ navigation }: TSearchStackScreenProps<'SearchScreen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'search' })
  const { t: tSearch } = useTranslation('search')

  const { actionData, setData, reset } = useActions<TActionData>({
    isSearching: false,
    search: '',
    foundActions: undefined,
  })

  const searchActions = useMemo<Omit<TSearchAction, 'onPress'>[]>(
    () => tSearch('actions', { returnObjects: true }),
    [tSearch]
  )

  const handleClick = async (action: Omit<TSearchAction, 'onPress'>) => {
    try {
      const func = functionsByActionId[action.id]
      if (!func) throw new AppError(t('errors.noFunction'))

      await func({ navigation })
      reset()
    } catch (error) {
      LoggerHelper.error(error, { where: 'SearchScreen', operation: 'handleClick' })
      ToastHelper.error({ message: AppError.wrap(error, t('errors.execute')).message })
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce(async (text: string) => {
      const doc = nlp.readDoc(text.toLowerCase())
      const tokens = doc.tokens().filter(t => t.out(nlp.its.type) === 'word')

      const verbs = tokens.filter(token => token.out(nlp.its.pos) === 'VERB').out(nlp.its.lemma as any) as string[]

      const nonVerbs = removeStopwords(
        tokens.filter(token => token.out(nlp.its.pos) !== 'VERB').out(nlp.its.lemma as any)
      )

      const verbsQuantity = verbs.length
      const nonVerbsQuantity = nonVerbs.length

      const hasVerbs = verbsQuantity > 0
      const hasNonVerbs = nonVerbsQuantity > 0

      try {
        if (!hasVerbs && !hasNonVerbs) {
          setData({ foundActions: [] })

          return
        }

        const items: TItem[] = []

        for (const action of searchActions) {
          const allVerbsSynonyms = await SynonymsHelper.getAllSynonyms(action.verbs)
          const allNonVerbsSynonyms = await SynonymsHelper.getAllSynonyms(action.nonVerbs)

          const lowerCaseLabels = action.label.toLowerCase().split(' ')
          const allVerbs = [...lowerCaseLabels, ...action.verbs, ...allVerbsSynonyms]
          const allNonVerbs = [...lowerCaseLabels, ...action.nonVerbs, ...allNonVerbsSynonyms]

          const filteredVerbs = verbs.filter(
            verb =>
              allVerbs.some(value => value.startsWith(verb)) || search(verb, allVerbs, { threshold: 0.8 }).length > 0
          )

          const filteredNonVerbs = nonVerbs.filter(
            nonVerb =>
              allNonVerbs.some(value => value.startsWith(nonVerb)) ||
              search(nonVerb, allNonVerbs, { threshold: 0.8 }).length > 0
          )

          const verbsMatchedQuantity = filteredVerbs.length
          const nonVerbsMatchedQuantity = filteredNonVerbs.length

          const hasVerbsMatchedQuantity = verbsMatchedQuantity > 0
          const hasNonVerbsMatchedQuantity = nonVerbsMatchedQuantity > 0

          const item = {
            action: {
              ...action,
              onPress: async () => await handleClick(action),
            },
            verbsMatchedQuantity,
            nonVerbsMatchedQuantity,
          }

          if (hasVerbs && hasNonVerbs) {
            if (hasVerbsMatchedQuantity && hasNonVerbsMatchedQuantity) items.push(item)
          } else if (hasVerbs) {
            if (hasVerbsMatchedQuantity) items.push(item)
          } else if (hasNonVerbs && hasNonVerbsMatchedQuantity) items.push(item)
        }

        setData({
          foundActions: orderBy(items, ['verbsMatchedQuantity', 'nonVerbsMatchedQuantity'], ['desc', 'desc']).map(
            ({ action }) => action
          ),
        })
      } catch {
        setData({ foundActions: [] })
      } finally {
        setData({ isSearching: false })
      }
    }, 1500),
    []
  )

  const handleChange = async (value: string) => {
    setData({ search: value, isSearching: true })

    if (value.length <= 0) {
      setData({ foundActions: undefined, isSearching: false })
      handleSearch.cancel()
      return
    }

    await handleSearch(value)
  }

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
        <ScreenLayout.Button position="right" label={t('resetButtonLabel')} onPress={reset} />
      </ScreenLayout.Header>
      <ScreenLayout.ViewContent>
        <TwInput
          containerProps={{ className: 'w-full' }}
          placeholder={t('inputPlaceholder')}
          inputContainerProps={{ className: 'bg-gray-300/15' }}
          className="placeholder:text-neon"
          onChangeText={handleChange}
          value={actionData.search}
          maxLength={200}
        />

        {match(actionData)
          .with({ isSearching: true }, () => <ScreenLoader />)
          .with({ foundActions: undefined }, () => (
            <View className="flex-grow flex-row items-center justify-center gap-5">
              <TbSearch aria-hidden className="size-11 text-gray-300" />
              <Text className="font-sans-medium text-2xl text-gray-300">{t('idleResultDescription')}</Text>
            </View>
          ))
          .with({ foundActions: [] }, () => (
            <View className="flex-grow flex-row items-center justify-center gap-5">
              <Text className="font-sans-medium text-2xl text-gray-300">{t('emptyResultDescription')}</Text>
            </View>
          ))
          .otherwise(({ foundActions }) => (
            <FlatList
              data={foundActions}
              className="w-full"
              ListHeaderComponent={
                <Fragment>
                  <Text className="mb-4 mt-8 font-sans-regular text-lg text-white">{t('resultDescription')}</Text>
                  <TwSeparator containerClassName="mb-5" />
                </Fragment>
              }
              keyExtractor={(_, index) => `search-action-${index}`}
              renderItem={renderItem}
            />
          ))}
      </ScreenLayout.ViewContent>
    </ScreenLayout.Root>
  )
}

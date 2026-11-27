import React, { useEffect } from 'react'

import { useTranslation } from 'react-i18next'

import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { StringHelper } from '@/helpers/StringHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useActions } from '@/hooks/useActions'
import { useDebounceFunction } from '@/hooks/useDebounceFunction'
import { useAppDispatch } from '@/hooks/useRedux'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbTrash from '@/assets/images/tb-trash.svg'

import { settingsReducerActions } from '@/store/reducers/settings'
import type { TRootStackScreenProps } from '@/types/stacks'

type TActionsData = {
  name: string
  url: string
  isValid: boolean
  isValidating: boolean
}

const NAME_MAX_LENGTH = 20

export const PersistNetworkModal = ({ navigation, route }: TRootStackScreenProps<'PersistNetworkModal'>) => {
  const { blockchain, network } = route.params

  const { t } = useTranslation('modals', { keyPrefix: 'persistNetwork' })
  const { t: tCommonGeneral } = useTranslation('common', { keyPrefix: 'general' })

  const dispatch = useAppDispatch()
  const debounce = useDebounceFunction()

  const { actionData, actionState, setData, setError, clearErrors } = useActions<TActionsData>({
    name: network?.name || '',
    url: network?.url || '',
    isValid: false,
    isValidating: false,
  })

  const canShowUrlInputMessage = !!actionData.url && !actionData.isValidating

  const handleChangeUrl = (url: string) => {
    url = StringHelper.removeLineBreaks(url).toLowerCase().trim()

    const isValidating = !!url

    clearErrors('url')
    setData({ url, isValid: false, isValidating })

    debounce(async () => {
      if (!isValidating) return

      if (!UtilsHelper.validateURL(url)) {
        setError('url', t('invalidUrl'))
        setData({ isValidating: false })

        return
      }

      try {
        const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

        await service.pingNetwork(url)

        setData({ isValid: true })
      } catch (error) {
        setError('url', AppError.wrap(error, t('notConnected')).message)
      } finally {
        setData({ isValidating: false })
      }
    })
  }

  const handleChangeName = (text: string) => {
    setData({ name: text })

    text = text.trim()

    if (text.length === 0 || text.length > NAME_MAX_LENGTH) {
      setError('name', t('invalidName'))
    }
  }

  const handleSave = () => {
    const name = actionData.name.trim()
    const url = actionData.url.trim()

    dispatch(
      settingsReducerActions.saveCustomNetwork({
        blockchain,
        network: network ? { ...network, name, url } : { id: UtilsHelper.uuid(), name, url, type: 'custom' },
      })
    )

    navigation.goBack()
  }

  const handleDelete = () => {
    if (!network) return

    dispatch(settingsReducerActions.deleteCustomNetwork({ blockchain, network }))

    navigation.goBack()
  }

  useEffect(() => {
    if (!network) {
      return
    }

    handleChangeUrl(network.url)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network])

  return (
    <ModalLayout.Root>
      <ModalLayout.Header>
        <ModalLayout.Title>
          {network ? t('editTitle', { networkName: network.name }) : t('createTitle')}
        </ModalLayout.Title>
        <ModalLayout.CloseButton />
      </ModalLayout.Header>

      <ModalLayout.KeyboardAvoidingContent>
        <TwInput
          label={t('inputLabels.name')}
          labelDescription={t('inputLabels.nameDescription')}
          placeholder={t('inputPlaceholder.name')}
          value={actionData.name}
          maxLength={NAME_MAX_LENGTH}
          error={actionState.errors.name}
          onChangeText={handleChangeName}
        />

        <TwInput
          label={t('inputLabels.url')}
          placeholder={t('inputPlaceholder.url')}
          value={actionData.url}
          maxLength={200}
          loading={actionData.isValidating}
          error={canShowUrlInputMessage && !actionData.isValid ? actionState.errors.url : undefined}
          success={canShowUrlInputMessage && actionData.isValid ? t('connected') : undefined}
          containerProps={{ className: 'mt-6' }}
          onChangeText={handleChangeUrl}
        />

        <ModalLayout.KeyboardAvoidingArea className="gap-4 pt-8">
          {network && (
            <TwButton
              label={t('deleteNetworkButtonLabel')}
              variant="outline"
              leftElement={<TbTrash aria-hidden />}
              onPress={handleDelete}
            />
          )}

          <TwButton
            label={tCommonGeneral('save')}
            variant="contained-light"
            disabled={!actionData.isValid || actionData.isValidating}
            onPress={handleSave}
          />
        </ModalLayout.KeyboardAvoidingArea>
      </ModalLayout.KeyboardAvoidingContent>
    </ModalLayout.Root>
  )
}

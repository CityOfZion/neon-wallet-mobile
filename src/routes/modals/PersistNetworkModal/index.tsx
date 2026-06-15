import React, { useCallback, useEffect } from 'react'

import { debounce } from 'lodash'
import { useTranslation } from 'react-i18next'

import { TwButton } from '@/components/TwButton'
import { TwInput } from '@/components/TwInput'

import { BlockchainServiceHelper } from '@/helpers/BlockchainServiceHelper'
import { AppError } from '@/helpers/ErrorHelper'
import { StringHelper } from '@/helpers/StringHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useActions } from '@/hooks/useActions'
import { useAppDispatch } from '@/hooks/useRedux'

import { ModalLayout } from '@/layouts/ModalLayout'

import TbTrash from '@/assets/images/tb-trash.svg'

import { settingsReducerActions } from '@/store/reducers/settings'
import type { TRootStackScreenProps } from '@/types/stacks'

type TActionData = {
  name: string
  url: string
  isValidating: boolean
  isUrlValid: boolean
}

export const PersistNetworkModal = ({ navigation, route }: TRootStackScreenProps<'PersistNetworkModal'>) => {
  const { blockchain, network } = route.params

  const dispatch = useAppDispatch()
  const { t } = useTranslation('modals', { keyPrefix: 'persistNetwork' })
  const { t: tCommon } = useTranslation('common')

  const { actionData, actionState, setData, setError, clearErrors } = useActions<TActionData>({
    isUrlValid: false,
    isValidating: false,
    name: '',
    url: '',
  })

  const canShowUrlInputMessage = !!actionData.url && !actionData.isValidating

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validateURL = useCallback(
    debounce(async (url: string) => {
      setData({ isValidating: true })

      await UtilsHelper.sleep(500)

      if (!url) {
        clearErrors('url')
        setData({ isUrlValid: false, isValidating: false })

        return
      }

      if (!UtilsHelper.validateURL(url)) {
        setError('url', t('invalidUrl'))
        setData({ isUrlValid: false, isValidating: false })

        return
      }

      try {
        const service = BlockchainServiceHelper.bsAggregator.blockchainServicesByName[blockchain]

        await service.pingNetwork(url)

        clearErrors('url')
        setData({ isUrlValid: true })
      } catch (error) {
        setError('url', AppError.wrap(error, t('notConnected')).message)
        setData({ isUrlValid: false })
      } finally {
        setData({ isValidating: false })
      }
    }, 1000),
    []
  )

  const handleChangeName = (text: string) => {
    setData({ name: text })

    text = text.trim()

    if (text.length === 0 || text.length > 20) {
      setError('name', t('invalidName'))
    }
  }

  const handleChangeNetworkUrl = (url: string) => {
    setData({ isUrlValid: false })

    url = StringHelper.removeLineBreaks(url).toLowerCase().trim()

    validateURL(url)
    setData({ url })
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
    if (!network) return

    validateURL(network.url)
    setData({ name: network.name, url: network.url })
  }, [network, setData, validateURL])

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
          onChangeText={handleChangeName}
          value={actionData.name}
          error={actionState.errors.name}
        />

        <TwInput
          containerProps={{ className: 'mt-7' }}
          label={t('inputLabels.url')}
          placeholder={t('inputPlaceholder.url')}
          onChangeText={handleChangeNetworkUrl}
          value={actionData.url}
          error={canShowUrlInputMessage && !actionData.isUrlValid ? actionState.errors.url : undefined}
          success={canShowUrlInputMessage && actionData.isUrlValid ? t('connected') : undefined}
        />

        <ModalLayout.KeyboardAvoidingArea className="gap-4 pt-7">
          {network && (
            <TwButton
              variant="outline"
              leftElement={<TbTrash aria-hidden />}
              label={t('delete')}
              onPress={handleDelete}
            />
          )}

          <TwButton
            variant="contained-light"
            label={tCommon('general.save')}
            onPress={handleSave}
            disabled={!actionState.isValid || actionData.isValidating || !actionData.isUrlValid}
          />
        </ModalLayout.KeyboardAvoidingArea>
      </ModalLayout.KeyboardAvoidingContent>
    </ModalLayout.Root>
  )
}

import { useMemo } from 'react'

import isArray from 'lodash/isArray'
import mapValues from 'lodash/mapValues'
import { Trans, useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { Details } from '@/components/Details'
import { TwButton } from '@/components/TwButton'
import { TwDappHeader } from '@/components/TwDappHeader'
import { TwIconButton } from '@/components/TwIconButton'

import { ClipboardHelper } from '@/helpers/ClipboardHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import TbArrowsSort from '@/assets/images/tb-arrows-sort.svg'
import TbCodeCircle from '@/assets/images/tb-code-circle.svg'
import TbCopy from '@/assets/images/tb-copy.svg'

import type { TDappPermissionProps } from '../index'
import { DappPermissionGenericContentFee } from './DappPermissionGenericContentFee'

export const DappPermissionGenericContent = (props: TDappPermissionProps) => {
  const { session, onAccept, onReject, isAccepting, isRejecting, request, sessionDetails } = props

  const { t } = useTranslation('modals', { keyPrefix: 'dappPermission' })
  const { t: tCommon } = useTranslation('common')

  const parsedParams = useMemo(() => {
    const params = request.params.request.params
    return mapValues(isArray(params) && params.length === 1 ? params[0] : params, UtilsHelper.parseJsonSafely)
  }, [request.params.request.params])

  const isCalculableMethod = sessionDetails.service.walletConnectService.calculableMethods.includes(
    request.params.request.method
  )

  return (
    <View className="flex-1">
      <TwDappHeader
        uri={session.peer.metadata.icons[0]}
        title={
          <Trans t={t} i18nKey="description" values={{ dAppName: session.peer.metadata.name }}>
            <Text className="font-sans-bold">start</Text>
            end
          </Trans>
        }
      />

      <Text className="mt-2 text-center font-sans-regular text-base text-gray-100">{t('description2')}</Text>

      <Details.Root className="mt-5">
        <Details.Header labelClassName="capitalize" leftElement={<TbArrowsSort aria-hidden className="rotate-90" />}>
          {request.params.request.method}
        </Details.Header>
      </Details.Root>

      {Object.entries(parsedParams).map(([key, value]) => {
        const content = typeof value === 'string' ? value : JSON.stringify(value, null, 2)

        return (
          <Details.Root className="mt-3" key={key}>
            <Details.Header
              rightElement={
                <TwIconButton
                  aria-label={tCommon('general.copy')}
                  icon={<TbCopy aria-hidden className="text-neon" />}
                  size="sm"
                  onPress={() => ClipboardHelper.write(content)}
                />
              }
              leftElement={<TbCodeCircle aria-hidden className="text-gray-300" />}
              labelClassName="capitalize text-gray-100"
            >
              {key}
            </Details.Header>

            <Details.HeaderSeparator />

            <Details.Item contentClassName="bg-gray-700/60 px-5 py-2.5 rounded whitespace-pre-wrap break-words">
              {content}
            </Details.Item>
          </Details.Root>
        )
      })}

      {isCalculableMethod && <DappPermissionGenericContentFee {...props} />}

      <View className="mt-auto gap-4 pt-8">
        <TwButton
          variant="contained-light"
          label={tCommon('general.accept')}
          onPress={() => onAccept()}
          isLoading={isAccepting}
          disabled={isRejecting}
        />

        <TwButton
          variant="outline"
          label={tCommon('general.decline')}
          onPress={() => onReject()}
          isLoading={isRejecting}
          disabled={isAccepting}
        />
      </View>
    </View>
  )
}

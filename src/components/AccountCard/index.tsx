import React, { Fragment } from 'react'

import { useNavigation } from '@react-navigation/native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { match, P } from 'ts-pattern'

import { ClipboardHelper } from '@/helpers/ClipboardHelper'
import { CurrencyHelper } from '@/helpers/CurrencyHelper'
import { SkinHelper } from '@/helpers/SkinHelper'
import { StyleHelper } from '@/helpers/StyleHelper'

import { useBalance } from '@/hooks/useBalances'
import { useCurrencySelector } from '@/hooks/useSettingsSelector'

import TbCopy from '@/assets/images/tb-copy.svg'
import TbBinocularsFilled from '@/assets/images/tb-filled-binoculars.svg'
import TbQrcode from '@/assets/images/tb-qrcode.svg'

import { Skeleton } from '../Skeleton'
import { TwBlockchainIcon } from '../TwBlockchainIcon'
import { TwIconButton } from '../TwIconButton'
import type { TAccountCardNoContentProps } from './AccountCardNoContent'
import { ACCOUNT_CARD_HEIGHT, ACCOUNT_CARD_WIDTH, AccountCardNoContent } from './AccountCardNoContent'

import type { TNftSkin } from '@/types/store'

type TProps = {
  isCompacted?: boolean
  isStack?: boolean
  hideQRCode?: boolean
  hideCopy?: boolean
  hideBalance?: boolean
} & Omit<TAccountCardNoContentProps, 'children'>

const AccountCardComponent = ({
  isCompacted = false,
  disabled = false,
  isStack = false,
  account,
  hideCopy,
  hideQRCode,
  hideBalance = false,
  ...props
}: TProps) => {
  const navigation = useNavigation()
  const { t } = useTranslation('components', { keyPrefix: 'accountCard' })
  const { t: commonT } = useTranslation('common', { keyPrefix: 'blockchainServices' })
  const balance = useBalance(account)
  const { currency } = useCurrencySelector()

  const handlePressQRCode = () => {
    navigation.navigate('AccountQRCodeModal', {
      account,
    })
  }

  const handlePressCopy = () => {
    ClipboardHelper.write(account.address)
  }

  return (
    <AccountCardNoContent disabled={disabled} account={account} {...props}>
      {match(account.skin)
        .with(
          P.when(value => value.type === 'nft' && !!value.imgUrl),
          () => (
            <Image
              className="absolute h-full w-full"
              source={{
                uri: (account.skin as TNftSkin).imgUrl,
                height: ACCOUNT_CARD_WIDTH,
                width: ACCOUNT_CARD_HEIGHT,
              }}
              contentFit="cover"
            />
          )
        )
        .with(
          P.when(value => value.type === 'local' && !!SkinHelper.localSkins.get(value.id)),
          () => (
            <Image
              className="absolute h-full w-full"
              source={{ uri: SkinHelper.localSkins.get(account.skin.id)!.imageUrl }}
              contentFit="cover"
              cachePolicy="memory-disk"
              priority="high"
            />
          )
        )
        .otherwise(() => (
          <LinearGradient
            className="absolute h-full w-full"
            start={{ x: 0, y: 0 }}
            colors={['rgba(0, 0, 0, 0.5)', 'transparent']}
          />
        ))}

      <View className="h-full w-full px-3.5 py-6">
        <View className="flex-row items-center gap-5">
          <TwBlockchainIcon className="size-6" blockchain={account.blockchain} type="white" />

          <Text
            className={StyleHelper.mergeStyles('flex-shrink flex-grow font-sans-semibold text-2xl text-white', {
              'font-sans-regular text-lg': isCompacted || isStack,
            })}
            numberOfLines={1}
          >
            {account.name || t('accountPlaceholder')}
          </Text>

          {isCompacted || isStack ? (
            <Fragment>
              {!hideBalance && (
                <Skeleton.Root loading={balance.isLoading}>
                  <Skeleton.Group>
                    <Skeleton.Item className="h-6 w-16" />
                  </Skeleton.Group>

                  <Skeleton.Content>
                    <Text className="font-sans-regular text-lg text-white" numberOfLines={1}>
                      {CurrencyHelper.format(balance.data?.exchangeTotal, { currency })}
                    </Text>
                  </Skeleton.Content>
                </Skeleton.Root>
              )}
            </Fragment>
          ) : (
            <Fragment>
              {!hideQRCode && (
                <TwIconButton
                  className="p-0"
                  icon={<TbQrcode aria-hidden className="size-7 text-white" />}
                  onPress={handlePressQRCode}
                />
              )}
            </Fragment>
          )}
        </View>

        <View className="flex-row justify-between pl-11">
          <Text className="font-sans-bold text-sm uppercase text-white/60">{commonT(`${account.blockchain}.id`)}</Text>

          {(isCompacted || isStack) && !hideBalance && (
            <Text className="font-sans-bold text-sm uppercase text-white/60">{t('balance')}</Text>
          )}
        </View>

        {!isCompacted && !isStack && !hideBalance && (
          <View className="flex-grow items-center justify-center px-4">
            <View className="gap-1">
              <Text className="font-sans-bold text-sm uppercase text-white/60">{t('balance')}</Text>

              <Skeleton.Root loading={balance.isLoading}>
                <Skeleton.Group>
                  <Skeleton.Item className="h-12 w-32 rounded-md" />
                </Skeleton.Group>

                <Skeleton.Content>
                  <Text className="font-sans-regular text-5xl text-white" numberOfLines={1}>
                    {CurrencyHelper.format(balance.data?.exchangeTotal, { currency })}
                  </Text>
                </Skeleton.Content>
              </Skeleton.Root>
            </View>
          </View>
        )}

        {account.address && (
          <View
            className={StyleHelper.mergeStyles('flex-row items-center gap-5', {
              'mt-2.5': isStack,
              'mt-auto': isCompacted,
            })}
          >
            {account.type === 'watch' && <TbBinocularsFilled className="size-8 text-white" />}

            <View className="flex-shrink flex-grow gap-0.5">
              {!isCompacted && !isStack && (
                <Text className="font-sans-bold text-sm uppercase text-white/60">{t('address')}</Text>
              )}

              <View className="flex-row items-center gap-3">
                <Text
                  className="flex-shrink font-sans-regular text-lg text-white"
                  ellipsizeMode="middle"
                  numberOfLines={1}
                >
                  {account.address}
                </Text>

                {!hideCopy && (
                  <TwIconButton
                    className="p-0"
                    icon={<TbCopy aria-hidden className="text-white" />}
                    onPress={handlePressCopy}
                  />
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    </AccountCardNoContent>
  )
}

export const AccountCard = React.memo(AccountCardComponent)

import React, { useEffect, useState } from 'react'

import * as Application from 'expo-application'
import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'

import { TwAccordionMenuButton } from '@/components/TwAccordionMenuButton'
import { TwMenuButton } from '@/components/TwMenuButton'
import { TwSeparator } from '@/components/TwSeparator'

import { ConstantsHelper } from '@/helpers/ConstantsHelper'
import { LinkHelper } from '@/helpers/LinkHelper'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import MdCircle from '@/assets/images/md-circle.svg'
import TbFileDescription from '@/assets/images/tb-file-description.svg'
import TbFileImport from '@/assets/images/tb-file-import.svg'
import TbHelp from '@/assets/images/tb-help.svg'
import TbSettings from '@/assets/images/tb-settings.svg'
import TbUsers from '@/assets/images/tb-users.svg'
import WalletIcon from '@/assets/images/wallet-icon.svg'

import packageJson from '../../../../package.json'

import type { TMoreStackScreenProps } from '@/types/stacks'

export const MoreScreen = ({ navigation, route }: TMoreStackScreenProps<'MoreScreen'>) => {
  const textToImport = route.params?.textToImport
  const [helpAccordionOpen, setHelpAccordionOpen] = useState(route.params?.isHelpAccordionOpen || false)

  const { t } = useTranslation('screens', { keyPrefix: 'more' })

  const handlePressContacts = () => {
    navigation.navigate('ContactsScreen')
  }

  const handlePressCreateWallet = () => {
    navigation.navigate('CreateWalletStep1Screen')
  }

  const handlePressImportKey = () => {
    navigation.navigate('ImportScreen')
  }

  const handlePressSettings = () => {
    navigation.navigate('SettingsScreen')
  }

  const handlePressVersion = () => {
    navigation.navigate('ChangelogModal')
  }

  const handlePressPrivacyPolicy = () => {
    LinkHelper.open(ConstantsHelper.cozPrivacyPolicyLink)
  }

  const handlePressDiscord = () => {
    LinkHelper.open(ConstantsHelper.cozDiscordUrl)
  }

  const handlePressOpenTicket = () => {
    navigation.navigate('SupportTicketScreen')
  }

  useEffect(() => {
    if (!textToImport) return

    const data = textToImport

    navigation.setParams({ textToImport: undefined })
    navigation.navigate('ImportScreen', { data })
  }, [textToImport, navigation])

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
      </ScreenLayout.Header>
      <ScreenLayout.ScrollContent contentContainerClassName="justify-between px-0">
        <View>
          <TwMenuButton
            label={t('contactsButtonLabel')}
            className="px-3.5"
            rightElement={undefined}
            leftElement={<TbUsers aria-hidden className="text-neon" />}
            onPress={handlePressContacts}
          />

          <TwSeparator containerClassName="px-2.5" />

          <TwMenuButton
            label={t('createWalletButtonLabel')}
            className="px-3.5"
            rightElement={undefined}
            leftElement={<WalletIcon aria-hidden className="text-neon" />}
            onPress={handlePressCreateWallet}
          />

          <TwSeparator containerClassName="px-2.5" />

          <TwSeparator containerClassName="px-2.5" />

          <TwMenuButton
            label={t('importButtonLabel')}
            className="px-3.5"
            rightElement={undefined}
            leftElement={<TbFileImport aria-hidden className="text-neon" />}
            onPress={handlePressImportKey}
          />

          <TwSeparator containerClassName="px-2.5" />

          <TwMenuButton
            label={t('settingsButtonLabel')}
            className="px-3.5"
            rightElement={undefined}
            leftElement={<TbSettings aria-hidden className="text-neon" />}
            onPress={handlePressSettings}
          />

          <TwSeparator containerClassName="px-2.5" />

          <TwMenuButton
            label={t('privatePolicyButtonLabel')}
            className="px-3.5"
            rightElement={undefined}
            leftElement={<TbFileDescription aria-hidden className="text-neon" />}
            onPress={handlePressPrivacyPolicy}
          />

          <TwSeparator containerClassName="px-2.5" />

          <TwAccordionMenuButton
            label={t('helpButtonLabel')}
            className="px-3.5"
            leftElement={<TbHelp aria-hidden className="text-yellow" />}
            open={helpAccordionOpen}
            onOpenChange={setHelpAccordionOpen}
          >
            <TwMenuButton
              label={t('chatWithUsButtonLabel')}
              className="px-3.5"
              leftElement={
                <View className="size-6 items-center justify-center">
                  <MdCircle aria-hidden className="size-2 text-yellow" />
                </View>
              }
              onPress={handlePressDiscord}
            />

            <TwMenuButton
              label={t('openSupportTicketButtonLabel')}
              className="px-3.5"
              leftElement={
                <View className="size-6 items-center justify-center">
                  <MdCircle aria-hidden className="size-2 text-yellow" />
                </View>
              }
              onPress={handlePressOpenTicket}
            />
          </TwAccordionMenuButton>
        </View>

        <TouchableOpacity activeOpacity={0.6} onPress={handlePressVersion} className="mt-3.5 px-3.5">
          <Text className="text-left text-sm text-white" numberOfLines={1}>
            {`v${packageJson.version}-${Application.nativeBuildVersion}`}
          </Text>
        </TouchableOpacity>
      </ScreenLayout.ScrollContent>
    </ScreenLayout.Root>
  )
}

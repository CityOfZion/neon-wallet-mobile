import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'

import { TwMenuButton } from '@/components/TwMenuButton'
import { TwSeparator } from '@/components/TwSeparator'
import { TwTabs } from '@/components/TwTabs'

import { useCurrencySelector, useLanguageSelector, useSecuritySelector } from '@/hooks/useSettingsSelector'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import TbAlertTriangle from '@/assets/images/tb-alert-triangle.svg'
import TbCashBanknote from '@/assets/images/tb-cash-banknote.svg'
import TbCube3dSphere from '@/assets/images/tb-cube-3d-sphere.svg'
import TbDeviceFloppy from '@/assets/images/tb-device-floppy.svg'
import TbMessage from '@/assets/images/tb-message.svg'
import TbPackageImport from '@/assets/images/tb-package-import.svg'
import TbUserShield from '@/assets/images/tb-user-shield.svg'

import type { TMoreStackScreenProps } from '@/types/stacks'

export type TSettingsTab = 'personalisation' | 'security'

export const SettingsScreen = ({ navigation, route }: TMoreStackScreenProps<'SettingsScreen'>) => {
  const { currency } = useCurrencySelector()
  const { language } = useLanguageSelector()
  const { t } = useTranslation('screens', { keyPrefix: 'settings' })
  const { security } = useSecuritySelector()

  const [selectedTab, setSelectedTab] = useState<TSettingsTab>(route?.params?.tab || 'personalisation')

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
      </ScreenLayout.Header>
      <ScreenLayout.ScrollContent>
        <TwTabs.Root value={selectedTab} onValueChange={value => setSelectedTab(value as TSettingsTab)}>
          <TwTabs.List>
            <TwTabs.Trigger value="personalisation" label={t('tabs.personalisation.title')} />
            <TwTabs.Trigger value="security" label={t('tabs.security.title')} />
          </TwTabs.List>

          <TwTabs.Content value="personalisation">
            <TwMenuButton
              label={t('tabs.personalisation.networkConfigurationButtonLabel')}
              leftElement={<TbCube3dSphere aria-hidden />}
              onPress={() => navigation.navigate('SettingsProtocolsScreen')}
            />

            <TwSeparator />

            <TwMenuButton
              label={t('tabs.personalisation.currencyButtonLabel')}
              subtitle={currency.label}
              leftElement={<TbCashBanknote aria-hidden />}
              onPress={() => navigation.navigate('CurrencySelectionModal')}
            />

            <TwSeparator />

            <TwMenuButton
              label={t('tabs.personalisation.languageButtonLabel')}
              subtitle={language.label}
              leftElement={<TbMessage aria-hidden />}
              onPress={() => navigation.navigate('LanguageSelectionModal')}
            />
          </TwTabs.Content>

          <TwTabs.Content value="security">
            <TwMenuButton
              label={t('tabs.security.verificationButtonLabel')}
              leftElement={<TbUserShield aria-hidden />}
              onPress={() => navigation.navigate('SecuritySelectionModal')}
              subtitle={
                security.type === 'disabled' ? (
                  <View className="flex-row items-center gap-2">
                    <TbAlertTriangle className="size-6 text-pink" aria-hidden />

                    <Text className="text-left font-sans-regular text-lg uppercase text-pink">
                      {t(`tabs.security.verificationSubtitle.${security.type}`)}
                    </Text>
                  </View>
                ) : (
                  t(`tabs.security.verificationSubtitle.${security.type}`)
                )
              }
            />

            <TwSeparator />

            <TwMenuButton
              label={t('tabs.security.backupButtonLabel')}
              leftElement={<TbDeviceFloppy aria-hidden />}
              onPress={() => navigation.navigate('CreateBackupModal')}
            />

            <TwSeparator />

            <TwMenuButton
              label={t('tabs.security.importBackupButtonLabel')}
              leftElement={<TbPackageImport aria-hidden />}
              onPress={() => navigation.navigate('ImportBackupModal')}
            />
          </TwTabs.Content>
        </TwTabs.Root>
      </ScreenLayout.ScrollContent>
    </ScreenLayout.Root>
  )
}

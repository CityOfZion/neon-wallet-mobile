import { useTranslation } from 'react-i18next'

import { TwContactList } from '@/components/TwContactList'
import { TwIconButton } from '@/components/TwIconButton'

import { ScreenLayout } from '@/layouts/ScreenLayout'

import TbPlus from '@/assets/images/tb-plus.svg'

import type { TMoreStackScreenProps } from '@/types/stacks'
import type { TContact } from '@/types/store'

export const ContactsScreen = ({ navigation }: TMoreStackScreenProps<'ContactsScreen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'contacts' })

  const handleContactPress = (contact?: TContact) => {
    if (!contact) return

    navigation.navigate('ContactScreen', {
      contact,
    })
  }

  const handlePressAdd = () => {
    navigation.navigate('PersistContactModal')
  }

  return (
    <ScreenLayout.Root>
      <ScreenLayout.Header>
        <ScreenLayout.BackButton
          onPress={() =>
            navigation.navigate('TabStack', {
              screen: 'MoreStack',
              params: { screen: 'MoreScreen' },
            })
          }
        />
        <ScreenLayout.Title>{t('title')}</ScreenLayout.Title>
        <ScreenLayout.ButtonContent position="right">
          <TwIconButton
            aria-label={t('addContactButtonLabel')}
            icon={<TbPlus aria-hidden className="text-white" />}
            onPress={handlePressAdd}
          />
        </ScreenLayout.ButtonContent>
      </ScreenLayout.Header>
      <ScreenLayout.ViewContent>
        <TwContactList
          containerProps={{ className: 'w-full' }}
          inputProps={{ inputContainerProps: { className: 'bg-gray-300/15' } }}
          onPress={handleContactPress}
        />
      </ScreenLayout.ViewContent>
    </ScreenLayout.Root>
  )
}

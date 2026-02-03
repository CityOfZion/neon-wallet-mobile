import { useTranslation } from 'react-i18next'

import { TwContactList } from '@/components/TwContactList'
import { TwIconButton } from '@/components/TwIconButton'

import { TwScreenLayout } from '@/layouts/TwScreenLayout'

import TbPlus from '@/assets/images/tb-plus.svg'

import type { TMoreStackScreenProps } from '@/types/stacks'
import type { IContactState } from '@/types/store'

export const ContactsScreen = ({ navigation }: TMoreStackScreenProps<'ContactsScreen'>) => {
  const { t } = useTranslation('screens', { keyPrefix: 'contactsScreen' })

  const handleContactPress = (contact?: IContactState) => {
    if (!contact) return

    navigation.navigate('ContactScreen', {
      contact,
    })
  }

  const handlePressAdd = () => {
    navigation.navigate('PersistContactModal')
  }

  return (
    <TwScreenLayout
      title={t('title')}
      onBack={() =>
        navigation.navigate('TabStack', {
          screen: 'MoreStack',
          params: {
            screen: 'MoreScreen',
          },
        })
      }
      rightElement={<TwIconButton icon={<TbPlus aria-hidden className="text-white" />} onPress={handlePressAdd} />}
      withoutScroll
    >
      <TwContactList
        containerProps={{ className: 'w-full' }}
        inputProps={{ inputContainerProps: { className: 'bg-gray-300/15' } }}
        onPress={handleContactPress}
      />
    </TwScreenLayout>
  )
}

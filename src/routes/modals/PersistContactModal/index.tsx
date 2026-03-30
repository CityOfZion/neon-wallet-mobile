import React, { Fragment } from 'react'

import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'

import { TwBlockchainIcon } from '@/components/TwBlockchainIcon'
import { TwButton } from '@/components/TwButton'
import { TwIconButton } from '@/components/TwIconButton'
import { TwInput } from '@/components/TwInput'
import { TwInputLabel } from '@/components/TwInputLabel'
import { TwSeparator } from '@/components/TwSeparator'

import { AlertHelper } from '@/helpers/AlertHelper'
import { StyleHelper } from '@/helpers/StyleHelper'
import { UtilsHelper } from '@/helpers/UtilsHelper'

import { useActions } from '@/hooks/useActions'
import { useAppDispatch } from '@/hooks/useRedux'

import { TwModalLayout } from '@/layouts/TwModalLayout'
import { TwModalLayoutButton } from '@/layouts/TwModalLayout/TwModalLayoutButtons'

import TbPlus from '@/assets/images/tb-plus.svg'
import TbTrash from '@/assets/images/tb-trash.svg'
import TbX from '@/assets/images/tb-x.svg'

import { contactReducerActions } from '@/store/reducers/contact'
import type { TRootStackScreenProps } from '@/types/stacks'
import type { TContactAddress } from '@/types/store'

type TActionData = {
  name: string
  addresses: TContactAddress[]
}

export const PersistContactModal = ({ navigation, route }: TRootStackScreenProps<'PersistContactModal'>) => {
  const contact = route.params?.contact
  const addresses = route.params?.addresses

  const dispatch = useAppDispatch()
  const { t } = useTranslation('modals', { keyPrefix: 'persistContactModal' })
  const { t: commonT } = useTranslation('common')

  const { actionData, actionState, setData, setError, handleAct } = useActions<TActionData>({
    addresses: contact?.addresses || addresses || [],
    name: contact?.name || '',
  })

  const handleAddAddress = () => {
    navigation.navigate('PersistContactAddressModal', {
      onAdd: address => {
        setData(prev => ({ addresses: [...prev.addresses, address] }))
      },
    })
  }

  const handleEditAddress = (index: number, address: TContactAddress) => {
    navigation.navigate('PersistContactAddressModal', {
      address,
      onAdd: newAddress => {
        setData(prev => ({
          addresses: prev.addresses.map((oldAddress, oldIndex) => (oldIndex === index ? newAddress : oldAddress)),
        }))
      },
    })
  }

  const handleDeleteAddress = (index: number) => {
    setData(prev => ({ addresses: prev.addresses.filter((_, addressIndex) => addressIndex !== index) }))
  }

  const handleChangeName = (name: string) => {
    setData({ name })

    const trimmedName = name.trim()

    if (trimmedName.length === 0 || trimmedName.length > 20) {
      setError('name', t('nameInvalid'))
    }
  }

  const handleSave = () => {
    const name = actionData.name.trim()
    const addresses = actionData.addresses

    dispatch(
      contactReducerActions.saveContact(
        contact ? { ...contact, name, addresses } : { name, addresses, id: UtilsHelper.uuid() }
      )
    )

    navigation.goBack()
  }

  const handleConfirmDelete = async () => {
    dispatch(contactReducerActions.deleteContact(contact!.id))

    navigation.goBack()
    navigation.replace('TabStack', {
      screen: 'MoreStack',
      params: {
        screen: 'ContactsScreen',
      },
    })
  }

  const handleDelete = () => {
    AlertHelper.show({
      subtitle: t('deleteContactAlert'),
      buttons: [
        { label: commonT('general.cancel') },
        {
          label: commonT('general.delete'),
          onPress: handleConfirmDelete,
        },
      ],
    })
  }

  return (
    <TwModalLayout
      title={contact ? t('title.edit') : t('title.create')}
      rightElement={
        <TwModalLayoutButton
          label={commonT('general.save')}
          onPress={handleAct(handleSave)}
          disabled={!actionState.isValid || actionData.addresses.length === 0}
        />
      }
      leftElement={
        <TwModalLayoutButton
          labelProps={{ className: 'text-white' }}
          label={commonT('general.cancel')}
          onPress={navigation.goBack}
        />
      }
      contentContainerClassName="justify-between"
    >
      <View className="gap-6">
        <TwInput
          label={t('nameLabel')}
          placeholder={t('namePlaceholder')}
          onChangeText={handleChangeName}
          value={actionData.name}
          error={actionState.errors.name}
        />

        <View>
          <TwInputLabel label={t('addressLabel')} />

          {actionData.addresses.map((address, index) => (
            <Fragment key={index}>
              <TouchableOpacity
                className="flex-row items-center gap-3 py-3"
                onPress={() => handleEditAddress(index, address)}
              >
                <TwBlockchainIcon blockchain={address.blockchain} className="size-5" />

                <Text className="flex-1 font-sans-regular text-lg text-neon" numberOfLines={1} ellipsizeMode="middle">
                  {address.address}
                </Text>

                <TwIconButton
                  size="sm"
                  icon={<TbX aria-hidden className="text-white" />}
                  onPress={() => handleDeleteAddress(index)}
                />
              </TouchableOpacity>

              <TwSeparator />
            </Fragment>
          ))}

          <TwButton
            label={actionData.addresses.length > 0 ? t('addAnotherAddress') : t('addAddress')}
            variant="outline"
            className={StyleHelper.mergeStyles('border-dashed', {
              'mt-6': actionData.addresses.length !== 0,
            })}
            leftElement={<TbPlus className="text-neon" aria-hidden />}
            onPress={handleAddAddress}
          />
        </View>
      </View>

      {contact && (
        <View>
          <TwSeparator className="my-8" />

          <Text className="font-sans-bold text-sm text-gray-300">{t('deleteContact')}</Text>

          <Text className="mb-8 mt-1.5 font-sans-regular text-white">{t('deleteContactSubtitle')}</Text>

          <TwButton
            label={t('deleteButton')}
            variant="outline"
            leftElement={<TbTrash aria-hidden className="text-neon" />}
            onPress={handleDelete}
          />
        </View>
      )}
    </TwModalLayout>
  )
}

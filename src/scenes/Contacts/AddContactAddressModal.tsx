import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from 'i18n-js'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'

import { wrapper } from '~/src/app/ApplicationWrapper'
import { BlockchainServiceKey } from '~/src/blockchain'
import InputWithValidation from '~/src/components/InputWithValidation'
import { Select } from '~/src/components/Select'
import ThemedButton from '~/src/components/themed/ThemedButton'
import { BlockchainHelper } from '~/src/helpers/BlockchainHelper'
import { useBlockchainServiceLib } from '~/src/hooks/useBlockchainServiceLib'
import { RootStackParamList } from '~/src/navigation/AppNavigation'
import { TabStackParamList } from '~/src/navigation/TabNavigation'
import { ContactAddresses } from '~/src/types/reducers/contact'
import InputLabel from '~src/components/InputLabel'
import SwiperPanel, { useSwiperController, CloseButton } from '~src/components/SwiperPanel'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'
import { ImageView, LinearLayout, TextView } from '~src/styles/styled-components'

export interface AddContactAddressModalParams {
  onAdd?: (address: ContactAddresses) => void
  address?: ContactAddresses
}

interface Props {
  navigation: StackNavigationProp<RootStackParamList & ModalStackParamList & TabStackParamList>
  route: RouteProp<ModalStackParamList, 'AddContactAddressModal'>
}

export const AddContactAddressModal = (props: Props) => {
  const { onAdd, address: editAddress } = props.route.params

  const controller = useSwiperController(true)
  const { getBlockchainServiceLib, hasNNS } = useBlockchainServiceLib()

  const [selectedBlockchain, setSelectedBlockchain] = useState<BlockchainServiceKey>()
  const [address, setAddress] = useState<string>('')
  const [addressIsValid, setAddressIsValid] = useState<boolean>()
  const [validating, setValidating] = useState(false)
  const [NNSAddress, setNNSAddress] = useState<string>('')

  const validateAddressOrNSS = useCallback(
    debounce(async (input: string, blockchain?: BlockchainServiceKey) => {
      try {
        setValidating(true)
        setNNSAddress('')

        let isValid = false
        if (blockchain && input.length) {
          try {
            const service = getBlockchainServiceLib(blockchain)

            isValid = service.validateAddress(input)

            if (!isValid && hasNNS(service) && service.validateNNSFormat(input)) {
              const nnsAddress = await service.getOwnerOfNNS(input)
              setNNSAddress(nnsAddress)
              isValid = true
            }
          } catch {}
        }
        setAddressIsValid(isValid)
      } finally {
        setValidating(false)
      }
    }, 1000),
    [getBlockchainServiceLib, hasNNS]
  )

  const handleSelectBlockchain = () => {
    props.navigation.navigate(wrapper.route.Modal.name, {
      screen: wrapper.route.SelectChainModal.name,
      params: {
        onSelect: (blockchain: BlockchainServiceKey) => {
          setSelectedBlockchain(blockchain)
          validateAddressOrNSS(address, blockchain)
        },
      },
    })
  }

  const handleChangeAddress = (input: string, blockchain?: BlockchainServiceKey) => {
    setAddress(input)
    validateAddressOrNSS(input, blockchain ?? selectedBlockchain)
  }

  const add = () => {
    controller.close()
    if (onAdd && selectedBlockchain && address) onAdd({ blockchain: selectedBlockchain, address })
  }

  useEffect(() => {
    if (!editAddress) return
    setSelectedBlockchain(editAddress.blockchain)
    handleChangeAddress(editAddress.address, editAddress.blockchain)
  }, [editAddress])

  return (
    <SwiperPanel
      title={i18n.t(
        editAddress ? 'modals.addContactAddressModal.title.edit' : 'modals.addContactAddressModal.title.create'
      )}
      rightButton={<CloseButton onPress={controller.close} />}
      onClose={props.navigation.goBack}
      controller={controller}
    >
      <LinearLayout justifyContent="space-between" flex={1}>
        <LinearLayout mb="48px">
          <InputLabel title={i18n.t('modals.addContactAddressModal.chainLabel')} marginBottom="8px" />
          <Select
            value={
              selectedBlockchain && (
                <LinearLayout orientation="horiz" alignItems="center" flexGrow={1} flexShrink={1}>
                  <ImageView
                    source={BlockchainHelper.getIcon(selectedBlockchain)}
                    resizeMode="contain"
                    mr="12px"
                    width={28}
                    height={28}
                  />

                  <LinearLayout>
                    <TextView color="text.11" fontSize="12px" fontWeight={500}>
                      {i18n.t(`blockchainServices.${selectedBlockchain}.label`)}
                    </TextView>

                    <TextView color="text.0" fontSize="18px" fontWeight={700}>
                      {i18n.t(`blockchainServices.${selectedBlockchain}.id`)}
                    </TextView>
                  </LinearLayout>
                </LinearLayout>
              )
            }
            placeholder={i18n.t('modals.addContactAddressModal.chainPlaceholder')}
            onPress={handleSelectBlockchain}
          />

          <InputLabel
            title={i18n.t('modals.addContactAddressModal.addressLabel')}
            marginTop="48px"
            marginBottom="8px"
          />
          <InputWithValidation
            placeholder={i18n.t('modals.addContactAddressModal.addressPlaceholder')}
            loading={validating}
            onChangeText={handleChangeAddress}
            title={NNSAddress}
            color="text.0"
            isValid={addressIsValid}
            value={address}
            invalidColor="quinary"
            invalidSeparatorColor="quinary"
            separatorColor="background.3"
            invalidMessageColor="quinary"
            sideMargins={0}
            onScan={setAddress}
          />
        </LinearLayout>

        <ThemedButton
          label={i18n.t(editAddress ? 'app.save' : 'app.add')}
          onPress={add}
          disabled={!addressIsValid || !selectedBlockchain}
        />
      </LinearLayout>
    </SwiperPanel>
  )
}

export default AddContactAddressModal

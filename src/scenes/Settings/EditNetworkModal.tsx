import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import I18n from 'i18n-js'
import { debounce } from 'lodash'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Keyboard, Platform } from 'react-native'
import { useDispatch } from 'react-redux'

import { BlockchainServiceKey } from '~/src/blockchain'
import InputLabel from '~/src/components/InputLabel'
import InputWithValidation from '~/src/components/InputWithValidation'
import { Separator } from '~/src/components/Separator'
import ThemedButton from '~/src/components/themed/ThemedButton'
import { TBlockchainNetwork } from '~/src/config/BlockchainConfig'
import { UtilsHelper } from '~/src/helpers/UtilsHelper'
import { useBlockchainServiceUtils } from '~/src/hooks/useBlockchainServices'
import { settingsReducerActions } from '~/src/store/settings/SettingsReducer'
import {
  ButtonWithoutFeedbackView,
  ImageView,
  InputTextView,
  LinearLayout,
  TextView,
} from '~/src/styles/styled-components'
import SwiperPanel, { useSwiperController, CloseButton } from '~src/components/SwiperPanel'
import { ModalStackParamList } from '~src/navigation/ModalStackNavigation'

export interface EditNetworkModalParams {
  blockchain: BlockchainServiceKey
  network?: TBlockchainNetwork
}

interface Props {
  navigation: StackNavigationProp<ModalStackParamList>
  route: RouteProp<ModalStackParamList, 'EditNetworkModal'>
}

export const EditNetworkModal = (props: Props) => {
  const { blockchain, network } = props.route.params
  const controller = useSwiperController(true)
  const dispatch = useDispatch()
  const { getBlockchainService } = useBlockchainServiceUtils()

  const [networkName, setNetworkName] = useState('')
  const [networkUrl, setNetworkUrl] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [urlIsValid, setUrlIsValid] = useState<boolean | undefined>(undefined)
  const [message, setMessage] = useState<string | undefined>(undefined)

  const validateURL = useCallback(
    debounce(async (text: string) => {
      if (!UtilsHelper.validateURL(text)) {
        setUrlIsValid(false)
        setMessage(I18n.t('modals.editNetworkModal.invalidUrl'))
        return
      }

      try {
        setIsValidating(true)

        const service = getBlockchainService(blockchain, { type: 'custom', url: text })
        await service.getBlockCount()

        setUrlIsValid(true)
        setMessage(I18n.t('modals.editNetworkModal.connected'))
      } catch {
        setUrlIsValid(false)
        setMessage(I18n.t('modals.editNetworkModal.notConnected'))
      } finally {
        setIsValidating(false)
      }
    }, 1000),
    [getBlockchainService]
  )

  const handleChangeNetworkUrl = async (text: string) => {
    setNetworkUrl(UtilsHelper.removeLineBreaks(text))
    validateURL(UtilsHelper.removeLineBreaks(text))
  }

  const handleSave = () => {
    dispatch(
      network
        ? settingsReducerActions.editBlockchainNetwork({
            blockchain,
            data: { ...network, name: networkName, url: networkUrl },
            id: network.id,
          })
        : settingsReducerActions.addBlockchainNetwork({
            blockchain,
            name: networkName,
            url: networkUrl,
            type: 'custom',
          })
    )
    controller.close()
  }

  const handleDelete = () => {
    if (!network) return

    dispatch(
      settingsReducerActions.deleteBlockchainNetwork({
        blockchain,
        id: network.id,
      })
    )
    controller.close()
  }

  useEffect(() => {
    if (!network) return

    setNetworkName(network.name)
    setNetworkUrl(network.url)
    validateURL(network.url)
  }, [network])

  return (
    <SwiperPanel
      controller={controller}
      title={
        network
          ? I18n.t('modals.editNetworkModal.editTitle', { networkName: network.name })
          : I18n.t('modals.editNetworkModal.createTitle')
      }
      onClose={props.navigation.goBack}
      rightButton={<CloseButton onPress={controller.close} />}
      contentStyle={{ justifyContent: 'space-between' }}
    >
      <LinearLayout>
        <InputLabel
          title={I18n.t('modals.editNetworkModal.inputLabels.name')}
          description={I18n.t('modals.editNetworkModal.inputLabels.nameDescription')}
          marginBottom="8px"
          capitalize
          color="text.0"
        />
        <InputWithValidation
          placeholder={I18n.t('modals.editNetworkModal.inputPlaceholder.name')}
          onChangeText={setNetworkName}
          color="white"
          value={networkName}
          validator={() => true}
          separatorColor="background.3"
          invalidColor="background.3"
          invalidMessageColor="quinary"
          sideMargins={0}
          hideScan
          hidePaste
        />

        <InputLabel
          title={I18n.t('modals.editNetworkModal.inputLabels.url')}
          marginBottom="8px"
          marginTop="74px"
          capitalize
          color="text.0"
        />
        <LinearLayout>
          <LinearLayout orientation="horiz">
            <InputTextView
              onChangeText={handleChangeNetworkUrl}
              color="text.0"
              placeholderTextColor="#7d929a"
              underlineColorAndroid="transparent"
              placeholder={I18n.t('modals.editNetworkModal.inputPlaceholder.url')}
              fontFamily="regular"
              fontSize="18px"
              value={networkUrl}
              weight={1}
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
              multiline={Platform.OS === 'ios'}
              numberOfLines={1}
              clearTextOnFocus={false}
            />

            {isValidating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              typeof urlIsValid === 'boolean' && (
                <>
                  {urlIsValid ? (
                    <ImageView
                      width={18}
                      height={18}
                      alignSelf="center"
                      source={require('~/src/assets/images/icon-circle-plus-green-fill.png')}
                      resizeMode="contain"
                    />
                  ) : (
                    <ImageView
                      width={18}
                      height={18}
                      alignSelf="center"
                      source={require('~/src/assets/images/icon-alert-purple.png')}
                      resizeMode="contain"
                    />
                  )}
                </>
              )
            )}
          </LinearLayout>

          <Separator mt={1} backgroundColor="background.3" />
          {typeof message !== 'undefined' && typeof urlIsValid !== 'undefined' && (
            <TextView
              fontSize="14px"
              fontStyle="italic"
              color={urlIsValid ? 'primary' : 'quinary'}
              textAlign="right"
              mt="8px"
            >
              {message}
            </TextView>
          )}
        </LinearLayout>
      </LinearLayout>

      <LinearLayout>
        <ThemedButton
          label={I18n.t('app.save')}
          onPress={handleSave}
          disabled={urlIsValid !== true || isValidating !== false}
        />
        {network && (
          <ButtonWithoutFeedbackView onPress={handleDelete}>
            <LinearLayout
              width="100%"
              borderRadius="4px"
              borderWidth="1px"
              borderColor="primary"
              justifyContent="center"
              alignItems="center"
              orientation="horiz"
              p="10px"
              mt="36px"
            >
              <ImageView
                source={require('~/src/assets/images/icon-trash-can-primary.png')}
                style={{
                  width: 20,
                  height: 20,
                }}
              />

              <TextView ml="3px" color="primary" fontSize="20px">
                {I18n.t('modals.editNetworkModal.delete')}
              </TextView>
            </LinearLayout>
          </ButtonWithoutFeedbackView>
        )}
      </LinearLayout>
    </SwiperPanel>
  )
}

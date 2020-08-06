import {wallet} from '@cityofzion/neon-core'
import {StackNavigationProp} from '@react-navigation/stack'
import {AwaitActivity} from '@simpli/react-native-await'
import React, {useState} from 'react'
import {Alert} from 'react-native'
import {useDispatch, useSelector} from 'react-redux'

import {Facade} from '~src/app/Facade'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputWithValidation'
import SwiperPanel, {useSwiperController} from '~src/components/SwiperPanel'
import ScreenLoader from '~src/components/loader/ScreenLoader'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {RootState, RootStore} from '~src/store/RootStore'
import {LinearLayout} from '~src/styles/styled-components'

interface AddContactProps {
  navigation: StackNavigationProp<ModalStackParamList>
}

export const AddContact = (props: AddContactProps) => {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const controller = useSwiperController(true)

  const dispatch = useDispatch<SyncDispatch>()
  const dispatchAsync = useDispatch<AsyncDispatch<any>>()

  const submit = async () => {
    if (name.length === 0 || name.length > 20) {
      Alert.alert(Facade.t('createContact.invalidName'))
      return
    }

    if (!wallet.isAddress(address)) {
      Alert.alert(Facade.t('createContact.invalidAddress'))
      return
    }

    dispatch(RootStore.contact.actions.clearState())

    dispatch(RootStore.contact.actions.setName(name))
    dispatch(RootStore.contact.actions.setAddress(address))

    await dispatchAsync(RootStore.contact.actions.createAndSave())
    dispatch(RootStore.contact.actions.clearState())

    await dispatchAsync(RootStore.app.actions.syncContacts())
    controller.close()
  }

  const save = () => {
    Facade.await.run('swiperRight', submit, 300)
  }

  return (
    <SwiperPanel
      padding={20}
      fullSize={true}
      title={Facade.t('createContact.title')}
      image={require('~src/assets/images/icon-add-circle-outline-white.png')}
      rightButton={Facade.t('createContact.save')}
      leftButton={Facade.t('createContact.cancel')}
      imageSize={[22, 22]}
      onClose={props.navigation.goBack}
      onLeftPress={controller.close}
      onRightPress={save}
      controller={controller}
    >
      <AwaitActivity
        name={'swiperRight'}
        loadingView={<ScreenLoader transparent={true} />}
      >
        <LinearLayout>
          <InputLabel
            title={Facade.t('createContact.name')}
            marginBottom={'8px'}
          />

          <InputWithValidation
            placeholder={Facade.t('createContact.namePlaceholder')}
            onChangeText={(val) => setName(val)}
            color={'background.4'}
            value={name}
            validator={(val) =>
              (val.length >= 2 && val.length <= 20) || val?.length === 0
            }
            separatorColor={'background.3'}
            invalidColor={'background.3'}
            invalidMessageColor={'quinary'}
            sideMargins={0}
            hideScan={true}
            hidePaste={true}
          />

          <InputLabel
            title={Facade.t('createContact.address')}
            marginBottom={'8px'}
            marginTop={'12px'}
          />

          <InputWithValidation
            placeholder={Facade.t('createContact.addressPlaceholder')}
            onChangeText={(val) => setAddress(val)}
            color={'background.4'}
            value={address}
            invalidColor={'background.3'}
            invalidSeparatorColor={'background.3'}
            validator={() => {
              return wallet.isAddress(address) || address?.length === 0
            }}
            separatorColor={'background.3'}
            invalidMessageColor={'quinary'}
            sideMargins={0}
          />
        </LinearLayout>
      </AwaitActivity>
    </SwiperPanel>
  )
}

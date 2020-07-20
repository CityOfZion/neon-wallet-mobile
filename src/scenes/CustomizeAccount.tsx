import {useNavigation, useRoute} from '@react-navigation/native'
import {useHeaderHeight} from '@react-navigation/stack'
import {LinearGradient} from 'expo-linear-gradient'
import React, {useState} from 'react'
import {ScrollView, TouchableHighlight, View} from 'react-native'
import {useSelector} from 'react-redux'

import {StackNavigationProp} from '~/node_modules/@react-navigation/stack/lib/typescript/src/types'
import {Facade} from '~src/app/Facade'
import AccountCard from '~src/components/AccountCard'
import InputLabel from '~src/components/InputLabel'
import InputWithValidation from '~src/components/InputTextWithValidation'
import SwiperPanel from '~src/components/SwiperPanel'
import WalletCard from '~src/components/WalletCard'
import {mockWalletAccounts} from '~src/mocks/mockWalletAccounts'
import {Account} from '~src/models/Account'
import {ModalStackParamList} from '~src/navigation/ModalStackNavigation'
import {MoreStackParamList} from '~src/navigation/MoreStackNavigation'
import {RootState} from '~src/store/RootStore'
import {
  ButtonView,
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

interface Props {
  navigation: StackNavigationProp<MoreStackParamList>
  address: string
}

class ColorButton {
  colorTop: string
  colorBot: string
  onClick?: () => void

  constructor(colorTop: string, colorBot: string) {
    this.colorBot = colorBot
    this.colorTop = colorTop
  }
}

export default function CustomizeAccount(props: Props) {
  const theme = useSelector((state: RootState) => Facade.theme[state.app.theme])
  const account = new Account()

  account.srcIcon = require('~src/assets/images/card-neo.png')
  account.name = 'My First Account'
  account.currency = '$'
  account.balance = 24985
  account.address = 'AN8iLVt18CKoATdexztCQj923hw5gkc41A'
  account.backgroundColor = '#0DD5B3'

  const [name, setName] = useState<string>('')
  const [color, setColor] = useState<string>('#280480')
  const colorPresets: ColorButton[] = [
    {
      colorTop: '#00DCB4',
      colorBot: '#00BAA4',
    },
    {
      colorTop: '#20AEFB',
      colorBot: '#026397',
    },
    {
      colorTop: '#7646F6',
      colorBot: '#38099B',
    },
    {
      colorTop: '#C94FDC',
      colorBot: '#801F90',
    },
  ]
  const colorPresets2: ColorButton[] = [
    {
      colorTop: '#FB852D',
      colorBot: '#BA5103',
    },
    {
      colorTop: '#FBDA59',
      colorBot: '#C0A435',
    },
    {
      colorTop: '#8EA8B9',
      colorBot: '#4C5E6A',
    },
    {
      colorTop: 'transparent',
      colorBot: 'transparent',
      onClick: () => {
        console.log('Click')
      },
    },
  ]

  const colorMap = [colorPresets, colorPresets2]

  const queryBalance = () => {
    return 124.44
  }

  function persistAccount() {
    // TODO: Store account info on redux/asyncStorage
    if (name) {
      //const account = new Account(name, color)
      props.navigation.goBack()
    } else {
      // TODO: Validate account name field as empty
    }
  }

  const headerSize = useHeaderHeight()
  return (
    <LinearGradient
      style={{flex: 1, paddingTop: headerSize}}
      colors={[theme.colors.background[0], theme.colors.background[2]]}
      end={[1, 0.75]}
    >
      <ScrollView>
        <LinearLayout width="100%" height="100%" pl={20} pr={20}>
          <TextView
            mt={6}
            pl={40}
            pr={40}
            mb={24}
            color={theme.colors.text[0]}
            fontSize={18}
            fontFamily="medium"
            textAlign="center"
          >
            {Facade.t('screens.customizeAccount.subtitle')}
          </TextView>
          <InputLabel
            title={Facade.t('screens.customizeAccount.preview')}
            textAlignVertical={'top'}
            marginBottom={4}
          />
          <AccountCard account={account} isCompacted={true} />
          <InputLabel title="Account Name" marginTop={4} />
          <InputWithValidation
            onChangeText={setName}
            color={theme.colors.text[0]}
            fontStyle={'normal'}
            value={name}
            inputIsValid={true}
            separatorColor={theme.colors.background[3]}
            //TODO Why it doesn't accept 0?
            sideMargins={0.0001}
            hidePaste={true}
            hideScan={true}
          />
          <InputLabel
            title={Facade.t('screens.customizeAccount.selectAColor')}
            textAlignVertical={'top'}
            marginBottom={4}
          />

          {colorMap.map((colors) => {
            return (
              <LinearLayout
                flexWrap="wrap"
                width="100%"
                orientation={'horiz'}
                justifyContent="space-between"
                mb={4}
              >
                {colors.map((color) => {
                  const isLastColor =
                    colors.indexOf(color) == colors.length - 1 &&
                    colorMap.indexOf(colors) == colorMap.length - 1

                  const paddingRight = isLastColor ? '0%' : '0%'

                  if (!isLastColor) {
                    return (
                      <View>
                        <LinearLayout
                          width={71}
                          height={71}
                          pr={paddingRight}
                          borderRadius={45}
                          weight={1}
                        >
                          <LinearGradient
                            colors={[color.colorTop, color.colorBot]}
                            end={[1, 1]}
                            style={{borderRadius: 9}}
                          />
                        </LinearLayout>
                      </View>
                    )
                  } else {
                    return (
                      <View>
                        <LinearLayout
                          width={71}
                          height={71}
                          pr={paddingRight}
                          borderRadius={45}
                          weight={1}
                        >
                          <LinearGradient
                            colors={[color.colorTop, color.colorBot]}
                            end={[1, 1]}
                            style={{
                              borderRadius: 9,
                            }}
                          >
                            <ButtonView
                              onPress={() =>
                                props.navigation.navigate('CustomColor')
                              }
                            >
                              <ImageView
                                resizeMode="stretch"
                                source={require('~/src/assets/images/border-select-color.png')}
                              ></ImageView>
                            </ButtonView>
                          </LinearGradient>
                        </LinearLayout>
                      </View>
                    )
                  }
                })}
              </LinearLayout>
            )
          })}
        </LinearLayout>
      </ScrollView>
    </LinearGradient>
  )
}

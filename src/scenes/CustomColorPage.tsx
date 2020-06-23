import {LinearGradient} from 'expo-linear-gradient'
import React, {useState} from 'react'
import {useSelector} from 'react-redux'

import ColorPicker from '~src/components/ColorPicker'
import PaymentCard from '~src/components/PaymentCard'
import i18n from '~src/i18n'
import {RootState} from '~src/store/reducers/root'
import {LinearLayout, TextView} from '~src/styles/styled-components'

const CustomColorPage: React.FC<object> = () => {
  const defaultCardColor = '#00aaff'
  const theme = useSelector((state: RootState) => state.themeReducer.theme)

  const [color, setColor] = useState<string>(defaultCardColor)

  const colorPickerChangeEvent = (hex: string) => {
    setColor(hex)
  }

  return (
    <LinearGradient
      style={{flex: 1}}
      colors={[theme.colors.background[1], theme.colors.background[2]]}
      start={[0.1, 0.1]}
      end={[1, 1]}
    >
      <LinearLayout
        orientation={'verti'}
        alignItems={'center'}
        width={'100%'}
        height={'100%'}
        p={4}
        mt={80}
      >
        <LinearLayout mb={5} maxWidth={380}>
          {/*TODO: change mock values*/}
          <PaymentCard
            name={'My First Account'}
            currency={'$'}
            balance={24985}
            address={'AN8iLVt18CKoATdexztCQj923hw5gkc41A'}
            color={color}
          />
        </LinearLayout>

        <TextView mb={3} color="text.0" textAlign={'center'} fontSize={'lg'}>
          {i18n.t('customColorPage.subtitle')}
        </TextView>

        <LinearLayout weight={1} mb={60} maxHeight={420}>
          <ColorPicker color={color} onChange={colorPickerChangeEvent} />
        </LinearLayout>
      </LinearLayout>
    </LinearGradient>
  )
}

export default CustomColorPage

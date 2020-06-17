import React, {useState} from 'react'
import {color, ColorProps} from 'styled-system'

import ColorPicker from '~src/components/ColorPicker'
import PaymentCard from '~src/components/PaymentCard'
import i18n from '~src/i18n'
import styled, {LinearLayout, TextView} from '~src/styles/styled-components'

const CustomColorPage: React.FC<object> = () => {
  const [color, setColor] = useState<string>('#00aaff')

  const colorPickerChangeEvent = (hex: string) => setColor(hex)

  return (
    <ThemeView bg="background.0">
      <LinearLayout
        orientation={'verti'}
        alignItems={'center'}
        width={'100%'}
        maxWidth={400}
        p={4}
      >
        <LinearLayout mb={5}>
          <PaymentCard
            name={'My First Account'}
            currency={'$'}
            balance={24985}
            address={'AN8iLVt18CKoATdexztCQj923hw5gkc41A'}
            color={color}
          />
        </LinearLayout>

        <TextView mb={3} color="text.0" textAlign={'center'} fontSize={'lg'}>
          {i18n.t('customColorPage.title')}
        </TextView>

        <LinearLayout width={220}>
          <ColorPicker color={color} onChange={colorPickerChangeEvent} />
        </LinearLayout>
      </LinearLayout>
    </ThemeView>
  )
}

const ThemeView = styled(LinearLayout)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  ${color}
`

export default CustomColorPage

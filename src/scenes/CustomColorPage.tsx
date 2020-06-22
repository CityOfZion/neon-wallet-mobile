import React, {useState} from 'react'

import ColorPicker from '~src/components/ColorPicker'
import PaymentCard from '~src/components/PaymentCard'
import i18n from '~src/i18n'
import {LinearLayout, TextView} from '~src/styles/styled-components'

const CustomColorPage: React.FC<object> = () => {
  const defaultCardColor = '#00aaff'
  const [color, setColor] = useState<string>(defaultCardColor)

  const colorPickerChangeEvent = (hex: string) => {
    setColor(hex)
  }

  return (
    <LinearLayout
      bg={'background.0'}
      orientation={'verti'}
      alignItems={'center'}
      justifyContent={'center'}
      height={'100%'}
    >
      <LinearLayout
        orientation={'verti'}
        alignItems={'center'}
        width={'100%'}
        maxWidth={400}
        p={4}
      >
        <LinearLayout mb={5}>
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
          {i18n.t('customColorPage.title')}
        </TextView>

        <LinearLayout mx={6}>
          <ColorPicker color={color} onChange={colorPickerChangeEvent} />
        </LinearLayout>
      </LinearLayout>
    </LinearLayout>
  )
}

export default CustomColorPage

import React, {useState} from 'react'

import AccountCard from '~src/components/AccountCard'
import ColorPicker from '~src/components/ColorPicker'
import ScreenLayout from '~src/components/ScreenLayout'
import i18n from '~src/i18n'
import {Account} from '~src/models/Account'
import {LinearLayout, TextView} from '~src/styles/styled-components'

const CustomColorPage: React.FC<object> = () => {
  const defaultCardColor = '#00aaff'

  const [color, setColor] = useState<string>(defaultCardColor)

  // TODO: change mock values
  const account = new Account()
  account.srcIcon = require('~src/assets/images/card-neo.png')
  account.name = 'Demo Card'
  account.currency = '$'
  account.balance = 24985
  account.address = 'AN8iLVt18CKoATdexztCQj923hw5gkc41A'
  account.backgroundColor = color

  const colorPickerChangeEvent = (hex: string) => {
    setColor(hex)
  }

  return (
    <ScreenLayout autoScroll={false} alignX={'center'}>
      <LinearLayout mb={5} maxWidth={320}>
        <AccountCard account={account} />
      </LinearLayout>

      <TextView
        mb={3}
        color="text.0"
        textAlign={'center'}
        fontSize={'lg'}
        allowFontScaling={true}
        adjustsFontSizeToFit={true}
        numberOfLines={1}
      >
        {i18n.t('customColorPage.subtitle')}
      </TextView>

      <LinearLayout weight={1}>
        <ColorPicker color={color} onChange={colorPickerChangeEvent} />
      </LinearLayout>
    </ScreenLayout>
  )
}

export default CustomColorPage

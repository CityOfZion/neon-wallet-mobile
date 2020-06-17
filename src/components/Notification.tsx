import React, {useState} from 'react'
import {ButtonView, ImageView, LinearLayout, TextView} from '~src/styles/styled-components'
import styled from '~src/styles/styled-components'

interface NotificationProps {
  text: string
}

const Notification = (props: NotificationProps) => {
  const [seen, setSeen] = useState(false)

  if (seen) return null

  return (
    <NotificationBox
      orientation='verti'
      height={72}
      width='100%'
      py='8px'
      px='11px'
      bg='background.1'
      borderColor='primary'
    >
      <TextView color='text.2' fontSize='10px' mb='4px'>NOTIFICATION</TextView>
      <LinearLayout orientation='horiz'>
        <TextView color='text.0' fontSize='14px' lineHeight='14px' weight={1}>
          {props.text}
        </TextView>
        <ButtonView alignSelf='center' onPress={() => setSeen(true)}>
          <ImageView
            height={'9px'}
            width={'9px'}
            source={require('~src/assets/images/close.png')}
          />
        </ButtonView>
      </LinearLayout>
    </NotificationBox>
  )
}

const NotificationBox = styled(LinearLayout)`
  border-radius: 7px;
  border-left-width: 7px;
  shadow-color: #fff;
  shadow-offset: { width: 2, height: 6 };
  shadow-opacity: 0.39;
  shadow-radius: 8.3px;
  elevation: 7;
`

export default Notification

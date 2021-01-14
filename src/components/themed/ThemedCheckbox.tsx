import PropTypes from 'prop-types'
import React, {useState} from 'react'
import {NativeSyntheticEvent, NativeTouchEvent} from 'react-native'

import styled, {
  ImageView,
  LinearLayout,
  TextView,
} from '~src/styles/styled-components'

interface Props {
  onChange?: (
    checked: boolean,
    e: NativeSyntheticEvent<NativeTouchEvent>
  ) => void
  checked?: boolean
  label: string
  singleRow?: boolean
  labelStyle?: {
    color: string
    size: string | number
    numberOfLines: number
    marginHorizontal: number
    marginVertical: number
  }
}

const ThemedCheckbox: React.FC<Props> = (props) => {
  const [value, setValue] = useState<boolean>(props.checked ?? false)

  const onChangeEvent = (e: NativeSyntheticEvent<NativeTouchEvent>) => {
    setValue(!value)
    if (props.onChange) props.onChange(!value, e)
  }
  return (
    <CheckboxView style={{width: '90%'}} onPress={onChangeEvent}>
      <CheckboxContentView
        orientation={'horiz'}
        alignItems={'center'}
        width={'100%'}
      >
        <CheckboxBoxView
          orientation={'horiz'}
          justifyContent={'center'}
          alignItems={'center'}
          width={35}
          height={35}
          borderColor={'text.0'}
          mr={4}
        >
          {value && (
            <ImageView
              width={24}
              height={24}
              resizeMode={'contain'}
              source={require('~src/assets/images/icon-check-green.png')}
            />
          )}
        </CheckboxBoxView>

        <LabelView
          weight={props.singleRow ? 1 : undefined}
          color={props.labelStyle?.color ?? 'text.0'}
          fontSize={props.labelStyle?.size ?? 'lg'}
          fontFamily={'bold'}
          allowFontScaling={true}
          adjustsFontSizeToFit={true}
          numberOfLines={props.labelStyle?.numberOfLines ?? 3}
          style={{
            textAlign: 'left',
            marginVertical: props.labelStyle?.marginVertical ?? 0,
            marginHorizontal: props.labelStyle?.marginHorizontal ?? 0,
          }}
        >
          {props.label}
        </LabelView>
      </CheckboxContentView>
    </CheckboxView>
  )
}

ThemedCheckbox.propTypes = {
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  label: PropTypes.string.isRequired,
  singleRow: PropTypes.bool,
  labelStyle: PropTypes.any,
}

ThemedCheckbox.defaultProps = {
  checked: false,
  singleRow: false,
}

const CheckboxView = styled.TouchableOpacity`
  box-shadow: 0 -6px 6px rgba(255, 255, 255, 0.1);
  max-width: 100%;
`

const CheckboxContentView = styled(LinearLayout)``

const CheckboxBoxView = styled(LinearLayout)`
  border-width: 1px;
  border-style: solid;
  border-radius: 7px;
`

const LabelView = styled(TextView)`
  text-align: center;
`

export default ThemedCheckbox

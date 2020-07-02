import PropTypes from 'prop-types'
import React, {useState, useEffect} from 'react'
import {GestureResponderEvent, LayoutChangeEvent} from 'react-native'

import {FilterHelper} from '~src/helpers/FilterHelper'
import styled, {
  LinearLayout,
  RelativeLayout,
} from '~src/styles/styled-components'

interface Props {
  onChange?: (hex: string) => void
  color?: string
}

const ColorPicker: React.FC<Props> = (props) => {
  const [viewHeight, setViewHeight] = useState<number>(0)

  const [hueAngle, setHueAngle] = useState<number>(0)
  const [hueDistanceVariation, setHueDistanceVariation] = useState<number>(0)

  const [luminosityAngle, setLuminosityAngle] = useState<number>(180)

  const [hue, setHue] = useState<number>(0)
  const [saturation, setSaturation] = useState<number>(100)
  const [luminosity, setLuminosity] = useState<number>(50)

  useEffect(() => {
    if (props.color) {
      const [h, s, l] = FilterHelper.hexToHsl(props.color)
      let hue, saturation, luminosity

      if (s > 40 && Math.abs(l - 50) <= 30) {
        hue = h
        saturation = 100
        luminosity = 50

        setHue(hue)
        setSaturation(saturation)
        setLuminosity(luminosity)
      } else {
        hue = 200
        saturation = 20
        luminosity = l

        setHue(hue)
        setSaturation(saturation)
        setLuminosity(luminosity)
      }

      setHueAngle(normalizeAngle(-h))
      setLuminosityAngle(Math.abs(359 - (15 + (330 * l) / 100)))

      const hex = FilterHelper.hslToHex(hue, saturation, luminosity)
      if (props.onChange) props.onChange(hex)
    }
  }, [])

  const isColored = () => {
    return saturation > 25
  }

  const getHex = () => {
    return FilterHelper.hslToHex(hue, saturation, luminosity)
  }

  const getHueRadius = (includeDistanceVariation = true) => {
    const base = viewHeight * 0.035
    const hexVariation = Math.abs(Math.sin((hueAngle * Math.PI) / 60)) * base

    let radius = viewHeight * 0.345 - hexVariation

    if (includeDistanceVariation) {
      radius += hueDistanceVariation
    }

    return radius
  }

  const getHueSelectorRadius = () => {
    return viewHeight * 0.075
  }

  const getLuminosityRadius = () => {
    const base = viewHeight * 0.016
    const variation =
      Math.abs(Math.cos((luminosityAngle * Math.PI) / 60)) * base

    return viewHeight * 0.16 - variation
  }

  const getLuminositySelectorRadius = () => {
    return viewHeight * 0.05
  }

  const layoutEvent = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout
    setViewHeight(height)
  }

  const hueAreaEvent = (event: GestureResponderEvent) => {
    const angle = calculateHueAngle(event)
    setHueAngle(angle)
    setHueDistanceVariation(calculateHueDistanceVariation(event))

    const hue = normalizeAngle(-angle)
    const saturation = 100
    const luminosity = 50

    setHue(hue)
    setSaturation(saturation)
    setLuminosity(luminosity)

    const hex = FilterHelper.hslToHex(hue, saturation, luminosity)
    if (props.onChange) props.onChange(hex)

    return false
  }

  const calculateHueAngle = (event: GestureResponderEvent) => {
    const x = Math.round(event.nativeEvent.locationX - viewHeight * 0.445)
    const y = Math.round(event.nativeEvent.locationY - viewHeight * 0.49)

    return normalizeAngle((Math.atan2(-x, y) * 180) / Math.PI + 180)
  }

  const calculateHueDistanceVariation = (event: GestureResponderEvent) => {
    const x = Math.round(event.nativeEvent.locationX - viewHeight * 0.445)
    const y = Math.round(event.nativeEvent.locationY - viewHeight * 0.49)

    const distance = Math.round(Math.sqrt(x ** 2 + y ** 2))
    const radius = getHueRadius(false)

    const variation = Math.round(distance - radius)
    const limit = Math.round(viewHeight * 0.085 - getHueSelectorRadius() / 2)

    if (variation > limit) return limit
    if (variation < -limit) return -limit
    return variation
  }

  const luminosityAreaEvent = (event: GestureResponderEvent) => {
    const angle = Math.min(Math.max(calculateLuminosityAngle(event), 15), 345)

    setLuminosityAngle(angle)

    const hue = 200
    const saturation = 20
    const luminosity = normalizeLuminosity(angle)

    setHue(hue)
    setSaturation(saturation)
    setLuminosity(luminosity)

    const hex = FilterHelper.hslToHex(hue, saturation, luminosity)
    if (props.onChange) props.onChange(hex)

    return false
  }

  const calculateLuminosityAngle = (event: GestureResponderEvent) => {
    const x = Math.round(event.nativeEvent.locationX - viewHeight * 0.23)
    const y = Math.round(event.nativeEvent.locationY - viewHeight * 0.24)

    return normalizeAngle((Math.atan2(-x, y) * 180) / Math.PI + 90)
  }

  const normalizeAngle = (angleInDegree: number) => {
    let angle = Math.round(angleInDegree % 360)
    while (angle < 0) angle += 360
    return angle
  }

  const normalizeLuminosity = (luminosityAngle: number) => {
    const luminosity = (100 * (luminosityAngle - 15)) / 330
    return Math.abs(100 - Math.round(luminosity * 0.75))
  }

  const HueView = styled(LinearLayout)`
    top: ${viewHeight * 0.49 - getHueSelectorRadius() * 0.5}px;
    left: ${viewHeight * 0.445 - getHueSelectorRadius() * 0.5}px;
    transform: rotate(${hueAngle}deg);
  `

  const HueSelectorView = styled(LinearLayout)`
    border-radius: 9999px;
    box-shadow: 0 3px 2px rgba(0, 0, 0, 0.6);
    elevation: 8;
    border: solid white ${getHueSelectorRadius() * 0.1}px;
    background: ${getHex()};
    top: ${-getHueRadius()}px;
    width: ${getHueSelectorRadius()}px;
    height: ${getHueSelectorRadius()}px;
  `

  const LuminosityView = styled(LinearLayout)`
    top: ${viewHeight * 0.49 - getLuminositySelectorRadius() * 0.5}px;
    left: ${viewHeight * 0.445 - getLuminositySelectorRadius() * 0.5}px;
    transform: rotate(${luminosityAngle}deg);
  `

  const LuminositySelectorView = styled(LinearLayout)`
    border-radius: 9999px;
    box-shadow: 0 3px 2px rgba(0, 0, 0, 0.6);
    elevation: 8;
    border: solid white ${getLuminositySelectorRadius() * 0.1}px;
    background: ${getHex()};
    right: ${-getLuminosityRadius()}px;
    width: ${getLuminositySelectorRadius()}px;
    height: ${getLuminositySelectorRadius()}px;
  `

  return (
    <ColorPickerView
      onLayout={layoutEvent}
      maxWidth={'100%'}
      height={'100%'}
      style={{aspectRatio: 8 / 9}}
    >
      <ColorPickerContainer
        source={require('~src/assets/images/colorpicker-container.png')}
        resizeMode="contain"
      />

      <LuminosityView position={'absolute'}>
        {!isColored() && <LuminositySelectorView position={'relative'} />}
      </LuminosityView>

      <HueView position={'absolute'}>
        {isColored() && <HueSelectorView position={'relative'} />}
      </HueView>

      <HueAreaView
        position={'absolute'}
        onTouchStart={hueAreaEvent}
        onTouchMove={hueAreaEvent}
        pointerEvents={'box-only'}
      />

      <LuminosityAreaView
        position={'absolute'}
        onTouchStart={luminosityAreaEvent}
        onTouchMove={luminosityAreaEvent}
        pointerEvents={'box-only'}
      />
    </ColorPickerView>
  )
}

ColorPicker.propTypes = {
  onChange: PropTypes.func,
  color: PropTypes.string,
}

const ColorPickerView = styled(RelativeLayout)``

const LuminosityAreaView = styled(LinearLayout)`
  top: 30%;
  bottom: 31%;
  left: 28%;
  right: 28%;
  border-radius: 9999px;
`

const HueAreaView = styled(LinearLayout)`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 9999px;
`

const ColorPickerContainer = styled.ImageBackground`
  position: absolute;
  top: -15%;
  bottom: -15%;
  left: -10%;
  right: -12%;
`

export default ColorPicker

import React, { useState } from 'react'
import Map from './Map'
import Slider from './Slider'
import { Input } from 'antd'
import * as ColorUtils from '@/utils/ColorUtils'
import { transformPxToRem } from '@/utils/utils'
import {
  ColorPickerWrapper,
  ColorInputContent,
  HuaSliderWrapper,
  OpacitySliderWrapper,
  ColorInputWrapper
} from './color-picker.js'

const ColorPicker = (props) => {
  const [color, setColor] = useState(ColorUtils.parseToHsv(props.color))
  const [hue, saturation, value] = color
  const [colorString, setColorString] = useState(props.color)
  const [colorRGBA, setColorArray] = useState(ColorUtils.toHexRGBAArray(ColorUtils.parseToHsv(props.color)))

  const getAlpha = () => {
    return color[3] === undefined ? 1 : color[3]
  }

  const getBackgroundGradient = () => {
    const [h, s, v] = color
    const opaque = ColorUtils.toRgbString([h, s, v, 1])

    return `linear-gradient(to right, rgba(0,0,0,0) 0%, ${opaque} 100%)`
  }

  const getBackgroundHue = () => {
    return ColorUtils.toRgbString([color[0], 100, 100])
  }

  const handleAlphaChange = (alpha) => {
    const [h, s, v] = color
    update([h, s, v, alpha])
  }

  const handleHueChange = (hue) => {
    const [, s, v, a] = color
    update([hue, 100, 100, a])
  }

  const handleSaturationValueChange = (saturation, value) => {
    const [h, , , a] = color
    update([h, saturation, value, a])
  }

  const update = (color) => {
    setColor(color)
    setColorString(ColorUtils.toHexRGBString(color))
    setColorArray(ColorUtils.toHexRGBAArray(color))
    props.onChange(ColorUtils.toRgbString(color))
  }

  const handleColorStringChange = (e) => {
    if (!e.target.value || !e.target.value.length) {
      setColorString('#')
      return
    }

    if (e.target.value.length <= 7) {
      setColorString(e.target.value)
      e.target.value.length === 7 && update(ColorUtils.parseToHsv(e.target.value))
    }
  }

  const handleColorRGBChange = (e, type) => {
    if (type === 'HEX') {
      handleColorStringChange(e)
      return
    }
    let color
    type === 'R' && (color = [parseInt(e.target.value), colorRGBA[1], colorRGBA[2]])
    type === 'G' && (color = [colorRGBA[0], parseInt(e.target.value), colorRGBA[2]])
    type === 'B' && (color = [colorRGBA[0], colorRGBA[1], parseInt(e.target.value)])
    setColorArray(color)
    update(ColorUtils.parseToHsv(ColorUtils.getHexColorString(color)))
  }

  const initInputBox = (width, value, type) => {
    return (
      <ColorInputContent width={transformPxToRem(width)}>
        <Input
          style={{ width: transformPxToRem(width), height: '35px' }}
          className="ant-input-violet"
          value={value}
          onChange={(e) => handleColorRGBChange(e, type)}
        ></Input>
        <h5 style={{ textAlign: 'center' }}>{type}</h5>
      </ColorInputContent>
    )
  }
  return (
    <ColorPickerWrapper>
      <Map
        x={saturation}
        y={value}
        max={100}
        backgroundColor={getBackgroundHue()}
        onChange={handleSaturationValueChange}
      />

      <HuaSliderWrapper>
        <Slider vertical={false} value={hue} max={360} onChange={handleHueChange} />
      </HuaSliderWrapper>

      {/* <OpacitySliderWrapper>
        <Slider
          vertical={false}
          value={getAlpha()}
          max={1}
          background={getBackgroundGradient()}
          onChange={handleAlphaChange}
        />
      </OpacitySliderWrapper> */}

      <ColorInputWrapper>
        {initInputBox('100px', colorString, 'HEX')}
        {initInputBox('65px', colorRGBA[0], 'R')}
        {initInputBox('65px', colorRGBA[1], 'G')}
        {initInputBox('65px', colorRGBA[2], 'B')}
      </ColorInputWrapper>
    </ColorPickerWrapper>
  )
}

export default ColorPicker

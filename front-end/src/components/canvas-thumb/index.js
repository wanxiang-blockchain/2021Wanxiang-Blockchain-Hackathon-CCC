import React, { memo } from 'react'
import { pxToRealPx } from '@/utils/utils'

function CanvasThumb(props) {
  let canvasWidth = pxToRealPx(props.width)
  let multiple = Math.floor(canvasWidth / props.realWidth) || 1

  const initPixels = (r) => {
    if (r) {
      var context = r.getContext('2d')
      console.log(
        'Object.keys(props.newPixelInfo).length = ' +
          Object.keys(props.newPixelInfo).length +
          ' props.count ' +
          props.count
      )
      context.clearRect(0, 0, canvasWidth, canvasWidth)
      if (Object.keys(props.newPixelInfo).length) {
        for (let key in props.newPixelInfo) {
          let tmp = key.split('-')
          drawRect(context, parseInt(tmp[0]), parseInt(tmp[1]), props.newPixelInfo[key])
        }
      }
    }
  }

  const drawRect = (context, offsetX, offsetY, color) => {
    let positionX = offsetX * multiple + Math.floor((canvasWidth - multiple * props.realWidth) / 2)
    let positionY = offsetY * multiple + Math.floor((canvasWidth - multiple * props.realWidth) / 2)
    context.fillStyle = color
    context.fillRect(positionX, positionY, multiple, multiple)
  }

  return (
    <canvas
      width={canvasWidth}
      height={canvasWidth}
      ref={(r) => {
        initPixels(r)
      }}
    ></canvas>
  )
}

export default memo(CanvasThumb)

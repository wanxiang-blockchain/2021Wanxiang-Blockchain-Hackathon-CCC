import React, { memo, useEffect, useState } from 'react'
import * as ColorUtils from '@/utils/ColorUtils'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { getPixelInfoById } from '@/components/canvas-pixel/store/actions'
import { PixelInfoUpdate, ResetDrawPixel } from '@/message'
import PubSub from 'pubsub-js'
import { AloneCreate } from '@/constants'
import { CanvasPixelWrapper, PixelDetailWrapper } from './style'
import { getValueDivide8 } from '../../utils/utils'
import { message } from 'antd'
import Heatmap from 'heatmap.js'

let drawType
let mouseDown = false
let newPixelInfo = {}
let priceInfo = {}
let colorInfo = {}
function CanvasPixel(props) {
  const [timer, setTimer] = useState({})
  const [canvasElem, setCanvasElem] = useState(null)
  //const [newPixelInfo, setNewPixelInfo] = useState({})
  const [showColor, setShowColor] = useState(null)
  const [showInfo, setShowInfo] = useState(null)
  const [showRect, setShowRect] = useState(null)
  const canvasPrinId = props.prinId
  const [hMap, setHeatMap] = useState(null)

  let canvasWidth = props.width
  let multiple = Math.floor(canvasWidth / props.realWidth) || 1
  let emptyWidth = Math.floor((canvasWidth - multiple * props.realWidth) / 2)
  let curColor = props.color
  const DEFAULT_PRICE = 10000 //初始像素值
  const NEXT_MULTI = 1.3 //下一次绘制像素价格
  drawType = props.drawType

  const isAlone = () => {
    return props.type === AloneCreate
  }
  const dispatch = useDispatch()

  const { pixelInfo } = useSelector((state) => {
    let key = isAlone() ? `alonePixelInfo-${canvasPrinId}` : `multiPixelInfo-${canvasPrinId}`
    let pixelInfo = state.piexls && state.piexls.getIn([key])
    for (let key in priceInfo) {
      delete priceInfo[key]
      delete colorInfo[key]
    }
    if (pixelInfo) {
      for (let info of pixelInfo) {
        let pos = info[0].x + '-' + info[0].y
        priceInfo[pos] = parseFloat(info[1].price)
        colorInfo[pos] = ColorUtils.getColorString(info[1].color || info[1])
      }
    }
    return {
      pixelInfo: pixelInfo
    }
  }, shallowEqual)

  const initPixels = (r) => {
    let data = []
    let max = 1
    if (r) {
      var context = r.getContext('2d')
      if (pixelInfo) {
        for (let piexl of pixelInfo) {
          let pos = piexl[0]
          let color = piexl[1].color || piexl[1] //兼容alone画布
          if (piexl[1].price && props.modify) {
            let value = Math.ceil(Math.log10(getValueDivide8(piexl[1].price) * 10000) / Math.log10(1.3)) + 1
            data.push({
              x: parseInt(pos.x) * multiple + emptyWidth,
              y: parseInt(pos.y) * multiple + emptyWidth,
              value: value
            })
            if (value > max) {
              max = value
            }
          }
          drawRect(context, parseInt(pos.x), parseInt(pos.y), ColorUtils.getColorString(color))
        }
      }
      for (let key in newPixelInfo) {
        let tmp = key.split('-')
        drawRect(context, parseInt(tmp[0]), parseInt(tmp[1]), newPixelInfo[key])
      }
    }
    if (data.length && hMap && props.modify && !isAlone()) {
      hMap.setData({ max: max, data })
    }
  }

  const drawRect = (context, offsetX, offsetY, color) => {
    let positionX = offsetX * multiple + emptyWidth
    let positionY = offsetY * multiple + emptyWidth
    context.fillStyle = color
    context.fillRect(positionX, positionY, multiple, multiple)
  }

  useEffect(() => {
    var canvas = document.getElementById('canvas')
    initListener(canvas)
    if (props.modify && !isAlone()) {
      let map = Heatmap.create({
        container: document.getElementById('hotMap'),
        radius: 5,
        maxOpacity: 1,
        minOpacity: 1,
        gradient: {
          '.1': '#52c41a',
          '.4': '#ffff00',
          '.7': '#ff0000',
          '.85': '#bb0000',
          1: '#880000'
        }
      })
      setHeatMap(map)
    }
    const pixelUpdate = PubSub.subscribe(PixelInfoUpdate, pixelInfoUpdateFunc)
    const resetPixel = PubSub.subscribe(ResetDrawPixel, resetPixelInfoFunc)
    if (!pixelInfo || props.canvas) dispatch(getPixelInfoById(props.type, canvasPrinId))
    return () => {
      PubSub.unsubscribe(pixelUpdate)
      PubSub.unsubscribe(resetPixel)
      removeLister(canvasElem)
      timer && timer.timer && clearTimeout(timer.timer)
      for (let key in newPixelInfo) {
        delete newPixelInfo[key]
      }
      for (let key in priceInfo) {
        delete priceInfo[key]
        delete colorInfo[key]
      }
    }
  }, [dispatch])

  const pixelInfoUpdateFunc = (topic, info) => {
    if (info.type === props.type && info.prinId === canvasPrinId) {
      if (info.resetCanvas) {
        for (let key in newPixelInfo) {
          delete newPixelInfo[key]
        }
      }
      dispatch(getPixelInfoById(props.type, canvasPrinId))
    }
  }

  const resetPixelInfoFunc = (topic, info) => {
    if (info.type === props.type && info.prinId === canvasPrinId) {
      var canvas = document.getElementById('canvas')
      if (canvas && newPixelInfo) {
        var context = canvas.getContext('2d')
        for (let key in newPixelInfo) {
          let color = colorInfo && colorInfo[key]
          let tmp = key.split('-')
          if (color) {
            drawRect(context, tmp[0], tmp[1], color)
          } else {
            context.clearRect(tmp[0] * multiple + emptyWidth, tmp[1] * multiple + emptyWidth, multiple, multiple)
          }
          console.log('reset  ', tmp[0], tmp[1], ' color = ' + color)
          delete newPixelInfo[key]
        }
      }
    }
  }

  const initListener = (canvasElem) => {
    if (props.modify && canvasElem) {
      if (!isAlone()) {
        let hotmap = document.getElementById('hotMap')
        if (hotmap) {
          hotmap.addEventListener('mousemove', handleMouseMove)
          hotmap.addEventListener('mouseup', handleMouseUp)
          hotmap.addEventListener('mouseleave', handleMouseUp)
        }
      }
      canvasElem.addEventListener('mousedown', handleMouseDown)
      canvasElem.addEventListener('mousemove', handleMouseMove)
      canvasElem.addEventListener('mouseup', handleMouseUp)
      canvasElem.addEventListener('mouseleave', handleMouseUp)
    }
  }

  const removeLister = (canvasElem) => {
    if (props.modify && canvasElem) {
      timer && timer['timer'] && clearTimeout(timer['timer'])
      if (!isAlone()) {
        let hotmap = document.getElementById('hotMap')
        if (hotmap) {
          hotmap.removeEventListener('mousemove', handleMouseMove)
          hotmap.removeEventListener('mouseup', handleMouseUp)
          hotmap.removeEventListener('mouseleave', handleMouseUp)
        }
      }
      canvasElem.removeEventListener('mousedown', handleMouseDown)
      canvasElem.removeEventListener('mousemove', handleMouseMove)
      canvasElem.removeEventListener('mouseup', handleMouseUp)
      canvasElem.removeEventListener('mouseleave', handleMouseUp)
    }
  }
  const changeColor = (offsetX, offsetY, isdown = false) => {
    if (canvasElem) {
      var context = canvasElem.getContext('2d')
      let x = Math.floor((offsetX - emptyWidth) / multiple)
      let y = Math.floor((offsetY - emptyWidth) / multiple)
      let res = newPixelInfo[`${x}-${y}`]
      console.log('Object.keys(newPixelInfo).length ', Object.keys(newPixelInfo).length)
      if (!res && Object.keys(newPixelInfo).length >= 1000) {
        if (isdown) {
          message.info('You can only change up to 1000 pixels at a time')
        }
        return
      }
      if (x < props.realWidth && x >= 0 && y < props.realWidth && y >= 0) {
        drawRect(context, x, y, curColor)
        newPixelInfo[`${x}-${y}`] = curColor
        console.log('changeColor = ' + `${x}-${y}`)
        props.changeSelect && props.changeSelect(x, y, true)
      }
    }
  }

  const recoverColor = (offsetX, offsetY) => {
    if (canvasElem) {
      var context = canvasElem.getContext('2d')
      let x = Math.floor((offsetX - emptyWidth) / multiple)
      let y = Math.floor((offsetY - emptyWidth) / multiple)
      if (x < props.realWidth && x >= 0 && y < props.realWidth && y >= 0) {
        if (newPixelInfo[`${x}-${y}`]) {
          let color = colorInfo && colorInfo[`${x}-${y}`]
          if (color) {
            drawRect(context, x, y, color)
          } else {
            context.clearRect(x * multiple + emptyWidth, y * multiple + emptyWidth, multiple, multiple)
          }
          delete newPixelInfo[`${x}-${y}`]
          console.log('x = ' + `${x}-${y}`)
          props.changeSelect && props.changeSelect(x, y, false)
        }
      }
    }
  }

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e
    mouseDown = true
    if (curColor && drawType === 'draw') {
      changeColor(offsetX, offsetY, true)
    } else if (drawType === 'eraser') {
      recoverColor(offsetX, offsetY)
    }
  }

  const handleMouseMove = (e) => {
    if (mouseDown) {
      const { offsetX, offsetY } = e
      if (curColor && drawType === 'draw') {
        changeColor(offsetX, offsetY)
      } else if (drawType === 'eraser') {
        recoverColor(offsetX, offsetY)
      }
    } else {
      if (!pixelInfo) {
        return
      }
      const { offsetX, offsetY } = e
      if (showRect) {
        setShowColor(null)
        setShowInfo(null)
        setShowRect(null)
        return
      }

      timer && timer['timer'] && clearTimeout(timer['timer'])
      let temp = setTimeout(() => {
        if (!mouseDown) {
          let x = Math.floor((offsetX - emptyWidth) / multiple)
          let y = Math.floor((offsetY - emptyWidth) / multiple)
          for (let piexl of pixelInfo) {
            let pos = piexl[0]
            if (parseInt(pos.x) === x && parseInt(pos.y) === y) {
              let color = piexl[1].color || piexl[1]
              let price = getValueDivide8(piexl[1].price || DEFAULT_PRICE)
              setShowColor(ColorUtils.getColorString(color))
              setShowInfo(`${price} WICP, Coordinates:(${x},${y})`)
              let left, right, top, bottom
              offsetX < canvasWidth / 2
                ? (left = x * multiple + emptyWidth)
                : (right = canvasWidth - x * multiple - emptyWidth)
              offsetY < canvasWidth / 2
                ? (top = y * multiple + emptyWidth)
                : (bottom = canvasWidth - y * multiple - emptyWidth)
              setShowRect([left, top, right, bottom])
              console.log(' x= ' + x + ' y = ' + y)
              break
            }
          }
        }
      }, 1500)
      timer['timer'] = temp
    }
  }

  const calPrice = () => {
    let totalPrice = 0
    let count = Object.keys(newPixelInfo).length
    if (isAlone()) {
      totalPrice = Object.keys(newPixelInfo).length * (parseInt(props.canvasInfo.basePrice) || DEFAULT_PRICE)
    } else {
      for (let key in newPixelInfo) {
        let info = priceInfo && priceInfo[key]
        let price = parseInt(props.canvasInfo.basePrice) || DEFAULT_PRICE
        if (info) {
          price = (parseInt(props.canvasInfo.growRatio) / 100 || NEXT_MULTI) * info
        }
        totalPrice += price
      }
    }
    return [totalPrice, count]
  }

  const handleMouseUp = () => {
    timer && timer['timer'] && clearTimeout(timer['timer'])
    mouseDown = false
    if (props.color) {
      let [totalPrice, count] = calPrice()
      props.calPrice && props.calPrice(totalPrice, count)
    }
  }

  return (
    <CanvasPixelWrapper width={canvasWidth} height={canvasWidth}>
      <canvas
        id="canvas"
        className="canvas"
        width={canvasWidth}
        height={canvasWidth}
        ref={(r) => {
          removeLister(canvasElem)
          initListener(r)
          setCanvasElem(r)
          initPixels(r)
        }}
      ></canvas>
      {props.modify && !isAlone() && (
        <div
          id="hotMap"
          style={{ width: canvasWidth, height: canvasWidth, visibility: props.heatMapShow ? 'visible' : 'hidden' }}
        ></div>
      )}
      {showRect && showInfo && showColor && (
        <PixelDetailWrapper left={showRect[0]} top={showRect[1]} right={showRect[2]} bottom={showRect[3]}>
          <div className="color" style={{ backgroundColor: showColor }}></div>
          <div className="price">{showInfo}</div>
        </PixelDetailWrapper>
      )}
    </CanvasPixelWrapper>
  )
}

export default memo(CanvasPixel)

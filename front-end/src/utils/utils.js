/**
 * common function
 */
import { blobFromUint8Array, blobToHex } from '@dfinity/candid'
import crc32 from 'crc-32'
import { sha224 } from 'js-sha256'
import { css } from 'styled-components'
import BigNumber from 'bignumber.js'

const to32bits = (num) => {
  let b = new ArrayBuffer(4)
  new DataView(b).setUint32(0, num)
  return Array.from(new Uint8Array(b))
}
const principalToAccountId = function (principal, subaccount) {
  const shaObj = sha224.create()
  shaObj.update('\x0Aaccount-id')
  shaObj.update(principal.toUint8Array())
  shaObj.update(subaccount ? subaccount : new Uint8Array(32))
  const hash = new Uint8Array(shaObj.array())
  const crc = to32bits(crc32.buf(hash))
  const blob = blobFromUint8Array(new Uint8Array([...crc, ...hash]))
  return blobToHex(blob)
}

const deDuplicationArr = (arr) => {
  for (var i = 0; i < arr.length - 1; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i].tokenId == arr[j].tokenId) {
        arr.splice(j, 1)
        //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
        j--
      }
    }
  }
  return arr
}

const getSubAccountArray = (s) => {
  if (Array.isArray(s)) {
    return s.concat(Array(32 - s.length).fill(0))
  } else {
    //32 bit number only
    return Array(28)
      .fill(0)
      .concat(to32bits(s ? s : 0))
  }
}

const bignumberFormat = (num) => {
  return num.toFormat(1, { groupSeparator: '', decimalSeparator: '.' }).split('.')[0]
}

const bignumberToBigInt = (num) => {
  return BigInt(bignumberFormat(num))
}

const uint8arrayToBase64 = (buffer) => {
  // case 1
  // web image base64图片格式: "data:image/png;base64," + b64encoded;
  // return  "data:image/png;base64," + btoa(result);

  // var binary = ''
  // var bytes = new Uint8Array(buffer)
  // var len = bytes.byteLength
  // for (var i = 0; i < len; i++) {
  //   binary += String.fromCharCode(bytes[i])
  // }
  // return `data:image/png;base64,${window.btoa(binary)}`

  // case 2
  if (!buffer || !buffer.length) {
    return
  }
  try {
    let view = new Uint8Array(new ArrayBuffer(buffer.length))
    for (let i = 0; i < view.length; i++) {
      view[i] = buffer[i]
    }
    let dec = new TextDecoder('utf-8')
    let dataStr = dec.decode(view)
    return dataStr
  } catch (e) {
    console.log('uint8arrayToBase64 e:', e)
  }
}

const gData = {
  tokens: new Map(),
  pools: new Map(),
  userLiquidList: new Map(),
  pools__expires__: 0,
  tokens__expires__: 0,
  userLiquid__expires__: 0
}
const getData = () => {
  return gData
}

const Storage = {
  set(key, value) {
    if (window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  },
  get(key) {
    if (window.localStorage) {
      return JSON.parse(window.localStorage.getItem(key))
    }
  },
  remove(key) {
    if (window.localStorage) {
      window.localStorage.removeItem(key)
    }
  }
}

const getRemValue = (pxValue) => {
  const ratio = 18 // 根据项目配置比例的方式自行设定

  // 针对template literals
  if (Array.isArray(pxValue)) {
    pxValue = pxValue[0]
  }

  pxValue = parseInt(pxValue)
  return pxValue / ratio
}

const r = (pxValue) => {
  return getRemValue(pxValue) + 'rem'
}

const transformPxToRem = (style) => {
  // 避免处理了函数等情况
  if (typeof style !== 'string') {
    return style
  }

  return style.replace(/\d+px/gm, (matched) => {
    return r(matched)
  })
}

const pxToRealPx = (value) => {
  return parseInt(getRemValue(value) * 16) //html中没有设置font-size，默认1rem = 16px
}

const pxToRem = (strings, ...interpolations) => {
  let styles = css(strings, ...interpolations) // css是styled-components的一个helper
  styles = styles.map(transformPxToRem)

  // 模拟raw的调用
  return [[''], styles]
}

const fromatLeftTime = (lastUpdate) => {
  if (lastUpdate) {
    let now = new Date().getTime()
    let update = parseInt(new BigNumber(parseInt(lastUpdate || 0)).dividedBy(Math.pow(10, 6)))
    let delta = Math.round((update + 24 * 3600 * 1000 - now) / 1000)
    let hour = Math.floor(delta / 3600)
    let hourStr = ('0' + hour).slice(-2)
    let minuteStr = ('0' + (delta - hour * 3600)).slice(-2)
    return `${hourStr}:${minuteStr}`
  }
  return '00:00'
}

const getValueDivide8 = (num) => {
  let res = new BigNumber(parseInt(num || 0)).dividedBy(Math.pow(10, 8))
  return res.toFixed()
}

const getValueMultiplied8 = (num) => {
  let res = new BigNumber(parseFloat(num || 0)).multipliedBy(Math.pow(10, 8))
  return res
}

const formatDate = (time, fmt) => {
  let date = new Date(time)

  let now = new Date().getTime()
  let delta = Math.max(now - time, 0)
  if (delta < 60 * 1000) {
    //1 mintue
    return 'just now'
  } else if (delta < 60 * 60 * 1000) {
    //1 hour
    return `${Math.round(delta / 60 / 1000)} minutes ago`
  } else if (delta < 24 * 60 * 60 * 1000) {
    //24 hour
    return `${Math.round(delta / 3600 / 1000)} hours ago`
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'Y+': date.getFullYear(),
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
    }
  }
  return fmt
}

const padLeftZero = (str) => {
  return ('00' + str).substr(str.length)
}

const formatMinuteSecond = (time, exchange) => {
  let res = exchange ? parseInt(new BigNumber(parseInt(time || 0)).dividedBy(Math.pow(10, 6))) : time
  return formatDate(res, 'YY-MM-dd hh:mm')
}

const handleScrollTop = (el) => {
  el.scrollIntoView()
}

// custom scroll
/**
 * 动画垂直滚动到页面指定位置
 * @param { Number } currentY 当前位置
 * @param { Number } targetY 目标位置
 */
const scrollAnimation = (currentY, targetY) => {
  // 获取当前位置方法
  // const currentY = document.documentElement.scrollTop || document.body.scrollTop

  // 计算需要移动的距离
  let needScrollTop = targetY - currentY
  let _currentY = currentY
  setTimeout(() => {
    // 一次调用滑动帧数，每次调用会不一样
    const dist = Math.ceil(needScrollTop / 10)
    _currentY += dist
    window.scrollTo(_currentY, currentY)
    // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
    if (needScrollTop > 10 || needScrollTop < -10) {
      scrollAnimation(_currentY, targetY)
    } else {
      window.scrollTo(_currentY, targetY)
    }
  }, 1)
}

export {
  Storage,
  principalToAccountId,
  deDuplicationArr,
  getData,
  uint8arrayToBase64,
  getSubAccountArray,
  bignumberToBigInt,
  pxToRem,
  transformPxToRem,
  pxToRealPx,
  getRemValue,
  fromatLeftTime,
  getValueDivide8,
  formatMinuteSecond,
  getValueMultiplied8,
  handleScrollTop,
  scrollAnimation
}

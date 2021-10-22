import { CrowdUndoneCoverAvailableWrapper } from './style'
import React, { memo } from 'react'
import { CrowdCreate } from '@/constants'
import Edit from '@/assets/images/icons/edit.svg'
import CanvasPixel from '@/components/canvas-pixel'
import { getValueDivide8 } from '@/utils/utils'
import CountDown from '@/components/count-down'
import PubSub from 'pubsub-js'
import BigNumber from 'bignumber.js'
import { RefreshCrowdUndone } from '@/message'

// 首页未完成的众创画布
function CrowdUndone(props) {
  const { canvasInfo, highestInfo, canvasPrinId, finishTime } = props

  const handlerOnItemClick = () => {
    props.onItemClick && props.onItemClick()
  }

  const getEndTime = () => {
    let endTime = parseInt(new BigNumber(parseInt(finishTime || 0)).dividedBy(Math.pow(10, 6)))
    return endTime
  }

  const sliceToolongPrice = (str, length) => {
    if (str && str.length && str.length > length) {
      return str.slice(0, length)
    }
    return str
  }

  const endTimeFun = () => {
    //通知主页刷新
    PubSub.publish(RefreshCrowdUndone, {})
  }

  return (
    <CrowdUndoneCoverAvailableWrapper onClick={handlerOnItemClick}>
      <div className="pixel-wrapper">
        <CanvasPixel
          prinId={canvasPrinId}
          type={CrowdCreate}
          realWidth={200}
          realHeight={200}
          width={456}
          height={456}
          canvas={true}
        />
      </div>
      <div className="info-right">
        <div className="canvas-index">
          <span>{`#M-${canvasInfo.tokenIndex}`}</span>
          <span>
            <CountDown endTime={getEndTime()} endTimeFun={endTimeFun} />
          </span>
        </div>
        <ul>
          <li>
            <label>CID:</label>
            {canvasPrinId}
          </li>
          <li>
            <label>Total invested:</label>
            {`${getValueDivide8(canvasInfo.totalWorth)} WICP`}
          </li>
          <li>
            <label>Bonus to vest:</label>
            {`${getValueDivide8(canvasInfo.bonus)} WICP`}
          </li>
          <li>
            <label>Number of Updated Pixels:</label>
            {`${canvasInfo.changeTotal}`}
          </li>
          <li>
            <label>Number of Players:</label>
            {`${canvasInfo.paintersNum}`}
          </li>
          <li>
            <label>MVP (Most Valuable Pixel):</label>
            {` ${getValueDivide8(highestInfo.length ? highestInfo[0][1].curPrice : 0)} WICP, Coordinates:(${
              highestInfo.length ? highestInfo[0][0].x : 0
            },${highestInfo.length ? highestInfo[0][0].y : 0})`}
          </li>
        </ul>
        <div className="canvas-edit">
          <div className="price">{`${sliceToolongPrice(getValueDivide8(canvasInfo.totalWorth) + '', 12)} WICP`}</div>
          <div className="btn-edit">
            <img src={Edit} />
          </div>
        </div>
      </div>
    </CrowdUndoneCoverAvailableWrapper>
  )
}

export default memo(CrowdUndone)

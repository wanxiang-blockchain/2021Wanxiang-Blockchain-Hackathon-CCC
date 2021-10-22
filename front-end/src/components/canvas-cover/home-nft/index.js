import { HomeNFTCoverWrapper } from './style'
import React, { memo } from 'react'
import { AloneCreate } from '@/constants'
import CanvasPixel from '@/components/canvas-pixel'
import { getValueDivide8 } from '@/utils/utils'
import ButtonBuy from '@/assets/images/icons/home-buy.png'

// 首页挂在market的nft
function HomeNFT(props) {
  const { canvasInfo, type, canvasPrinId, listingInfo } = props
  const isAlone = () => {
    return type === AloneCreate
  }
  const handlerOnItemClick = () => {
    props.onItemClick && props.onItemClick()
  }

  return (
    <HomeNFTCoverWrapper onClick={handlerOnItemClick}>
      <div className="info-right">
        <div className="canvas-index">
          <span>{`${isAlone() ? '#A-' : '#M-'}${canvasInfo.tokenIndex}`}</span>
          <span>{`${canvasInfo.name}`}</span>
        </div>
        <div className="canvas-edit">
          <div className="price">{`${getValueDivide8(listingInfo.price)} WICP`}</div>
          <img className="nft-buy" src={ButtonBuy}></img>
        </div>
      </div>
      <div className="pixel-bg">
        <div className="pixel-wrapper">
          <CanvasPixel
            prinId={canvasPrinId}
            type={props.type}
            realWidth={props.type === AloneCreate ? 100 : 200}
            realHeight={props.type === AloneCreate ? 100 : 200}
            width={300}
            height={300}
          />
        </div>
      </div>
    </HomeNFTCoverWrapper>
  )
}

export default memo(HomeNFT)

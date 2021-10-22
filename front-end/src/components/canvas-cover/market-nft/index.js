import { NFTMarketCoverWrapper } from './style'
import React, { memo } from 'react'
import { AloneCreate } from '@/constants'
import CanvasPixel from '@/components/canvas-pixel'
import { getValueDivide8 } from '@/utils/utils'

// 钱包中的nft
function WalletNFT(props) {
  const { canvasInfo, type, canvasPrinId, listingInfo } = props
  const isAlone = () => {
    return type === AloneCreate
  }
  const handlerOnItemClick = () => {
    props.onItemClick && props.onItemClick()
  }

  return (
    <NFTMarketCoverWrapper onClick={handlerOnItemClick}>
      <div className="pixel-wrapper">
        <CanvasPixel
          prinId={canvasPrinId}
          type={props.type}
          realWidth={isAlone() ? 100 : 200}
          realHeight={isAlone() ? 100 : 200}
          width={300}
          height={300}
        />
      </div>
      <div className="detail">
        <div className="nft-index">{`${isAlone() ? '#A-' : '#M-'}${canvasInfo.tokenIndex}`}</div>
        <div className="canvas-worth">{`${getValueDivide8(listingInfo.price)} WICP`}</div>
      </div>
    </NFTMarketCoverWrapper>
  )
}

export default memo(WalletNFT)

import { NFTCoverWrapper } from './style'
import React, { memo } from 'react'
import { AloneCreate } from '@/constants'
import CanvasPixel from '@/components/canvas-pixel'
import { getValueDivide8 } from '@/utils/utils'
import { Button } from 'antd'

// 钱包中的nft
function WalletNFT(props) {
  const { canvasInfo, type, canvasPrinId, listingInfo } = props
  const isAlone = () => {
    return type === AloneCreate
  }
  const handlerOnButtonClick = () => {
    props.onButtonClick && props.onButtonClick()
  }

  return (
    <NFTCoverWrapper>
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
        <div className="nfo_content">
          <div className="nft-index">{`Number:${isAlone() ? '#A-' : '#M-'}${canvasInfo.tokenIndex}`}</div>
          {listingInfo && listingInfo.seller && (
            <div className="nft-price">{`${getValueDivide8(listingInfo.price)} WICP`}</div>
          )}
        </div>
        <Button className="nft-manage" type="violet" onClick={handlerOnButtonClick}>
          {listingInfo && listingInfo.seller ? 'Cancel' : 'Sell'}
        </Button>
      </div>
    </NFTCoverWrapper>
  )
}

export default memo(WalletNFT)

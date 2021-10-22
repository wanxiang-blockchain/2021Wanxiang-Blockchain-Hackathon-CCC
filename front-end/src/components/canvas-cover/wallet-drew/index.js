import { WalletDrewCoverWrapper } from './style'
import React, { memo } from 'react'
import { AloneCreate } from '@/constants'
import CanvasPixel from '@/components/canvas-pixel'
import { getValueDivide8 } from '@/utils/utils'
import { Button } from 'antd'

// 市场中的drew
function WalletDrew(props) {
  const { canvasInfo, type, canvasPrinId, listingInfo } = props
  const isAlone = () => {
    return type === AloneCreate
  }
  const handlerOnItemClick = () => {
    props.onItemClick && props.onItemClick()
  }

  return (
    <WalletDrewCoverWrapper onClick={handlerOnItemClick}>
      <div className="pixel-wrapper">
        <CanvasPixel
          prinId={canvasPrinId}
          type={props.type}
          realWidth={isAlone() ? 100 : 200}
          realHeight={isAlone() ? 100 : 200}
          width={300}
          height={300}
          canvas={true}
        />
      </div>
      <div className="footer-wrapper">
        <div className="text">
          <div className="name">{`${isAlone() ? '#A-' : '#M-'}${canvasInfo.tokenIndex}`}</div>
          <div className="worth">
            Total invested:<span>{`${getValueDivide8(canvasInfo.totalWorth)} WICP`}</span>
          </div>
        </div>

        <div className="btn">
          <Button className="nft-buy" type="violet" disabled={canvasInfo.isNFTOver}>
            Go on
          </Button>
        </div>
      </div>
    </WalletDrewCoverWrapper>
  )
}

export default memo(WalletDrew)

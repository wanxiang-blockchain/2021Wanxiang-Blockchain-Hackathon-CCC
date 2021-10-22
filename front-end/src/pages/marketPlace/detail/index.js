import React, { memo, useState, useEffect } from 'react'
import { Button, message } from 'antd'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { AloneCreate, CrowdCreate } from '@/constants'
import CanvasPixel from '@/components/canvas-pixel'
import { getValueDivide8 } from '@/utils/utils'
import ConfirmModal from '@/components/confirm-modal'
import Toast from '@/components/toast'
import Description from '@/assets/images/market/description.png'
import Detail from '@/assets/images/market/detail.png'
import {
  getCanvasInfoById,
  getNFTListingInfoByType,
  getHighestInfoById,
  getNFTOwnerByIndex
} from '@/pages/home/store/actions'
import { factoryBuyNow, requestCanister, setFavorite } from '@/api/handler'
import { MarketDetailWrapper, MarketDetailLeft, MarketDetailRight, MarketDetailBlock } from './style'

// canvas缩略图组件
function MarketDetail(props) {
  const params = props.match.params
  // canvas index
  const tokenIndex = parseInt(params.index)
  const type = params.type
  // id,cansiterid
  const canvasPrinId = params.prinId
  const [buyVisible, setBuyVisible] = useState(false)

  const dispatch = useDispatch()
  const isAlone = () => {
    return type === AloneCreate
  }
  const { canvasInfo, listingInfo, highestInfo, isAuth, authToken, owner } = useSelector((state) => {
    let isAuth = state.auth.getIn(['isAuth']) || false
    let authToken = state.auth.getIn(['authToken']) || ''
    let key1 = isAlone() ? `aloneInfo-${canvasPrinId}` : `multiInfo-${canvasPrinId}`
    let canvasInfo = (state.allcavans && state.allcavans.getIn([key1])) || {}
    let key2 = isAlone() ? `aloneNFTInfo-${tokenIndex}` : `multiNFTInfo-${tokenIndex}`
    let listingInfo = (state.allcavans && state.allcavans.getIn([key2])) || {}
    let key3 = isAlone() ? `aloneNFTOwner-${tokenIndex}` : `multiNFTOwner-${tokenIndex}`
    let owner = (state.allcavans && state.allcavans.getIn([key3])) || ''
    let highestInfo = []
    if (!isAlone()) {
      highestInfo = (state.allcavans && state.allcavans.getIn([`multiPriceHighestInfo-${canvasPrinId}`])) || []
    }
    return {
      canvasInfo: canvasInfo,
      listingInfo: listingInfo,
      highestInfo: highestInfo,
      owner: owner,
      isAuth: isAuth,
      authToken: authToken
    }
  }, shallowEqual)

  // other hooks
  useEffect(() => {
    //获取画布的相关信息：name、desc等
    if (canvasInfo.tokenIndex === undefined) dispatch(getCanvasInfoById(type, canvasPrinId))
    dispatch(getNFTListingInfoByType(type, tokenIndex))
    //获取最高价格的像素点
    if (type === CrowdCreate && !highestInfo.length) {
      dispatch(getHighestInfoById(canvasPrinId))
    }
    dispatch(getNFTOwnerByIndex(type, tokenIndex))
    //事件信息绑定
  }, [dispatch])

  const handlerClose = () => {
    setBuyVisible(false)
  }

  const handlerBuy = async () => {
    let notice = Toast.loading('buy ...', 0)
    let data = {
      tokenIndex: BigInt(tokenIndex),
      type: type,
      success: (res) => {
        console.debug('marketplace handlerListing res:', res)
        if (res) {
          handlerClose()
          history.back()
        }
      },
      fail: (error) => {
        console.error('marketplace handlerListing fail:', error)
        dispatch(getNFTListingInfoByType(type, tokenIndex))
        handlerClose()
        message.error(error)
      },
      notice: notice
    }
    await requestCanister(factoryBuyNow, data)
  }

  const onFavoriteClick = (info, type) => {
    if (!isAuth) {
      message.error('Please sign in first')
      return
    }

    let notice = Toast.loading('set favoriting...', 0)
    let data = {
      type: type,
      tokenIndex: info.tokenIndex,
      prinId: info.prinId,
      success: (res) => {},
      fail: (error) => {
        message.error(error)
      },
      notice: notice
    }
    requestCanister(setFavorite, data)
  }

  const onClickBuy = () => {
    if (!isAuth) {
      message.error('Please sign in first')
      return
    }
    if (listingInfo.seller.toText() === authToken) {
      message.error(
        'Are you kidding me? You are selling this NFT as the owner. You can cancel it in your Wallet if you want. '
      )
      return
    }
    setBuyVisible(true)
  }

  return (
    <MarketDetailWrapper>
      <MarketDetailLeft>
        <div className="canvas-pixel">
          <CanvasPixel
            prinId={canvasPrinId}
            type={type}
            realWidth={type === AloneCreate ? 100 : 200}
            realHeight={type === AloneCreate ? 100 : 200}
            width={600}
            height={600}
          />
        </div>
      </MarketDetailLeft>
      <MarketDetailRight>
        <div className="title"> {`${isAlone() ? '#A-' : '#M-'}${canvasInfo.tokenIndex}`}</div>
        <div className="owner">
          <div>{`Owned by `}</div>
          <div className="seller">{`${owner}`}</div>
        </div>
        <MarketDetailBlock height={220} marginTop={20}>
          <div className="priceTip">Current price</div>
          <div className="priceValue">{`${getValueDivide8(listingInfo.price)} WICP`}</div>

          <Button type="violet buy" onClick={onClickBuy} disabled={!listingInfo.price}>
            Buy now
          </Button>
        </MarketDetailBlock>

        <MarketDetailBlock height={83} marginTop={7}>
          <div className="titleLayout">
            <img src={Detail}></img>
            <div className="titleValue">Detail</div>
          </div>
        </MarketDetailBlock>
        <MarketDetailBlock height={270} marginTop={1}>
          <div className="contentValue">
            Name:
            <span style={{ color: '#4338ca' }}>{` ${canvasInfo.name}`}</span>
          </div>
          <div className="contentValue">
            Description:
            <span style={{ color: '#4338ca' }}>{` ${canvasInfo.desc}`}</span>
          </div>
          <div className="contentValue">
            Total invested:
            <span style={{ color: '#4338ca' }}>{`${getValueDivide8(canvasInfo.totalWorth)} WICP`}</span>
          </div>
          {!isAlone() && (
            <div>
              <div className="contentValue">
                Number of Updated Pixels:
                <span style={{ color: '#4338ca' }}>{` ${canvasInfo.changeTotal}`}</span>
              </div>
              <div className="contentValue">
                Number of Players:
                <span style={{ color: '#4338ca' }}>{` ${canvasInfo.paintersNum || 1}`}</span>
              </div>
              <div className="contentValue">
                MVP (Most Valuable Pixel):
                <span style={{ color: '#4338ca' }}>{` ${getValueDivide8(
                  highestInfo.length ? highestInfo[0][1].curPrice : 0.0001
                )} WICP, Coordinates:${highestInfo.length ? highestInfo[0][0].x : 0},${
                  highestInfo.length ? highestInfo[0][0].y : 0
                }`}</span>
              </div>
            </div>
          )}
        </MarketDetailBlock>
      </MarketDetailRight>
      <ConfirmModal
        title={'Buy'}
        width={328}
        onModalClose={handlerClose}
        onModalConfirm={handlerBuy}
        modalVisible={buyVisible}
      ></ConfirmModal>
    </MarketDetailWrapper>
  )
}

export default memo(MarketDetail)

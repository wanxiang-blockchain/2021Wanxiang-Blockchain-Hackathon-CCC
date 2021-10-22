import React, { memo, useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { AloneCreate, CrowdCreate } from '@/constants'
import {
  getCanvasInfoById,
  getNFTListingInfoByType,
  getHighestInfoById,
  getFinshedTimeById
} from '@/pages/home/store/actions'
import CrowdUndone from './crowd-undone'
import WalletNFT from './wallet-nft'
import MarketNFT from './market-nft'
import WalletDrew from './wallet-drew'
import HomeNFT from './home-nft'
import { ListingUpdate } from '@/message'
import PubSub from 'pubsub-js'

// canvas缩略图组件
function CavansCover(props) {
  const { info, type, itemIndex } = props
  // canvas index
  const tokenIndex = (info && info[0]) || 0

  // id,cansiterid
  const canvasPrinId = (info && info[1].toText()) || ''

  const dispatch = useDispatch()
  const isAlone = () => {
    return props.type === AloneCreate
  }
  const { canvasInfo, listingInfo, highestInfo, finishTime } = useSelector((state) => {
    let key1 = isAlone() ? `aloneInfo-${canvasPrinId}` : `multiInfo-${canvasPrinId}`
    let canvasInfo = (state.allcavans && state.allcavans.getIn([key1])) || {}
    let key3 = isAlone() ? `aloneNFTInfo-${tokenIndex}` : `multiNFTInfo-${tokenIndex}`
    let listingInfo = props.thumbType != 'crowdUndone' ? (state.allcavans && state.allcavans.getIn([key3])) || {} : {}
    let highestInfo = []
    if (!isAlone()) {
      highestInfo = (state.allcavans && state.allcavans.getIn([`multiPriceHighestInfo-${canvasPrinId}`])) || []
    }
    let finishTime =
      props.thumbType === 'crowdUndone'
        ? (state.allcavans && state.allcavans.getIn([`multiFinishTime-${canvasPrinId}`])) || 0
        : 0
    return {
      canvasInfo: canvasInfo,
      listingInfo: listingInfo,
      highestInfo: highestInfo,
      finishTime: finishTime
    }
  }, shallowEqual)

  // other hooks
  useEffect(() => {
    //获取画布的相关信息：name、desc等
    dispatch(getCanvasInfoById(props.type, canvasPrinId))
    //获取nft是否挂单的信息
    if (props.thumbType != 'crowdUndone') {
      dispatch(getNFTListingInfoByType(props.type, tokenIndex))
    } else {
      dispatch(getFinshedTimeById(canvasPrinId))
    }
    //获取最高价格的像素点
    if (props.type === CrowdCreate) {
      dispatch(getHighestInfoById(canvasPrinId))
    }
    //事件信息绑定

    const listUpdate = PubSub.subscribe(ListingUpdate, listingUpdateFunc)
    return () => {
      PubSub.unsubscribe(listUpdate)
    }
  }, [dispatch])

  const listingUpdateFunc = (topic, info) => {
    if (info.type === props.type && info.tokenIndex === tokenIndex) {
      if (props.thumbType != 'crowdUndone') {
        dispatch(getNFTListingInfoByType(props.type, tokenIndex))
      }
    }
  }

  const handlerOnItemClick = () => {
    props.onItemClick &&
      props.onItemClick({ prinId: canvasPrinId, canvasInfo: canvasInfo }, props.type, props.thumbType)
  }

  const handlerOnButtonClick = (e) => {
    props.onButtonClick &&
      props.onButtonClick(
        { prinId: canvasPrinId, canvasInfo: canvasInfo, tokenIndex: tokenIndex, listingInfo: listingInfo },
        props.type
      )
  }

  const getContentItem = (thumbType) => {
    const { isNFTOver } = canvasInfo
    let content
    thumbType === 'crowdUndone' &&
      (content = (
        <CrowdUndone
          canvasPrinId={canvasPrinId}
          canvasInfo={canvasInfo}
          highestInfo={highestInfo}
          listingInfo={listingInfo}
          finishTime={finishTime}
          type={type}
          thumbType={thumbType}
          onItemClick={handlerOnItemClick}
        />
      ))
    thumbType === 'wallet-nft' &&
      (content = (
        <WalletNFT
          canvasPrinId={canvasPrinId}
          canvasInfo={canvasInfo}
          highestInfo={highestInfo}
          listingInfo={listingInfo}
          type={type}
          thumbType={thumbType}
          onButtonClick={handlerOnButtonClick}
        />
      ))
    thumbType === 'home-nft' &&
      (content = (
        <HomeNFT
          canvasPrinId={canvasPrinId}
          canvasInfo={canvasInfo}
          highestInfo={highestInfo}
          listingInfo={listingInfo}
          type={type}
          thumbType={thumbType}
          onItemClick={handlerOnItemClick}
        />
      ))
    thumbType === 'market-nft' &&
      (content = (
        <MarketNFT
          canvasPrinId={canvasPrinId}
          canvasInfo={canvasInfo}
          highestInfo={highestInfo}
          listingInfo={listingInfo}
          type={type}
          thumbType={thumbType}
          onItemClick={handlerOnItemClick}
        />
      ))
    thumbType === 'drew' &&
      (content = (
        <WalletDrew
          canvasPrinId={canvasPrinId}
          canvasInfo={canvasInfo}
          highestInfo={highestInfo}
          listingInfo={listingInfo}
          type={type}
          thumbType={thumbType}
          onItemClick={handlerOnItemClick}
        />
      ))
    return content || <div />
  }
  return getContentItem(props.thumbType)
}

export default memo(CavansCover)

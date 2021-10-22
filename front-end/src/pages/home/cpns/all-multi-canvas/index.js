import React, { memo, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { message } from 'antd'
import { MultiListWrapper, MultiContentWrapper } from './style'
import { getAllUndoneCanvasAction, getMarketNFTByType } from '@/pages/home/store/actions'
import CavansCover from '@/components/canvas-cover'
import { AloneCreate, CrowdCreate } from '@/constants'
import { NavLink } from 'react-router-dom'
import { createHashHistory } from 'history'
import { RefreshCrowdUndone } from '@/message'

export default memo(function AllMultiUndone(props) {
  const dispatch = useDispatch()
  const history = useHistory()
  const [type, setType] = useState(null)
  const [curCanvasId, setCurCanvasId] = useState(null)
  const [curCanvasInfo, setCurCanvasInfo] = useState(null)

  const { multiUndone, isAuth, multiMarket, aloneMarket } = useSelector((state) => {
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      multiUndone: (state.allcavans && state.allcavans.getIn(['multiUndone'])) || [],
      multiMarket: (state.allcavans && state.allcavans.getIn(['multiMarket'])) || [],
      aloneMarket: (state.allcavans && state.allcavans.getIn(['aloneMarket'])) || []
    }
  }, shallowEqual)

  // other hooks
  useEffect(() => {
    dispatch(getAllUndoneCanvasAction(CrowdCreate))
    if (!props.onlyMultiCanvas) {
      dispatch(getMarketNFTByType(CrowdCreate))
      dispatch(getMarketNFTByType(AloneCreate))
    }
    const undoneListUpdate = PubSub.subscribe(RefreshCrowdUndone, undoneListUpdateFunc)
    return () => {
      PubSub.unsubscribe(undoneListUpdate)
    }
  }, [dispatch])

  const undoneListUpdateFunc = (topic, info) => {
    dispatch(getAllUndoneCanvasAction(CrowdCreate))
  }

  const onItemClick = (info, type, thumbType) => {
    if (thumbType === 'crowdUndone') {
      if (!isAuth) {
        message.error('Please sign in first')
        return
      }
      setType(type)
      setCurCanvasInfo(info.canvasInfo)
      setCurCanvasId(info.prinId)

      // jump '/canvas'
      history.push(`/canvas/${type}/${info.prinId}`)
    } else {
      let history = createHashHistory()
      history.push(`/detail/${type}/${info.canvasInfo.tokenIndex}/${info.prinId}`)
    }
  }

  const marketContent = () => {
    let res = []
    if (multiMarket) {
      let list = multiMarket.slice(0, Math.min(multiMarket.length, 6))
      let multi =
        list &&
        list.map((item) => {
          return (
            <CavansCover
              key={item.baseInfo[1].toText()}
              type={item.nftType}
              info={item.baseInfo}
              thumbType={'home-nft'}
              className="multi-list"
              onItemClick={onItemClick}
            ></CavansCover>
          )
        })
      res.push(...multi)
    }
    if (res.length < 6 && aloneMarket) {
      let list = aloneMarket.slice(0, Math.min(aloneMarket.length, 6 - res.length))
      let alone =
        list &&
        list.map((item) => {
          return (
            <CavansCover
              key={item.baseInfo[1].toText()}
              type={item.nftType}
              info={item.baseInfo}
              thumbType={'home-nft'}
              className="multi-list"
              onItemClick={onItemClick}
            ></CavansCover>
          )
        })
      res.push(...alone)
    }
    return res
  }

  return props.onlyMultiCanvas ? (
    <MultiListWrapper>
      <div className="multi-list">
        {multiUndone &&
          multiUndone.slice(0, 1).map((item) => {
            return (
              <CavansCover
                key={item[0]}
                type={CrowdCreate}
                thumbType={'crowdUndone'}
                info={item}
                className="multi-list"
                onItemClick={onItemClick}
              ></CavansCover>
            )
          })}
      </div>
    </MultiListWrapper>
  ) : (
    <MultiContentWrapper>
      {multiUndone && multiUndone.length > 0 && (
        <MultiListWrapper>
          <div className="title">Canvases Available for Painting</div>
          <div className="multi-list">
            {multiUndone &&
              multiUndone.slice(0, 1).map((item) => {
                return (
                  <CavansCover
                    key={item[0]}
                    type={CrowdCreate}
                    thumbType={'crowdUndone'}
                    info={item}
                    className="multi-list"
                    onItemClick={onItemClick}
                  ></CavansCover>
                )
              })}
          </div>
        </MultiListWrapper>
      )}
      {((multiMarket && multiMarket.length > 0) || (aloneMarket && aloneMarket.length > 0)) && (
        <MultiListWrapper>
          <div className="aloneBg">
            <div className="title">NFT MarketPlace</div>
            <div className="market-list">{marketContent()}</div>
            <div className="more">
              <NavLink to={'marketplace'}>{'More >>'}</NavLink>
            </div>
          </div>
        </MultiListWrapper>
      )}
    </MultiContentWrapper>
  )
})

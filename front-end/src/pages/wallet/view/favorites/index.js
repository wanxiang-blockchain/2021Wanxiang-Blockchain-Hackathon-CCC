import React, { memo, useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { getAllUndoneCanvasAction } from '@/pages/home/store/actions'
import { message } from 'antd'
import { requestCanister, getFavorite } from '@/api/handler'
import { DrewWrapper, DrewHeader, DrewList } from './style'

import CavansCover from '@/components/canvas-cover'
import { AloneCreate, CrowdCreate } from '@/constants'
import ComingSoon from '@/assets/images/coming_soon.png'
function Favorites(props) {
  const [drew, setdrew] = useState([])
  // const [type, setType] = useState(null)

  const dispatch = useDispatch()
  const isAuth = useSelector((state) => state.auth && state.auth.get('isAuth'), shallowEqual)

  // get drew data
  const fetchFavoriteData = async () => {
    let data = {
      success: (res) => {
        console.debug('fetchFavoriteData res:', res)
        // if (res) {
        //   let arr = []
        //   res.map((item) => {
        //     const { index, canisterId } = item
        //     arr.push({ index: parseFloat(index), canisterId })
        //   })
        //   setdrew(arr)
        // }
      },
      fail: (error) => {
        console.error('fetchFavoriteData fail:', error)
        message.error(error)
      }
    }
    await requestCanister(getFavorite, data)
  }

  const onItemClick = useCallback((info, type) => {
    setType(type)
    setCurCanvasInfo(info.canvasInfo)
    setCurCanvasId(info.prinId)
  }, [])

  // useEffect(() => {
  //   console.log('isAuth: ', isAuth)
  //   fetchFavoriteData()
  //   dispatch(getAllUndoneCanvasAction(AloneCreate))
  // }, [isAuth])

  return (
    <DrewWrapper>
      <img src={ComingSoon}></img>
      {/* <DrewHeader>
      </DrewHeader>
      <DrewList>
        {drew &&
          drew.map((item) => {
            return (
              <CavansCover
                info={[item.index, item.canisterId]}
                type={CrowdCreate}
                thumbType={''}
                key={item.index}
              />
            )
          })}
      </DrewList> */}
    </DrewWrapper>
  )
}
export default memo(Favorites)

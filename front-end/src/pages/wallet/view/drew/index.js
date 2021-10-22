import React, { memo, useState, useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getAllUndoneCanvasAction } from '@/pages/home/store/actions'
import { message } from 'antd'
import { requestCanister, getParticipate } from '@/api/handler'
import { DrewWrapper, DrewList } from './style'

import CavansCover from '@/components/canvas-cover'
import { AloneCreate, CrowdCreate } from '@/constants'

function Drew() {
  const [drew, setDrew] = useState([])
  // console.debug('finished bonus res:', drew)
  const history = useHistory()
  const dispatch = useDispatch()
  const { isAuth, aloneUndone } = useSelector((state) => {
    return {
      isAuth: state.auth && state.auth.get('isAuth'),
      aloneUndone: (state.allcavans && state.allcavans.getIn(['aloneUndone'])) || []
    }
  }, shallowEqual)

  // get drew data
  const fetchDrewData = async () => {
    console.time('fetchDrewData')
    let data = {
      success: async (res) => {
        console.timeEnd('fetchDrewData')
        console.debug('fetchDrewData res:', res)
        if (res) {
          setDrew(res)
        }
      },
      fail: (error) => {
        console.error('fetchDrewData fail:', error)
        message.error(error)
      }
    }
    await requestCanister(getParticipate, data)
  }

  // jump detail
  const onItemClick = (info, type) => {
    if (info.canvasInfo.isNFTOver) {
      history.push(`/detail/${type}/${info.canvasInfo.tokenIndex}/${info.prinId}`)
    } else {
      history.push(`/canvas/${type}/${info.prinId}`)
    }
  }

  useEffect(() => {
    dispatch(getAllUndoneCanvasAction(AloneCreate))
    fetchDrewData()
  }, [isAuth, status])
  return (
    <DrewWrapper>
      {/* <DrewHeader>
        <Radio.Group defaultValue={status} buttonStyle="solid" onChange={onChangeRadio}>
          <Radio.Button value="finished">Drew</Radio.Button>
          <Radio.Button value="unfinished">Unfinished work</Radio.Button>
        </Radio.Group>
      </DrewHeader> */}
      <DrewList>
        {drew &&
          drew.map((item, idx) => {
            const { index, canisterId } = item
            return (
              <CavansCover
                itemIndex={idx}
                info={[index, canisterId]}
                type={CrowdCreate}
                thumbType={'drew'}
                key={item.index}
                onItemClick={onItemClick}
              />
            )
          })}
        {aloneUndone &&
          aloneUndone.map((item) => {
            return (
              <CavansCover key={item[0]} type={AloneCreate} info={item} thumbType={'drew'} onItemClick={onItemClick} />
            )
          })}
      </DrewList>
    </DrewWrapper>
  )
}
export default memo(Drew)

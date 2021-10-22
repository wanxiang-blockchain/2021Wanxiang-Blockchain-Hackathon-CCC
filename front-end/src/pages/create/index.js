import React, { useState, memo } from 'react'
import { Input, message } from 'antd'
import { shallowEqual, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { CreateWrapper, CreateContentWrapper, CreateItemWrapper, CreateBgWrapper } from './style'
import createBg from '@/assets/images/create_bg.png'
import alone from '@/assets/images/create/alone.png'
import aloneCover from '@/assets/images/create/alone_cover.png'
import multi from '@/assets/images/create/multi.png'
import multiCover from '@/assets/images/create/multi_cover.png'

import ConfirmModal from '@/components/confirm-modal'
import { mintPixelCanvas, requestCanister, getAllUndoneCanvas } from '@/api/handler'
import { AloneCreate, CrowdCreate } from '@/constants'
import Toast from '@/components/toast'

function Create(props) {
  const [createType, setCreateType] = useState('')
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [canvasName, setCanvasName] = useState('')
  const [canvasDescrible, setCanvasDescrible] = useState('')
  const [confrimVisible, setConfirmVisible] = useState(false)

  const history = useHistory()

  const { isAuth } = useSelector(
    (state) => ({
      isAuth: state.auth.getIn(['isAuth']) || false
    }),
    shallowEqual
  )

  const createCancel = () => {
    setCreateModalVisible(false)
  }

  const showConfirmModal = () => {
    if (!canvasName || !canvasDescrible) {
      message.error('empty')
      return
    }
    setConfirmVisible(true)
  }

  const createConfirm = async () => {
    setConfirmVisible(false)
    let notice = Toast.loading('creating...', 0)
    let data = {
      type: createType,
      description: canvasDescrible,
      name: canvasName,
      success: (response) => {
        if (response && response.ok) {
          let canvasView = response.ok
          let txtId = canvasView.canisterId.toText()
          createCancel()
          history.push(`/canvas/${createType}/${txtId}`)
        }
      },
      fail: (error) => {
        message.error(error)
      },
      notice: notice
    }
    requestCanister(mintPixelCanvas, data)
  }

  const handleChangeInput = (e, type) => {
    if (type === 1 && e.target.value.length > 20) {
      return
    }
    if (type === 2 && e.target.value.length > 100) {
      return
    }
    type === 1 && setCanvasName(e.target.value)
    type === 2 && setCanvasDescrible(e.target.value)
  }

  const createCanvas = (type) => {
    if (!isAuth) {
      message.error('Please sign in first')
      return
    }
    if (type === CrowdCreate) {
      //let notice = Toast.loading('querying...', 0)//这个查询速度过快
      let data = {
        type: type,
        success: (res) => {
          if (res && res.length) {
            let txtId = res[0][1].toText()
            history.push(`/canvas/${type}/${txtId}`)
          } else {
            setCanvasName('')
            setCanvasDescrible('')
            setCreateType(type)
            setCreateModalVisible(true)
          }
        },
        fail: (error) => {
          message.error(error)
        }
        //notice: notice
      }
      requestCanister(getAllUndoneCanvas, data)
    } else {
      message.info('Coming Soon')
      return
      setCanvasName('')
      setCanvasDescrible('')
      setCreateType(type)
      setCreateModalVisible(true)
    }
  }

  return (
    <CreateWrapper>
      {/* 主体内容 */}
      <CreateBgWrapper src={createBg}></CreateBgWrapper>
      <CreateContentWrapper>
        <CreateContentWrapper>
          <CreateItemWrapper
            itemBg={multi}
            itemCover={multiCover}
            onClick={() => {
              createCanvas(CrowdCreate)
            }}
          >
            <div className="cover"></div>
            <div className="title">Crowd</div>
          </CreateItemWrapper>
          <CreateItemWrapper
            itemBg={alone}
            itemCover={aloneCover}
            onClick={() => {
              createCanvas(AloneCreate)
            }}
          >
            <div className="cover"></div>
            <div className="title">Personal</div>
          </CreateItemWrapper>
        </CreateContentWrapper>
      </CreateContentWrapper>
      <ConfirmModal
        title={createType === AloneCreate ? 'Alone Create' : 'Crowd Create'}
        width={400}
        onModalClose={createCancel}
        onModalConfirm={showConfirmModal}
        modalVisible={createModalVisible}
      >
        <Input
          placeholder="Name"
          value={canvasName}
          className="ant-input-violet"
          onChange={(e) => handleChangeInput(e, 1)}
        />
        <Input
          placeholder="Describle"
          value={canvasDescrible}
          style={{ marginTop: '20px' }}
          className="ant-input-violet"
          onChange={(e) => handleChangeInput(e, 2)}
        />
      </ConfirmModal>

      <ConfirmModal
        title={'Create'}
        width={340}
        onModalClose={() => {
          setConfirmVisible(false)
        }}
        onModalConfirm={createConfirm}
        modalVisible={confrimVisible}
      >
        <div className="tips">
          {`Are you sure to spend ${createType === AloneCreate ? 0.05 : 0.1}WICP to create a new canvas?`}
        </div>
      </ConfirmModal>
    </CreateWrapper>
  )
}
export default memo(Create)

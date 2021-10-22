import React, { memo, useRef, useState, useEffect } from 'react'
import { Button, message, Checkbox } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import CanvasPixel from '@/components/canvas-pixel'
import {
  MultiDrawWrapper,
  MultiContentWrapper,
  MultiDrawLeft,
  MultiDrawRight,
  MultiDrawMiddle,
  MultiTitleWrapper,
  MultiSubTitleWrapper,
  BlockAreaWrapper,
  BlockTitleWrapper
} from './style'
import { drawPixel, aloneCanvasDrawOver, balanceWICP, requestWithdrawIncome, requestCanister } from '@/api/handler'
import { getColorIntFromString } from '@/utils/ColorUtils'
import ColorPicker from '@/components/color-picker/ColorPicker'
import { transformPxToRem, fromatLeftTime, getValueDivide8, Storage } from '@/utils/utils'
import {
  getCanvasInfoById,
  changeInfoAction,
  getHighestInfoById,
  getCrowdCanvasConsumeAndBalance,
  getFinshedTimeById
} from '@/pages/home/store/actions'

import { useHistory } from 'react-router-dom'
import Detail from '@/assets/images/create/detail.png'
import Pixel from '@/assets/images/create/pixel.png'
import { AloneCreate, CrowdCreate } from '@/constants'
import CountDown from '@/components/count-down'
import Toast from '@/components/toast'
import { PixelInfoUpdate, UndownUpdate, ResetDrawPixel } from '@/message'
import PubSub from 'pubsub-js'
import BigNumber from 'bignumber.js'
import CanvasThumb from '@/components/canvas-thumb'
import Auth from '@/components/auth'
import ConfirmModal from '@/components/confirm-modal'
/**
 * 众创
 */
let queringWicp = false
function CanvasContent(props) {
  // state/props
  const [newPixelInfo, setNewPixelInfo] = useState({})
  const [curColor, setCurColor] = useState('')
  const history = useHistory()
  const [timer, setTimer] = useState(0)
  const [submitVisible, setSubmitVisible] = useState(false)
  const [finishVisible, setFinishVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  const [lastUpload, setLastUpload] = useState(0)
  const [drawType, setDrawType] = useState('draw') //draw,eraser两种状态
  const { type, id: prinId } = props.match.params
  const [wicp, setWICP] = useState(0)
  const [heatMapShow, setHeatMapShow] = useState(false)
  // redux
  const dispatch = useDispatch()
  const isAlone = () => {
    return type === AloneCreate
  }
  const canvasWidth = 800
  const [totalPrice, setTotalPrice] = useState(0)
  const [count, setCount] = useState(0)

  const getWICPBalance = (authToken) => {
    queringWicp = true
    requestCanister(balanceWICP, {
      curPrinId: authToken,
      success: (res) => {
        setWICP(res)
        queringWicp = false
      },
      fail: (error) => {
        queringWicp = false
      }
    })
  }

  const { isAuth, canvasInfo, highestInfo, consumeBalance, finishTime, authToken } = useSelector((state) => {
    let key = isAlone() ? `aloneInfo-${prinId}` : `multiInfo-${prinId}`
    let isAuth = state.auth.getIn(['isAuth']) || false
    let authToken = state.auth.getIn(['authToken']) || ''
    let canvasInfo = (state.allcavans && state.allcavans.getIn([key])) || {}
    let highestInfo = []
    let consumeBalance
    let finishTime = 0
    if (!isAlone()) {
      highestInfo = (state.allcavans && state.allcavans.getIn([`multiPriceHighestInfo-${prinId}`])) || []
      if (isAuth) consumeBalance = state.allcavans && state.allcavans.getIn([`multiConsumeBalanceInfo-${prinId}`])
      finishTime = (state.allcavans && state.allcavans.getIn([`multiFinishTime-${prinId}`])) || 0
    }
    if (isAuth && authToken && !queringWicp) {
      getWICPBalance(authToken)
    }
    return {
      isAuth: isAuth,
      canvasInfo: canvasInfo,
      highestInfo: highestInfo,
      consumeBalance: consumeBalance,
      finishTime: finishTime,
      authToken: authToken
    }
  }, shallowEqual)

  // other hooks
  useEffect(() => {
    console.log('canvas-content prinId: ', prinId)
    if (props.canvasInfo) {
      dispatch(changeInfoAction({ type: props.type, prinId: prinId, res: props.canvasInfo }))
    } else {
      dispatch(getCanvasInfoById(type, prinId))
    }
    if (!isAlone()) {
      dispatch(getFinshedTimeById(prinId))
      dispatch(getCrowdCanvasConsumeAndBalance(prinId))
      dispatch(getHighestInfoById(prinId))
    }
    timer && clearInterval(timer)
    setTimer(
      setInterval(() => {
        updateContentInfo(false)
      }, 1000 * 60 * 5)
    )
    return () => {
      queringWicp = false
      timer && clearInterval(timer)
    }
  }, [dispatch])

  const updateContentInfo = (resetCanvas = true) => {
    console.log('updateContentInfo ')
    dispatch(getCanvasInfoById(type, prinId))
    if (!isAlone()) {
      dispatch(getHighestInfoById(prinId))
      dispatch(getCrowdCanvasConsumeAndBalance(prinId))
      dispatch(getFinshedTimeById(prinId))
    }
    PubSub.publish(PixelInfoUpdate, { type, prinId, resetCanvas })
  }

  const handleColorChange = (color) => {
    setCurColor(color)
    setDrawType('draw')
  }

  const calPrice = (totalPrice, count) => {
    setTotalPrice(totalPrice)
    setCount(count)
  }

  const handleSelectRectChange = (x, y, isAdd) => {
    if (isAdd) {
      newPixelInfo[`${x}-${y}`] = curColor
    } else {
      delete newPixelInfo[`${x}-${y}`]
    }
  }

  const uploadCanvasInfo = async (e, finish) => {
    cancelSubmitModal()

    if (newPixelInfo && Object.keys(newPixelInfo).length) {
      let colors = []
      for (let key in newPixelInfo) {
        let tmp = key.split('-')
        colors.push({
          pos: { x: parseInt(tmp[0]), y: parseInt(tmp[1]) },
          color: getColorIntFromString(newPixelInfo[key])
        })
      }
      let notice = Toast.loading('drawing...', 0)
      let data = {
        type,
        prinId,
        colors: colors,
        success: (res) => {
          setLastUpload(new Date().getTime())
          if (finish && isAlone()) {
            finishCanvasUpload()
          } else {
            message.info('Your changes are Uploaded successfully')
            setNewPixelInfo({})
            setTotalPrice(0)
            setCount(0)
            updateContentInfo()
            // goBack()
          }
          authToken && getWICPBalance(authToken)
        },
        fail: (error) => {
          message.error(error)
        },
        notice
      }
      requestCanister(drawPixel, data)
    } else {
      message.info('Please draw something before submitting')
    }
  }

  const finishCanvasUpload = async () => {
    cancelFinishModal()
    if (canvasInfo && canvasInfo.isNFTOver) {
      message.info('This NFT is finished, please try a new one')
      return
    }
    let notice = Toast.loading('finish...', 0)
    let data = {
      prinId: prinId,
      success: (res) => {
        updateContentInfo()
        PubSub.publish(UndownUpdate, { type })
        message.info('Congratulations! The painting is finished. Please check it in your wallet')
      },
      fail: (error) => {
        message.error(error)
      },
      notice: notice
    }
    isAlone() && requestCanister(aloneCanvasDrawOver, data)
  }

  const showSubmitModal = () => {
    let time = new Date().getTime()
    if (time - lastUpload < 30 * 1000) {
      message.info('30s+ interval is required between two consecutive submissions')
      return
    }
    if (canvasInfo && canvasInfo.isNFTOver) {
      message.info('This NFT is finished, please try a new one')
      return
    }
    if (!newPixelInfo || !Object.keys(newPixelInfo).length) {
      message.info('Please draw something before submitting')
      return
    }
    if (!isAlone() && Object.keys(newPixelInfo).length > 1000) {
      message.info('At most 1000 pixels can be updated in one submission')
      return
    }
    setSubmitVisible(true)
  }

  const cancelSubmitModal = () => {
    setSubmitVisible(false)
  }

  const showFinishModal = () => {
    if (canvasInfo && canvasInfo.isNFTOver) {
      message.info('This NFT is finished, please try a new one')
      return
    }
    if (newPixelInfo && Object.keys(newPixelInfo).length) {
      message.info('You have updated pixels, please submit the change before finishing')
      return
    }
    if (canvasInfo.totalWorth < 10000000) {
      message.info('Total invested value > 0.1WICP is required to finish an NFT')
      return
    }
    setFinishVisible(true)
  }

  const cancelFinishModal = () => {
    setFinishVisible(false)
  }

  const cancelWithdrawModal = () => {
    setWithdrawVisible(false)
  }

  const showWithdrawModal = () => {
    if (canvasInfo.changeTotal < canvasInfo.bonusPixelThreshold) {
      message.error('Bonus not active')
      return
    }
    if (!consumeBalance.income || consumeBalance.income <= 0) {
      message.error('No income,go on playing')
      return
    }
    setWithdrawVisible(true)
  }

  const endTimeFun = () => {
    dispatch(getCanvasInfoById(type, prinId))
  }

  const onChangeShowHeatmap = (e) => {
    setHeatMapShow(e.target.checked)
  }

  const withdrawIncome = () => {
    setWithdrawVisible(false)
    let notice = Toast.loading('Withdrawing...', 0)
    let data = {
      type,
      prinId,
      success: (res) => {
        if (res.ok) {
          updateContentInfo()
          authToken && getWICPBalance(authToken)
        }
      },
      fail: (error) => {
        message.error(error)
      },
      notice
    }
    requestCanister(requestWithdrawIncome, data)
  }

  const initBlockArea = (width, height, title, img, children, otherTitle) => {
    return (
      <BlockAreaWrapper width={transformPxToRem(width + 'px')} height={transformPxToRem(height + 'px')}>
        {(title || img) && (
          <BlockTitleWrapper>
            <h5>{title}</h5>
            <img src={img}></img>
            {otherTitle && otherTitle}
          </BlockTitleWrapper>
        )}
        {children}
      </BlockAreaWrapper>
    )
  }
  const defaultWrapperContent = (
    <MultiContentWrapper>
      <MultiDrawLeft>
        {initBlockArea(
          387,
          isAlone() ? 300 : 330,
          null,
          null,
          <div className="thumb">
            <div className="canvas">
              <CanvasThumb
                count={count}
                newPixelInfo={newPixelInfo}
                realWidth={isAlone() ? 100 : 200}
                realHeight={isAlone() ? 100 : 200}
                width={250}
              ></CanvasThumb>
            </div>
            <div>
              <Button
                type="violet"
                className="reset"
                onClick={() => {
                  setNewPixelInfo({})
                  setTotalPrice(0)
                  setCount(0)
                  PubSub.publish(ResetDrawPixel, { type, prinId })
                }}
              >
                Reset
              </Button>
              <Button
                type="violet"
                className="eraser"
                onClick={() => {
                  setCurColor('#ffffff')
                  setDrawType('eraser')
                }}
              >
                Eraser
              </Button>
              {!isAlone() && (
                <Checkbox onChange={onChangeShowHeatmap} checked={heatMapShow}>
                  HeatMap
                </Checkbox>
              )}
            </div>
          </div>
        )}
        {initBlockArea(
          387,
          isAlone() ? 550 : 580,
          'Color picker',
          Pixel,
          <ColorPicker color={'#ffffff'} onChange={handleColorChange} />,
          <div className="curColor" style={{ backgroundColor: curColor }}></div>
        )}
      </MultiDrawLeft>
      <MultiDrawMiddle width={canvasWidth + 2}>
        {/* +2是边框的2像素值 */}
        <CanvasPixel
          prinId={prinId}
          modify={true}
          type={type}
          color={curColor}
          realWidth={isAlone() ? 100 : 200}
          realHeight={isAlone() ? 100 : 200}
          width={canvasWidth}
          height={canvasWidth}
          canvasInfo={canvasInfo}
          changeSelect={handleSelectRectChange}
          calPrice={calPrice}
          drawType={drawType}
          canvas={true}
          heatMapShow={heatMapShow}
        />
        {/* <MultiToSelectBg width = {selectRect[2] * canvasWidth/100} height= {selectRect[3] * canvasWidth/100} left = {selectRect[0]} top = {selectRect[1]}></MultiToSelectBg> */}
      </MultiDrawMiddle>

      <MultiDrawRight>
        {initBlockArea(
          424,
          isAlone() ? 520 : 450,
          'Canvas Info',
          Detail,
          <div>
            <div className="textDetail">
              Description:
              <span style={{ color: '#4338ca' }}>{` ${canvasInfo.desc}`}</span>
            </div>
            <div className="textDetail">
              CID:
              <span style={{ color: '#4338ca' }}>{` ${prinId}`}</span>
            </div>
            <div className="textDetail">
              Created by:
              <span style={{ color: '#4338ca' }}>{` ${canvasInfo.createBy}`}</span>
            </div>
            <div className="textDetail">
              Total invested:
              <span style={{ color: '#4338ca' }}>{` ${getValueDivide8(canvasInfo.totalWorth)} WICP`}</span>
            </div>

            {!isAlone() && (
              <div className="textDetail">
                Bonus status:
                <span style={{ color: '#4338ca' }}>
                  {canvasInfo.changeTotal >= canvasInfo.bonusPixelThreshold
                    ? ' Open'
                    : ` Not open(${canvasInfo.changeTotal}/${canvasInfo.bonusPixelThreshold})`}
                </span>
              </div>
            )}

            {!isAlone() && (
              <div className="textDetail">
                Bonus to vest:
                <span style={{ color: '#4338ca' }}>{` ${getValueDivide8(canvasInfo.bonus)} WICP`}</span>
              </div>
            )}

            {!isAlone() && (
              <div className="textDetail">
                Number of Updated Pixels:
                <span style={{ color: '#4338ca' }}>{` ${canvasInfo.changeTotal}`}</span>
              </div>
            )}

            {!isAlone() && (
              <div className="textDetail">
                Number of Players:
                <span style={{ color: '#4338ca' }}>{` ${canvasInfo.paintersNum || 1}`}</span>
              </div>
            )}
            {!isAlone() && (
              <div className="textDetail">
                MVP (Most Valuable Pixel):
                <span style={{ color: '#4338ca' }}>{` ${getValueDivide8(
                  highestInfo.length ? highestInfo[0][1].curPrice : 0
                )} WICP, Coordinates:(${highestInfo.length ? highestInfo[0][0].x : 0},${
                  highestInfo.length ? highestInfo[0][0].y : 0
                })`}</span>
              </div>
            )}
          </div>
        )}
        {!isAlone() &&
          initBlockArea(
            424,
            200,
            'Personal Info',
            Detail,
            <div>
              <div className="textDetail">
                Total Invested:
                <span style={{ color: '#4338ca' }}>{` ${getValueDivide8(
                  consumeBalance ? consumeBalance.consume : 0
                )} WICP`}</span>
              </div>

              <div className="textDetail">
                Total Income :
                <span style={{ color: '#4338ca' }}>{` ${getValueDivide8(
                  parseInt(consumeBalance ? consumeBalance.income : 0) +
                    parseInt(consumeBalance ? consumeBalance.withDrawed : 0)
                )} WICP`}</span>
              </div>
              <div className="textSubDetail">
                Withdrawed:
                <span style={{ color: '#4338ca' }}>{` ${getValueDivide8(
                  consumeBalance ? consumeBalance.withDrawed : 0
                )} WICP`}</span>
              </div>
              <div className="textSubDetail">
                Remaining :
                <span style={{ color: '#4338ca' }}>{` ${getValueDivide8(
                  consumeBalance ? consumeBalance.income : 0
                )} WICP`}</span>
                <Button type="violet" className="withdraw" onClick={showWithdrawModal}>
                  Withdraw
                </Button>
              </div>

              <div className="textDetail">
                Estimated Bonus:
                <span style={{ color: '#4338ca' }}>{` ${getValueDivide8(
                  consumeBalance ? consumeBalance.userBonus : 0
                )} WICP`}</span>
              </div>
              <div className="textDetail">
                Asset (Number of Owned Pixels):
                <span style={{ color: '#4338ca' }}>{` ${consumeBalance ? consumeBalance.pixelNum : 0} `}</span>
              </div>
            </div>
          )}
        {initBlockArea(
          424,
          isAlone() ? 330 : 80,
          null,
          null,
          <div className="textPriceContent">
            <div className="totalPrice">{`Total price: ${getValueDivide8(totalPrice)} WICP`}</div>
            <div className="totalNum">{`Number: ${count}*`}</div>
            {isAlone() && <div className="tips">{'Total invested value > 0.1WICP is required to finish an NFT'}</div>}
            <div className="buttonLayout">
              <Button type="violet" className="confirm" onClick={showSubmitModal}>
                Submit
              </Button>
              {isAlone() && (
                <Button type="violet" className="confirm" onClick={showFinishModal}>
                  Finish
                </Button>
              )}
            </div>
          </div>
        )}
      </MultiDrawRight>
    </MultiContentWrapper>
  )

  const getEndTime = () => {
    let endTime = parseInt(new BigNumber(parseInt(finishTime || 0)).dividedBy(Math.pow(10, 6)))
    return endTime
  }

  const mainContent = (
    <MultiDrawWrapper>
      <MultiTitleWrapper backgroundColor={'#A25AFF33'} color={'#000000'}>
        <div>CROWD CREATED CANVAS</div>
        {!isAlone() && <div>{`Name: ${canvasInfo.name}`}</div>}
        <div>Number:</div>
        <div>{`${isAlone() ? '#A-' : '#M-'}${canvasInfo.tokenIndex}`}</div>
      </MultiTitleWrapper>

      <MultiSubTitleWrapper>
        <div
          className="home"
          onClick={() => {
            history.push('/')
          }}
        >
          <HomeOutlined />
        </div>

        {!isAlone() ? (
          <div className="content">
            <div>Remaining Time:</div>
            <CountDown endTime={getEndTime()} endTimeFun={endTimeFun} />
          </div>
        ) : (
          <div className="content">{`Name: ${canvasInfo.name}`}</div>
        )}
        {isAuth && authToken && <div className="wicp">{`Balance:${getValueDivide8(wicp)} WICP`}</div>}
        <div className="auth">
          <Auth />
        </div>
      </MultiSubTitleWrapper>

      {defaultWrapperContent}
      <ConfirmModal
        title={'Submit'}
        width={450}
        onModalClose={cancelSubmitModal}
        onModalConfirm={uploadCanvasInfo}
        modalVisible={submitVisible}
      >
        <div className="tips">
          {`It will take about ${getValueDivide8(
            totalPrice
          )} WICP  for the ${count} pixels update. Please confirm you want to make the change.`}
        </div>
      </ConfirmModal>
      <ConfirmModal
        title={'Finish'}
        width={500}
        onModalClose={cancelFinishModal}
        onModalConfirm={finishCanvasUpload}
        modalVisible={finishVisible}
      >
        <div className="tips">
          {`You are closing this canvas painting. You will not be able to change it any more once it is finished. Please confirm or cancel it. 
You can find the finished canvas in your wallet ( Wallet-> My Wallet -> Non-Fungible Tokens )`}
        </div>
      </ConfirmModal>
      <ConfirmModal
        title={'Withdraw'}
        width={500}
        onModalClose={cancelWithdrawModal}
        onModalConfirm={withdrawIncome}
        modalVisible={withdrawVisible}
      >
        <div className="tips">
          {`It will withdraw abount ${getValueDivide8(
            consumeBalance ? consumeBalance.income : 0
          )} WICP .Please confirm you want to withdraw.`}
        </div>
      </ConfirmModal>
    </MultiDrawWrapper>
  )

  return mainContent
}

export default memo(CanvasContent)

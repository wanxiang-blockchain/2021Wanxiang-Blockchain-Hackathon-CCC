import * as constants from './constants'
import {
  getAllUndoneCanvas,
  getCanisterCanvasInfoById,
  factoryGetListings,
  getNFTListingInfo,
  getHighestPosition,
  getConsumeAndBalance,
  getNFTOwner,
  getFinshedTime,
  requestCanister
} from '@/api/handler'
import { AloneCreate, CrowdCreate } from '@/constants'

const isAlone = (type) => {
  return type === AloneCreate
}

// 所有未完成合作的canvans
export const changeAllCanvasAction = (type, res) =>
  isAlone(type)
    ? {
        type: constants.CHANGE_ALONE_UNDONE,
        value: res
      }
    : {
        type: constants.CHANGE_MULTI_UNDONE,
        value: res
      }

// 获取画布某个id信息
export const changeInfoAction = (data) => {
  let { type, prinId, res } = data
  return isAlone(type)
    ? {
        type: `${constants.CHANGE_ALONE_INFO}-${prinId}`,
        value: res
      }
    : {
        type: `${constants.CHANGE_MULTI_INFO}-${prinId}`,
        value: res
      }
}

// 所有挂在market的list
export const changeAllMarketNFTAction = (data) => {
  let { type, res } = data
  return isAlone(type)
    ? {
        type: constants.CHANGE_ALONE_MARKET,
        value: res
      }
    : {
        type: constants.CHANGE_MULTI_MARKET,
        value: res
      }
}

// 获取某个NFT的List信息
export const changeNFTInfoAction = (data) => {
  let { type, tokenIndex, res } = data
  return isAlone(type)
    ? {
        type: `${constants.CHANGE_ALONE_NFT_INFO}-${tokenIndex}`,
        value: res
      }
    : {
        type: `${constants.CHANGE_MULTI_NFT_INFO}-${tokenIndex}`,
        value: res
      }
}

// 获取画布price最高的点
export const changePriceHighestInfoAction = (data) => {
  let { prinId, res } = data
  return {
    type: `${constants.CHANGE_MULTI_PRICE_HIGHEST_INFO}-${prinId}`,
    value: res
  }
}

// 获取画布花费的点，可提现的余额
export const changeConsumeAndBalanceInfoAction = (data) => {
  let { prinId, res } = data
  return {
    type: `${constants.CHANGE_MULTI_CONSUME_BALANCE_INFO}-${prinId}`,
    value: res
  }
}

export const changeNFTOwnerAction = (data) => {
  let { type, tokenIndex, res } = data
  return isAlone(type)
    ? {
        type: `${constants.CHANGE_ALONE_NFT_OWNER}-${tokenIndex}`,
        value: res
      }
    : {
        type: `${constants.CHANGE_MULTI_NFT_OWNER}-${tokenIndex}`,
        value: res
      }
}

export const changeCanvasUpdateTimeAction = (data) => {
  let { prinId, res } = data
  return {
    type: `${constants.CHANGE_MULTI_UPDATE_TIME}-${prinId}`,
    value: res
  }
}

export const getAllUndoneCanvasAction = (type) => {
  return (dispatch) => {
    // 发送网络请求
    let data = {
      type: type,
      success: (res) => {
        dispatch(changeAllCanvasAction(type, res))
      }
    }
    requestCanister(getAllUndoneCanvas, data, false)
  }
}

export const getCanvasInfoById = (type, prinId) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      type: type,
      prinId: prinId,
      success: (res) => {
        dispatch(changeInfoAction({ type: type, prinId: prinId, res: res }))
      }
    }
    requestCanister(getCanisterCanvasInfoById, data, false)
  }
}

export const getMarketNFTByType = (type) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      type: type,
      success: (res) => {
        dispatch(changeAllMarketNFTAction({ type: type, res: res }))
      }
    }
    requestCanister(factoryGetListings, data, false)
  }
}

export const getNFTListingInfoByType = (type, tokenIndex) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      type: type,
      tokenIndex: tokenIndex,
      success: (res) => {
        dispatch(changeNFTInfoAction({ type: type, tokenIndex: tokenIndex, res: res[0] || {} }))
      }
    }
    requestCanister(getNFTListingInfo, data, false)
  }
}

export const getHighestInfoById = (prinId) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      prinId: prinId,
      success: (res) => {
        dispatch(changePriceHighestInfoAction({ prinId: prinId, res: res }))
      }
    }
    requestCanister(getHighestPosition, data, false)
  }
}

export const getCrowdCanvasConsumeAndBalance = (prinId) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      type: CrowdCreate,
      prinId: prinId,
      success: (res) => {
        dispatch(changeConsumeAndBalanceInfoAction({ prinId: prinId, res: res }))
      }
    }
    requestCanister(getConsumeAndBalance, data)
  }
}

export const getNFTOwnerByIndex = (type, tokenIndex) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      type: type,
      tokenIndex: tokenIndex,
      success: (res) => {
        dispatch(changeNFTOwnerAction({ type: type, tokenIndex: tokenIndex, res: res }))
      }
    }
    requestCanister(getNFTOwner, data, false)
  }
}

export const getFinshedTimeById = (prinId) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      prinId: prinId,
      success: (res) => {
        dispatch(changeCanvasUpdateTimeAction({ prinId: prinId, res: res }))
      }
    }
    requestCanister(getFinshedTime, data, false)
  }
}

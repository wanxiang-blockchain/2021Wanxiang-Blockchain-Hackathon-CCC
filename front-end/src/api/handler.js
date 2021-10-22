import CanisterManager from './canisterManager'
import { Principal } from '@dfinity/principal'
import { II_LOCAL_URL } from 'canister/local/id.js'
import ErrorMessage from '@/assets/scripts/errorCode'
import RosettaApi from '../ic/RosettaApi'
import {
  principalToAccountId,
  getSubAccountArray,
  bignumberToBigInt,
  getValueDivide8,
  getValueMultiplied8
} from '../utils/utils'
import BigNumber from 'bignumber.js'
import { NFT_ALONE_FACTORY_ID, NFT_MULTI_FACTORY_ID } from 'canister/local/id.js'
import { AloneCreate, CrowdCreate } from '@/constants'

const canisterManager = new CanisterManager()
const rosettaApi = new RosettaApi()

////代码需要整理
////代码需要整理

const isAlone = (type) => {
  return type === AloneCreate
}

const getCanisterByType = async (type, prinId) => {
  let fetch = isAlone(type)
    ? await canisterManager.getAloneCanvasCanister(prinId)
    : await canisterManager.getMultiCanvasCanister(prinId)
  return fetch
}

async function approveWICPNat(prinId) {
  let fetch = await canisterManager.getWICPMotoko()
  let identity = await canisterManager.getIdentity()
  let args1 = Principal.fromText(prinId)
  let args2 = await fetch.balanceOf(identity.getPrincipal())
  let res = await fetch.approve(args1, args2)
  return res
}

async function getAllowance(prinId) {
  let fetch = await canisterManager.getWICPMotoko()
  let identity = await canisterManager.getIdentity()
  let spender = Principal.fromText(prinId)
  let amount = await fetch.allowance(identity.getPrincipal(), spender)
  return amount
}

// factor canister
const getNftFactoryByType = async (type) => {
  let fetch = isAlone(type) ? await canisterManager.getAloneNFTFactory() : await canisterManager.getMultiNFTFactory()
  return fetch
}

export async function initLoginStates() {
  return await canisterManager.getAuthClient()
}

export async function isLogin() {
  let authClient = await canisterManager.getAuthClient()
  const boolean = await authClient.isAuthenticated()
  return boolean
}

export async function authLoginOut() {
  let authClient = await canisterManager.getAuthClient()
  authClient.logout()
  canisterManager.updateIdentity()
  return authClient
}

export async function authLogin(callback) {
  let authClient = await canisterManager.getAuthClient()
  console.log('authLogin ', II_LOCAL_URL)
  authClient.login({
    maxTimeToLive: BigInt(24 * 60 * 60 * 1000000000),
    identityProvider: II_LOCAL_URL,
    onSuccess: () => {
      callback(authClient)
      canisterManager.updateIdentity()
    }
  })
}

export async function requestCanister(reqFunc, data, mustLogin = true) {
  let { success, fail, notice, error } = data
  Promise.resolve()
    .then(async () => {
      if (mustLogin && !(await isLogin())) {
        return { err: { NotLogin: 1 } }
      }
      return await reqFunc(data)
    })
    .then((res) => {
      notice && notice()
      if (res.err) {
        console.warn('response error:', res.err)
        for (let key in res.err) {
          fail && fail(ErrorMessage[key])
        }
      } else {
        success && success(res)
      }
    })
    .catch((err) => {
      notice && notice()
      error && error(err)
      console.error('error :' + err)
    })
}

export async function mintPixelCanvas(data) {
  let { type, description, name } = data
  let fetch = await getNftFactoryByType(type)
  if (!fetch) {
    return { err: { NotCanister: 1 } }
  }
  /** auth temp begin **/
  let _pid = isAlone(type) ? NFT_ALONE_FACTORY_ID : NFT_MULTI_FACTORY_ID
  let amount = await getAllowance(_pid)
  console.debug('mintPixelCanvas: amount ', amount, 'pid:', _pid)
  if (amount == 0) {
    await approveWICPNat(_pid)
  }
  /** auth temp end **/

  let param = { desc: description, name: name }
  let res = isAlone(type) ? await fetch.mintAloneCanvas(param) : await fetch.mintMultiCanvas(param)
  return res
}

export async function getMintFee(data) {
  let { type } = data
  let fetch = await getNftFactoryByType(type)
  let fee = isAlone(type) ? await fetch.getAloneFee() : await fetch.getMultiFee()
  return fee
}

export async function drawPixel(data) {
  let { type, prinId, colors } = data
  let amount = await getAllowance(prinId)
  if (amount == 0) {
    await approveWICPNat(prinId)
  }
  let fetch = await getCanisterByType(type, prinId)
  if (fetch) {
    const res = await fetch.drawPixel(colors)
    if (res.err) {
      for (let key in res.err) {
        if (key === 'AllowedInsufficientBalance') {
          await approveWICPNat(prinId)
        }
      }
    }
    return res
  } else {
    return { err: { NotCanister: 1 } }
  }
}

export async function getAllUndoneCanvas(data) {
  let { type } = data
  let fetch = await getNftFactoryByType(type)
  if (fetch) {
    let res = isAlone(type) ? await fetch.getAllAloneCanvas() : await fetch.getAllMultipCanvas()
    return res || []
  } else {
    return []
  }
}

export async function getCanisterCanvasInfoById(data) {
  let { type, prinId } = data
  let fetch = await getCanisterByType(type, prinId)
  if (fetch) {
    let res = await fetch.getNftDesInfo()
    return res
  }
}

export async function getCanisterPixelInfoById(data) {
  let { type, prinId } = data
  let fetch = await getCanisterByType(type, prinId)
  if (fetch) {
    let res = await fetch.getAllPixel()
    return res
  }
}

export async function aloneCanvasDrawOver(data) {
  let { prinId } = data
  console.log('aloneCanvasDrawOver prinId = ', prinId)
  let fetch = await getCanisterByType(AloneCreate, prinId)
  if (fetch) {
    let res = await fetch.drawOver()
    console.log('aloneCanvasDrawOver res = ' + res)
    if (res) {
      return res
    }
  }
  return null
}

export async function getAllNFT() {
  let fetch = await canisterManager.getAloneNFTFactory()
  let res1 = fetch && (await fetch.getAllNFT())
  fetch = await canisterManager.getMultiNFTFactory()
  let res2 = await fetch.getAllNFT()
  return { alone: res1 || [], crowd: res2 || [] }
}

export async function getParticipate() {
  let fetch = await canisterManager.getMultiNFTFactory()
  let res = await fetch.getParticipate()
  return res
}
export async function getMultiCanvasBouns(prinId) {
  let fetch = await getCanisterByType(CrowdCreate, prinId)
  let res = await fetch.getBonus()
  return res
}
export async function getWithDrawByUser(data) {
  const { prinId } = data
  let fetch = await getCanisterByType(CrowdCreate, prinId)
  let res = await fetch.withDrawByUser()
  return res
}
export async function drewNftBuyNow(data) {
  const { tokenIndex } = data
  // let fetch = await getCanisterByType(CrowdCreate, prinId)
  let fetch = await canisterManager.getMultiNFTFactory()
  let res = await fetch.buyNow(tokenIndex)
  return res
}

export async function getFavorite() {
  let fetch = await canisterManager.getAloneNFTFactory()
  let res1 = fetch && (await fetch.getFavorite())
  fetch = await canisterManager.getMultiNFTFactory()
  let res2 = await fetch.getFavorite()
  console.log('res1 = ' + res1 + ' res2 ' + res2)
  return { alone: res1 || [], crowd: res2 || [] }
}

export async function setFavorite(data) {
  let { type, tokenIndex, prinId } = data
  let fetch = await getNftFactoryByType(type)
  let ret = await fetch.setFavorite({ index: tokenIndex, canisterId: Principal.fromText(prinId) })
  return ret
}

export async function cancelFavorite(data) {
  let { type, tokenIndex } = data
  let fetch = await getNftFactoryByType(type)
  let ret = await fetch.cancelFavorite(tokenIndex)
  return ret
}

export async function balanceWICP(data) {
  let { curPrinId } = data
  let fetch = await canisterManager.getWICPMotoko()
  let count = await fetch.balanceOf(Principal.fromText(curPrinId))
  return count || 0
}

export async function balanceICP(data) {
  let { curPrinId } = data
  let account = principalToAccountId(Principal.fromText(curPrinId))
  let ledgercanister = await canisterManager.getLedgerCanister()
  let icpBalance = await ledgercanister.account_balance_dfx({ account: account })
  return icpBalance ? getValueDivide8(icpBalance.e8s) : 0 // 接口拿
}

export async function transferIcp2Icp(data) {
  let { amount, address } = data
  let transAmount = new BigNumber(amount).multipliedBy(Math.pow(10, 8)).minus(10000)
  let subaccount = [getSubAccountArray(0)]
  let toAddr = address
  let args = {
    from_subaccount: subaccount,
    to: toAddr,
    amount: { e8s: bignumberToBigInt(transAmount) },
    fee: { e8s: 10000 },
    memo: 0,
    created_at_time: []
  }
  let ledgercanister = await canisterManager.getLedgerCanister()
  let blockHeight = await ledgercanister.send_dfx(args)
  return blockHeight
}

export async function transferWIcp2WIcp(data) {
  let { amount, address } = data
  let fetch = await canisterManager.getWICPMotoko()
  let res = await fetch.transfer(Principal.fromText(address), parseInt(getValueMultiplied8(amount)))
  return res
}

export async function transferWIcp2Icp(data) {
  let { amount } = data
  let fetch = await canisterManager.getWICPMotoko()
  let res = await fetch.burn(parseInt(getValueMultiplied8(amount)))
  return res
}

export async function transferIcp2WIcp(data) {
  let fetch = await canisterManager.getWICPMotoko()
  let toAddr = await fetch.getReceiveICPAcc()
  data['address'] = toAddr[0]
  let blockHeight = await transferIcp2Icp(data)
  if (blockHeight) {
    console.log('blockHeight =' + blockHeight)
    //let fetch = await getWICPMotoko()
    let subaccount = [getSubAccountArray(0)]
    let result = await fetch.mint({ from_subaccount: subaccount, blockHeight: blockHeight })
    approveWICPNat(NFT_ALONE_FACTORY_ID)
    approveWICPNat(NFT_MULTI_FACTORY_ID)
    return result
  } else {
    return null
  }
}

// get oder listings
export async function factoryGetListings(data) {
  // ret
  // public type Listings = {
  //     tokenIndex : TokenIndex;
  //     seller : Principal;
  //     price : Nat;
  // };
  let { type } = data
  let fetch = await getNftFactoryByType(type)
  if (fetch) {
    let res = await fetch.getListings()
    if (res) {
      let nftInfoArray = []
      for (const _nft of res) {
        var { 0: tokenIndex, 1: sellInfo } = _nft
        var { price } = sellInfo
        var nftInfo = await factoryGetNFTByIndex({ type: type, args: tokenIndex })
        if (nftInfo && nftInfo.length) {
          nftInfoArray.push({
            baseInfo: [tokenIndex, nftInfo[0]],
            nftType: type,
            sellInfo: sellInfo,
            sellPrice: new BigNumber(price).dividedBy(Math.pow(10, 8)).toFixed()
          })
        }
      }

      return nftInfoArray
    }
  }
  return
}

// getNFTByIndex
export async function factoryGetNFTByIndex(data) {
  let { type, args } = data
  let fetch = await getNftFactoryByType(type)
  if (fetch) {
    let res = await fetch.getNFTByIndex(args)
    if (res) {
      return res
    }
  }
  return
}

// new a oder list
// args = {tokenIndex : 0, price : 10000}
export async function addFactoryList(data) {
  let { tokenIndex, price, type } = data
  let args = { tokenIndex: tokenIndex, price: price }
  let fetch = await getNftFactoryByType(type)
  if (fetch) {
    let res = await fetch.list(args)
    if (res) {
      return res
    }
  }
  return null
}

export async function factoryBuyNow(data) {
  console.log('factoryBuyNow data = ', data)
  let { type, tokenIndex } = data
  let _pid = isAlone(type) ? NFT_ALONE_FACTORY_ID : NFT_MULTI_FACTORY_ID
  let amount = await getAllowance(_pid)
  console.debug('mintPixelCanvas: amount ', amount, 'pid:', _pid)
  if (amount == 0) {
    await approveWICPNat(_pid)
  }
  let fetch = await getNftFactoryByType(type)
  if (fetch) {
    let res = await fetch.buyNow(tokenIndex)
    console.debug('[factoryBuyNow] buyNow res:', res)
    if (res) {
      return res
    }
  }
  return null
}

export async function getICPTransaction(data) {
  let { accountAddress } = data
  let res = await rosettaApi.getTransactionsByAccount(accountAddress)
  return res
}

export async function getWICPTransaction(data) {
  let { prinId } = data
  let principal = Principal.fromText(prinId)
  let fetch = await canisterManager.getWICPMotoko()
  let res = await fetch.getHistoryByAccount(principal)
  return res
}

export async function getNFTListingInfo(data) {
  let { type, tokenIndex } = data
  let fetch = await getNftFactoryByType(type)
  let res = fetch && (await fetch.isList(tokenIndex))
  return res || {}
}

export async function cancelNFTList(data) {
  let { type, tokenIndex } = data
  let fetch = await getNftFactoryByType(type)
  let res = fetch && (await fetch.cancelList(tokenIndex))
  return res || {}
}

export async function getNFTOwner(data) {
  let { type, tokenIndex } = data
  let fetch = await getNftFactoryByType(type)
  let res = fetch && (await fetch.ownerOf(tokenIndex))
  return res || {}
}

export async function getHighestPosition(data) {
  let { prinId } = data
  let fetch = await getCanisterByType(CrowdCreate, prinId)
  let highest = fetch && (await fetch.getHighestPosition())
  return highest || {}
}

// Subscribe to email

export async function subEmail(email) {
  let fetch = await canisterManager.getStorageMotoko()
  let res = await fetch.addCccMailSub(email)
  return res
}

export async function getConsumeAndBalance(data) {
  let { prinId } = data
  let fetch = await getCanisterByType(CrowdCreate, prinId)
  let res = fetch && (await fetch.getAccInfo())
  return res || {}
}

export async function isCanvasOver(data) {
  let { type, prinId } = data
  let fetch = await getCanisterByType(type, prinId)
  let res = fetch && (await fetch.isOver())
  return res
}

export async function getFinshedTime(data) {
  let { prinId } = data
  let fetch = await getCanisterByType(CrowdCreate, prinId)
  let res = fetch && (await fetch.getFinshedTime())
  return res
}

export async function requestWithdrawIncome(data) {
  let { type, prinId } = data
  let fetch = await getCanisterByType(type, prinId)
  let res = fetch && (await fetch.withDrawIncome())
  approveWICPNat(prinId)
  return res
}

/**
 * create agent
 */
import { Actor, HttpAgent } from '@dfinity/agent'
import { AuthClient } from '@dfinity/auth-client'

import {
  NFT_ALONE_FACTORY_ID,
  NFT_MULTI_FACTORY_ID,
  WICP_MOTOKO_ID,
  LEDGER_CANISTER_ID,
  STORAGE_EMAIL_CID
} from 'canister/local/id.js'
import { idlFactory as AloneNFTDIL } from 'canister/local/candid/aloneNFT.did.js'
import { idlFactory as MultiNFTDIL } from 'canister/local/candid/multiNFT.did.js'
import { idlFactory as WICPMotokoDIL } from 'canister/local/candid/WICP_motoko.did.js'
import { idlFactory as AloneCanvasDIL } from 'canister/local/candid/aloneCanvas.did.js'
import { idlFactory as MultiCanvasDIL } from 'canister/local/candid/multiCanvas.did.js'
import { idlFactory as StorageDIL } from 'canister/local/candid/storage.did'
import LedgerCanisterDIL from 'canister/local/candid/ledger.did.js'

export default class CanisterManager {
  constructor() {
    this.canisterMap = new Map()
  }

  async getAuthClient() {
    if (!this.authClient) {
      this.authClient = await AuthClient.create()
      this.identity = await this.authClient.getIdentity()
    }
    return this.authClient
  }

  async getIdentity() {
    if (!this.identity) {
      await this.getAuthClient()
    }
    return this.identity
  }

  async createCanister(idl, id, host) {
    const identity = await this.getIdentity()
    var args = {}
    args['identity'] = identity
    if (host) args['host'] = host
    // args['host'] = 'https://boundary.ic0.app/'
    const agent = new HttpAgent(args)

    if (process.env['DFX_NETWORK'] !== 'ic') {
      await agent.fetchRootKey()
    }
    return Actor.createActor(idl, {
      agent,
      canisterId: id
    })
  }

  async getAloneNFTFactory() {
    if (!this.fetchAloneNFT) this.fetchAloneNFT = await this.createCanister(AloneNFTDIL, NFT_ALONE_FACTORY_ID)
    return this.fetchAloneNFT
  }

  async getLedgerCanister() {
    if (!this.fetchLedgerCanister)
      this.fetchLedgerCanister = await this.createCanister(LedgerCanisterDIL, LEDGER_CANISTER_ID)
    return this.fetchLedgerCanister
  }

  async getMultiNFTFactory() {
    if (!this.fetchMultiNFT) this.fetchMultiNFT = await this.createCanister(MultiNFTDIL, NFT_MULTI_FACTORY_ID)
    return this.fetchMultiNFT
  }

  async getWICPMotoko() {
    if (!this.fetchWICPMotoko) this.fetchWICPMotoko = await this.createCanister(WICPMotokoDIL, WICP_MOTOKO_ID)
    return this.fetchWICPMotoko
  }

  async getAloneCanvasCanister(prinId) {
    let canister = this.canisterMap.get(prinId)
    if (!canister) {
      canister = await this.createCanister(AloneCanvasDIL, prinId)
      this.canisterMap.set(prinId, canister)
    }
    return canister
  }

  async getMultiCanvasCanister(prinId) {
    let canister = this.canisterMap.get(prinId)
    if (!canister) {
      canister = await this.createCanister(MultiCanvasDIL, prinId)
      this.canisterMap.set(prinId, canister)
    }
    return canister
  }

  async getStorageMotoko() {
    if (!this.fetchStorageMotoko) this.fetchStorageMotoko = await this.createCanister(StorageDIL, STORAGE_EMAIL_CID)
    return this.fetchStorageMotoko
  }

  updateIdentity() {
    this.identity = null
    this.authClient = null
    this.fetchAloneNFT = null
    this.fetchMultiNFT = null
    this.fetchLedgerCanister = null
    this.fetchWICPMotoko = null
    this.canisterMap.clear()
  }
}

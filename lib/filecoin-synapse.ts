import { ethers } from 'ethers'
import { RPC_URLS, Synapse } from '@filoz/synapse-sdk'

let synapseInstance: Synapse | null = null
let storageContext: any | null = null

export class FilecoinSynapseService {
  private synapse: Synapse | null = null
  private storageContext: any | null = null

  async initialize() {
    if (synapseInstance) {
      this.synapse = synapseInstance
      this.storageContext = storageContext
      return
    }

    const privateKey = process.env.FILECOIN_PRIVATE_KEY
    const rpcUrl = process.env.FILECOIN_RPC_URL || RPC_URLS.calibration.http

    if (!privateKey) {
      throw new Error('FILECOIN_PRIVATE_KEY is not configured')
    }

    this.synapse = await Synapse.create({
      privateKey,
      rpcURL: rpcUrl,
    })

    this.storageContext = await this.synapse.storage.createContext({
      withCDN: true,
      callbacks: {
        onProviderSelected: (provider: any) => {
          console.log(`✓ Selected service provider: ${provider.serviceProvider}`)
        },
      },
    })

    synapseInstance = this.synapse
    storageContext = this.storageContext
  }

  async depositUSDFC(amount: string) {
    await this.ensureInitialized()
    const depositAmount = ethers.parseUnits(amount, 18)
    await this.synapse!.payments.deposit(depositAmount)
  }

  async approveWarmStorageService(rateAllowance: string, lockupAllowance: string, maxLockupPeriod: bigint = 86400n) {
    await this.ensureInitialized()
    const warmStorageAddress = this.synapse!.getWarmStorageAddress()
    await this.synapse!.payments.approveService(
      warmStorageAddress,
      ethers.parseUnits(rateAllowance, 18),
      ethers.parseUnits(lockupAllowance, 18),
      maxLockupPeriod,
    )
  }

  async uploadFile(fileData: Buffer): Promise<{ pieceCid: string; pieceIds: string[] }> {
    console.log('[Synapse] Starting upload...')
    await this.ensureInitialized()

    console.log(`[Synapse] Running preflight check for ${fileData.length} bytes...`)
    const preflight = await this.storageContext!.preflightUpload(fileData.length)

    console.log('[Synapse] Preflight result:', JSON.stringify(preflight, null, 2))

    if (!preflight.allowanceCheck.sufficient) {
      console.error('[Synapse] Insufficient allowances:', preflight.allowanceCheck.message)
      throw new Error(`Insufficient allowances: ${preflight.allowanceCheck.message}. Please visit /setup to configure payments.`)
    }

    let pieceIds: string[] = []

    console.log('[Synapse] Uploading to storage provider...')
    const uploadResult = await this.storageContext!.upload(fileData, {
      onPieceConfirmed: (confirmedPieceIds: string[]) => {
        console.log('✓ Piece addition confirmed on-chain!')
        console.log(`  Assigned piece IDs: ${confirmedPieceIds.join(', ')}`)
        pieceIds = confirmedPieceIds
      },
    })

    console.log('[Synapse] Upload complete:', uploadResult.pieceCid)

    return {
      pieceCid: uploadResult.pieceCid,
      pieceIds,
    }
  }

  async downloadFile(pieceCid: string): Promise<ArrayBuffer> {
    await this.ensureInitialized()
    const downloadedData = await this.synapse!.storage.download(pieceCid)
    return downloadedData
  }

  async downloadFileCDN(pieceCid: string): Promise<ArrayBuffer> {
    await this.ensureInitialized()
    const clientAddress = await this.synapse!.getSigner().getAddress()
    const url = `https://${clientAddress}.calibration.filcdn.io/${pieceCid}`
    
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Cannot retrieve ${pieceCid}: ${res.status}`)
    }
    
    const downloadedData = await res.arrayBuffer()
    return downloadedData
  }

  private async ensureInitialized() {
    if (!this.synapse || !this.storageContext) {
      await this.initialize()
    }
  }
}

export const filecoinSynapse = new FilecoinSynapseService()

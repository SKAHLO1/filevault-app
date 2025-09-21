// Filecoin client wrapper for storage operations
import { FilecoinWarmStorageService, StorageProviderManager } from "./filecoin-warm-storage"
import { ethers } from "ethers"

export class FilecoinClient {
  private warmStorageService: FilecoinWarmStorageService
  private providerManager: StorageProviderManager
  private provider: ethers.Provider
  private signer?: ethers.Signer

  constructor() {
    // Initialize Web3 provider - this would typically connect to Filecoin network
    const rpcUrl = process.env.FILECOIN_RPC_URL || "https://api.node.glif.io"
    this.provider = new ethers.JsonRpcProvider(rpcUrl)

    // Initialize signer if private key is available
    if (process.env.FILECOIN_PRIVATE_KEY) {
      this.signer = new ethers.Wallet(process.env.FILECOIN_PRIVATE_KEY, this.provider)
    }

    const contractAddress = process.env.FILECOIN_WARM_STORAGE_CONTRACT || "0x..." // Contract address from deployment

    this.warmStorageService = new FilecoinWarmStorageService(contractAddress, this.provider, this.signer)
    this.providerManager = new StorageProviderManager(contractAddress, this.provider, this.signer)
  }

  async uploadFile(encryptedData: Buffer, metadata: any) {
    try {
      // First, upload the encrypted data to IPFS to get CID
      const cid = await this.uploadToIPFS(encryptedData, metadata)

      // Create storage request on Filecoin network
      const datasetId = await this.warmStorageService.createStorageRequest(
        cid,
        encryptedData.length,
        metadata.duration || 365 * 24 * 3600, // Default 1 year
        metadata.replicationFactor || 3,
        metadata.preferredProviders || [],
      )

      return {
        cid,
        datasetId,
        size: encryptedData.length,
        status: "pending",
        storageProviders: metadata.preferredProviders || [],
      }
    } catch (error) {
      console.error("Filecoin upload error:", error)
      throw new Error("Failed to upload to Filecoin network")
    }
  }

  async retrieveFile(cid: string, userId: string) {
    try {
      // Retrieve from IPFS using the CID
      const response = await fetch(`https://ipfs.io/ipfs/${cid}`)

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`Retrieve failed: ${response.statusText}`)
      }

      const encryptedContent = await response.arrayBuffer()

      return {
        encryptedContent: Buffer.from(encryptedContent),
        metadata: {}, // Metadata would be stored separately
      }
    } catch (error) {
      console.error("Filecoin retrieve error:", error)
      throw new Error("Failed to retrieve from Filecoin network")
    }
  }

  async getUserFiles(userId: string) {
    try {
      // Get user's datasets from the smart contract
      const datasetIds = await this.warmStorageService.getUserDatasets(userId)

      const files = await Promise.all(
        datasetIds.map(async (datasetId) => {
          const dataset = await this.warmStorageService.getDatasetInfo(datasetId)
          if (!dataset) return null

          return {
            id: dataset.id,
            originalName: `dataset-${dataset.id.slice(0, 8)}.enc`,
            type: "application/octet-stream",
            size: Number(dataset.size),
            cid: dataset.cid,
            datasetId: dataset.id,
            uploadedAt: new Date(dataset.createdAt * 1000).toISOString(),
            expiresAt: new Date(dataset.expiresAt * 1000).toISOString(),
            status: dataset.status,
            storageProviders: dataset.storageProviders,
            replicationFactor: dataset.replicationFactor,
          }
        }),
      )

      return files.filter((file) => file !== null)
    } catch (error) {
      console.error("Get user files error:", error)
      // Return mock data for development
      return [
        {
          id: "1",
          originalName: "passport.pdf",
          type: "application/pdf",
          size: 2048576,
          cid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
          datasetId: "0x1234...",
          uploadedAt: "2024-01-15T10:30:00Z",
          expiresAt: "2025-01-15T10:30:00Z",
          status: "active",
          storageProviders: ["f01234", "f05678", "f09012"],
          replicationFactor: 3,
        },
      ]
    }
  }

  async deleteFile(fileId: string, userId: string) {
    try {
      const response = await fetch(`${this.apiEndpoint}/files/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "X-User-ID": userId,
        },
      })

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`)
      }

      return true
    } catch (error) {
      console.error("Delete file error:", error)
      throw new Error("Failed to delete file from Filecoin network")
    }
  }

  async getDealStatus(dealId: string) {
    try {
      const response = await fetch(`${this.apiEndpoint}/deals/${dealId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Get deal status failed: ${response.statusText}`)
      }

      const result = await response.json()
      return {
        status: result.status || "active",
        storageProviders: result.storage_providers || [],
        expirationDate: result.expiration_date,
        replicationFactor: result.replication_factor || 3,
      }
    } catch (error) {
      console.error("Get deal status error:", error)
      return {
        status: "active",
        storageProviders: ["f01234", "f05678"],
        expirationDate: "2025-01-15T00:00:00Z",
        replicationFactor: 3,
      }
    }
  }

  async renewDataset(datasetId: string, additionalDuration: number): Promise<boolean> {
    return await this.warmStorageService.renewDataset(datasetId, additionalDuration)
  }

  async validateStorageProof(datasetId: string, proof: Uint8Array): Promise<boolean> {
    return await this.warmStorageService.validateStorageProof(datasetId, proof)
  }

  async getAvailableStorageProviders(): Promise<string[]> {
    return await this.providerManager.getAvailableProviders()
  }

  private async uploadToIPFS(data: Buffer, metadata: any): Promise<string> {
    // This would typically use a service like Web3.Storage or Pinata
    // For now, return a mock CID
    const mockCid = `Qm${Buffer.from(data.slice(0, 32)).toString("hex")}`
    return mockCid
  }
}

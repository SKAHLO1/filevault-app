import { ethers } from "ethers"

// FilecoinWarmStorageService contract interface based on the documentation
export interface StorageRequest {
  datasetId: string
  clientAddress: string
  size: bigint
  duration: number
  replicationFactor: number
  storageProviders: string[]
  paymentAmount: bigint
}

export interface DatasetInfo {
  id: string
  client: string
  size: bigint
  cid: string
  status: "pending" | "active" | "expired" | "failed"
  createdAt: number
  expiresAt: number
  storageProviders: string[]
  replicationFactor: number
}

export class FilecoinWarmStorageService {
  private contract: ethers.Contract
  private provider: ethers.Provider
  private signer?: ethers.Signer

  constructor(contractAddress: string, provider: ethers.Provider, signer?: ethers.Signer) {
    // Contract ABI based on the documentation structure
    const abi = [
      "function createDataset(string memory cid, uint256 size, uint256 duration, uint8 replicationFactor, address[] memory storageProviders) external payable returns (bytes32)",
      "function getDataset(bytes32 datasetId) external view returns (tuple(bytes32 id, address client, uint256 size, string cid, uint8 status, uint256 createdAt, uint256 expiresAt, address[] storageProviders, uint8 replicationFactor))",
      "function renewDataset(bytes32 datasetId, uint256 additionalDuration) external payable",
      "function validateProof(bytes32 datasetId, bytes memory proof) external returns (bool)",
      "function getClientDatasets(address client) external view returns (bytes32[] memory)",
      "function registerStorageProvider(address provider, uint256 capacity, uint256 pricePerGB) external",
      "function getStorageProviderInfo(address provider) external view returns (tuple(bool active, uint256 capacity, uint256 used, uint256 pricePerGB, uint256 reputation))",
      "event DatasetCreated(bytes32 indexed datasetId, address indexed client, string cid, uint256 size)",
      "event DatasetRenewed(bytes32 indexed datasetId, uint256 newExpirationTime)",
      "event ProofValidated(bytes32 indexed datasetId, address indexed storageProvider, bool valid)",
    ]

    this.provider = provider
    this.signer = signer
    this.contract = new ethers.Contract(contractAddress, abi, signer || provider)
  }

  async createStorageRequest(
    cid: string,
    size: number,
    duration: number,
    replicationFactor = 3,
    storageProviders: string[] = [],
  ): Promise<string> {
    if (!this.signer) {
      throw new Error("Signer required for creating storage requests")
    }

    try {
      // Calculate payment amount based on size, duration, and replication factor
      const paymentAmount = await this.calculateStorageCost(size, duration, replicationFactor)

      const tx = await this.contract.createDataset(cid, size, duration, replicationFactor, storageProviders, {
        value: paymentAmount,
      })

      const receipt = await tx.wait()

      // Extract dataset ID from the event
      const event = receipt.logs.find(
        (log: any) => log.topics[0] === ethers.id("DatasetCreated(bytes32,address,string,uint256)"),
      )

      if (!event) {
        throw new Error("Dataset creation event not found")
      }

      const datasetId = event.topics[1]
      return datasetId
    } catch (error) {
      console.error("Error creating storage request:", error)
      throw new Error("Failed to create storage request on Filecoin")
    }
  }

  async getDatasetInfo(datasetId: string): Promise<DatasetInfo | null> {
    try {
      const result = await this.contract.getDataset(datasetId)

      return {
        id: result.id,
        client: result.client,
        size: result.size,
        cid: result.cid,
        status: this.mapStatusFromContract(result.status),
        createdAt: Number(result.createdAt),
        expiresAt: Number(result.expiresAt),
        storageProviders: result.storageProviders,
        replicationFactor: result.replicationFactor,
      }
    } catch (error) {
      console.error("Error getting dataset info:", error)
      return null
    }
  }

  async getUserDatasets(userAddress: string): Promise<string[]> {
    try {
      return await this.contract.getClientDatasets(userAddress)
    } catch (error) {
      console.error("Error getting user datasets:", error)
      return []
    }
  }

  async renewDataset(datasetId: string, additionalDuration: number): Promise<boolean> {
    if (!this.signer) {
      throw new Error("Signer required for renewing datasets")
    }

    try {
      const renewalCost = await this.calculateRenewalCost(datasetId, additionalDuration)

      const tx = await this.contract.renewDataset(datasetId, additionalDuration, {
        value: renewalCost,
      })

      await tx.wait()
      return true
    } catch (error) {
      console.error("Error renewing dataset:", error)
      return false
    }
  }

  async validateStorageProof(datasetId: string, proof: Uint8Array): Promise<boolean> {
    try {
      const result = await this.contract.validateProof(datasetId, proof)
      return result
    } catch (error) {
      console.error("Error validating proof:", error)
      return false
    }
  }

  private async calculateStorageCost(size: number, duration: number, replicationFactor: number): Promise<bigint> {
    // Base cost calculation - this would typically query storage provider rates
    const baseCostPerGB = ethers.parseEther("0.001") // 0.001 ETH per GB
    const sizeInGB = Math.ceil(size / (1024 * 1024 * 1024))
    const durationInMonths = Math.ceil(duration / (30 * 24 * 3600))

    return baseCostPerGB * BigInt(sizeInGB) * BigInt(durationInMonths) * BigInt(replicationFactor)
  }

  private async calculateRenewalCost(datasetId: string, additionalDuration: number): Promise<bigint> {
    const dataset = await this.getDatasetInfo(datasetId)
    if (!dataset) {
      throw new Error("Dataset not found")
    }

    return this.calculateStorageCost(Number(dataset.size), additionalDuration, dataset.replicationFactor)
  }

  private mapStatusFromContract(status: number): "pending" | "active" | "expired" | "failed" {
    switch (status) {
      case 0:
        return "pending"
      case 1:
        return "active"
      case 2:
        return "expired"
      case 3:
        return "failed"
      default:
        return "pending"
    }
  }
}

// Storage provider management utilities
export class StorageProviderManager {
  private contract: ethers.Contract

  constructor(contractAddress: string, provider: ethers.Provider, signer?: ethers.Signer) {
    const abi = [
      "function registerStorageProvider(address provider, uint256 capacity, uint256 pricePerGB) external",
      "function getStorageProviderInfo(address provider) external view returns (tuple(bool active, uint256 capacity, uint256 used, uint256 pricePerGB, uint256 reputation))",
      "function getAvailableStorageProviders() external view returns (address[] memory)",
    ]

    this.contract = new ethers.Contract(contractAddress, abi, signer || provider)
  }

  async getAvailableProviders(): Promise<string[]> {
    try {
      return await this.contract.getAvailableStorageProviders()
    } catch (error) {
      console.error("Error getting storage providers:", error)
      return []
    }
  }

  async getProviderInfo(providerAddress: string) {
    try {
      const info = await this.contract.getStorageProviderInfo(providerAddress)
      return {
        active: info.active,
        capacity: info.capacity,
        used: info.used,
        pricePerGB: info.pricePerGB,
        reputation: info.reputation,
      }
    } catch (error) {
      console.error("Error getting provider info:", error)
      return null
    }
  }
}

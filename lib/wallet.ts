declare global {
  interface Window {
    ethereum?: any
  }
}

export const FILECOIN_CALIBRATION_CONFIG = {
  chainId: "0x4cb2f",
  chainName: "Filecoin Calibration testnet",
  nativeCurrency: {
    name: "testnet FIL",
    symbol: "tFIL",
    decimals: 18,
  },
  rpcUrls: ["https://api.calibration.node.glif.io/rpc/v1"],
  blockExplorerUrls: ["https://calibration.filfox.info/"],
}

export async function switchToFilecoinTestnet() {
  if (!window.ethereum) {
    throw new Error("No Web3 wallet found. Please install MetaMask.")
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: FILECOIN_CALIBRATION_CONFIG.chainId }],
    })
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [FILECOIN_CALIBRATION_CONFIG],
        })
      } catch (addError) {
        throw new Error("Failed to add Filecoin Calibration testnet")
      }
    } else {
      throw switchError
    }
  }
}

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("No Web3 wallet found. Please install MetaMask.")
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  })

  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts found")
  }

  await switchToFilecoinTestnet()

  return accounts[0]
}

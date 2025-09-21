import { ethers } from 'ethers';
import contractABI from '../contracts/FilecoinStorageRegistry.abi.json';

// The address of your deployed contract, loaded from environment variables
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

// A provider for interacting with the Filecoin network.
// Using a public RPC for the Calibration testnet as an example.
const provider = new ethers.JsonRpcProvider('https://api.calibration.node.glif.io/rpc/v1');

// A wallet instance created from your private key to sign transactions
const signer = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY, provider);

/**
 * Creates an instance of the smart contract that can be used to call its functions.
 * This instance is connected to a signer, so it can send transactions that modify state.
 */
const filecoinStorageRegistry = new ethers.Contract(contractAddress, contractABI, signer);

/**
 * Registers file metadata on the smart contract.
 * @param {string} cid - The file's Content ID from IPFS.
 * @param {string} name - The file's name.
 * @param {number} size - The file's size in bytes.
 * @param {string} fileType - The file's MIME type.
 * @returns {Promise<{success: boolean, transactionHash?: string, fileId?: ethers.BigNumber, error?: string}>}
 */
export async function registerFileOnChain(cid, name, size, fileType) {
  if (!contractAddress) {
    throw new Error("Contract address is not defined in environment variables.");
  }

  try {
    console.log('Sending transaction to register file on-chain...');
    const tx = await filecoinStorageRegistry.registerFile(cid, name, size, fileType);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.hash);

    const event = receipt.logs.find(log => log.fragment.name === 'FileRegistered');
    const fileId = event.args.fileId;

    return { success: true, transactionHash: tx.hash, fileId };
  } catch (error) {
    console.error('Error registering file on-chain:', error);
    return { success: false, error: error.message };
  }
}


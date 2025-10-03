# 🚀 FilecoinVault Usage Guide

## Getting Started

### 1️⃣ **Connect Your Wallet**

The hamburger menu (☰) in the top-right corner is your gateway to the app!

**Steps to Connect:**
1. Click the **user avatar/hamburger icon** in the top-right
2. Click **"Sign In"** button
3. Choose **"Web3 Wallet"** tab
4. Click **"Connect Wallet"**
5. MetaMask will automatically:
   - Request permission to connect
   - Prompt you to switch to **Filecoin Calibration testnet**
   - Add the network if you don't have it
6. Sign the authentication message
7. ✅ You're connected!

**Network Auto-Configuration:**
- Chain ID: `314159` (0x4cb2f)
- Network: Filecoin Calibration testnet
- Currency: tFIL
- RPC: https://api.calibration.node.glif.io/rpc/v1

---

### 2️⃣ **Get Test Tokens**

Before uploading files, you need tFIL tokens for transactions:

1. Visit: https://faucet.calibration.fildev.network/
2. Enter your wallet address
3. Request test tokens
4. Wait ~1 minute for tokens to arrive

---

### 3️⃣ **Upload Files**

**Option A - From Homepage:**
1. Click **"Start Uploading"** button on the hero section
2. If not signed in, you'll be redirected to sign in first
3. After signing in, you'll be taken to the dashboard

**Option B - Direct Upload:**
1. Scroll to the **Upload Section** on the homepage
2. Drag & drop files or click to browse
3. Files are automatically encrypted before upload
4. Your encryption key is displayed after upload (save it!)

**Supported File Types:**
- PDF documents
- Images (PNG, JPG, JPEG)
- Word documents (DOC, DOCX)
- Max size: 10MB per file

---

### 4️⃣ **Download Files**

1. Go to **Dashboard** → **File Manager**
2. Find your file in the list
3. Click the **⋮** menu button
4. Select **"Download"**
5. Enter your encryption key when prompted
6. File will decrypt and download automatically

---

### 5️⃣ **Payment Setup (One-Time)**

Before first upload, you need to set up Synapse SDK payments:

**API Endpoint:** `POST /api/filecoin/setup-payment`

**Example Request:**
```json
{
  "depositAmount": "10",
  "rateAllowance": "1",
  "lockupAllowance": "10",
  "maxLockupPeriod": 86400
}
```

This deposits USDFC tokens and approves the Warm Storage service.

---

## 🎯 Key Features

### **Automatic Network Switching**
- App automatically switches MetaMask to Filecoin Calibration testnet
- No manual network configuration needed
- Network is added to MetaMask if not present

### **End-to-End Encryption**
- Files encrypted locally before upload
- You control the encryption keys
- Server never sees your unencrypted data

### **Filecoin Synapse SDK**
- Provable Data Possession (PDP)
- Automatic storage provider selection
- On-chain storage verification
- CDN-accelerated downloads

---

## 🔧 Technical Details

### **File Upload Flow:**
1. User selects file
2. File encrypted with AES-256-GCM (local)
3. Encrypted data uploaded to Synapse SDK
4. SDK stores on Filecoin with PDP proofs
5. Returns `pieceCid` and `pieceIds`
6. User receives encryption key (store safely!)

### **File Download Flow:**
1. User provides `pieceCid` and encryption key
2. App downloads from Synapse SDK
3. File verified against CID
4. Decrypted locally with user's key
5. Downloaded to user's device

---

## ⚠️ Important Notes

- **Save Your Encryption Keys!** Without them, files cannot be decrypted
- **Testnet Only:** This is running on Filecoin Calibration testnet
- **Test Tokens:** Use the faucet for free tFIL tokens
- **Private Key Security:** Never share your wallet private key

---

## 🆘 Troubleshooting

### "Please install MetaMask"
- Install MetaMask browser extension
- Visit: https://metamask.io/

### "Failed to switch to Filecoin testnet"
- Manually add network in MetaMask:
  - Network Name: Filecoin Calibration testnet
  - RPC URL: https://api.calibration.node.glif.io/rpc/v1
  - Chain ID: 314159
  - Symbol: tFIL

### "Insufficient allowances"
- Run payment setup endpoint (see step 5)
- Ensure you have tFIL tokens

### "Authentication failed"
- Make sure you sign the message in MetaMask
- Check that you're on Filecoin Calibration testnet
- Try refreshing and reconnecting

---

## 📚 Resources

- Filecoin Docs: https://docs.filecoin.io/
- Synapse SDK: https://docs.filoz.io/
- Calibration Explorer: https://calibration.filfox.info/
- Faucet: https://faucet.calibration.fildev.network/

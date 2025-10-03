# 🔐 FilecoinVault - Secure Document Storage

A decentralized document storage application built on **Filecoin Calibration testnet** with end-to-end encryption using the **Synapse SDK**.

## ✨ Features

- 🔒 **End-to-End Encryption** - Files encrypted locally before upload
- 🌐 **Decentralized Storage** - Powered by Filecoin's distributed network
- 🔑 **Web3 Wallet Authentication** - Connect with MetaMask
- 📦 **Synapse SDK Integration** - Provable Data Possession (PDP)
- ⚡ **CDN-Accelerated Downloads** - Fast file retrieval
- 🎨 **Modern UI** - Built with Next.js, Tailwind CSS, and shadcn/ui

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- MetaMask browser extension
- Filecoin Calibration testnet wallet with tFIL tokens

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

3. **Configure `.env.local`:**
   ```env
   # Required
   FILECOIN_PRIVATE_KEY=your_private_key_here
   NEXTAUTH_SECRET=your_nextauth_secret_here
   
   # Optional (has defaults)
   FILECOIN_RPC_URL=https://api.calibration.node.glif.io/rpc/v1
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Generate NextAuth secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

5. **Get testnet tokens:**
   - Visit: https://faucet.calibration.fildev.network/
   - Enter your wallet address
   - Request tFIL tokens

6. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

7. **Open your browser:**
   - Navigate to http://localhost:3000

## 📖 How to Use

### 1. Connect Wallet
- Click the **user icon** (hamburger menu) in top-right
- Click **"Sign In"**
- Select **"Web3 Wallet"** tab
- Click **"Connect Wallet"**
- MetaMask will automatically switch to Filecoin Calibration testnet
- Sign the authentication message

### 2. Upload Files
- Click **"Start Uploading"** on homepage (redirects to dashboard if signed in)
- Or scroll to upload section and drag & drop files
- Files are encrypted locally before upload
- **Save your encryption key!** You'll need it to download files

### 3. Download Files
- Go to **Dashboard** → **File Manager**
- Click **⋮** menu on any file
- Select **"Download"**
- Enter your encryption key
- File downloads decrypted

## 🏗️ Architecture

### Tech Stack
- **Frontend:** Next.js 15, React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Authentication:** NextAuth.js with Web3 wallet support
- **Blockchain:** Filecoin Calibration testnet
- **Storage SDK:** @filoz/synapse-sdk
- **Encryption:** AES-256-GCM (local)

### Key Files
```
├── app/
│   ├── api/
│   │   ├── upload/route.ts          # File upload with Synapse SDK
│   │   ├── files/[cid]/route.ts     # File download with decryption
│   │   └── filecoin/setup-payment/  # Payment setup endpoint
│   ├── auth/signin/page.tsx         # Wallet connection page
│   └── dashboard/page.tsx           # File management dashboard
├── components/
│   ├── upload-section.tsx           # Drag & drop upload UI
│   ├── file-manager.tsx             # File list and management
│   └── user-nav.tsx                 # Wallet connection widget
├── lib/
│   ├── filecoin-synapse.ts          # Synapse SDK integration
│   ├── encryption.ts                # AES encryption utilities
│   └── wallet.ts                    # Web3 wallet helpers
└── types/
    └── next-auth.d.ts               # Extended NextAuth types
```

## 🔧 Configuration

### Filecoin Calibration Testnet
- **Chain ID:** 314159 (0x4cb2f)
- **RPC URL:** https://api.calibration.node.glif.io/rpc/v1
- **Currency:** tFIL
- **Explorer:** https://calibration.filfox.info/
- **Faucet:** https://faucet.calibration.fildev.network/

The app automatically configures MetaMask with these settings when you connect your wallet.

## 🔐 Security

- **Client-side encryption** - Files encrypted before leaving your device
- **User-controlled keys** - Only you have access to encryption keys
- **Zero-knowledge storage** - Server never sees unencrypted data
- **Filecoin PDP** - Provable Data Possession for storage verification

## 📚 API Endpoints

### Upload File
```
POST /api/upload
Content-Type: multipart/form-data

Parameters:
- file: File (required)
- encryptionKey: string (required)

Response:
{
  "success": true,
  "file": {
    "pieceCid": "baga...",
    "pieceIds": ["0", "1"],
    "status": "confirmed"
  }
}
```

### Download File
```
GET /api/files/[cid]?encryptionKey=xxx&fileName=xxx&fileType=xxx

Response: Binary file data (decrypted)
```

### Setup Payment
```
POST /api/filecoin/setup-payment
Content-Type: application/json

{
  "depositAmount": "10",
  "rateAllowance": "1", 
  "lockupAllowance": "10",
  "maxLockupPeriod": 86400
}
```

## 🛠️ Development

### Build for Production
```bash
npm run build
npm start
```

### Type Checking
```bash
npx tsc --noEmit
```

### Linting
```bash
npm run lint
```

## ⚠️ Important Notes

- **Testnet Only** - This application runs on Filecoin Calibration testnet
- **Save Encryption Keys** - Without them, files cannot be decrypted
- **Private Keys** - Server-side private key is only for Synapse SDK operations
- **Test Tokens** - Use faucet for free tFIL tokens

## 🐛 Troubleshooting

### "Please install MetaMask"
Install MetaMask: https://metamask.io/

### "Failed to switch to Filecoin testnet"
Manually add network in MetaMask with the configuration above.

### "Insufficient allowances"
Run the payment setup endpoint first (see API documentation).

### "Authentication failed"
- Ensure you're signing the MetaMask message
- Verify you're on Filecoin Calibration testnet
- Try disconnecting and reconnecting wallet

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📞 Support

For issues and questions:
- GitHub Issues: [Create an issue]
- Filecoin Docs: https://docs.filecoin.io/
- Synapse SDK Docs: https://docs.filoz.io/

---

Built with ❤️ using Filecoin and Synapse SDK

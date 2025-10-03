# 🚀 Deploying to Vercel

Complete guide for deploying FilecoinVault to Vercel.

## 📋 Prerequisites

- Vercel account (sign up at https://vercel.com)
- GitHub/GitLab/Bitbucket repository with your code
- Filecoin Calibration testnet wallet with private key
- Test tFIL tokens (get from faucet)

---

## 🔧 Step-by-Step Deployment

### 1. **Push Code to Git Repository**

```bash
git init
git add .
git commit -m "Initial commit - FilecoinVault"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/filecoin-vault.git
git push -u origin main
```

---

### 2. **Import Project to Vercel**

1. Go to https://vercel.com/new
2. Click **"Import Project"**
3. Select your Git repository
4. Click **"Import"**

---

### 3. **Configure Environment Variables**

**CRITICAL: Configure these BEFORE deploying!**

Go to: **Project Settings** → **Environment Variables**

Add these variables:

| Variable Name | Value | Environment | Sensitive? |
|--------------|-------|-------------|------------|
| `NEXTAUTH_URL` | `https://your-app.vercel.app` | Production | No |
| `NEXTAUTH_SECRET` | [Generate new - see below] | Production, Preview, Development | ✅ Yes |
| `FILECOIN_PRIVATE_KEY` | Your private key (no 0x) | Production, Preview, Development | ✅ Yes |
| `FILECOIN_RPC_URL` | `https://api.calibration.node.glif.io/rpc/v1` | Production, Preview, Development | No |

---

### 4. **Generate NEXTAUTH_SECRET**

**Generate a secure secret for production:**

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using OpenSSL
openssl rand -base64 32

# Using PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**⚠️ IMPORTANT:**
- Use a **DIFFERENT** secret than your local development
- Keep it **SECURE** - never commit to Git
- Mark as "Sensitive" in Vercel

---

### 5. **Environment Variable Configuration in Vercel UI**

For each variable:

1. **Name:** Enter variable name (e.g., `NEXTAUTH_SECRET`)
2. **Value:** Paste the value
3. **Environments:** Check all boxes (Production, Preview, Development)
4. **Sensitive:** ✅ Check for `NEXTAUTH_SECRET` and `FILECOIN_PRIVATE_KEY`
5. Click **"Save"**

**Example Configuration:**

```
Name: NEXTAUTH_URL
Value: https://filecoin-vault.vercel.app
Environments: ✅ Production ✅ Preview ☐ Development
Sensitive: ☐
```

```
Name: NEXTAUTH_SECRET
Value: [your-generated-secret-here]
Environments: ✅ Production ✅ Preview ✅ Development
Sensitive: ✅
```

```
Name: FILECOIN_PRIVATE_KEY
Value: abc123...your-private-key
Environments: ✅ Production ✅ Preview ✅ Development
Sensitive: ✅
```

```
Name: FILECOIN_RPC_URL
Value: https://api.calibration.node.glif.io/rpc/v1
Environments: ✅ Production ✅ Preview ✅ Development
Sensitive: ☐
```

---

### 6. **Deploy**

After adding environment variables:

1. Go to **Deployments** tab
2. Click **"Redeploy"** or push a new commit
3. Wait for build to complete (~2-3 minutes)
4. Click **"Visit"** to open your deployed app

---

### 7. **Update NEXTAUTH_URL (Important!)**

Once deployed, Vercel assigns you a URL like `your-app-abc123.vercel.app`

**Update the environment variable:**

1. Go to **Settings** → **Environment Variables**
2. Edit `NEXTAUTH_URL`
3. Change to your actual Vercel URL: `https://your-app-abc123.vercel.app`
4. Save
5. Go to **Deployments** → **Redeploy**

---

## 🔐 Security Checklist

- ✅ `NEXTAUTH_SECRET` marked as Sensitive
- ✅ `FILECOIN_PRIVATE_KEY` marked as Sensitive
- ✅ Different `NEXTAUTH_SECRET` for production vs development
- ✅ `.env.local` added to `.gitignore`
- ✅ Never committed secrets to Git
- ✅ Wallet has only testnet tFIL (not mainnet funds)

---

## 🌐 Custom Domain (Optional)

To use a custom domain:

1. Go to **Settings** → **Domains**
2. Add your domain (e.g., `filecoinvault.com`)
3. Follow Vercel's DNS configuration instructions
4. Update `NEXTAUTH_URL` to your custom domain
5. Redeploy

---

## 🧪 Testing Production Deployment

1. Visit your Vercel URL
2. Click hamburger menu (☰) → **Sign In**
3. Connect MetaMask wallet
4. Should prompt to switch to Filecoin Calibration testnet
5. Sign authentication message
6. Upload a test file
7. Download the file with encryption key

---

## 🔄 Environment Variables Reference

### Required Variables

```env
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=production-secret-here
FILECOIN_PRIVATE_KEY=your-private-key-no-0x
```

### Optional Variables

```env
FILECOIN_RPC_URL=https://api.calibration.node.glif.io/rpc/v1
```

---

## 📊 Monitoring & Logs

**View Logs:**
1. Go to **Deployments**
2. Click on a deployment
3. Click **"View Function Logs"**
4. Monitor API calls, errors, and performance

**Common Issues:**

| Issue | Solution |
|-------|----------|
| NextAuth errors | Check `NEXTAUTH_URL` matches your domain |
| "Unauthorized" errors | Verify `NEXTAUTH_SECRET` is set correctly |
| Filecoin SDK errors | Check `FILECOIN_PRIVATE_KEY` is valid |
| Network errors | Verify `FILECOIN_RPC_URL` is accessible |

---

## 🔧 Updating Environment Variables

After changing environment variables:

1. **Always redeploy** for changes to take effect
2. Environment variables are **cached** during build
3. Changes don't apply to existing deployments automatically

**How to redeploy:**
- Go to **Deployments** → Click **⋯** → **Redeploy**
- Or push a new commit to trigger automatic deployment

---

## 🚨 Troubleshooting

### "Error: NEXTAUTH_URL is not defined"

**Fix:**
1. Go to Settings → Environment Variables
2. Add `NEXTAUTH_URL` with your Vercel domain
3. Redeploy

### "Authentication failed"

**Fix:**
1. Verify `NEXTAUTH_SECRET` is set
2. Check it's marked for Production environment
3. Ensure it's at least 32 characters
4. Redeploy

### "Filecoin SDK initialization failed"

**Fix:**
1. Check `FILECOIN_PRIVATE_KEY` is set correctly
2. Verify private key has no `0x` prefix
3. Ensure wallet has tFIL tokens
4. Verify `FILECOIN_RPC_URL` is accessible

### Build Errors

**Fix:**
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for lint errors
npm run lint
```

---

## 📱 Mobile Testing

After deployment, test on mobile:

1. Open Vercel URL on mobile browser
2. Install MetaMask mobile app
3. Use MetaMask browser to visit your app
4. Test wallet connection and file upload

---

## 💰 Vercel Pricing

**Free Tier includes:**
- Unlimited deployments
- 100GB bandwidth/month
- Automatic HTTPS
- Edge Network
- **Sufficient for testnet applications!**

**Pro Tier ($20/month):**
- Needed for production apps with high traffic
- 1TB bandwidth/month
- Advanced analytics

---

## 🎯 Production Readiness Checklist

Before going to mainnet (future):

- [ ] Switch to Filecoin mainnet RPC
- [ ] Use mainnet wallet with real FIL
- [ ] Add proper database for file metadata
- [ ] Implement user file storage tracking
- [ ] Add file size limits
- [ ] Implement rate limiting
- [ ] Add monitoring/alerting
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Add terms of service & privacy policy
- [ ] Implement backup encryption keys
- [ ] Add 2FA for sensitive operations
- [ ] Security audit

---

## 📚 Additional Resources

- **Vercel Docs:** https://vercel.com/docs
- **Environment Variables Guide:** https://vercel.com/docs/environment-variables
- **NextAuth.js Deployment:** https://next-auth.js.org/deployment
- **Filecoin Docs:** https://docs.filecoin.io/

---

## 🆘 Getting Help

If you encounter issues:

1. Check Vercel **Function Logs**
2. Check **Build Logs** for errors
3. Review this deployment guide
4. Check [GitHub Issues]
5. Filecoin Slack: https://filecoin.io/slack

---

**🎉 Congratulations!** Your FilecoinVault app is now deployed on Vercel!

Next steps:
- Test thoroughly on testnet
- Share with beta users
- Gather feedback
- Iterate and improve

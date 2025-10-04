import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { ethers } from "ethers"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "ethereum",
      name: "Ethereum Wallet",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          console.log("[NextAuth] Starting authorization...")
          console.log("[NextAuth] Credentials received:", {
            hasMessage: !!credentials?.message,
            hasSignature: !!credentials?.signature,
          })
          
          if (!credentials?.message || !credentials?.signature) {
            console.error("[NextAuth] Missing credentials")
            return null
          }

          // Verify the signature
          console.log("[NextAuth] Verifying signature...")
          const signerAddress = ethers.verifyMessage(credentials.message, credentials.signature)
          console.log("[NextAuth] Signer address:", signerAddress)

          if (!signerAddress) {
            console.error("[NextAuth] Invalid signature")
            return null
          }

          // Create user object
          const user = {
            id: signerAddress,
            name: `${signerAddress.slice(0, 6)}...${signerAddress.slice(-4)}`,
            email: `${signerAddress}@wallet.local`,
            address: signerAddress,
          }
          
          console.log("[NextAuth] User object created:", user)
          return user
        } catch (error) {
          console.error("[NextAuth] Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("[NextAuth] JWT callback - user:", user)
      if (user) {
        token.address = user.address
        token.id = user.id
      }
      console.log("[NextAuth] JWT callback - token:", token)
      return token
    },
    async session({ session, token }) {
      console.log("[NextAuth] Session callback - token:", token)
      if (token) {
        session.user.id = token.sub || token.id as string
        session.user.address = token.address as string
      }
      console.log("[NextAuth] Session callback - session:", session)
      return session
    },
    async redirect({ url, baseUrl }) {
      // After signin, redirect to dashboard
      if (url === baseUrl + "/" || url === baseUrl) {
        return baseUrl + "/dashboard"
      }
      if (url.startsWith(baseUrl)) return url
      else if (url.startsWith("/")) return baseUrl + url
      return baseUrl + "/dashboard"
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
})

export { handler as GET, handler as POST }

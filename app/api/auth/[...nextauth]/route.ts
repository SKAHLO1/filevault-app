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
          if (!credentials?.message || !credentials?.signature) {
            return null
          }

          // Verify the signature
          const signerAddress = ethers.verifyMessage(credentials.message, credentials.signature)

          if (!signerAddress) {
            return null
          }

          // Create user object
          return {
            id: signerAddress,
            name: `${signerAddress.slice(0, 6)}...${signerAddress.slice(-4)}`,
            email: `${signerAddress}@wallet.local`,
            address: signerAddress,
          }
        } catch (error) {
          console.error("Auth error:", error)
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
      if (user) {
        token.address = user.address
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub || token.id as string
        session.user.address = token.address as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // After signin, redirect to homepage
      if (url.startsWith(baseUrl)) return url
      else if (url.startsWith("/")) return baseUrl + url
      return baseUrl
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
})

export { handler as GET, handler as POST }

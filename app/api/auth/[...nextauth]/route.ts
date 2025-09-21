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
    CredentialsProvider({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          // In a real app, verify against your database
          // For demo purposes, accept any email/password combination
          if (credentials.email && credentials.password.length >= 6) {
            return {
              id: credentials.email,
              name: credentials.email.split("@")[0],
              email: credentials.email,
              address: null,
            }
          }

          return null
        } catch (error) {
          console.error("Credentials auth error:", error)
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
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.address = token.address as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
})

export { handler as GET, handler as POST }

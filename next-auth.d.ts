import { DefaultSession, DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      address?: string | null
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    address?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    address?: string | null
  }
}
